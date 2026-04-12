"use client";

import { jsPDF } from "jspdf";
import type { ComponentType } from "react";
import { useCallback, useMemo, useState } from "react";
import type { ToolImplementation } from "@/data/tools";

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

export function ImageToPdfTool() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
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
        pdf.save("images.pdf");
      } catch {
        setError("Could not build the PDF. Try different images.");
      } finally {
        setBusy(false);
      }
    },
    []
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

export function WordCounterTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words =
      trimmed.length === 0 ? 0 : trimmed.split(/\s+/).filter(Boolean).length;
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

const views: Record<ToolImplementation, ComponentType> = {
  "image-to-pdf": ImageToPdfTool,
  "word-counter": WordCounterTool,
  "percentage-calculator": PercentageCalculatorTool,
};

export function ToolImplementationView({
  implementation,
}: {
  implementation: ToolImplementation;
}) {
  const Cmp = views[implementation];
  return <Cmp />;
}
