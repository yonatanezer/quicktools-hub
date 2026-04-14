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

function formatResult(value: number, maxFractionDigits = 6): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: maxFractionDigits });
}

function SingleValueConverterTool({
  label,
  inputUnit,
  outputUnit,
  convert,
  defaultValue = "1",
}: {
  label: string;
  inputUnit: string;
  outputUnit: string;
  convert: (value: number) => number;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const converted = useMemo(() => {
    const n = parseFloat(value);
    if (Number.isNaN(n)) return null;
    return convert(n);
  }, [convert, value]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg"
        />
      </label>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-lg font-medium text-slate-900">
        Result: {converted === null ? "—" : `${formatResult(converted)} ${outputUnit}`}
      </p>
      <p className="text-xs text-slate-500">
        Input unit: {inputUnit}. Output unit: {outputUnit}.
      </p>
    </div>
  );
}

function BmiCalculatorTool() {
  const [heightCm, setHeightCm] = useState("170");
  const [weightKg, setWeightKg] = useState("70");
  const bmi = useMemo(() => {
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    if (Number.isNaN(h) || Number.isNaN(w) || h <= 0 || w <= 0) return null;
    return w / (h / 100) ** 2;
  }, [heightCm, weightKg]);

  const category = useMemo(() => {
    if (bmi === null) return "—";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  }, [bmi]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Height (cm)</span>
          <input
            type="number"
            inputMode="decimal"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Weight (kg)</span>
          <input
            type="number"
            inputMode="decimal"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg"
          />
        </label>
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-lg font-medium text-slate-900">
        BMI: {bmi === null ? "—" : formatResult(bmi, 2)} ({category})
      </p>
    </div>
  );
}

function AgeCalculatorTool() {
  const today = new Date().toISOString().slice(0, 10);
  const [dob, setDob] = useState("2000-01-01");
  const [asOf, setAsOf] = useState(today);

  const result = useMemo(() => {
    const birth = new Date(dob);
    const ref = new Date(asOf);
    if (Number.isNaN(birth.getTime()) || Number.isNaN(ref.getTime()) || birth > ref) return null;
    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    let days = ref.getDate() - birth.getDate();
    if (days < 0) {
      const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
      days += prevMonth;
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }
    return { years, months, days };
  }, [asOf, dob]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Date of birth</span>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">As of date</span>
          <input
            type="date"
            value={asOf}
            onChange={(e) => setAsOf(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
          />
        </label>
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-lg font-medium text-slate-900">
        {result ? `${result.years} years, ${result.months} months, ${result.days} days` : "—"}
      </p>
    </div>
  );
}

function LoanEmiCalculatorTool() {
  const [principal, setPrincipal] = useState("250000");
  const [annualRate, setAnnualRate] = useState("8.5");
  const [months, setMonths] = useState("60");

  const values = useMemo(() => {
    const p = parseFloat(principal);
    const rAnnual = parseFloat(annualRate);
    const n = parseFloat(months);
    if (Number.isNaN(p) || Number.isNaN(rAnnual) || Number.isNaN(n) || p <= 0 || n <= 0) return null;
    const r = rAnnual / 12 / 100;
    const emi = r === 0 ? p / n : (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    const total = emi * n;
    return { emi, total, interest: total - p };
  }, [annualRate, months, principal]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Principal</span>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Annual rate (%)</span>
          <input type="number" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Tenure (months)</span>
          <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg" />
        </label>
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium text-slate-900">
        EMI: {values ? formatResult(values.emi, 2) : "—"} | Total: {values ? formatResult(values.total, 2) : "—"} | Interest: {values ? formatResult(values.interest, 2) : "—"}
      </p>
    </div>
  );
}

function GpaCalculatorTool() {
  const [rows, setRows] = useState([
    { grade: "4", credit: "3" },
    { grade: "3.3", credit: "3" },
  ]);
  const update = (index: number, key: "grade" | "credit", value: string) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };
  const addRow = () => setRows((prev) => [...prev, { grade: "4", credit: "3" }]);
  const removeRow = (index: number) => setRows((prev) => prev.filter((_, i) => i !== index));
  const gpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const row of rows) {
      const g = parseFloat(row.grade);
      const c = parseFloat(row.credit);
      if (Number.isNaN(g) || Number.isNaN(c) || c <= 0) continue;
      totalPoints += g * c;
      totalCredits += c;
    }
    if (totalCredits === 0) return null;
    return totalPoints / totalCredits;
  }, [rows]);

  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input type="number" min="0" max="4" step="0.1" value={row.grade} onChange={(e) => update(i, "grade", e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Grade points" />
          <input type="number" min="0" step="0.5" value={row.credit} onChange={(e) => update(i, "credit", e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Credits" />
          <button type="button" onClick={() => removeRow(i)} className="btn-secondary px-3" disabled={rows.length <= 1}>Remove</button>
        </div>
      ))}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={addRow} className="btn-secondary px-4">Add course</button>
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-lg font-medium text-slate-900">
        GPA: {gpa === null ? "—" : formatResult(gpa, 3)}
      </p>
    </div>
  );
}

function CalorieCalculatorTool() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("72");
  const [activity, setActivity] = useState("1.55");
  const calories = useMemo(() => {
    const a = parseFloat(age);
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    const f = parseFloat(activity);
    if ([a, h, w, f].some((v) => Number.isNaN(v) || v <= 0)) return null;
    const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    return bmr * f;
  }, [activity, age, heightCm, sex, weightKg]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <select value={sex} onChange={(e) => setSex(e.target.value as "male" | "female")} className="rounded-lg border border-slate-300 px-4 py-3">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Age" />
        <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Height (cm)" />
        <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Weight (kg)" />
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Activity factor</span>
        <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3">
          <option value="1.2">Sedentary</option>
          <option value="1.375">Light activity</option>
          <option value="1.55">Moderate activity</option>
          <option value="1.725">Very active</option>
          <option value="1.9">Extra active</option>
        </select>
      </label>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-lg font-medium text-slate-900">
        Estimated maintenance calories: {calories === null ? "—" : `${formatResult(calories, 0)} kcal/day`}
      </p>
    </div>
  );
}

function DateDifferenceCalculatorTool() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const result = useMemo(() => {
    const a = new Date(start);
    const b = new Date(end);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
    const diffMs = Math.abs(b.getTime() - a.getTime());
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return { days, weeks: days / 7, months: days / 30.4375, years: days / 365.25 };
  }, [end, start]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" />
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium text-slate-900">
        {result ? `${result.days} days | ${formatResult(result.weeks, 2)} weeks | ${formatResult(result.months, 2)} months | ${formatResult(result.years, 2)} years` : "—"}
      </p>
    </div>
  );
}

function HexToRgbTool() {
  const [hex, setHex] = useState("#1E90FF");
  const rgb = useMemo(() => {
    const normalized = hex.trim().replace(/^#/, "");
    const full = normalized.length === 3 ? normalized.split("").map((c) => c + c).join("") : normalized;
    if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
    };
  }, [hex]);
  return (
    <div className="space-y-4">
      <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg" placeholder="#RRGGBB" />
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-lg font-medium text-slate-900">
        {rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "Enter a valid HEX code"}
      </p>
    </div>
  );
}

function RgbToHexTool() {
  const [r, setR] = useState("30");
  const [g, setG] = useState("144");
  const [b, setB] = useState("255");
  const hex = useMemo(() => {
    const values = [parseInt(r, 10), parseInt(g, 10), parseInt(b, 10)];
    if (values.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return null;
    return `#${values.map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
  }, [b, g, r]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <input type="number" min="0" max="255" value={r} onChange={(e) => setR(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="R" />
        <input type="number" min="0" max="255" value={g} onChange={(e) => setG(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="G" />
        <input type="number" min="0" max="255" value={b} onChange={(e) => setB(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="B" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-lg font-medium text-slate-900">
        {hex ?? "Enter values between 0 and 255"}
      </p>
    </div>
  );
}

function CaseConverterTool() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"upper" | "lower" | "title" | "sentence">("title");
  const output = useMemo(() => {
    if (mode === "upper") return text.toUpperCase();
    if (mode === "lower") return text.toLowerCase();
    if (mode === "title") {
      return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return text.length ? `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}` : "";
  }, [mode, text]);
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7} className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Paste text..." />
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-secondary px-3" onClick={() => setMode("upper")}>UPPERCASE</button>
        <button type="button" className="btn-secondary px-3" onClick={() => setMode("lower")}>lowercase</button>
        <button type="button" className="btn-secondary px-3" onClick={() => setMode("title")}>Title Case</button>
        <button type="button" className="btn-secondary px-3" onClick={() => setMode("sentence")}>Sentence case</button>
      </div>
      <textarea value={output} readOnly rows={7} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3" />
    </div>
  );
}

function RemoveDuplicateLinesTool() {
  const [input, setInput] = useState("");
  const output = useMemo(() => {
    const seen = new Set<string>();
    return input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => {
        if (!line || seen.has(line)) return false;
        seen.add(line);
        return true;
      })
      .join("\n");
  }, [input]);
  return (
    <div className="space-y-4">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="One item per line..." />
      <textarea value={output} readOnly rows={8} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3" />
    </div>
  );
}

function TextToSlugTool() {
  const [input, setInput] = useState("");
  const slug = useMemo(
    () =>
      input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
    [input]
  );
  return (
    <div className="space-y-4">
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Enter title..." />
      <input type="text" value={slug} readOnly className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3" />
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
  "bmi-calculator": () => <BmiCalculatorTool />,
  "age-calculator": () => <AgeCalculatorTool />,
  "loan-emi-calculator": () => <LoanEmiCalculatorTool />,
  "gpa-calculator": () => <GpaCalculatorTool />,
  "calorie-calculator": () => <CalorieCalculatorTool />,
  "date-difference-calculator": () => <DateDifferenceCalculatorTool />,
  "celsius-to-fahrenheit": () => (
    <SingleValueConverterTool
      label="Celsius"
      inputUnit="Celsius"
      outputUnit="Fahrenheit"
      convert={(v) => (v * 9) / 5 + 32}
      defaultValue="25"
    />
  ),
  "inches-to-cm": () => (
    <SingleValueConverterTool
      label="Inches"
      inputUnit="Inches"
      outputUnit="Centimeters"
      convert={(v) => v * 2.54}
    />
  ),
  "mpg-to-kpl": () => (
    <SingleValueConverterTool
      label="Miles per gallon (MPG)"
      inputUnit="MPG"
      outputUnit="KPL"
      convert={(v) => v * 0.425143707}
    />
  ),
  "km-to-miles": () => (
    <SingleValueConverterTool
      label="Kilometers"
      inputUnit="Kilometers"
      outputUnit="Miles"
      convert={(v) => v * 0.621371}
    />
  ),
  "miles-to-km": () => (
    <SingleValueConverterTool
      label="Miles"
      inputUnit="Miles"
      outputUnit="Kilometers"
      convert={(v) => v * 1.609344}
    />
  ),
  "pounds-to-kg": () => (
    <SingleValueConverterTool
      label="Pounds"
      inputUnit="Pounds"
      outputUnit="Kilograms"
      convert={(v) => v * 0.45359237}
    />
  ),
  "kg-to-pounds": () => (
    <SingleValueConverterTool
      label="Kilograms"
      inputUnit="Kilograms"
      outputUnit="Pounds"
      convert={(v) => v * 2.20462262}
    />
  ),
  "liters-to-gallons": () => (
    <SingleValueConverterTool
      label="Liters"
      inputUnit="Liters"
      outputUnit="US gallons"
      convert={(v) => v * 0.264172052}
    />
  ),
  "gallons-to-liters": () => (
    <SingleValueConverterTool
      label="US gallons"
      inputUnit="US gallons"
      outputUnit="Liters"
      convert={(v) => v * 3.78541178}
    />
  ),
  "hex-to-rgb": () => <HexToRgbTool />,
  "rgb-to-hex": () => <RgbToHexTool />,
  "case-converter": () => <CaseConverterTool />,
  "remove-duplicate-lines": () => <RemoveDuplicateLinesTool />,
  "text-to-slug": () => <TextToSlugTool />,
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
