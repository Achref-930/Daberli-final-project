import { Facebook, Instagram, MessageCircle, Phone, Twitter } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer
      className="text-white pt-20 pb-10"
      style={{ backgroundColor: '#1D1D1F' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/10 p-2 rounded-2xl shadow-lg">
                <img src="/logo.svg" alt="Daberli" className="h-7 w-auto" />
              </div>
              <span className="font-heading text-xl font-black tracking-tighter">DABERLI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              The premium marketplace for vehicles, real estate, and services across Algeria.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Facebook,  href: '#', label: 'Facebook'  },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Twitter,   href: '#', label: 'Twitter'   },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-500 mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-bold">
              <li><Link to="/about" className="hover:text-apple-blue transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-apple-blue transition-colors">How it Works</a></li>
              <li><Link to="/terms" className="hover:text-apple-blue transition-colors">Terms of Service</Link></li>
              <li><a href="#" className="hover:text-apple-blue transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-500 mb-6">Categories</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-bold">
              <li><Link to="/auto"        className="hover:text-apple-blue transition-colors">Vehicles</Link></li>
              <li><Link to="/real-estate" className="hover:text-apple-blue transition-colors">Real Estate</Link></li>
              <li><Link to="/jobs"        className="hover:text-apple-blue transition-colors">Jobs</Link></li>
              <li><Link to="/services"    className="hover:text-apple-blue transition-colors">Services</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-500 mb-6">Contact</h4>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-3 rounded-2xl font-bold"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                WhatsApp Support
              </a>
              <a
                href="tel:+213550000000"
                className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-3 rounded-2xl font-bold"
              >
                <Phone className="w-5 h-5 text-apple-blue shrink-0" />
                +213 550 00 00 00
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Daberli. Made for Algeria</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;