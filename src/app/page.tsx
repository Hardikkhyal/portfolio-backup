"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroScroll from "@/components/hero/HeroScroll";
import Me from "@/components/aboutsection";
import AboutMe from "@/components/myslide";
import Skills from "@/components/Skills";
import Projects from "@/components/graphic";
import Web from "@/components/Web";
import Journey from "@/components/Journey";
import BB from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="relative bg-luxury-bg text-white">
      {/* Fixed Header & Navigation */}
      <Navbar />

      <HeroScroll />
      <Me />
      <AboutMe />
      <Skills />
      <Projects />
      <Web />
      <Journey />
      <BB />
      <Footer />
    </main>
  );
}

