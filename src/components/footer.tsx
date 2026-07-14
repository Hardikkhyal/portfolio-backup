"use client";

import React from 'react';
import { Heart, ExternalLink, Palette, Layers, Code2, Sparkles } from 'lucide-react';

export default function Footer() {
    const [isServiceModalOpen, setIsServiceModalOpen] = React.useState(false);

    const services = [
        {
            title: "Logo Design",
            description: "Premium visual brand identity & vector logo creation.",
            icon: Palette,
            message: "Hi Hardik! I'm interested in getting a Logo designed for my brand. Let's discuss details!"
        },
        {
            title: "Poster & Graphic Art",
            description: "Creative layouts, posters, and custom vector artwork.",
            icon: Layers,
            message: "Hi Hardik! I would love to get a custom Poster or Graphic Artwork designed. Let's connect!"
        },
        {
            title: "Web Development",
            description: "High-performance, scalable web apps & landing pages.",
            icon: Code2,
            message: "Hi Hardik! I want to build a custom Website for my project. Let's connect!"
        },
        {
            title: "Animated Website",
            description: "Next-gen immersive websites with custom interactive motion.",
            icon: Sparkles,
            message: "Hi Hardik! I am interested in building a premium Animated Website with custom physics and transitions. Let's discuss!"
        }
    ];

    const handleServiceClick = (message: string) => {
        const url = `https://wa.me/919465529470?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        setIsServiceModalOpen(false);
    };

    // Utility for smooth scrolling directly to section elements via ID references
    const handleScrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Stacked marquee texts to overlay in the footer background (layered look)
    const marquees = [
        { text: "CREATIVE DEVELOPER // PORTFOLIO // LEMA.WEB // FUTURE INTERFACES // AWWWARDS STYLE // ", dir: "left" },
        { text: "IMMERSIVE EXPERIENCE // WEBGL // GSAP // REACT // SMOOTH SCROLLING // TAILWIND // ", dir: "right" },
        { text: "LEESHARK // INNOVATIVE CODE // MODERN BRANDING // LUXURY DESIGN // ", dir: "left" },
        { text: "AESTHETIC LAYOUTS // SCROLLTRIGGER // LENIS // PHYSICAL ANIMATION // ", dir: "right" }
    ];

    return (
        <footer
            className="relative w-full py-24 px-6 md:px-12 lg:px-24 overflow-hidden z-30 select-none flex flex-col items-center"
            style={{
              backgroundColor: "var(--footer-bg, #19350C)",
              color: "var(--footer-link-color, #a8d4b8)"
            }}
        >
            {/* BACKGROUND TEXT MARQUEES - LAYERED VISUAL DEPTH */}
            <div className="absolute inset-0 w-full h-full flex flex-col justify-between py-6 pointer-events-none z-0">
                {marquees.map((m, idx) => (
                    <div key={idx} className="relative w-full flex overflow-hidden select-none">
                        {/* Animates text seamlessly using global infinite marquee styling */}
                        <div
                            className={`flex gap-4 font-black uppercase text-white/[0.025] text-[6.5vw] leading-none tracking-tighter ${m.dir === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
                                }`}
                        >
                            <span>{m.text}</span>
                            <span>{m.text}</span>
                            <span>{m.text}</span>
                            <span>{m.text}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* FOREGROUND CONTENT */}
            <div className="w-full max-w-5xl flex flex-col items-center z-10 relative text-center">

                {/* Floating Profile Image Placeholder (leaving hero image blank/logo placeholder as requested) */}
                <div 
                    className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 bg-zinc-950 shadow-2xl animate-float group cursor-pointer mb-6 flex items-center justify-center"
                    style={{ borderColor: "var(--footer-avatar-border, #a8d4b8)" }}
                >
                    <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-white font-display text-4xl font-extrabold tracking-tighter">
                        <span>L</span>
                        <span style={{ color: "var(--footer-accent-dot, #4db880)" }}>.</span>
                    </div>
                </div>

                {/* Premium Glowing CTA Buttons */}
                <div className="flex gap-4 flex-wrap justify-center mb-16">
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 text-white hover:bg-blue-700 font-bold uppercase tracking-widest text-xs rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(37,99,235,0.7)] hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-2"
                        style={{ backgroundColor: "var(--footer-btn-secondary, #2563eb)" }}
                    >
                        Follow
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                        onClick={() => setIsServiceModalOpen(true)}
                        className="px-8 py-3 bg-white hover:bg-zinc-100 font-bold uppercase tracking-widest text-xs rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center border-none"
                        style={{ color: "var(--footer-bg, #19350C)" }}
                    >
                        Message Me
                    </button>
                </div>

                {/* Luxury Branding */}
                <div className="mb-12">
                    <div className="flex justify-center items-center gap-1 cursor-pointer font-black text-4xl tracking-tighter mb-2" onClick={() => handleScrollTo('home')}>
                        <span style={{ color: "var(--footer-brand-color, #c8f0d8)" }}>HARDIK</span>
                        <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]">KHYAL</span>
                    </div>
                    <p 
                        className="text-[10px] font-black tracking-[0.25em] uppercase"
                        style={{ color: "var(--footer-sub-text, rgba(168, 212, 180, 0.8))" }}
                    >
                        Future Interfaces // Immersive Experiences
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-black text-xs uppercase tracking-widest mb-16">
                    {[
                        { name: 'Home', target: 'home' },
                        { name: 'About', target: 'about-me' },
                        { name: 'Portfolio', target: 'web-projects' },
                        { name: 'Service', target: 'skills' },
                        { name: 'Contact', target: 'contact' }
                    ].map((link) => (
                        <button
                            key={link.name}
                            onClick={() => handleScrollTo(link.target)}
                            className="hover:text-white hover:scale-105 hover:tracking-widest transition-all duration-300 cursor-pointer py-1"
                            style={{ color: "var(--footer-link-text, rgba(168, 212, 180, 0.8))" }}
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-white/10 rounded-full mb-8" />

                {/* Copyright & Legal */}
                <div 
                    className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest"
                    style={{ color: "var(--footer-copy-text, rgba(168, 212, 180, 0.6))" }}
                >
                    <div className="flex items-center gap-1.5 justify-center md:justify-start">
                        <span>&copy; {new Date().getFullYear()} khyalhardik ALL RIGHTS RESERVED.</span>
                        <Heart className="w-3 h-3 text-red-600 fill-current" />
                        <span>BY HARDIIKKHYAL</span>
                    </div>

                    <div className="flex gap-6">
                        <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>

            </div>

            {/* SERVICE SELECTOR MODAL OVERLAY */}
            {isServiceModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Dark backing overlay */}
                    <div 
                        className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer" 
                        onClick={() => setIsServiceModalOpen(false)}
                    />
                    
                    {/* Modal Card */}
                    <div 
                        className="relative w-full max-w-xl bg-zinc-900/90 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col items-center justify-center text-center z-10"
                        style={{
                            boxShadow: "0 0 50px rgba(0,0,0,0.8), inset 0 1px 0 0 rgba(255,255,255,0.05)"
                        }}
                    >
                        {/* Title */}
                        <span className="text-luxury-gold text-xs font-mono font-bold uppercase tracking-widest mb-2 block">
                            select a service
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black uppercase text-white font-display tracking-tight mb-3">
                            What are you building?
                        </h3>
                        <p className="text-white/45 text-xs md:text-sm max-w-md leading-relaxed mb-8">
                            Select a category below to instantly draft a customized message and start a chat on WhatsApp.
                        </p>
                        
                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
                            {services.map((s, idx) => {
                                const IconComponent = s.icon;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleServiceClick(s.message)}
                                        className="p-5 bg-white/[0.02] border border-white/[0.05] hover:border-luxury-gold/50 hover:bg-white/[0.04] transition-all duration-300 rounded-2xl cursor-pointer text-left flex items-start gap-4 group"
                                    >
                                        <IconComponent className="w-8 h-8 text-white/60 group-hover:text-luxury-gold group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-bold uppercase text-white tracking-wider group-hover:text-luxury-gold transition-colors duration-300">
                                                {s.title}
                                            </span>
                                            <span className="text-[11px] text-white/50 leading-normal font-sans">
                                                {s.description}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setIsServiceModalOpen(false)}
                            className="px-6 py-2.5 bg-transparent border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-mono text-[11px] uppercase tracking-widest rounded-full cursor-pointer transition-colors duration-200"
                        >
                            [ CLOSE ]
                        </button>
                    </div>
                </div>
            )}
        </footer>
    );
}