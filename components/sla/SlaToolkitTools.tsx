"use client";

import { useMemo, useState } from "react";
import { trackSlaToolEvent } from "@/lib/analytics";
import {
  addBusinessTime,
  diffBusinessTime,
  type SLAConfig,
} from "@/lib/sla/sla-engine";
import {
  DateTimeInput,
  PresetButtons,
  ResultPanel,
  SLAConfigPanel,
  ToolModeSwitch,
} from "@/components/sla/SLAUi";

const DEFAULT_CONFIG: SLAConfig = {
  workingDays: [1, 2, 3, 4, 5],
  workingHours: { start: "09:00", end: "17:00" },
  holidays: [],
};

function nowLocalInput(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function toDate(input: string): Date | null {
  const value = new Date(input);
  return Number.isNaN(value.getTime()) ? null : value;
}

function formatMinutes(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? "-" : "";
  const absolute = Math.abs(totalMinutes);
  const days = Math.floor(absolute / (24 * 60));
  const hours = Math.floor((absolute % (24 * 60)) / 60);
  const minutes = absolute % 60;
  if (days > 0) return `${sign}${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${sign}${hours}h ${minutes}m`;
  return `${sign}${minutes}m`;
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function useTrackedConfig(toolSlug: string, mode: "business" | "full-time"): [SLAConfig, (next: SLAConfig) => void] {
  const [config, setConfig] = useState<SLAConfig>(DEFAULT_CONFIG);

  const effectiveConfig = useMemo<SLAConfig>(
    () =>
      mode === "full-time"
        ? { ...config, workingHours: null }
        : config,
    [config, mode]
  );

  const onChange = (next: SLAConfig) => {
    trackSlaToolEvent("config_change", toolSlug);
    setConfig(next);
  };

  return [effectiveConfig, onChange];
}

export function SlaDeadlineCalculatorTool({ toolSlug }: { toolSlug: string }) {
  const [mode, setMode] = useState<"business" | "full-time">("business");
  const [config, setConfig] = useTrackedConfig(toolSlug, mode);
  const [start, setStart] = useState(nowLocalInput);
  const [durationMinutes, setDurationMinutes] = useState("1440");
  const [started, setStarted] = useState(false);

  const result = useMemo(() => {
    const startDate = toDate(start);
    const minutes = parseInt(durationMinutes, 10);
    if (!startDate || Number.isNaN(minutes) || minutes <= 0) return null;
    return addBusinessTime(startDate, minutes, config);
  }, [config, durationMinutes, start]);

  const markStart = () => {
    if (!started) {
      trackSlaToolEvent("tool_start", toolSlug);
      setStarted(true);
    }
  };

  return (
    <div className="space-y-5">
      <ToolModeSwitch mode={mode} onChange={setMode} />
      <DateTimeInput
        label="Ticket created at"
        value={start}
        onChange={(v) => {
          markStart();
          setStart(v);
        }}
      />
      <label htmlFor="sla-target-minutes" className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">SLA target (minutes)</span>
        <input
          id="sla-target-minutes"
          type="number"
          min="1"
          value={durationMinutes}
          onChange={(e) => {
            markStart();
            setDurationMinutes(e.target.value);
          }}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
        />
      </label>
      <PresetButtons
        onPick={(minutes) => {
          markStart();
          setDurationMinutes(String(minutes));
        }}
      />
      <SLAConfigPanel
        config={config}
        onChange={setConfig}
        disabledWorkingHours={mode === "full-time"}
      />
      <button
        type="button"
        className="btn-primary px-4"
        onClick={() => {
          trackSlaToolEvent("calculate_click", toolSlug);
          if (result) trackSlaToolEvent("tool_complete", toolSlug);
        }}
      >
        Calculate SLA deadline
      </button>
      <ResultPanel
        title="Result"
        primary={result ? formatDateTime(result) : "Enter valid input"}
        description="Deadline is computed using your selected business calendar."
      />
    </div>
  );
}

export function BusinessHoursCalculatorTool({ toolSlug }: { toolSlug: string }) {
  const [mode, setMode] = useState<"business" | "full-time">("business");
  const [config, setConfig] = useTrackedConfig(toolSlug, mode);
  const [start, setStart] = useState(nowLocalInput);
  const [end, setEnd] = useState(nowLocalInput);
  const [started, setStarted] = useState(false);

  const minutes = useMemo(() => {
    const startDate = toDate(start);
    const endDate = toDate(end);
    if (!startDate || !endDate) return null;
    return diffBusinessTime(startDate, endDate, config);
  }, [config, end, start]);

  const markStart = () => {
    if (!started) {
      setStarted(true);
      trackSlaToolEvent("tool_start", toolSlug);
    }
  };

  return (
    <div className="space-y-5">
      <ToolModeSwitch mode={mode} onChange={setMode} />
      <div className="grid gap-4 sm:grid-cols-2">
        <DateTimeInput
          label="Start timestamp"
          value={start}
          onChange={(v) => {
            markStart();
            setStart(v);
          }}
        />
        <DateTimeInput
          label="End timestamp"
          value={end}
          onChange={(v) => {
            markStart();
            setEnd(v);
          }}
        />
      </div>
      <SLAConfigPanel
        config={config}
        onChange={setConfig}
        disabledWorkingHours={mode === "full-time"}
      />
      <button
        type="button"
        className="btn-primary px-4"
        onClick={() => {
          trackSlaToolEvent("tool_start", toolSlug);
          trackSlaToolEvent("calculate_click", toolSlug);
          if (minutes !== null) trackSlaToolEvent("tool_complete", toolSlug);
        }}
      >
        Calculate business hours
      </button>
      <ResultPanel
        title="Business time"
        primary={minutes === null ? "Enter valid timestamps" : formatMinutes(minutes)}
      />
    </div>
  );
}

export function ResponseTimeCalculatorTool({ toolSlug }: { toolSlug: string }) {
  const [config, setConfig] = useTrackedConfig(toolSlug, "business");
  const [openedAt, setOpenedAt] = useState(nowLocalInput);
  const [firstResponseAt, setFirstResponseAt] = useState(nowLocalInput);

  const minutes = useMemo(() => {
    const openDate = toDate(openedAt);
    const responseDate = toDate(firstResponseAt);
    if (!openDate || !responseDate) return null;
    return diffBusinessTime(openDate, responseDate, config);
  }, [config, firstResponseAt, openedAt]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <DateTimeInput
          label="Ticket opened at"
          value={openedAt}
          onChange={(v) => {
            trackSlaToolEvent("tool_start", toolSlug);
            setOpenedAt(v);
          }}
        />
        <DateTimeInput
          label="First response at"
          value={firstResponseAt}
          onChange={(v) => setFirstResponseAt(v)}
        />
      </div>
      <SLAConfigPanel config={config} onChange={setConfig} />
      <button
        type="button"
        className="btn-primary px-4"
        onClick={() => {
          trackSlaToolEvent("tool_start", toolSlug);
          trackSlaToolEvent("calculate_click", toolSlug);
          if (minutes !== null) trackSlaToolEvent("tool_complete", toolSlug);
        }}
      >
        Calculate response time
      </button>
      <ResultPanel
        title="First response SLA"
        primary={minutes === null ? "Enter valid timestamps" : formatMinutes(minutes)}
        description="Only configured working time is counted."
      />
    </div>
  );
}

export function ResolutionTimeCalculatorTool({ toolSlug }: { toolSlug: string }) {
  const [config, setConfig] = useTrackedConfig(toolSlug, "business");
  const [openedAt, setOpenedAt] = useState(nowLocalInput);
  const [resolvedAt, setResolvedAt] = useState(nowLocalInput);

  const minutes = useMemo(() => {
    const openDate = toDate(openedAt);
    const resolvedDate = toDate(resolvedAt);
    if (!openDate || !resolvedDate) return null;
    return diffBusinessTime(openDate, resolvedDate, config);
  }, [config, openedAt, resolvedAt]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <DateTimeInput label="Ticket opened at" value={openedAt} onChange={setOpenedAt} />
        <DateTimeInput label="Ticket resolved at" value={resolvedAt} onChange={setResolvedAt} />
      </div>
      <SLAConfigPanel config={config} onChange={setConfig} />
      <button
        type="button"
        className="btn-primary px-4"
        onClick={() => {
          trackSlaToolEvent("tool_start", toolSlug);
          trackSlaToolEvent("calculate_click", toolSlug);
          if (minutes !== null) trackSlaToolEvent("tool_complete", toolSlug);
        }}
      >
        Calculate resolution time
      </button>
      <ResultPanel
        title="Total resolution time"
        primary={minutes === null ? "Enter valid timestamps" : formatMinutes(minutes)}
        description="Non-working periods and holidays are excluded."
      />
    </div>
  );
}

export function SlaRemainingTimeTool({ toolSlug }: { toolSlug: string }) {
  const [mode, setMode] = useState<"business" | "full-time">("business");
  const [config, setConfig] = useTrackedConfig(toolSlug, mode);
  const [ticketOpenedAt, setTicketOpenedAt] = useState(nowLocalInput);
  const [slaTargetMinutes, setSlaTargetMinutes] = useState("1440");
  const [asOf, setAsOf] = useState(nowLocalInput);

  const result = useMemo(() => {
    const opened = toDate(ticketOpenedAt);
    const now = toDate(asOf);
    const targetMinutes = parseInt(slaTargetMinutes, 10);
    if (!opened || !now || Number.isNaN(targetMinutes) || targetMinutes <= 0) return null;
    const used = diffBusinessTime(opened, now, config);
    const remaining = targetMinutes - used;
    return { used, remaining };
  }, [asOf, config, slaTargetMinutes, ticketOpenedAt]);

  return (
    <div className="space-y-5">
      <ToolModeSwitch mode={mode} onChange={setMode} />
      <div className="grid gap-4 sm:grid-cols-2">
        <DateTimeInput
          label="Ticket opened at"
          value={ticketOpenedAt}
          onChange={setTicketOpenedAt}
        />
        <DateTimeInput label="As of time" value={asOf} onChange={setAsOf} />
      </div>
      <label htmlFor="sla-remaining-target-minutes" className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          SLA target (minutes)
        </span>
        <input
          id="sla-remaining-target-minutes"
          type="number"
          min="1"
          value={slaTargetMinutes}
          onChange={(e) => setSlaTargetMinutes(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
        />
      </label>
      <PresetButtons onPick={(minutes) => setSlaTargetMinutes(String(minutes))} />
      <SLAConfigPanel
        config={config}
        onChange={setConfig}
        disabledWorkingHours={mode === "full-time"}
      />
      <button
        type="button"
        className="btn-primary px-4"
        onClick={() => {
          trackSlaToolEvent("tool_start", toolSlug);
          trackSlaToolEvent("calculate_click", toolSlug);
          if (result) trackSlaToolEvent("tool_complete", toolSlug);
        }}
      >
        Check remaining time
      </button>
      <ResultPanel
        title="SLA remaining"
        primary={result ? formatMinutes(result.remaining) : "Enter valid input"}
        description={
          result
            ? result.remaining < 0
              ? "SLA already breached."
              : "Time remaining before SLA breach."
            : undefined
        }
        secondary={
          result ? (
            <p>
              Used so far: <strong>{formatMinutes(result.used)}</strong>
            </p>
          ) : null
        }
      />
    </div>
  );
}
