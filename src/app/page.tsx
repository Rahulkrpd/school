
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100 p-6">
      <div className="w-full max-w-xl bg-white/70 backdrop-blur rounded-2xl shadow-lg p-8 border border-indigo-100">
        <h1 className="text-3xl font-bold text-indigo-900 text-center">School Manager</h1>
        <p className="mt-2 text-center text-indigo-700">Quickly add and browse schools</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={'/addSchool'}
            className="inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-600 text-white px-5 py-3 font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Add School
          </Link>
          <Link
            href={'/showSchools'}
            className="inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-white text-indigo-700 px-5 py-3 font-medium shadow hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Show Schools
          </Link>
        </div>
      </div>
    </div>
  );
}
