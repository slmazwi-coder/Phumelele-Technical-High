import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { cn } from '../lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Staff', path: '/staff' },
  { name: 'Documents', path: '/documents' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Sport', path: '/sport' },
  { name: 'Activities', path: '/activities' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  return (
    <nav className="w-full sticky top-0 z-50" style={{ background: '#003580', borderBottom: '3px solid #F5A800' }}>

      <div className="w-full" style={{ borderBottom: '1px solid rgba(245,168,0,0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link to="/" className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-md" style={{ border: '2px solid #F5A800' }}>
                <img src="./assets/Copilot_20260509_220231.png" alt="PTHS" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <span className="md:hidden text-sm font-bold block leading-tight text-white">
                  Phumelele THS
                </span>
                <span className="hidden md:block text-base font-bold leading-tight text-white">
                  Phumelele Technical High School
                </span>
                <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(245,168,0,0.8)' }}>
                  Technical Excellence
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link
                to="/student/login"
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-2',
                  location.pathname.startsWith('/student')
                    ? 'text-[#003580] bg-[#F5A800]'
                    : 'text-white border-2 border-white hover:bg-white hover:text-[#003580]'
                )}
              >
                <User size={15} /> Student Portal
              </Link>
            </div>

            <div className="md:hidden flex items-center shrink-0 ml-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white"
                aria-label="Open menu"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-full" style={{ background: '#003580' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center flex-wrap gap-x-1 gap-y-0 py-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                style={
                  location.pathname === link.path
                    ? { color: '#003580', background: '#F5A800', fontWeight: 700 }
                    : { color: 'white' }
                }
                onMouseEnter={e => {
                  if (location.pathname !== link.path) {
                    (e.target as HTMLElement).style.background = 'rgba(245,168,0,0.15)';
                  }
                }}
                onMouseLeave={e => {
                  if (location.pathname !== link.path) {
                    (e.target as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden shadow-lg" style={{ background: '#003580', borderTop: '1px solid rgba(245,168,0,0.3)' }}>
          <div className="px-3 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                style={
                  location.pathname === link.path
                    ? { color: '#003580', background: '#F5A800', fontWeight: 700 }
                    : { color: 'white' }
                }
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2" style={{ borderTop: '1px solid rgba(245,168,0,0.3)' }}>
              <Link
                to="/student/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-colors"
                style={
                  location.pathname.startsWith('/student')
                    ? { color: '#003580', background: '#F5A800' }
                    : { color: 'white', background: 'rgba(245,168,0,0.15)' }
                }
              >
                <User size={15} /> Student Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
