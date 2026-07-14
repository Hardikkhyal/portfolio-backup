"use client";

import { Phone, Mail } from "lucide-react";

export default function Navbar() {
  return (
    <>
      
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent md:border-b md:border-white/[0.03] md:backdrop-blur-[4px] py-5 px-6 md:px-12 flex items-center justify-between">
        
        <div>
          <a href="#" className="font-display text-lg md:text-xl font-extrabold tracking-widest text-white uppercase group transition-all duration-300">
            hardik khyal <span className="text-luxury-gold transition-colors group-hover:text-white">®</span>
          </a>
        </div>

        
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "About", id: "about-me" },
            { label: "Graphic Design", id: "projects" },
            { label: "Web Projects", id: "web-projects" }
          ].map((item) => (
            <a
              key={item.label}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(item.id);
                if (target) {
                  if ((window as any).lenis) {
                    (window as any).lenis.scrollTo(target, { duration: 2.2 });
                  } else {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
              className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors duration-300 font-semibold cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </nav>

        
        <div className="flex items-center gap-6">
          <a
            href="tel:+919876543210"
            className="hidden sm:flex items-center gap-2 text-xs tracking-wider text-white/60 hover:text-luxury-gold transition-colors duration-300 font-medium"
          >
            <Phone className="h-3.5 w-3.5 text-luxury-gold" />
            <span>+91 98765 43210</span>
          </a>
          <a
            href="mailto:hardikkhyal@gmail.com"
            className="flex items-center gap-2 text-xs tracking-wider text-white/60 hover:text-luxury-gold transition-colors duration-300 font-medium"
          >
            <Mail className="h-3.5 w-3.5 text-luxury-gold" />
            <span className="hidden lg:inline">hardikkhyal@gmail.com</span>
          </a>
        </div>
      </header>
    </>
  );
}
