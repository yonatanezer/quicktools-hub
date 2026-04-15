"use client";

import type { ReactNode } from "react";
import type { SLAConfig } from "@/lib/sla/sla-engine";

const WEEKDAY_OPTIONS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
] as const;

export function DateTimeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </label>
  );
}

export function ToolModeSwitch({
  mode,
  onChange,
}: {
  mode: "business" | "full-time";
  onChange: (mode: "business" | "full-time") => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange("business")}
        className={`rounded-md px-3 py-2 text-sm font-medium transition ${
          mode === "business"
            ? "bg-blue-600 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        Business hours
      </button>
      <button
        type="button"
        onClick={() => onChange("full-time")}
        className={`rounded-md px-3 py-2 text-sm font-medium transition ${
          mode === "full-time"
            ? "bg-blue-600 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        24/7 mode
      </button>
    </div>
  );
}

export function PresetButtons({
  onPick,
}: {
  onPick: (minutes: number, label: string) => void;
}) {
  const presets = [
    { label: "24h", minutes: 24 * 60 },
    { label: "48h", minutes: 48 * 60 },
    { label: "3 days", minutes: 72 * 60 },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.label}
          type="button"
          className="btn-secondary px-3 py-2 text-sm"
          onClick={() => onPick(preset.minutes, preset.label)}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

export function SLAConfigPanel({
  config,
  onChange,
  disabledWorkingHours,
}: {
  config: SLAConfig;
  onChange: (next: SLAConfig) => void;
  disabledWorkingHours?: boolean;
}) {
  const holidaysText = config.holidays.join("\n");
  const hoursStart = config.workingHours?.start ?? "09:00";
  const hoursEnd = config.workingHours?.end ?? "17:00";

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-base font-semibold text-slate-900">SLA configuration</h3>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Working days</p>
        <div className="flex flex-wrap gap-2">
          {WEEKDAY_OPTIONS.map((day) => {
            const active = config.workingDays.includes(day.value);
            return (
              <button
                type="button"
                key={day.value}
                className={`rounded-md border px-3 py-2 text-sm font-medium ${
                  active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
                onClick={() => {
                  const nextDays = active
                    ? config.workingDays.filter((d) => d !== day.value)
                    : [...config.workingDays, day.value].sort((a, b) => a - b);
                  onChange({ ...config, workingDays: nextDays });
                }}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Working hours</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Start
            </span>
            <input
              type="time"
              value={hoursStart}
              disabled={disabledWorkingHours}
              onChange={(e) =>
                onChange({
                  ...config,
                  workingHours: {
                    start: e.target.value,
                    end: hoursEnd,
                  },
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              End
            </span>
            <input
              type="time"
              value={hoursEnd}
              disabled={disabledWorkingHours}
              onChange={(e) =>
                onChange({
                  ...config,
                  workingHours: {
                    start: hoursStart,
                    end: e.target.value,
                  },
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Holidays (YYYY-MM-DD, one per line)
        </span>
        <textarea
          rows={4}
          value={holidaysText}
          onChange={(e) => {
            const lines = e.target.value
              .split(/\r?\n/)
              .map((v) => v.trim())
              .filter(Boolean);
            onChange({ ...config, holidays: lines });
          }}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-relaxed"
          placeholder="2026-01-01&#10;2026-12-25"
        />
      </label>
    </section>
  );
}

export function ResultPanel({
  title,
  primary,
  description,
  secondary,
}: {
  title: string;
  primary: string;
  description?: string;
  secondary?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{title}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{primary}</p>
      {description ? <p className="mt-2 text-sm text-slate-700">{description}</p> : null}
      {secondary ? <div className="mt-3 text-sm text-slate-700">{secondary}</div> : null}
    </section>
  );
}
