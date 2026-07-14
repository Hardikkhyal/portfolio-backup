"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { motion } from "framer-motion";

// ── exact same data as index.html ──────────────────────────────────────────
const ITEMS = [
  {
    id: "article-1",
    img: "/gallery-big/img1.jpg",
    title: "01 — artwork",
    caption: "I, D-503, the builder of the Integral, I am only one of the many mathematicians of the United State.",
    largeImg: "/gallery-big/img1.jpg",
    number: "01",
    articleTitle: "artwork",
    intro: "I, D-503, the builder of the Integral.",
    description: "The great historic hour is near, when the first Integral will rise into the limitless space of the universe.",
    extraImages: [
      "/gallery/sketches/img1.jpg",
      "/gallery/sketches/img2.jpg",
      "/gallery/sketches/img3.jpg",
      "/gallery/sketches/img4.jpg"
    ],
  },
  {
    id: "article-2",
    img: "/gallery-big/img2.jpg",
    title: "02 — logo",
    caption: "From behind the Green Wall from some unknown plains the wind brings to us the yellow honeyed pollen of flowers.",
    largeImg: "/gallery-big/img2.jpg",
    number: "02",
    articleTitle: "logo",
    intro: "From behind the Green Wall the wind brings honeyed pollen of flowers.",
    description: "One's lips are dry from this sweet dust. Every moment one passes one's tongue over them.",
    extraImages: [
      "/gallery/graphic-design/img1.jpg",
      "/gallery/graphic-design/img2.jpg",
      "/gallery/graphic-design/img3.jpg",
      "/gallery/graphic-design/img4.jpg"
    ],
  },
  {
    id: "article-3",
    img: "/gallery-big/img3.jpg",
    title: "03 — graphic designer",
    caption: "I looked over all that I wrote down yesterday and I find that my descriptions are not sufficiently clear.",
    largeImg: "/gallery-big/img3.jpg",
    number: "03",
    articleTitle: "graphic designer",
    intro: "I looked over all that I wrote down yesterday.",
    description: "That is, everything would undoubtedly be clear to one of us but who knows to whom my Integral will some day bring these records.",
    extraImages: [
      "/gallery/photography/img1.jpg",
      "/gallery/photography/img2.jpg",
      "/gallery/photography/img3.jpg",
      "/gallery/photography/img4.jpg"
    ],
  },
  {
    id: "article-4",
    img: "/gallery-big/img4.jpg",
    title: "04 — webproject",
    caption: "The auditorium: an enormous half-globe of glass with the sun piercing through.",
    largeImg: "/gallery-big/img4.jpg",
    number: "04",
    articleTitle: "webproject",
    intro: "The auditorium: an enormous half-globe of glass with the sun piercing through.",
    description: "The circular rows of noble, globe-like, closely-shaven heads. With joy in my heart I looked around.",
    extraImages: [
      "/gallery/web-projects/img1.jpg",
      "/gallery/web-projects/img2.jpg",
      "/gallery/web-projects/img3.jpg",
      "/gallery/web-projects/img4.jpg"
    ],
  },
];

// ── exact same type lines as index.html ────────────────────────────────────
const TYPE_LINES = [
  "bonjour bonjour bonjour",
  "attrayant attrayant attrayant",
  "charmante charmante charmante",
  "rosetta rosetta rosetta",
  "tendresse tendresse tendresse",
  "chatoyer chatoyer chatoyer",
  "bonjour bonjour bonjour",
  "attrayant attrayant attrayant",
  "charmante charmante charmante",
  "rosetta rosetta rosetta",
  "tendresse tendresse tendresse",
];

export default function Projects() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // ── TypeTransition (exact copy of typeTransition.js) ──────────────────
    const TYPE_LINE_OPACITY = 0.05; // matches --type-line-opacity in CSS

    const typeEl = root.querySelector<HTMLElement>("[data-type-transition]")!;
    const lines = Array.from(root.querySelectorAll<HTMLElement>(".type__line"));

    const typeIn = () =>
      gsap
        .timeline({ paused: true })
        .to(typeEl, { duration: 1.4, ease: "power2.inOut", scale: 2.7, rotate: -90 })
        .to(
          lines,
          {
            keyframes: [
              { x: "20%", duration: 1, ease: "power1.inOut" },
              { x: "-200%", duration: 1.5, ease: "power1.in" },
            ],
            stagger: 0.04,
          },
          0
        )
        .to(
          lines,
          {
            keyframes: [
              { opacity: 1, duration: 1, ease: "power1.in" },
              { opacity: 0, duration: 1.5, ease: "power1.in" },
            ],
          },
          0
        );

    const typeOut = () =>
      gsap
        .timeline({ paused: true })
        .to(typeEl, { duration: 1.4, ease: "power2.inOut", scale: 1, rotate: 0 }, 1.2)
        .to(lines, { duration: 2.3, ease: "back", x: "0%", stagger: -0.04 }, 0)
        .to(
          lines,
          {
            keyframes: [
              { opacity: 1, duration: 1, ease: "power1.in" },
              { opacity: TYPE_LINE_OPACITY, duration: 1.5, ease: "power1.in" },
            ],
          },
          0
        );

    // ── Article (exact copy of article.js) ────────────────────────────────
    class Article {
      DOM: {
        el: HTMLElement;
        imageWrap: HTMLElement | null;
        image: HTMLElement | null;
        number: HTMLElement | null;
        title: HTMLElement | null;
        info: HTMLElement | null;
      };
      constructor(el: HTMLElement) {
        this.DOM = {
          el,
          imageWrap: el.querySelector(".article__img-wrap"),
          image: el.querySelector(".article__img"),
          number: el.querySelector(".article__number"),
          title: el.querySelector(".article__title"),
          info: el.querySelector(".article__info"),
        };
      }
    }

    // ── Item (exact copy of item.js) ──────────────────────────────────────
    class Item {
      DOM: {
        el: HTMLElement;
        image: HTMLElement | null;
        title: HTMLElement | null;
        description: HTMLElement | null;
        article: HTMLElement | null;
      };
      article?: Article;

      constructor(el: HTMLElement) {
        const articleEl = document.getElementById(el.dataset.article!);
        this.DOM = {
          el,
          image: el.querySelector(".item__img"),
          title: el.querySelector(".item__caption-title"),
          description: el.querySelector(".item__caption-description"),
          article: articleEl,
        };
        if (articleEl) {
          this.article = new Article(articleEl);
        }

        const defaults = { duration: 1, ease: "expo" };
        el.addEventListener("mouseenter", () => {
          gsap
            .timeline({ defaults })
            .to([this.DOM.image, this.DOM.title, this.DOM.description], {
              y: (pos: number) => pos * 8 - 4,
            });
        });
        el.addEventListener("mouseleave", () => {
          gsap
            .timeline({ defaults })
            .to([this.DOM.image, this.DOM.title, this.DOM.description], { y: 0 });
        });
      }
    }

    // ── index.js logic ────────────────────────────────────────────────────
    let isAnimating = false;
    let currentItem = -1;

    const frameEl = root.querySelector<HTMLElement>(".frame")!;
    const itemsWrap = root.querySelector<HTMLElement>(".item-wrap")!;
    const backCtrl = root.querySelector<HTMLElement>(".back")!;

    const itemsInstanceArr: Item[] = [];
    Array.from(itemsWrap.querySelectorAll<HTMLElement>(".item")).forEach((itemEl) => {
      const item = new Item(itemEl);
      itemsInstanceArr.push(item);
      if (item.DOM.article) {
        itemEl.addEventListener("click", () => openItem(item));
      } else {
        itemEl.style.cursor = "default";
      }
    });

    function openItem(item: Item) {
      if (isAnimating || !item.article) return;
      isAnimating = true;
      currentItem = itemsInstanceArr.indexOf(item);

      const typeInTl = typeIn();

      const openTimeline = gsap.timeline({
        onComplete: () => (isAnimating = false),
      });

      openTimeline
        .addLabel("start", 0)
        .addLabel("typeTransition", 0.3)
        .addLabel(
          "articleOpening",
          typeInTl.totalDuration() * 0.75 + openTimeline.labels.typeTransition
        )

        // fade out items
        .to(
          itemsInstanceArr.map((i) => i.DOM.el),
          {
            duration: 0.8,
            ease: "power2.inOut",
            opacity: 0,
            y: (pos: number) => (pos % 2 ? "25%" : "-25%"),
          },
          "start"
        )
        // fade out frame
        .to(
          frameEl,
          {
            duration: 0.8,
            ease: "power3",
            opacity: 0,
            onComplete: () => gsap.set(frameEl, { pointerEvents: "none" }),
          },
          "start"
        )
        // type transition in
        .add(typeInTl.play(), "typeTransition")

        // open article
        .add(() => {
          gsap.set(backCtrl, { pointerEvents: "auto" });
          gsap.set(itemsWrap, { pointerEvents: "none" });
          item.DOM.article!.classList.add("article--current");
          // Reset any stale transforms from previous open/close
          gsap.set(item.article!.DOM.imageWrap, { clearProps: "all" });
          // Hide info block and image tiles so they can animate in
          gsap.set(item.article!.DOM.info, { opacity: 0, y: 30 });
          const imgTiles = item.article!.DOM.imageWrap
            ? item.article!.DOM.imageWrap.querySelectorAll<HTMLElement>(".article__img-horizontal")
            : [];
          gsap.set(imgTiles, { opacity: 0, y: 40 });
        }, "articleOpening")
        .to(backCtrl, { duration: 0.7, opacity: 1 }, "articleOpening")
        .to(
          item.article!.DOM.info,
          { duration: 0.8, ease: "expo", opacity: 1, y: 0 },
          "articleOpening"
        )
        .add(() => {
          // Animate individual image tiles in with stagger
          const imgTiles = item.article!.DOM.imageWrap
            ? item.article!.DOM.imageWrap.querySelectorAll<HTMLElement>(".article__img-horizontal")
            : [];
          gsap.to(imgTiles, {
            duration: 0.8,
            ease: "expo",
            opacity: 1,
            y: 0,
            stagger: 0.1,
          });
        }, "articleOpening");
    }

    function closeItem() {
      const item = itemsInstanceArr[currentItem];
      if (isAnimating || !item || !item.article) return;
      isAnimating = true;

      const typeOutTl = typeOut();

      const closeTimeline = gsap.timeline({
        onComplete: () => (isAnimating = false),
      });

      closeTimeline
        .addLabel("start", 0)
        .addLabel("typeTransition", 0.5)
        .addLabel(
          "showItems",
          typeOutTl.totalDuration() * 0.7 + closeTimeline.labels.typeTransition
        )

        .to(backCtrl, { duration: 0.7, ease: "power1", opacity: 0 }, "start")
        .to(
          item.article!.DOM.info,
          { duration: 0.6, ease: "power4.in", opacity: 0, y: 20 },
          "start"
        )
        .add(() => {
          // Animate image tiles out
          const imgTiles = item.article!.DOM.imageWrap
            ? item.article!.DOM.imageWrap.querySelectorAll<HTMLElement>(".article__img-horizontal")
            : [];
          gsap.to(imgTiles, {
            duration: 0.5,
            ease: "power4.in",
            opacity: 0,
            y: 30,
            stagger: 0.05,
          });
        }, "start")

        .add(() => {
          gsap.set(backCtrl, { pointerEvents: "none" });
          gsap.set(itemsWrap, { pointerEvents: "auto" });
          item.DOM.article!.classList.remove("article--current");
        })

        .add(typeOutTl.play(), "typeTransition")

        .to(
          frameEl,
          {
            duration: 0.8,
            ease: "power3",
            opacity: 1,
            onStart: () => gsap.set(frameEl, { pointerEvents: "auto" }),
          },
          "showItems"
        )
        .to(
          itemsInstanceArr.map((i) => i.DOM.el),
          { duration: 1, ease: "power3.inOut", opacity: 1, y: "0%" },
          "showItems"
        );
    }

    backCtrl.addEventListener("click", () => closeItem());

    return () => {
      // cleanup
      gsap.killTweensOf("*");
    };
  }, []);

  return (
    // wrapper keeps the section self-contained so its CSS vars don't bleed
    <section ref={rootRef} id="projects" className="ktp-root">
      {/* exact same markup as index.html ──────────────────────────────── */}

      {/* kinetic type overlay */}
      <div className="ktp-type" data-type-transition aria-hidden="true">
        {TYPE_LINES.map((line, i) => (
          <div key={i} className="type__line">
            {line}
          </div>
        ))}
      </div>

      {/* frame (header bar) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-24 left-0 w-full text-center z-10 pointer-events-none px-6"
      >
        <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.25em] mb-3 block relative z-10">
          selected works
        </span>
        <h2 
          className="text-4xl md:text-6xl font-black uppercase tracking-tight font-display relative z-10 mt-8 md:mt-12"
          style={{ color: "var(--graphic-title-color, #ffffff)" }}
        >
          Graphic Design
        </h2>
        <div className="h-[2px] w-16 bg-luxury-gold mx-auto mt-6 relative z-10" />
      </motion.div>

      {/* items grid */}
      <section className="item-wrap">
        {ITEMS.map((it, idx) => (
          <figure 
            key={it.id} 
            className="item" 
            data-article={it.id}
            data-aos="fade-up"
            data-aos-delay={idx * 150}
          >
            <Image
              className="item__img"
              src={it.img}
              alt={it.articleTitle}
              width={600}
              height={800}
              style={{ width: "100%", height: "auto", aspectRatio: "3/4", objectFit: "cover" }}
              priority={true}
            />
            <figcaption className="item__caption">
              <h3 className="item__caption-title">{it.title}</h3>
            </figcaption>
          </figure>
        ))}
      </section>

      {/* articles list (horizontal 4-image layout enabled for all) */}
      <section className="article-wrap">
        <button className="back">
          <svg viewBox="0 0 50 9" width="100%">
            <path d="M0 4.5l5-3M0 4.5l5 3M50 4.5h-77" />
          </svg>
        </button>

        {ITEMS.map((it) => (
          <article key={it.id} className="article article--horizontal" id={it.id}>
            {/* Number + Title centered at top */}
            <div className="article__info">
              <span className="article__number">{it.number}</span>
              <h2 className="article__title">{it.articleTitle}</h2>
            </div>
            {/* 4 images below */}
            <div className="article__img-wrap article__img-wrap--horizontal">
              {it.extraImages && it.extraImages.map((src: string, i: number) => (
                <div key={i} className="article__img-horizontal">
                  <Image
                    src={src}
                    alt={`${it.articleTitle} view ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}
