import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          Job Application Tracker
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            List
          </Link>
          <Link href="/board" className="hover:text-blue-600 dark:hover:text-blue-400">
            Board
          </Link>
          <Link href="/stats" className="hover:text-blue-600 dark:hover:text-blue-400">
            Stats
          </Link>
          <Link href="/interviews" className="hover:text-blue-600 dark:hover:text-blue-400">
            Interviews
          </Link>
          <Link
            href="/applications/new"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            + New
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
