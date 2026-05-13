import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="pt-12 pb-8 w-full" style={{ background: '#003580', borderTop: '4px solid #F5A800' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">

          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden shadow-lg flex items-center justify-center"
                style={{ background: '#F5A800', border: '2px solid #F5A800' }}>
                <span className="text-xl font-black" style={{ color: '#003580' }}>P</span>
              </div>
              <div>
                <h3 className="text-base font-bold leading-tight" style={{ color: '#F5A800' }}>
                  Phumelele Technical High School
                </h3>
                <p className="text-sm italic mt-0.5" style={{ color: 'rgba(245,168,0,0.65)' }}>
                  "Technical Excellence"
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 pb-2 uppercase tracking-wide"
              style={{ color: '#F5A800', borderBottom: '1px solid rgba(245,168,0,0.25)' }}>
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: 'rgba(245,168,0,0.8)' }}>
              <li className="flex items-start gap-2">
                <MapPin className="shrink-0 mt-0.5" size={16} />
                <span>Embizeni, Lupindo A/A, Matatiele, Eastern Cape, 4730</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0" />
                <span>+27 84 620 6248</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="shrink-0 mt-0.5" />
                <span className="break-all">principal@phumeleleths.co.za</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 pb-2 uppercase tracking-wide"
              style={{ color: '#F5A800', borderBottom: '1px solid rgba(245,168,0,0.25)' }}>
              School Hours
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: 'rgba(245,168,0,0.8)' }}>
              <li className="flex justify-between gap-4">
                <span>Mon – Thu</span>
                <span className="font-medium">07:30 – 15:30</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Friday</span>
                <span className="font-medium">07:30 – 13:30</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sat – Sun</span>
                <span className="font-medium">Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 text-center text-xs" style={{ borderTop: '1px solid rgba(245,168,0,0.15)', color: 'rgba(245,168,0,0.5)' }}>
          <p>&copy; {new Date().getFullYear()} Phumelele Technical High School. All Rights Reserved.</p>
          <Link to="/admin/login"
            className="text-xs mt-2 inline-block transition-colors hover:opacity-80"
            style={{ color: 'rgba(245,168,0,0.3)' }}>
            Staff Portal
          </Link>
        </div>

      </div>
    </footer>
  );
};
