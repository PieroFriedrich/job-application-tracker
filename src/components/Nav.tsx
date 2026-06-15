import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          Job Application Tracker
        </Link>
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/" className="hover:text-blue-600">
            List
          </Link>
          <Link href="/board" className="hover:text-blue-600">
            Board
          </Link>
          <Link href="/stats" className="hover:text-blue-600">
            Stats
          </Link>
          <Link
            href="/applications/new"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
          >
            + New
          </Link>
        </nav>
      </div>
    </header>
  );
}
