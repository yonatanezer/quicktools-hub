import type { Tool } from "@/types/tool";

function getToolPlaybook(tool: Tool): {
  problem: string;
  mistakes: string[];
  edgeCases: string[];
  alternatives: string;
} {
  const slug = tool.slug;
  const title = tool.title;
  const is = (token: string) => slug.includes(token);

  if (is("word-to-pdf")) {
    return {
      problem:
        "Teams often need fixed-layout files for submission, but source documents are still in editable DOCX format.",
      mistakes: [
        "Submitting without checking pagination and heading breaks.",
        "Assuming all fonts render the same after conversion.",
        "Skipping file-size checks before portal upload.",
      ],
      edgeCases: [
        "Complex tables and embedded objects can shift visually.",
        "Low-memory devices may process large documents more slowly.",
      ],
      alternatives:
        "Desktop office suites are useful for complex formatting control, while this tool is better for quick, browser-based conversion workflows.",
    };
  }

  if (is("pdf-to-word")) {
    return {
      problem:
        "Content locked in PDFs slows revisions when teams need editable versions for updates and collaboration.",
      mistakes: [
        "Expecting perfect formatting on heavily designed PDFs.",
        "Editing immediately without first checking section integrity.",
        "Discarding original PDF before validating the converted file.",
      ],
      edgeCases: [
        "Scanned PDFs may require OCR quality review.",
        "Multi-column layouts can require manual cleanup in DOCX.",
      ],
      alternatives:
        "Manual rewrite may be better for small files with complex layouts; this converter is strongest for text-first revision workflows.",
    };
  }

  if (is("merge-pdfs") || is("split-pdf") || is("compress-pdf")) {
    return {
      problem:
        "Document operations fail when files are disorganized, oversized, or bundled incorrectly for reviewers.",
      mistakes: [
        "Running operations without a final page-order review.",
        "Compressing too aggressively and reducing readability.",
        "Splitting by guesswork instead of clear section boundaries.",
      ],
      edgeCases: [
        "Very large source PDFs can take longer to process.",
        "Image-heavy pages may degrade if repeatedly recompressed.",
      ],
      alternatives:
        "Full PDF suites are useful for advanced editing; this tool is optimized for focused, high-frequency workflow actions.",
    };
  }

  if (is("word-counter") || is("case-converter") || is("text-to-slug") || is("duplicate-lines")) {
    return {
      problem:
        "Publishing and communication workflows break when text length, format, or URL structure is inconsistent.",
      mistakes: [
        "Relying on visual length instead of exact counts.",
        "Applying transformations without reviewing acronyms/brand names.",
        "Generating slugs before title wording is finalized.",
      ],
      edgeCases: [
        "Pasted rich text may include hidden whitespace characters.",
        "Non-English symbols may need editorial review after conversion.",
      ],
      alternatives:
        "Full writing editors support long drafting sessions; this tool is best for fast, targeted cleanup before publish.",
    };
  }

  if (is("hex-to-rgb") || is("rgb-to-hex")) {
    return {
      problem:
        "Design-dev handoff slows down when teams need color values in a different format than the one provided.",
      mistakes: [
        "Using RGB values outside valid 0-255 ranges.",
        "Copying shorthand HEX into systems requiring six-digit format.",
        "Assuming display differences always indicate conversion errors.",
      ],
      edgeCases: [
        "Color profile differences across monitors can affect perception.",
        "Print workflows may require CMYK conversion beyond this scope.",
      ],
      alternatives:
        "Design suites are better for palette management; this tool is ideal for quick format conversion and verification.",
    };
  }

  if (
    is("loan") ||
    is("mortgage") ||
    is("apr") ||
    is("debt-to-income") ||
    is("refinance") ||
    is("amortization") ||
    is("down-payment")
  ) {
    return {
      problem:
        "Loan and affordability decisions are often made quickly, but inconsistent assumptions can distort monthly and lifetime cost estimates.",
      mistakes: [
        "Mixing monthly and annual rates in the same interpretation.",
        "Ignoring fees or closing costs while comparing options.",
        "Trusting one output without running best/worst-case scenarios.",
      ],
      edgeCases: [
        "Zero-rate or short-term scenarios can change formula behavior.",
        "Lender-specific rules may differ from generic estimates.",
      ],
      alternatives:
        "Spreadsheet models are useful for custom policy constraints; this tool is built for fast decision checks and scenario comparison.",
    };
  }

  if (is("roi") || is("break-even") || is("inflation") || is("savings") || is("interest")) {
    return {
      problem:
        "Planning decisions become risky when return assumptions are unclear or interpreted without context.",
      mistakes: [
        "Using nominal values without considering inflation impact.",
        "Comparing options with different timelines as if equivalent.",
        "Skipping sensitivity checks on key assumptions.",
      ],
      edgeCases: [
        "Long time horizons amplify small assumption changes.",
        "Negative or extreme inputs can require special interpretation.",
      ],
      alternatives:
        "Financial planning software supports portfolio-level analysis; this tool is best for focused estimate and communication workflows.",
    };
  }

  if (is("sla") || is("response-time") || is("resolution-time") || is("business-hours")) {
    return {
      problem:
        "Service teams miss SLA expectations when elapsed time is measured without correct business-hour calendars.",
      mistakes: [
        "Measuring wall-clock time when contracts specify business time.",
        "Forgetting to configure non-working days and holidays.",
        "Reporting totals without clarifying the time mode used.",
      ],
      edgeCases: [
        "Timezone boundaries can affect timestamp interpretation.",
        "Past-due scenarios require negative remaining-time handling.",
      ],
      alternatives:
        "Ticketing platforms can automate SLA tracking at scale; this tool is useful for audit checks and manual scenario validation.",
    };
  }

  if (is("bmi") || is("calorie") || is("age") || is("date-difference")) {
    return {
      problem:
        "Everyday planning requires quick time and health-adjacent estimates, but small input errors can produce misleading results.",
      mistakes: [
        "Entering inconsistent units (cm vs m, date formats, etc.).",
        "Treating rough estimates as clinical conclusions.",
        "Ignoring baseline date assumptions in comparisons.",
      ],
      edgeCases: [
        "Date differences can vary around timezone transitions.",
        "Health outputs are informational and not medical diagnoses.",
      ],
      alternatives:
        "Professional medical or scheduling systems provide deeper context; this tool is ideal for quick checks and basic planning.",
    };
  }

  return {
    problem: `${title} is typically used when users need a fast, reliable answer during an active workflow without opening heavyweight software.`,
    mistakes: [
      "Skipping input validation before running the calculation or conversion.",
      "Copying results forward without a quick sanity check.",
      "Not reviewing assumptions shown in the page guidance.",
    ],
    edgeCases: [
      "Large or unusual inputs may require extra validation.",
      "Results should be interpreted in context of the specific workflow.",
    ],
    alternatives:
      "General-purpose software can support broader workflows, while this tool is optimized for focused task completion.",
  };
}

export function ToolSeoSections({ tool }: { tool: Tool }) {
  const faqItems = tool.faq.slice(0, 4);
  const faqSchema =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;
  const toolPlaybook = getToolPlaybook(tool);

  const benefits = [
    `Focused on ${tool.title.toLowerCase()} workflows users actually run.`,
    "Clear steps designed for completion, not exploration.",
    "Built for quick verification before sharing or submitting results.",
  ];

  return (
    <>
      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-900">Problem this tool solves</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          {toolPlaybook.problem}
        </p>
        <ul className="mt-4 list-disc space-y-2 rounded-xl bg-slate-50 px-5 py-4 pl-10 text-base leading-relaxed text-slate-700">
          {benefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-900">Common mistakes to avoid</h2>
        <ul className="list-disc space-y-2 rounded-xl bg-slate-50 px-5 py-4 pl-10 text-base leading-relaxed text-slate-700">
          {toolPlaybook.mistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-900">Edge cases and limitations</h2>
        <ul className="list-disc space-y-2 rounded-xl bg-slate-50 px-5 py-4 pl-10 text-base leading-relaxed text-slate-700">
          {toolPlaybook.edgeCases.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8 text-base leading-relaxed text-slate-700">
        <h2 className="text-lg font-semibold text-slate-900">Alternatives and when to use them</h2>
        <p>{toolPlaybook.alternatives}</p>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8 text-base leading-relaxed text-slate-700">
        <h2 className="text-lg font-semibold text-slate-900">
          About this free online tool
        </h2>
        {tool.seoContent.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      {faqItems.length > 0 ? (
        <section className="border-t border-slate-200 pt-8">
          <h2 className="text-lg font-semibold text-slate-900">FAQ</h2>
          <dl className="mt-4 space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <dt className="font-medium text-slate-900">{item.question}</dt>
                <dd className="mt-2 text-slate-700">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
    </>
  );
}
