import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <span className="tracking-tight">SUPER</span>
              <span className="font-extrabold tracking-wider">Pi</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your trusted partner for financial wellness and market signals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-foreground text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-foreground text-sm">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-0">
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@superpi.com" className="hover:text-foreground">
                  contact@superpi.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-foreground">
                  +1 (732) 798-0486
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>103 Carnegie Center, #300 Princeton</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links & Copyright */}
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} SUPER Pi. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground text-sm">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
