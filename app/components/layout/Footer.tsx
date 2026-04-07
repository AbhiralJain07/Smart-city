import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background-secondary py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 text-2xl font-bold text-white">SmartCity AI</div>
            <p className="text-sm text-gray-400">
              Transforming urban infrastructure with AI-powered insights, live operations data, and coordinated city workflows.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Platform</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 transition-colors hover:text-neon-blue">
                  Features
                </a>
              </li>
              <li>
                <a href="#technology" className="text-gray-400 transition-colors hover:text-neon-blue">
                  Technology
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 transition-colors hover:text-neon-blue">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blogs" className="text-gray-400 transition-colors hover:text-neon-blue">
                  Blogs
                </Link>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 transition-colors hover:text-neon-blue">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 transition-colors hover:text-neon-blue">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Admin</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/admin/login" className="text-gray-400 transition-colors hover:text-neon-blue">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 transition-colors hover:text-neon-blue">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2026 SmartCity AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
