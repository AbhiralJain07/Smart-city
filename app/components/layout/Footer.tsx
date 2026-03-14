export default function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-white/10 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold gradient-text mb-4">
              SmartCity AI
            </div>
            <p className="text-gray-400 text-sm">
              Transforming urban infrastructure with AI-powered insights and real-time analytics.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#technology" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Technology
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-neon-blue transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#careers" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#privacy" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#security" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 SmartCity AI. All rights reserved. Made with ❤️ by Group 3 (The OG team - Abhiral, Anunay and Rishi) - EvolVIT Team. 😊
          </p>
        </div>
      </div>
    </footer>
  );
}
