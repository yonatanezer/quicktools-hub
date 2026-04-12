import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">
        That page does not exist or was moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
      >
        Back to home
      </Link>
    </div>
  );
}
