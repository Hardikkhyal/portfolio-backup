"use client";

import React, { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize Marquees
    const cleanupMarquees = initRadialTextMarquee();

    // GSAP ScrollTrigger Animations for Parallax and Scaling
    const ctx = gsap.context(() => {
      const heroes = container.querySelectorAll(".creative-hero");

      heroes.forEach((hero) => {
        const image = hero.querySelector("picture");
        const marquees = hero.querySelectorAll(".marquees svg");

        const ANIMATION = {
          IMAGE: {
            before: -50,
            after: 50,
          },
          MARQUEE: {
            before: 1.5,
            after: 0.5,
          },
        };

        const SHARED_SETTINGS = {
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            fastScrollEnd: true,
          },
        };

        // Image Parallax
        if (image) {
          gsap.set(image, {
            yPercent: ANIMATION.IMAGE.before,
          });

          gsap.fromTo(
            image,
            {
              yPercent: ANIMATION.IMAGE.before,
            },
            {
              yPercent: ANIMATION.IMAGE.after,
              ...SHARED_SETTINGS,
            }
          );
        }

        // Marquee Scaling
        marquees.forEach((marquee) => {
          gsap.set(marquee, {
            scale: ANIMATION.MARQUEE.before,
          });

          gsap.fromTo(
            marquee,
            {
              scale: ANIMATION.MARQUEE.before,
            },
            {
              scale: ANIMATION.MARQUEE.after,
              ...SHARED_SETTINGS,
            }
          );
        });
      });
    }, container);

    return () => {
      ctx.revert();
      cleanupMarquees();
    };
  }, []);

  return (
    <div ref={containerRef} id="about-slides" className="relative w-full bg-black z-10">
      {/* Hero Section 1: Founder / Creator */}
      <section className="creative-hero">
        <picture>
          <source media="(max-width: 767px)" srcSet="/about/mobile.jpg" />
          <source media="(min-width: 768px)" srcSet="/about/img1.jpg" />
          <img src="/about/img1.jpg" alt="Hero Image 1" />
        </picture>

        <div className="marquees">
          <div
            data-radial-text-marquee-init=""
            data-radial-text-marquee-speed="2"
            data-radial-text-marquee-radius="8"
            data-radial-text-marquee-spacer="."
            data-radial-text-marquee-spacer-color="#fff"
            className="radial-text-marquee"
          >
            <h2 data-radial-text-marquee-text="" className="red">Founder</h2>
          </div>

          <div
            data-radial-text-marquee-init=""
            data-radial-text-marquee-speed="4"
            data-radial-text-marquee-radius="8"
            data-radial-text-marquee-spacer=" "
            data-radial-text-marquee-spacer-color="#fff"
            className="radial-text-marquee script"
          >
            <h3 data-radial-text-marquee-text="">
              Creator
            </h3>
          </div>
        </div>
      </section>

      {/* Hero Section 2: Producer / Executive */}
      <section className="creative-hero">
        <picture>
          <source media="(max-width: 767px)" srcSet="/about/mobile2.jpg" />
          <source media="(min-width: 768px)" srcSet="/about/img2.jpg" />
          <img src="/about/img2.jpg" alt="Hero Image 2" />
        </picture>

        <div className="marquees">
          <div
            data-radial-text-marquee-init=""
            data-radial-text-marquee-speed="2"
            data-radial-text-marquee-radius="8"
            data-radial-text-marquee-spacer="."
            data-radial-text-marquee-spacer-color="#19350C"
            className="radial-text-marquee"
          >
            <h2 data-radial-text-marquee-text="" className="red">
              Producer
            </h2>
          </div>

          <div
            data-radial-text-marquee-init=""
            data-radial-text-marquee-speed="4"
            data-radial-text-marquee-radius="8"
            data-radial-text-marquee-spacer=" "
            data-radial-text-marquee-spacer-color="#fff"
            className="radial-text-marquee script"
          >
            <h3 data-radial-text-marquee-text="">Executive</h3>
          </div>
        </div>
      </section>

      {/* Hero Section 3: Psychic / Celebrity */}
      <section className="creative-hero">
        <picture>
          <source media="(max-width: 767px)" srcSet="/about/mobil3.jpg" />
          <source media="(min-width: 768px)" srcSet="/about/img3.jpg" />
          <img src="/about/img3.jpg" alt="Hero Image 3" />
        </picture>

        <div className="marquees">
          <div
            data-radial-text-marquee-init=""
            data-radial-text-marquee-speed="2"
            data-radial-text-marquee-radius="8"
            data-radial-text-marquee-spacer="."
            data-radial-text-marquee-spacer-color="#19350C"
            className="radial-text-marquee"
          >
            <h2 data-radial-text-marquee-text="" className="red">
              Psychic
            </h2>
          </div>

          <div
            data-radial-text-marquee-init=""
            data-radial-text-marquee-speed="4"
            data-radial-text-marquee-radius="8"
            data-radial-text-marquee-spacer=" "
            data-radial-text-marquee-spacer-color="#fff"
            className="radial-text-marquee script"
          >
            <h3 data-radial-text-marquee-text="">Celebrity</h3>
          </div>
        </div>
      </section>
    </div>
  );
}

function initRadialTextMarquee() {
  const wraps = document.querySelectorAll("[data-radial-text-marquee-init]");
  if (!wraps.length) return () => { };

  const ns = "http://www.w3.org/2000/svg";
  const xns = "http://www.w3.org/1999/xlink";
  const prm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prm) {
    wraps.forEach((wrap) => {
      const textEl = wrap.querySelector("[data-radial-text-marquee-text]") as HTMLElement;
      if (textEl) textEl.style.opacity = "1";
    });
    return () => { };
  }

  const startTime = performance.now();

  const isSafari = (() => {
    const ua = navigator.userAgent;
    return /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua);
  })();

  const clamp = (n: any, a: number, b: number) => Math.min(b, Math.max(a, Number(n) || 0));

  const speedMul = () => {
    const w = window.innerWidth || 2000;
    const t = clamp((w - 250) / (2000 - 250), 0, 1);
    return 0.5 + t * (1 - 0.5);
  };

  const lsToPx = (ls: string | null, fs: number) => {
    if (!ls || ls === "normal") return 0;
    if (ls.endsWith("px")) return parseFloat(ls) || 0;
    if (ls.endsWith("em")) return (parseFloat(ls) || 0) * fs;
    if (ls.endsWith("rem")) {
      const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      return (parseFloat(ls) || 0) * root;
    }
    const n = parseFloat(ls);
    return Number.isFinite(n) ? n : 0;
  };

  const syncType = (fromEl: HTMLElement, svgText: SVGTextElement, svgTextPath: SVGTextPathElement) => {
    const s = getComputedStyle(fromEl);
    const fsPx = parseFloat(s.fontSize) || 16;
    const lsPx = lsToPx(s.letterSpacing, fsPx);

    svgText.setAttribute("font-family", s.fontFamily);
    svgText.setAttribute("font-size", s.fontSize);
    svgText.setAttribute("font-weight", s.fontWeight);
    svgText.setAttribute("dominant-baseline", "alphabetic");
    svgText.setAttribute("text-rendering", "geometricPrecision");
    svgText.setAttribute("fill", s.color);
    svgText.setAttribute("letter-spacing", `${lsPx}px`);
    svgText.setAttribute("font-kerning", "none");
    svgText.setAttribute("font-feature-settings", '"kern" 0, "liga" 0, "clig" 0');

    if (svgTextPath) svgTextPath.setAttribute("letter-spacing", `${lsPx}px`);
    return { fsPx, lsPx, ff: s.fontFamily, fw: s.fontWeight, fz: s.fontSize, tt: s.textTransform };
  };

  const matchSourceCasing = (value: string, textTransform: string) => {
    if (typeof value !== "string") return value;
    if (textTransform === "uppercase") return value.toUpperCase();
    return value;
  };

  const tspan = (tp: SVGTextPathElement, v: string, fill: string | null, lsPx: number | null) => {
    const t = document.createElementNS(ns, "tspan");
    t.textContent = v;
    if (fill) t.setAttribute("fill", fill);
    if (lsPx != null) t.setAttribute("letter-spacing", `${lsPx}px`);
    tp.appendChild(t);
  };

  const buildRun = (
    tp: SVGTextPathElement,
    text: string,
    spacer: string,
    spacerColor: string | null,
    pad: string,
    reps: number,
    lsPx: number,
    textTransform: string
  ) => {
    tp.textContent = "";
    const displayText = matchSourceCasing(text, textTransform);
    const displaySpacer = matchSourceCasing(spacer, textTransform);

    for (let i = 0; i < reps; i++) {
      tspan(tp, displayText, null, lsPx);
      tspan(tp, pad, null, lsPx);
      tspan(tp, displaySpacer, spacerColor, lsPx);
      tspan(tp, pad, null, lsPx);
    }
  };

  const circleR = (half: number, level01: number) => {
    if (level01 <= 0) return half * 200;
    const inv = 1 - level01;
    return half * (1.01 + inv * inv * 16.99);
  };

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const measureLS = (str: string, fontCss: string, lsPx: number, textTransform: string) => {
    if (!ctx) return 0;
    const txt = matchSourceCasing(str || "", textTransform).replace(/\u00A0/g, " ");
    ctx.font = fontCss;
    const w = ctx.measureText(txt).width || 0;
    const glyphs = Array.from(txt).length;
    return w + Math.max(glyphs - 1, 0) * (lsPx || 0);
  };

  const makeSvg = (wrap: Element) => {
    const svg = document.createElementNS(ns, "svg");
    const defs = document.createElementNS(ns, "defs");
    const g = document.createElementNS(ns, "g");
    const path = document.createElementNS(ns, "path");
    const text = document.createElementNS(ns, "text");
    const tp = document.createElementNS(ns, "textPath");
    const id = `rtm-${Math.random().toString(16).slice(2)}`;

    svg.setAttribute("xmlns", ns);
    svg.setAttribute("xmlns:xlink", xns);
    Object.assign(svg.style, {
      position: "absolute",
      top: "0",
      left: "0",
      overflow: "visible",
      pointerEvents: "none",
      display: "block",
    });
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    path.setAttribute("id", id);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "none");

    tp.setAttribute("href", `#${id}`);
    tp.setAttributeNS(xns, "xlink:href", `#${id}`);
    tp.setAttribute("text-anchor", "start");
    tp.setAttribute("startOffset", "0px");

    text.appendChild(tp);
    defs.appendChild(path);
    svg.appendChild(defs);
    g.appendChild(path);
    g.appendChild(text);
    svg.appendChild(g);
    wrap.appendChild(svg);

    const textEl = wrap.querySelector("[data-radial-text-marquee-text]") as HTMLElement;
    if (textEl) textEl.style.opacity = "0";

    return { svg, g, path, text, tp };
  };

  const activeMarquees: any[] = [];
  const observers: ResizeObserver[] = [];

  wraps.forEach((wrap) => {
    const textEl = wrap.querySelector("[data-radial-text-marquee-text]") as HTMLElement;
    if (!textEl) return;

    const st = {
      ...makeSvg(wrap),
      tw: null as gsap.core.Tween | null,
      px: { x: 0 },
      raf: 0,
      qs: null as any,
    };
    activeMarquees.push(st);

    const rebuild = () => {
      let baseText = (textEl.textContent || "").trim();
      if (!baseText) return;

      const speed = clamp(wrap.getAttribute("data-radial-text-marquee-speed") || 4, 0.1, 200);
      const speedPx = Math.max(speed * 100 * speedMul(), 1);
      const radiusLevel = clamp(wrap.getAttribute("data-radial-text-marquee-radius") || 10, 0, 10);
      const level01 = radiusLevel / 10;
      const spacer = wrap.getAttribute("data-radial-text-marquee-spacer") || "•";
      const spacerColor = wrap.getAttribute("data-radial-text-marquee-spacer-color") || null;
      const padCount = clamp(wrap.getAttribute("data-radial-text-marquee-spacer-padding") || 1, 0, 20);
      const pad = "\u00A0".repeat(padCount);

      const typo = syncType(textEl, st.text, st.tp);
      const wrapW = Math.max(wrap.clientWidth || 1, 1);
      const parentH = wrap.parentElement ? wrap.parentElement.clientHeight : 0;
      const wrapH = Math.max(wrap.clientHeight || parentH || textEl.offsetHeight || 1, 1);
      const bleed = typo.fsPx * 2;
      const w = wrapW + bleed * 2;
      const h = wrapH;

      Object.assign(st.svg.style, {
        width: `${w}px`,
        height: `${h}px`,
        left: `${-bleed}px`,
      });
      st.svg.setAttribute("width", String(w));
      st.svg.setAttribute("height", String(h));
      st.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      const half = w / 2;
      const r = level01 <= 0.0001 ? half * 200 : Math.max(circleR(half, level01), half + 0.001);
      const under = Math.max(r * r - half * half, 0);
      const arcHeight = Math.max(r - Math.sqrt(under), 0);
      const baseline = h / 2 + typo.fsPx * 0.35;
      const y = Math.max(baseline - arcHeight / 2, 0);

      st.path.setAttribute(
        "d",
        level01 <= 0.0001 ? `M 0 ${y} L ${w} ${y}` : `M 0 ${y} A ${r} ${r} 0 0 0 ${w} ${y}`
      );
      st.text.setAttribute("x", "0");
      st.text.setAttribute("y", `${y}`);
      st.g.setAttribute("transform", "translate(0 0)");
      textEl.style.opacity = "0";

      if (st.raf) cancelAnimationFrame(st.raf);
      st.raf = requestAnimationFrame(() => {
        const fontCss = `${typo.fw} ${typo.fz} ${typo.ff}`;
        let loopLen =
          measureLS(baseText, fontCss, typo.lsPx, typo.tt) +
          measureLS(pad, fontCss, typo.lsPx, typo.tt) +
          measureLS(spacer, fontCss, typo.lsPx, typo.tt) +
          measureLS(pad, fontCss, typo.lsPx, typo.tt);
        loopLen = Math.max(loopLen || 0, 1);

        const pathLen = st.path.getTotalLength ? st.path.getTotalLength() : wrapW;
        const targetCover = Math.max(pathLen * 4, wrapW * 8);
        const reps = clamp(Math.ceil(targetCover / loopLen) + 6, 6, 600);

        buildRun(st.tp, baseText, spacer, spacerColor, pad, reps, typo.lsPx, typo.tt);

        const textBox = st.text.getBBox();
        const centerOffset = h / 2 - (textBox.y + textBox.height / 2);
        st.g.setAttribute("transform", `translate(0 ${centerOffset})`);

        if (!isSafari) {
          const fullLen = st.tp.getComputedTextLength();
          if (Number.isFinite(fullLen) && fullLen > 0) {
            const perUnit = fullLen / reps;
            if (Number.isFinite(perUnit) && perUnit > 0) loopLen = perUnit;
          }
        }
        loopLen = Math.max(loopLen, 1);

        if (st.tw) st.tw.kill();
        st.tw = null;

        if (prm) return;

        st.qs = gsap && gsap.quickSetter ? gsap.quickSetter(st.tp, "attr") : null;

        const setOffset = (v: number) => {
          const val = `${v.toFixed(3)}px`;
          if (st.qs) st.qs({ startOffset: val });
          else st.tp.setAttribute("startOffset", val);
        };

        st.px.x = ((performance.now() - startTime) / 1000 * speedPx) % loopLen;
        st.tw = gsap.to(st.px, {
          x: st.px.x + loopLen,
          duration: loopLen / speedPx,
          ease: "none",
          repeat: -1,
          onUpdate: () => {
            const x = ((st.px.x % loopLen) + loopLen) % loopLen;
            setOffset(-x);
          },
        });
      });
    };

    const schedule = (() => {
      let raf = 0;
      return () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(rebuild);
      };
    })();

    rebuild();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule).catch(() => { });
    } else {
      setTimeout(schedule, 150);
    }

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(schedule);
      ro.observe(wrap);
      ro.observe(textEl);
      observers.push(ro);
    } else {
      window.addEventListener("resize", schedule);
    }
  });

  return () => {
    activeMarquees.forEach((st) => {
      if (st.tw) st.tw.kill();
      if (st.raf) cancelAnimationFrame(st.raf);
      if (st.svg && st.svg.parentNode) {
        st.svg.parentNode.removeChild(st.svg);
      }
    });
    observers.forEach((ro) => ro.disconnect());
  };
}
