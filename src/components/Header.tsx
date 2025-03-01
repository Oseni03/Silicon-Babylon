
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ease-in-out",
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-primary-foreground font-semibold text-lg">S</span>
          </div>
          <span className={cn(
            "font-medium text-xl tracking-tight transition-opacity", 
            scrolled ? "opacity-100" : "opacity-100"
          )}>
            SatiricTech
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-primary/80 transition-colors underline-animate">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary/80 transition-colors underline-animate">
            About
          </Link>
          <Link to="/archive" className="text-sm font-medium hover:text-primary/80 transition-colors underline-animate">
            Archive
          </Link>
        </nav>

        <div className="md:hidden">
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
