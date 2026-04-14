"use client";

import { jsPDF } from "jspdf";
import mammoth from "mammoth";
import type { ComponentType } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getClientUsageSignals, trackToolAction } from "@/lib/analytics";
import type { ToolImplementation } from "@/types/tool";

function readDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function ImageToPdfTool({ toolSlug }: { toolSlug: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      trackToolAction(toolSlug, "upload");
      const list = Array.from(files).filter(
        (f) =>
          f.type === "image/jpeg" ||
          f.type === "image/png" ||
          /\.jpe?g$/i.test(f.name) ||
          /\.png$/i.test(f.name)
      );
      if (!list.length) {
        setError("Please choose JPG or PNG images.");
        return;
      }
      setError(null);
      setBusy(true);
      try {
        const pdf = new jsPDF({ unit: "pt", format: "a4" });
        let first = true;
        for (const file of list) {
          const dataUrl = await readDataUrl(file);
          const img = await loadImageElement(dataUrl);
          const isPng =
            file.type === "image/png" || /\.png$/i.test(file.name);
          const format = isPng ? "PNG" : "JPEG";

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = 36;
          const maxW = pageWidth - margin * 2;
          const maxH = pageHeight - margin * 2;
          const ratio = Math.min(maxW / img.width, maxH / img.height);
          const w = img.width * ratio;
          const h = img.height * ratio;
          const x = (pageWidth - w) / 2;
          const y = (pageHeight - h) / 2;

          if (!first) pdf.addPage();
          first = false;
          pdf.addImage(dataUrl, format, x, y, w, h);
        }
        trackToolAction(toolSlug, "download");
        pdf.save("images.pdf");
      } catch {
        setError("Could not build the PDF. Try different images.");
      } finally {
        setBusy(false);
      }
    },
    [toolSlug]
  );

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Images (JPG or PNG)
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          multiple
          onChange={(e) => onFiles(e.target.files)}
          disabled={busy}
          className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-4 text-base file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-800"
        />
      </label>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <p className="text-sm text-slate-600">
        {busy ? "Building PDF…" : "Files are processed in your browser."}
      </p>
    </div>
  );
}

export function WordCounterTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words =
      trimmed.length === 0
        ? 0
        : trimmed.split(/\s+/).filter((w) => w.length > 0).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences =
      trimmed.length === 0
        ? 0
        : trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    return { words, characters, charactersNoSpaces, sentences };
  }, [text]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Your text
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Paste or type here…"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base leading-relaxed text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </label>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-medium text-slate-500">Words</dt>
          <dd className="text-xl font-semibold text-slate-900">
            {stats.words}
          </dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-medium text-slate-500">Characters</dt>
          <dd className="text-xl font-semibold text-slate-900">
            {stats.characters}
          </dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-medium text-slate-500">No spaces</dt>
          <dd className="text-xl font-semibold text-slate-900">
            {stats.charactersNoSpaces}
          </dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-medium text-slate-500">Sentences</dt>
          <dd className="text-xl font-semibold text-slate-900">
            {stats.sentences}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={async () => {
          if (!text.trim()) return;
          try {
            await navigator.clipboard.writeText(text);
            trackToolAction(toolSlug, "copy");
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          } catch {
            // Silent failure to preserve UX if clipboard is unavailable.
          }
        }}
        className="btn-primary bg-slate-900 px-4 hover:bg-slate-800"
      >
        {copied ? "Copied" : "Copy text"}
      </button>
    </div>
  );
}

export function PercentageCalculatorTool() {
  const [pct, setPct] = useState("15");
  const [of, setOf] = useState("200");
  const [oldVal, setOldVal] = useState("80");
  const [newVal, setNewVal] = useState("100");

  const portion = useMemo(() => {
    const p = parseFloat(pct);
    const o = parseFloat(of);
    if (Number.isNaN(p) || Number.isNaN(o)) return null;
    return (p / 100) * o;
  }, [pct, of]);

  const change = useMemo(() => {
    const a = parseFloat(oldVal);
    const b = parseFloat(newVal);
    if (Number.isNaN(a) || Number.isNaN(b) || a === 0) return null;
    return ((b - a) / a) * 100;
  }, [oldVal, newVal]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">
          What is X% of Y?
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Percent (X)
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={pct}
              onChange={(e) => setPct(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Of (Y)
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={of}
              onChange={(e) => setOf(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg"
            />
          </label>
        </div>
        <p className="rounded-lg bg-slate-50 px-4 py-3 text-lg font-medium text-slate-900">
          Result:{" "}
          {portion === null ? "—" : portion.toLocaleString(undefined, { maximumFractionDigits: 6 })}
        </p>
      </section>
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">
          Percent increase / decrease
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Old value
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={oldVal}
              onChange={(e) => setOldVal(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              New value
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg"
            />
          </label>
        </div>
        <p className="rounded-lg bg-slate-50 px-4 py-3 text-lg font-medium text-slate-900">
          Change:{" "}
          {change === null
            ? "—"
            : `${change >= 0 ? "+" : ""}${change.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`}
        </p>
      </section>
    </div>
  );
}

export function WordToPdfTool({ toolSlug }: { toolSlug: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Upload a .docx file to start conversion.");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("document.pdf");

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const runClientFallback = useCallback(
    async (file: File) => {
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      const content = value.replace(/\r/g, "").trim();
      if (!content) {
        throw new Error("Could not read text from this document.");
      }

      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const lineHeight = 18;
      const lines = pdf.splitTextToSize(content, pageWidth) as string[];

      let y = margin;
      lines.forEach((line) => {
        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin, y);
        y += lineHeight;
      });

      const blob = pdf.output("blob");
      return URL.createObjectURL(blob);
    },
    []
  );

  const convert = useCallback(async () => {
    if (!selectedFile) {
      setError("Please choose a .docx file first.");
      return;
    }
    if (!/\.docx$/i.test(selectedFile.name)) {
      setError("Please upload a valid .docx file.");
      return;
    }

    setBusy(true);
    setError(null);
    setProgress(10);
    setStatus("Uploading your document...");
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      setStatus("Converting on server...");
      setProgress(35);

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 45_000);

      const res = await fetch("/api/word-to-pdf", {
        method: "POST",
        headers: {
          "x-qth-usage-depth": String(getClientUsageSignals().usageDepth),
          "x-qth-interaction-ms": String(getClientUsageSignals().interActionMs),
        },
        body: formData,
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "Conversion failed.");
      }

      setStatus("Preparing download...");
      setProgress(80);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setDownloadUrl(objectUrl);
      setDownloadName(`${selectedFile.name.replace(/\.docx$/i, "") || "document"}.pdf`);
      setProgress(100);
      setStatus("Conversion completed. Download your PDF below.");
      trackToolAction(toolSlug, "conversion_complete");
    } catch (e) {
      try {
        setStatus("Server conversion is slow. Switching to fallback mode...");
        setProgress(55);
        const fallbackUrl = await runClientFallback(selectedFile);
        setDownloadUrl(fallbackUrl);
        setDownloadName(
          `${selectedFile.name.replace(/\.docx$/i, "") || "document"}-fallback.pdf`
        );
        setProgress(100);
        setError(null);
        setStatus(
          "Fallback conversion completed. Download your PDF below."
        );
        trackToolAction(toolSlug, "conversion_complete");
      } catch {
        const message =
          e instanceof Error
            ? e.message
            : "Conversion failed. Please try again.";
        setError(message);
        setStatus("Conversion failed.");
      }
    } finally {
      setBusy(false);
    }
  }, [downloadUrl, runClientFallback, selectedFile, toolSlug]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Word file (.docx)
        </span>
        <input
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => {
            const selected = e.target.files?.[0] ?? null;
            setSelectedFile(selected);
            setProgress(0);
            setError(null);
            if (selected) {
              trackToolAction(toolSlug, "upload");
              setStatus(`${selected.name} selected. Click convert to continue.`);
            } else {
              setStatus("Upload a .docx file to start conversion.");
            }
          }}
          disabled={busy}
          className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-4 text-base file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-800"
        />
      </label>
      <button
        type="button"
        onClick={() => void convert()}
        disabled={busy || !selectedFile}
        className="btn-primary px-4"
      >
        {busy ? "Converting..." : "Convert to PDF"}
      </button>
      <div className="space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
        <p className="text-xs text-slate-500">Progress: {progress}%</p>
      </div>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <p className="text-sm text-slate-600">{status}</p>

      {downloadUrl ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800">
            Your PDF is ready. Download now and share or submit it.
          </p>
          <a
            href={downloadUrl}
            download={downloadName}
            onClick={() => trackToolAction(toolSlug, "download")}
            className="btn-primary mt-3 bg-slate-900 px-4 hover:bg-slate-800"
          >
            Download PDF
          </a>
        </div>
      ) : null}
    </div>
  );
}

function PdfToolComingSoon({ name }: { name: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
      <h3 className="text-base font-semibold text-slate-900">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed">
        This PDF workflow is being finalized and will be available soon. In the
        meantime, try the Word to PDF converter from this category.
      </p>
    </div>
  );
}

const views: Record<ToolImplementation, ComponentType<{ toolSlug: string }>> = {
  "image-to-pdf": ImageToPdfTool,
  "word-counter": WordCounterTool,
  "percentage-calculator": () => <PercentageCalculatorTool />,
  "word-to-pdf": WordToPdfTool,
  "pdf-to-word": () => <PdfToolComingSoon name="PDF to Word Converter" />,
  "merge-pdfs": () => <PdfToolComingSoon name="Merge PDFs" />,
  "split-pdf": () => <PdfToolComingSoon name="Split PDF" />,
  "compress-pdf": () => <PdfToolComingSoon name="Compress PDF" />,
};

export function ToolImplementationView({
  implementation,
  toolSlug,
}: {
  implementation: ToolImplementation;
  toolSlug: string;
}) {
  const Cmp = views[implementation];
  if (!Cmp) {
    return <PdfToolComingSoon name="Tool unavailable" />;
  }
  return <Cmp toolSlug={toolSlug} />;
}
