import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-6 flex items-center">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-medium tracking-tight">Category Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the category you're looking for. This category may have been removed or doesn't exist.
          </p>
          <Link
            href="/archive"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/90"
          >
            Browse All Articles
            <svg
              className="ml-1 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
