import chromium from "@sparticuz/chromium";
import mammoth from "mammoth";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import { detectAbuse } from "@/lib/security/abuseDetection";
import { applyRateLimit } from "@/lib/security/rateLimit";
import {
  recordSecurityEvent,
  scoreTraffic,
} from "@/lib/security/trafficScore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const MAX_DOCX_BYTES = 8 * 1024 * 1024;

function toDocumentHtml(rawHtml: string): string {
  return `<!doctype html>
<html lang="en" dir="auto">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      @page { size: A4; margin: 20mm 16mm; }
      html, body {
        font-family: "Segoe UI", Arial, sans-serif;
        color: #0f172a;
        line-height: 1.55;
        font-size: 12pt;
        word-break: break-word;
      }
      body { margin: 0; }
      p { margin: 0 0 10px; }
      table { border-collapse: collapse; width: 100%; margin: 12px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: start; vertical-align: top; }
      img { max-width: 100%; height: auto; }
      pre, code { font-family: Consolas, "Courier New", monospace; white-space: pre-wrap; }
      blockquote { border-inline-start: 4px solid #cbd5e1; padding-inline-start: 12px; margin: 12px 0; color: #334155; }
    </style>
  </head>
  <body>
    ${rawHtml}
  </body>
</html>`;
}

export async function POST(req: Request) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const forwardedFor = req.headers.get("x-forwarded-for") ?? "";
    const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
    const userAgent = req.headers.get("user-agent") ?? "";
    const usageDepth = Number(req.headers.get("x-qth-usage-depth") ?? "0");
    const interActionMs = Number(req.headers.get("x-qth-interaction-ms") ?? "0");
    const sessionKey = `${ip}:${userAgent.slice(0, 40)}`;

    const traffic = scoreTraffic({
      key: sessionKey,
      userAgent,
      endpoint: "/api/word-to-pdf",
      clientUsageDepth: Number.isFinite(usageDepth) ? usageDepth : 0,
      interActionMs: Number.isFinite(interActionMs) ? interActionMs : undefined,
    });

    const abuse = detectAbuse({
      key: sessionKey,
      endpoint: "/api/word-to-pdf",
      score: traffic.score,
      category: traffic.category,
    });

    const limit = applyRateLimit({
      key: sessionKey,
      tier: "heavy",
      category: traffic.category,
    });
    if (!limit.allowed) {
      const retrySecs = Math.max(1, Math.ceil(limit.resetInMs / 1000));
      return NextResponse.json(
        {
          error:
            "You are converting files too quickly. Please wait a moment and try again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retrySecs),
            "X-RateLimit-Limit": String(limit.limit),
            "X-RateLimit-Remaining": String(limit.remaining),
          },
        }
      );
    }

    if (abuse.shouldSoftThrottle) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing .docx file upload." },
        { status: 400 }
      );
    }
    if (!/\.docx$/i.test(file.name)) {
      return NextResponse.json(
        { error: "Only .docx files are supported." },
        { status: 400 }
      );
    }
    if (file.size <= 0 || file.size > MAX_DOCX_BYTES) {
      return NextResponse.json(
        {
          error:
            "File size must be between 1 byte and 8 MB for stable conversion.",
        },
        { status: 413 }
      );
    }

    recordSecurityEvent({
      key: sessionKey,
      type: "tool_action",
      endpoint: "/api/word-to-pdf",
    });

    const arrayBuffer = await file.arrayBuffer();
    const mammothResult = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        includeDefaultStyleMap: true,
        convertImage: mammoth.images.imgElement(async (image) => {
          const buffer = await image.read();
          const base64 = Buffer.from(buffer).toString("base64");
          return {
            src: `data:${image.contentType};base64,${base64}`,
          };
        }),
      }
    );

    const htmlContent = mammothResult.value?.trim();
    if (!htmlContent) {
      return NextResponse.json(
        { error: "Could not parse this document. Please try another .docx file." },
        { status: 422 }
      );
    }

    const executablePath =
      process.env.CHROMIUM_EXECUTABLE_PATH ?? (await chromium.executablePath());

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(toDocumentHtml(htmlContent), {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "20mm",
        right: "16mm",
        bottom: "20mm",
        left: "16mm",
      },
    });

    const safeName = file.name.replace(/\.docx$/i, "").replace(/[^\w\-]+/g, "_");
    const downloadName = `${safeName || "document"}.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${downloadName}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    console.warn("[word-to-pdf] conversion_error");
    return NextResponse.json(
      { error: "Conversion failed. Please try again with a different file." },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
