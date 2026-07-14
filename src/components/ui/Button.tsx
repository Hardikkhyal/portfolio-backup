import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "gold" | "outline" | "glass" | "liquid-glass";
  showArrow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "gold", showArrow = true, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-full py-3.5 px-7 text-xs font-semibold uppercase tracking-widest transition-all duration-500 ease-out active:scale-[0.98]",
          variant === "gold" && 
            "bg-luxury-gold text-black shadow-lg shadow-luxury-gold/5 hover:bg-luxury-goldHover hover:shadow-luxury-gold/20 hover:scale-[1.04]",
          variant === "outline" && 
            "border border-white/20 bg-transparent text-white hover:border-white hover:bg-white/5",
          variant === "glass" && 
            "border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/20",
          variant === "liquid-glass" &&
            "liquid-glass text-white",
          className
        )}
        {...props}
      >
        {variant === "liquid-glass" && (
          <>
            {/* Ambient liquid glow backing */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />
            
            <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out pointer-events-none" />
          </>
        )}
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {showArrow && (
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:translate-x-1" />
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
