import React from 'react';
import { Phone, MessageCircle, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white p-1 rounded">
                 <span className="text-daberli-blue font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight">DABERLI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for finding services, vehicles, and homes across Algeria. Fast, secure, and local.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-daberli-green">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-daberli-green">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-daberli-green">Contact Us</h4>
            <div className="flex flex-col space-y-3">
              <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-lg hover:bg-gray-700">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">WhatsApp Support</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-lg hover:bg-gray-700">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-sm">+213 550 00 00 00</span>
              </a>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Daberli. Made for Algeria with ❤️.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;