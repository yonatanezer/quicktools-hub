"use client";

import { jsPDF } from "jspdf";
import mammoth from "mammoth";
import type { ComponentType } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getClientUsageSignals, trackToolAction } from "@/lib/analytics";
import {
  BusinessHoursCalculatorTool,
  ResolutionTimeCalculatorTool,
  ResponseTimeCalculatorTool,
  SlaDeadlineCalculatorTool,
  SlaRemainingTimeTool,
} from "@/components/sla/SlaToolkitTools";
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

function MortgageCalculatorTool() {
  const [principal, setPrincipal] = useState("350000");
  const [annualRate, setAnnualRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const result = useMemo(() => {
    const p = parseFloat(principal);
    const rAnnual = parseFloat(annualRate);
    const y = parseFloat(years);
    if ([p, rAnnual, y].some((v) => Number.isNaN(v) || v <= 0)) return null;
    const n = y * 12;
    const r = rAnnual / 1200;
    const monthly = r === 0 ? p / n : (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    const total = monthly * n;
    return { monthly, total, interest: total - p };
  }, [annualRate, principal, years]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Loan amount" />
        <input type="number" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Annual rate (%)" />
        <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Term (years)" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Monthly: {result ? formatResult(result.monthly, 2) : "—"} | Total paid: {result ? formatResult(result.total, 2) : "—"} | Interest: {result ? formatResult(result.interest, 2) : "—"}
      </p>
    </div>
  );
}

function CompoundInterestCalculatorTool() {
  const [principal, setPrincipal] = useState("10000");
  const [annualRate, setAnnualRate] = useState("7");
  const [years, setYears] = useState("10");
  const [timesPerYear, setTimesPerYear] = useState("12");
  const amount = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(annualRate) / 100;
    const t = parseFloat(years);
    const n = parseFloat(timesPerYear);
    if ([p, r, t, n].some((v) => Number.isNaN(v) || v < 0) || n <= 0) return null;
    return p * (1 + r / n) ** (n * t);
  }, [annualRate, principal, timesPerYear, years]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Initial amount" />
        <input type="number" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Annual rate (%)" />
        <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Years" />
        <input type="number" value={timesPerYear} onChange={(e) => setTimesPerYear(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Compounds per year" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Future value: {amount === null ? "—" : formatResult(amount, 2)}
      </p>
    </div>
  );
}

function SavingsGoalCalculatorTool() {
  const [target, setTarget] = useState("50000");
  const [current, setCurrent] = useState("5000");
  const [annualRate, setAnnualRate] = useState("5");
  const [years, setYears] = useState("8");
  const monthlyContribution = useMemo(() => {
    const goal = parseFloat(target);
    const now = parseFloat(current);
    const r = parseFloat(annualRate) / 1200;
    const n = parseFloat(years) * 12;
    if ([goal, now, r, n].some((v) => Number.isNaN(v)) || goal <= now || n <= 0) return null;
    if (r === 0) return (goal - now) / n;
    const fvCurrent = now * (1 + r) ** n;
    const numerator = goal - fvCurrent;
    return (numerator * r) / ((1 + r) ** n - 1);
  }, [annualRate, current, target, years]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Savings target" />
        <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Current savings" />
        <input type="number" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Expected annual return (%)" />
        <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Years to goal" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Required monthly savings: {monthlyContribution === null || monthlyContribution < 0 ? "—" : formatResult(monthlyContribution, 2)}
      </p>
    </div>
  );
}

function SimpleInterestCalculatorTool() {
  const [principal, setPrincipal] = useState("10000");
  const [annualRate, setAnnualRate] = useState("6");
  const [years, setYears] = useState("3");
  const result = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(annualRate) / 100;
    const t = parseFloat(years);
    if ([p, r, t].some((v) => Number.isNaN(v) || v < 0)) return null;
    const interest = p * r * t;
    return { interest, total: p + interest };
  }, [annualRate, principal, years]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Principal" />
        <input type="number" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Rate (%)" />
        <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Years" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Interest: {result ? formatResult(result.interest, 2) : "—"} | Total amount: {result ? formatResult(result.total, 2) : "—"}
      </p>
    </div>
  );
}

function CreditCardPayoffCalculatorTool() {
  const [balance, setBalance] = useState("8000");
  const [apr, setApr] = useState("22");
  const [monthlyPayment, setMonthlyPayment] = useState("250");
  const months = useMemo(() => {
    const b = parseFloat(balance);
    const r = parseFloat(apr) / 1200;
    const p = parseFloat(monthlyPayment);
    if ([b, r, p].some((v) => Number.isNaN(v) || v <= 0)) return null;
    if (p <= b * r) return null;
    if (r === 0) return b / p;
    return -Math.log(1 - (r * b) / p) / Math.log(1 + r);
  }, [apr, balance, monthlyPayment]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Current balance" />
        <input type="number" value={apr} onChange={(e) => setApr(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="APR (%)" />
        <input type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Monthly payment" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Payoff time: {months === null ? "Increase monthly payment to exceed monthly interest." : `${formatResult(months, 1)} months`}
      </p>
    </div>
  );
}

function AutoLoanCalculatorTool() {
  const [carPrice, setCarPrice] = useState("30000");
  const [downPayment, setDownPayment] = useState("5000");
  const [annualRate, setAnnualRate] = useState("7.5");
  const [months, setMonths] = useState("60");
  const values = useMemo(() => {
    const price = parseFloat(carPrice);
    const down = parseFloat(downPayment);
    const r = parseFloat(annualRate) / 1200;
    const n = parseFloat(months);
    const p = price - down;
    if ([price, down, r, n].some((v) => Number.isNaN(v)) || p <= 0 || n <= 0) return null;
    const monthly = r === 0 ? p / n : (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    return { monthly, financed: p, total: monthly * n };
  }, [annualRate, carPrice, downPayment, months]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="number" value={carPrice} onChange={(e) => setCarPrice(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Car price" />
        <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Down payment" />
        <input type="number" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Annual rate (%)" />
        <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Term (months)" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Financed: {values ? formatResult(values.financed, 2) : "—"} | Monthly: {values ? formatResult(values.monthly, 2) : "—"} | Total: {values ? formatResult(values.total, 2) : "—"}
      </p>
    </div>
  );
}

function DebtToIncomeCalculatorTool() {
  const [monthlyDebt, setMonthlyDebt] = useState("1800");
  const [grossIncome, setGrossIncome] = useState("6000");
  const dti = useMemo(() => {
    const debt = parseFloat(monthlyDebt);
    const income = parseFloat(grossIncome);
    if ([debt, income].some((v) => Number.isNaN(v) || v <= 0)) return null;
    return (debt / income) * 100;
  }, [grossIncome, monthlyDebt]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="number" value={monthlyDebt} onChange={(e) => setMonthlyDebt(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Monthly debt payments" />
        <input type="number" value={grossIncome} onChange={(e) => setGrossIncome(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Gross monthly income" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Debt-to-income ratio: {dti === null ? "—" : `${formatResult(dti, 2)}%`}
      </p>
    </div>
  );
}

function RefinanceCalculatorTool() {
  const [oldBalance, setOldBalance] = useState("240000");
  const [oldRate, setOldRate] = useState("7.2");
  const [newRate, setNewRate] = useState("5.9");
  const [remainingMonths, setRemainingMonths] = useState("300");
  const [closingCosts, setClosingCosts] = useState("5000");
  const result = useMemo(() => {
    const p = parseFloat(oldBalance);
    const oldR = parseFloat(oldRate) / 1200;
    const newR = parseFloat(newRate) / 1200;
    const n = parseFloat(remainingMonths);
    const costs = parseFloat(closingCosts);
    if ([p, oldR, newR, n, costs].some((v) => Number.isNaN(v) || v < 0) || n <= 0 || p <= 0) return null;
    const oldMonthly = oldR === 0 ? p / n : (p * oldR * (1 + oldR) ** n) / ((1 + oldR) ** n - 1);
    const newMonthly = newR === 0 ? p / n : (p * newR * (1 + newR) ** n) / ((1 + newR) ** n - 1);
    const savings = oldMonthly - newMonthly;
    const breakEven = savings > 0 ? costs / savings : null;
    return { oldMonthly, newMonthly, savings, breakEven };
  }, [closingCosts, newRate, oldBalance, oldRate, remainingMonths]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="number" value={oldBalance} onChange={(e) => setOldBalance(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Current loan balance" />
        <input type="number" value={remainingMonths} onChange={(e) => setRemainingMonths(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Remaining months" />
        <input type="number" value={oldRate} onChange={(e) => setOldRate(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Current rate (%)" />
        <input type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="New rate (%)" />
        <input type="number" value={closingCosts} onChange={(e) => setClosingCosts(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3 sm:col-span-2" placeholder="Refinance closing costs" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Monthly savings: {result ? formatResult(result.savings, 2) : "—"} | Break-even: {result?.breakEven === null || result?.breakEven === undefined ? "Not beneficial at this rate" : `${formatResult(result.breakEven, 1)} months`}
      </p>
    </div>
  );
}

function DownPaymentCalculatorTool() {
  const [homePrice, setHomePrice] = useState("450000");
  const [downPercent, setDownPercent] = useState("20");
  const values = useMemo(() => {
    const price = parseFloat(homePrice);
    const pct = parseFloat(downPercent);
    if ([price, pct].some((v) => Number.isNaN(v) || v < 0)) return null;
    const down = (price * pct) / 100;
    return { down, loanAmount: price - down };
  }, [downPercent, homePrice]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="number" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Home price" />
        <input type="number" value={downPercent} onChange={(e) => setDownPercent(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Down payment (%)" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Down payment: {values ? formatResult(values.down, 2) : "—"} | Estimated loan: {values ? formatResult(values.loanAmount, 2) : "—"}
      </p>
    </div>
  );
}

function AmortizationCalculatorTool() {
  const [principal, setPrincipal] = useState("250000");
  const [annualRate, setAnnualRate] = useState("6.2");
  const [years, setYears] = useState("25");
  const values = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(annualRate) / 1200;
    const n = parseFloat(years) * 12;
    if ([p, r, n].some((v) => Number.isNaN(v) || v < 0) || p <= 0 || n <= 0) return null;
    const payment = r === 0 ? p / n : (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    const total = payment * n;
    const totalInterest = total - p;
    const firstMonthInterest = p * r;
    const firstMonthPrincipal = payment - firstMonthInterest;
    return { payment, totalInterest, firstMonthInterest, firstMonthPrincipal };
  }, [annualRate, principal, years]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Loan amount" />
        <input type="number" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Annual rate (%)" />
        <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Term (years)" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium">
        Monthly payment: {values ? formatResult(values.payment, 2) : "—"} | Total interest: {values ? formatResult(values.totalInterest, 2) : "—"} | Month 1 principal/interest: {values ? `${formatResult(values.firstMonthPrincipal, 2)} / ${formatResult(values.firstMonthInterest, 2)}` : "—"}
      </p>
    </div>
  );
}

function AprCalculatorTool() {
  const [loanAmount, setLoanAmount] = useState("20000");
  const [fees, setFees] = useState("800");
  const [monthlyPayment, setMonthlyPayment] = useState("420");
  const [months, setMonths] = useState("60");
  const aprValue = useMemo(() => {
    const principal = parseFloat(loanAmount) - parseFloat(fees);
    const payment = parseFloat(monthlyPayment);
    const n = parseFloat(months);
    if ([principal, payment, n].some((v) => Number.isNaN(v) || v <= 0)) return null;
    let low = 0;
    let high = 1;
    for (let i = 0; i < 60; i += 1) {
      const mid = (low + high) / 2;
      const pv =
        mid === 0
          ? payment * n
          : payment * ((1 - (1 + mid) ** -n) / mid);
      if (pv > principal) low = mid;
      else high = mid;
    }
    return ((low + high) / 2) * 12 * 100;
  }, [fees, loanAmount, monthlyPayment, months]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Loan amount" />
        <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Upfront fees" />
        <input type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Monthly payment" />
        <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Term (months)" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Estimated APR: {aprValue === null ? "—" : `${formatResult(aprValue, 2)}%`}
      </p>
    </div>
  );
}

function RetirementSavingsCalculatorTool() {
  const [current, setCurrent] = useState("25000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [years, setYears] = useState("25");
  const value = useMemo(() => {
    const p = parseFloat(current);
    const c = parseFloat(monthlyContribution);
    const r = parseFloat(annualReturn) / 1200;
    const n = parseFloat(years) * 12;
    if ([p, c, r, n].some((v) => Number.isNaN(v) || v < 0) || n <= 0) return null;
    const fvPrincipal = p * (1 + r) ** n;
    const fvContrib = r === 0 ? c * n : c * (((1 + r) ** n - 1) / r);
    return fvPrincipal + fvContrib;
  }, [annualReturn, current, monthlyContribution, years]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Current savings" />
        <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Monthly contribution" />
        <input type="number" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Annual return (%)" />
        <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Years" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Estimated retirement value: {value === null ? "—" : formatResult(value, 2)}
      </p>
    </div>
  );
}

function InflationCalculatorTool() {
  const [amount, setAmount] = useState("10000");
  const [inflationRate, setInflationRate] = useState("3");
  const [years, setYears] = useState("10");
  const values = useMemo(() => {
    const a = parseFloat(amount);
    const r = parseFloat(inflationRate) / 100;
    const t = parseFloat(years);
    if ([a, r, t].some((v) => Number.isNaN(v) || v < 0)) return null;
    const futureCost = a * (1 + r) ** t;
    const futurePurchasingPower = a / (1 + r) ** t;
    return { futureCost, futurePurchasingPower };
  }, [amount, inflationRate, years]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Amount today" />
        <input type="number" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Inflation rate (%)" />
        <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Years" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium">
        Future cost equivalent: {values ? formatResult(values.futureCost, 2) : "—"} | Purchasing power of current amount: {values ? formatResult(values.futurePurchasingPower, 2) : "—"}
      </p>
    </div>
  );
}

function RoiCalculatorTool() {
  const [initial, setInitial] = useState("10000");
  const [finalValue, setFinalValue] = useState("13000");
  const roi = useMemo(() => {
    const i = parseFloat(initial);
    const f = parseFloat(finalValue);
    if ([i, f].some((v) => Number.isNaN(v)) || i <= 0) return null;
    return ((f - i) / i) * 100;
  }, [finalValue, initial]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="number" value={initial} onChange={(e) => setInitial(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Initial investment" />
        <input type="number" value={finalValue} onChange={(e) => setFinalValue(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Final value" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        ROI: {roi === null ? "—" : `${formatResult(roi, 2)}%`}
      </p>
    </div>
  );
}

function BreakEvenCalculatorTool() {
  const [fixedCosts, setFixedCosts] = useState("10000");
  const [pricePerUnit, setPricePerUnit] = useState("80");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("35");
  const breakEvenUnits = useMemo(() => {
    const fixed = parseFloat(fixedCosts);
    const price = parseFloat(pricePerUnit);
    const variable = parseFloat(variableCostPerUnit);
    const contribution = price - variable;
    if ([fixed, price, variable].some((v) => Number.isNaN(v) || v < 0) || contribution <= 0) return null;
    return fixed / contribution;
  }, [fixedCosts, pricePerUnit, variableCostPerUnit]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Fixed costs" />
        <input type="number" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Price per unit" />
        <input type="number" value={variableCostPerUnit} onChange={(e) => setVariableCostPerUnit(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Variable cost per unit" />
      </div>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-medium">
        Break-even volume: {breakEvenUnits === null ? "—" : `${formatResult(breakEvenUnits, 2)} units`}
      </p>
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
  "mortgage-calculator": () => <MortgageCalculatorTool />,
  "compound-interest-calculator": () => <CompoundInterestCalculatorTool />,
  "savings-goal-calculator": () => <SavingsGoalCalculatorTool />,
  "simple-interest-calculator": () => <SimpleInterestCalculatorTool />,
  "credit-card-payoff-calculator": () => <CreditCardPayoffCalculatorTool />,
  "auto-loan-calculator": () => <AutoLoanCalculatorTool />,
  "debt-to-income-calculator": () => <DebtToIncomeCalculatorTool />,
  "refinance-calculator": () => <RefinanceCalculatorTool />,
  "down-payment-calculator": () => <DownPaymentCalculatorTool />,
  "amortization-calculator": () => <AmortizationCalculatorTool />,
  "apr-calculator": () => <AprCalculatorTool />,
  "retirement-savings-calculator": () => <RetirementSavingsCalculatorTool />,
  "inflation-calculator": () => <InflationCalculatorTool />,
  "roi-calculator": () => <RoiCalculatorTool />,
  "break-even-calculator": () => <BreakEvenCalculatorTool />,
  "sla-calculator": ({ toolSlug }) => <SlaDeadlineCalculatorTool toolSlug={toolSlug} />,
  "business-hours-calculator": ({ toolSlug }) => (
    <BusinessHoursCalculatorTool toolSlug={toolSlug} />
  ),
  "response-time-calculator": ({ toolSlug }) => (
    <ResponseTimeCalculatorTool toolSlug={toolSlug} />
  ),
  "resolution-time-calculator": ({ toolSlug }) => (
    <ResolutionTimeCalculatorTool toolSlug={toolSlug} />
  ),
  "sla-remaining-time": ({ toolSlug }) => <SlaRemainingTimeTool toolSlug={toolSlug} />,
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
