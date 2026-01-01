import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default async function RedirectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let targetUrl = null;

    try {
        const res = await fetch(`${API_URL}/api/stats/${decodeURIComponent(slug)}`, {
            cache: 'no-store'
        });

        if (res.ok) {
            targetUrl = `${API_URL}/${slug}`;
        }
    } catch (error) {
        console.error("Redirect check failed:", error);
    }

    if (targetUrl) {
        redirect(targetUrl);
    }

    // If we reach here, it's a 404
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#02140a] text-white selection:bg-emerald-500/30">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
            </div>

            <div className="relative z-10 text-center p-8">
                <h1 className="text-9xl font-black text-emerald-900 mb-4 tracking-tighter opacity-50">ዐ</h1>
                <h2 className="text-4xl font-black mb-4 tracking-tight">404 - ጠፍቷል</h2>
                <p className="text-emerald-100/40 max-w-sm mx-auto mb-8 font-medium">
                    The link you're looking for doesn't exist or has moved to another heritage site.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-3xl transition-all font-black shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                    Go back home
                </a>
            </div>
        </div>
    );
}
