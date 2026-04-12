import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/data/tools";

export default function HomePage() {
  return (
    <div>
      <AdBanner placement="top" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        QuickTools Hub
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Free browser-based utilities for images, text, and quick math. No
        accounts—open a tool and get results.
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-700">
        <li>
          <Link href="/image-tools" className="hover:underline">
            Image tools
          </Link>
        </li>
        <li>
          <Link href="/text-tools" className="hover:underline">
            Text tools
          </Link>
        </li>
        <li>
          <Link href="/calculator-tools" className="hover:underline">
            Calculator tools
          </Link>
        </li>
      </ul>

      <AdBanner placement="middle" />

      <h2 className="text-xl font-semibold text-slate-900">All tools</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      <AdBanner placement="bottom" />
    </div>
  );
}
