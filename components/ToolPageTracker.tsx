"use client";

import { useEffect, useRef } from "react";
import {
  trackToolEngagement,
  trackToolOpen,
  type ToolEventContext,
} from "@/lib/analytics";

export function ToolPageTracker({ tool }: { tool: ToolEventContext }) {
  const sentMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    trackToolOpen(tool);
  }, [tool]);

  useEffect(() => {
    const milestones = [25, 50, 75, 100] as const;

    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = Math.min(100, Math.round((window.scrollY / total) * 100));

      milestones.forEach((milestone) => {
        if (pct >= milestone && !sentMilestones.current.has(milestone)) {
          sentMilestones.current.add(milestone);
          trackToolEngagement(tool.tool_slug, `scroll_${milestone}` as const);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [tool.tool_slug]);

  useEffect(() => {
    const t10 = window.setTimeout(
      () => trackToolEngagement(tool.tool_slug, "time_10s"),
      10_000
    );
    const t30 = window.setTimeout(
      () => trackToolEngagement(tool.tool_slug, "time_30s"),
      30_000
    );
    const t60 = window.setTimeout(
      () => trackToolEngagement(tool.tool_slug, "time_60s"),
      60_000
    );

    return () => {
      window.clearTimeout(t10);
      window.clearTimeout(t30);
      window.clearTimeout(t60);
    };
  }, [tool.tool_slug]);

  return null;
}
