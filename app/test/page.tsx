import Link from "next/link";

export default function TestPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-2xl font-bold mb-4">Test Page</h1>
            <p className="text-gray-500 mb-8">Navigation successful!</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                Go Back
            </Link>
        </div>
    );
}
