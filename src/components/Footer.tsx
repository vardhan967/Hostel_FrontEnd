import { Link } from 'react-router-dom';
import { Building2, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    // Clean, slightly elevated footer container
    <footer className="border-t border-gray-200 bg-white shadow-inner mt-16 pt-8 pb-4"> 
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 pb-8">
          
          {/* Column 1: Branding and About */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-blue-600 mb-3">
              <Building2 className="h-6 w-6" />
              <span>HostelHub</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Your trusted platform for discovering and managing perfect hostel accommodation.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b-2 border-blue-100 pb-1 inline-block">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/hostels" className="text-gray-600 hover:text-blue-600 transition-colors">Browse Hostels</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</Link>
              </li>
              <li>
                {/* Assuming /contact is a defined route or will be ignored by Router if not */}
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/policy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b-2 border-blue-100 pb-1 inline-block">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <a href="mailto:info@hostelhub.com" className="text-gray-600 hover:text-blue-600 transition-colors">info@hostelhub.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-gray-600 hover:text-blue-600 transition-colors">+1 (555) 123-4567</a>
              </div>
              <p className="text-xs text-gray-400 pt-2">Available M-F, 9am - 5pm EST</p>
            </div>
          </div>
          
          {/* Column 4: Social/Placeholder (Added for better layout) */}
          <div className="hidden lg:block">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b-2 border-blue-100 pb-1 inline-block">Connect</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Twitter (X)</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="pt-6 mt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} HostelHub. All rights reserved. Built for modern travellers.
        </div>
      </div>
    </footer>
  );
};

export default Footer;