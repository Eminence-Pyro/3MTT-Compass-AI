import { Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">3M</span>
              </div>
              <span className="font-bold text-lg text-foreground">3MTT Compass AI</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Empowering your learning journey with AI-powered personalized pathways for the 3 Million Technical Talent program.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://3mtt.training" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  3MTT Official Portal
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://app.3mtt.training" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  3MTT Dashboard
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Learning Tracks
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 3MTT Compass AI. Part of the 3 Million Technical Talent initiative.
          </p>
          <div className="flex items-center space-x-1 text-muted-foreground text-sm mt-2 sm:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by Divine Nnata</span>
            <span>for Nigerian tech talents</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
