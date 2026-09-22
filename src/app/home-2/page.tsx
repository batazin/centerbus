"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../_lib/gsap";
import { SmoothScrollProvider } from "../_components/smooth-scroll-provider";
import { ForgeCursorTrail } from "./_components/forge-cursor-trail";
import { ForgeHeader } from "./_components/forge-header";
import "./forge.css";

const MARQUEE_LOGOS = [
  { name: "Aston Martin", src: "https://cdn.sanity.io/images/ed72g2cx/production/0376b1a1dd08bc79a767f1f5f46befe617f2882c-120x28.svg" },
  { name: "Audi", src: "https://cdn.sanity.io/images/ed72g2cx/production/2c9cafc8b15ad6961ff9d5c0a57a0dc2c97c2fa2-120x42.svg" },
  { name: "Bentley", src: "https://cdn.sanity.io/images/ed72g2cx/production/e271601746e95bcd1b5b1ebfce37d51ce581b8ad-120x38.svg" },
  { name: "Jaguar", src: "https://cdn.sanity.io/images/ed72g2cx/production/2cb28ac57667b0d9bbac8d68c0a630859ce889b2-120x10.svg" },
  { name: "Lamborghini", src: "https://cdn.sanity.io/images/ed72g2cx/production/57eab24a91878f828a2a6e7461c84a603eb8240b-52x60.svg" },
  { name: "Land Rover", src: "https://cdn.sanity.io/images/ed72g2cx/production/647bea4b10ef8f9bcea149298271657e9c72a670-115x60.svg" },
  { name: "Lotus", src: "https://cdn.sanity.io/images/ed72g2cx/production/69fee80a9c1bc7ec5d4b22c662319db174326f16-60x60.svg" },
  { name: "Lucid", src: "https://cdn.sanity.io/images/ed72g2cx/production/5e7b943bfe0a0908a7035693ae1a9ed209b914b8-120x8.svg" },
  { name: "Maserati", src: "https://cdn.sanity.io/images/ed72g2cx/production/e7cfeea594b2ac1cf927270961ace6ce8ebffb0e-120x60.svg" },
  { name: "McLaren", src: "https://cdn.sanity.io/images/ed72g2cx/production/e8ce4b533a95fd19ebe5fa323495d1c2d3170074-120x18.svg" },
  { name: "Mercedes", src: "https://cdn.sanity.io/images/ed72g2cx/production/6e49cc1f76bd2d6a2049408d12f00a58b2c6f889-60x60.svg" },
  { name: "Polestar", src: "https://cdn.sanity.io/images/ed72g2cx/production/8493e4780bacc8d8f9a4601cdb755bacf46b0ab7-120x27.svg" },
  { name: "Porsche", src: "https://cdn.sanity.io/images/ed72g2cx/production/9e728876539cbcc9f82941b505b4522fd1db5e6b-120x8.svg" },
  { name: "Rolls Royce", src: "https://cdn.sanity.io/images/ed72g2cx/production/1056d91ce910f0816d6467e96bf2d2a28befa4ba-49x60.svg" },
];

const STEPS_DATA = [
  {
    num: "01",
    total: "03",
    title: "Identity",
    desc: "Every build begins with the person behind the wheel, shaped around their individual taste, lifestyle, presence and personal sense of identity on the road.",
    image: "https://cdn.sanity.io/images/ed72g2cx/production/96abbebcdb69e4b13c6ff0e23da7784139ad7da3-2880x2234.jpg?auto=format",
    alt: "Forge Identity – Spirit of Ecstasy",
  },
  {
    num: "02",
    total: "03",
    title: "Insight",
    desc: "Exterior, interior and performance are brought together through a considered, detail-led approach, creating one complete and fully resolved vision.",
    image: "https://cdn.sanity.io/images/ed72g2cx/production/235781052416262c147da92950dc76d4d07b86ff-2880x2174.jpg?auto=format",
    alt: "Forge Intent – Custom Carbon Fibre",
  },
  {
    num: "03",
    total: "03",
    title: "Cohesion",
    desc: "Every modification is chosen with precision, ensuring each detail adds purpose, balance and distinction to the final bespoke automotive build.",
    image: "https://cdn.sanity.io/images/ed72g2cx/production/5831f81c6ffab5f5c73abf162d4b92c1a5a8c271-2880x2218.jpg?auto=format",
    alt: "Forge Cohesion – Backend McLaren",
  },
];

const SERVICES_DATA = [
  {
    id: "bodystyling",
    tag: "Service",
    title: "Bodystyling",
    desc: "From aero styling to carbon details and exterior refinement, bodywork is designed to change the vehicle’s presence without compromising its original character.",
    image: "https://cdn.sanity.io/images/ed72g2cx/production/dc00a94ef171fe44f6a793a72a3fa9216dd48f15-1254x1254.png?auto=format",
    alt: "Forge Service: Bodywork",
  },
  {
    id: "interior",
    tag: "Service",
    title: "Interior",
    desc: "Material, stitching, trim and finish are selected to create an interior that feels personal, tactile and composed. We turn the cabin into a space of identity, comfort and control.",
    image: "https://cdn.sanity.io/images/ed72g2cx/production/b98d6f2372e56bacbab8c532906ab79dd6a70581-1440x1800.jpg?auto=format",
    alt: "Forge Service: Interior",
  },
  {
    id: "wheels",
    tag: "Service",
    title: "Wheels",
    desc: "Bespoke wheel upgrades designed to enhance stance, proportion and road presence, with fitments selected to complement the vehicle’s character and performance.",
    image: "https://cdn.sanity.io/images/ed72g2cx/production/eba4e5fd9c980edaf3a36249253d9db5bdd4755c-1440x1800.jpg?auto=format",
    alt: "Forge Service: Wheels",
  },
  {
    id: "lighting",
    tag: "Service",
    title: "Lighting",
    desc: "Lighting gives a vehicle its expression. From subtle tinting to signature illumination and refined visual details, we use light to sharpen character, presence and atmosphere.",
    image: "https://cdn.sanity.io/images/ed72g2cx/production/1afaca4dbc32c6ef8e332bb05c144f56bef61599-1440x1800.jpg?auto=format",
    alt: "Forge Service: Lighting",
  },
  {
    id: "exhaust",
    tag: "Service",
    title: "Exhaust",
    desc: "Exhaust upgrades are chosen for tone, response and presence. Not noise for the sake of noise, but a sound profile that gives the vehicle more character and depth.",
    image: "https://cdn.sanity.io/images/ed72g2cx/production/e7030382683e44699afff394af92ae564c998004-1440x1800.jpg?auto=format",
    alt: "Forge Service: Exhaust",
  },
  {
    id: "protection",
    tag: "Service",
    title: "Protection",
    desc: "Paint protective film solutions that preserve the finish of the vehicle while allowing for satin finishes, coloured films and full visual transformation.",
    image: "https://cdn.sanity.io/images/ed72g2cx/production/e2d7ada78adba232d267d00994ba320200322289-1440x1800.jpg?auto=format",
    alt: "Forge Service: Wraps / PPF",
  },
];

// Helper component for Forge luxury button with character roll and glowing conic shader
function ForgeButton({ text, href = "#contact" }: { text: string; href?: string }) {
  return (
    <a href={href} className="forge-btn" aria-label={text}>
      <span className="forge-btn-shine" aria-hidden="true" />
      <span className="forge-btn-label">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="forge-btn-char"
            style={{ transitionDelay: `${i * 0.02}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </a>
  );
}

export default function Home2() {
  const [isPreloaderLoaded, setIsPreloaderLoaded] = useState(false);
  const [progressBarActive, setProgressBarActive] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  const stepsRef = useRef<HTMLDivElement>(null);
  const stepArticleRefs = useRef<(HTMLElement | null)[]>([]);
  const serviceRefs = useRef<(HTMLElement | null)[]>([]);

  // Preloader progress animation
  useEffect(() => {
    const timerStart = setTimeout(() => {
      setProgressBarActive(true);
    }, 80);

    const timerEnd = setTimeout(() => {
      setIsPreloaderLoaded(true);
    }, 700);

    return () => {
      clearTimeout(timerStart);
      clearTimeout(timerEnd);
    };
  }, []);

  // Steps and Services ScrollTrigger sync to ensure sticky visuals stay pinned and update on time
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Step articles tracking
      stepArticleRefs.current.forEach((el, idx) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveStepIndex(idx);
            }
          },
        });
      });

      // Service cards tracking
      serviceRefs.current.forEach((el, idx) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveServiceIndex(idx);
            }
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SmoothScrollProvider anchorOffset={0} lerp={0.09} wheelMultiplier={0.82}>
      <div className="forge-body">
        {/* 1. Preloader */}
        <aside className={`forge-preloader ${isPreloaderLoaded ? "loaded" : ""}`}>
          <p className="forge-preloader-text">
            Bespoke vehicles built on distinction, desire, and identity. not simply to be modified.
          </p>
          <div className="forge-preloader-progress-wrap">
            <div className="forge-preloader-track">
              <div className={`forge-preloader-bar ${progressBarActive ? "active" : ""}`} />
            </div>
          </div>
        </aside>

      {/* 2. Header */}
      <ForgeHeader />

      {/* 3. Hero Section with Interactive Cursor Image Trail */}
      <section id="hero" className="forge-hero-section">
        <div className="forge-hero-bg-texture" />
        <ForgeCursorTrail />

        <div className="forge-hero-top">
          <h1 className="forge-hero-title">For Those Who Refuse Ordinary</h1>
        </div>

        <div className="forge-hero-center-reveal">
          <h2 className="forge-hero-center-title">
            We don’t modify vehicles
            <br />
            We build them for you
          </h2>
        </div>

        <div className="forge-hero-bottom">
          <p className="forge-hero-desc">
            A luxury automotive atelier for bespoke styling, performance and craftsmanship.
          </p>
        </div>
      </section>

      {/* 4. Approach Section & Luxury Brand Logo Marquee */}
      <section id="approach" className="forge-approach-section">
        <div className="forge-approach-bg">
          <img
            src="https://cdn.sanity.io/images/ed72g2cx/production/fcdbdf14cba64b77f457e40c415f08366cd05043-2880x3600.jpg?auto=format"
            alt="Hands meticulously stitching red leather"
            loading="lazy"
          />
        </div>

        <div className="forge-approach-content">
          <h2 className="forge-approach-title">Our Approach To Every Build</h2>

          {/* Marquee */}
          <div className="forge-marquee-wrap" aria-hidden="true">
            <div className="forge-marquee-track">
              {MARQUEE_LOGOS.concat(MARQUEE_LOGOS).map((logo, idx) => (
                <div key={idx} className="forge-marquee-item">
                  <img src={logo.src} alt={logo.name} />
                </div>
              ))}
            </div>
          </div>

          <div className="forge-approach-bottom">
            <p className="forge-approach-desc">
              Every decision is intentional, every detail has purpose based on your taste, your
              lifestyle, and your standards.
            </p>
            <ForgeButton text="Start Your Project" href="#contact" />
          </div>
        </div>
      </section>

      {/* 5. Sticky 3-Step Narrative (Identity, Insight, Cohesion) */}
      <section id="steps" ref={stepsRef} className="forge-steps-section">
        <div className="forge-steps-split">
          {/* Left: Sticky 1:1 image visual */}
          <aside className="forge-steps-sticky-aside" aria-hidden="true">
            <div className="forge-steps-visual">
              {STEPS_DATA.map((step, idx) => (
                <img
                  key={step.title}
                  src={step.image}
                  alt={step.alt}
                  className={`forge-steps-image ${activeStepIndex === idx ? "active" : ""}`}
                />
              ))}
            </div>
          </aside>

          {/* Right: 3 Sequential Step Articles (100dvh each) */}
          <div className="forge-steps-cards-list">
            {STEPS_DATA.map((step, idx) => (
              <article
                key={step.title}
                data-step-index={idx}
                ref={(el) => {
                  stepArticleRefs.current[idx] = el;
                }}
                className="forge-step-article"
              >
                <div className="forge-step-indicator">
                  {step.num} <span>/ {step.total}</span>
                </div>
                <h3 className="forge-step-heading">{step.title}</h3>
                <p className="forge-step-desc">{step.desc}</p>
                <ForgeButton text="Start Your Project" href="#contact" />

                {/* Mobile inline image */}
                <img
                  src={step.image}
                  alt={step.alt}
                  className="forge-step-mobile-img"
                  loading="lazy"
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Statement Section */}
      <section className="forge-statement-section">
        <div className="forge-statement-grid">
          <h2 className="forge-statement-quote">
            A vehicle should say something before it moves. Every line, material, and finish is
            considered.
          </h2>
          <div className="forge-statement-details">
            <p className="forge-statement-copy">
              Our services are shaped with intent, from exterior styling and interior refinement to
              performance upgrades, detailing and bespoke finishes; each detail sharpens the
              vehicle’s character without overpowering it.
            </p>
            <ForgeButton text="Start Your Project" href="#contact" />
          </div>
        </div>
      </section>

      {/* 7. Sticky Services Split (6 Services) */}
      <section id="services" className="forge-services-section">
        <div className="forge-services-split">
          {/* Left: Scrollable service cards */}
          <div className="forge-services-list">
            {SERVICES_DATA.map((srv, idx) => (
              <article
                key={srv.id}
                data-service-index={idx}
                ref={(el) => {
                  serviceRefs.current[idx] = el;
                }}
                className="forge-service-card"
              >
                <span className="forge-service-tag">{srv.tag}</span>
                <h3 className="forge-service-title">{srv.title}</h3>
                <p className="forge-service-desc">{srv.desc}</p>
                <ForgeButton text="Start Your Project" href="#contact" />

                {/* Mobile image inline */}
                <img
                  src={srv.image}
                  alt={srv.alt}
                  className="forge-service-mobile-img"
                  loading="lazy"
                />
              </article>
            ))}
          </div>

          {/* Right: Sticky Image Showcase (Desktop) */}
          <aside className="forge-services-sticky-panel" aria-hidden="true">
            {SERVICES_DATA.map((srv, idx) => (
              <img
                key={srv.id}
                src={srv.image}
                alt={srv.alt}
                className={`forge-service-sticky-image ${activeServiceIndex === idx ? "active" : ""}`}
              />
            ))}
          </aside>
        </div>
      </section>

      {/* 8. "Ordinary Ends Here" Aerial Vehicle Showcase */}
      <section className="forge-ordinary-section">
        <h2 className="forge-ordinary-top-title">Ordinary</h2>

        <div className="forge-ordinary-cars-container">
          {/* Left Car: Mercedes G-Wagon */}
          <div className="forge-car-eagle-eye forge-car-side left">
            <img
              src="https://cdn.sanity.io/images/ed72g2cx/production/2dda49076a88dd6a1282c3858f405d756ff734f6-708x1402.png?auto=format"
              alt="Mercedes G-Wagon eagle eye POV"
              loading="lazy"
            />
          </div>

          {/* Center Main Car: Porsche 992 GT3RS */}
          <div className="forge-car-eagle-eye forge-car-main">
            <img
              src="https://cdn.sanity.io/images/ed72g2cx/production/135b8a261d63c2eacb7a981b7479b94c4a74998c-708x1402.png?auto=format"
              alt="Porsche 992 GT3RS in Red with carbon fibre modifications"
              loading="lazy"
            />
          </div>

          {/* Right Car: Land Rover Defender 110 */}
          <div className="forge-car-eagle-eye forge-car-side right">
            <img
              src="https://cdn.sanity.io/images/ed72g2cx/production/22884fd5c804bb7a4a5545e22f9dd51b353c0b27-707x1402.png?auto=format"
              alt="Land Rover Defender 110 eagle eye POV"
              loading="lazy"
            />
          </div>
        </div>

        <h2 className="forge-ordinary-bottom-title">Ends Here</h2>
        <p className="forge-ordinary-copy">
          Complete expressions of taste, intent and individuality, shaped through detail, restraint
          and presence.
        </p>
      </section>

      {/* 9. Previous Builds Monumental Card */}
      <section id="builds" className="forge-full-banner">
        <div className="forge-full-banner-bg">
          <img
            src="https://cdn.sanity.io/images/ed72g2cx/production/7d46ac246bd0990940600ffd72bac7105ee5cc0a-3840x2160.png?auto=format"
            alt="A Forge collection of custom vehicles including Porsche 911 GT3"
            loading="lazy"
          />
        </div>
        <div className="forge-full-banner-overlay" />
        <div className="forge-full-banner-content">
          <h2 className="forge-full-banner-title">Previous Builds</h2>
          <p className="forge-full-banner-desc">
            A collection of previous bespoke builds, shaped by craft, character and the people behind
            the wheel.
          </p>
          <ForgeButton text="Explore Builds" href="#contact" />
        </div>
      </section>

      {/* 10. Available Stock Monumental Card */}
      <section id="stock" className="forge-full-banner">
        <div className="forge-full-banner-bg">
          <img
            src="https://cdn.sanity.io/images/ed72g2cx/production/ca1704ba19e7015f94cf5ccb51d5f3db32fd3d96-2880x1868.jpg?auto=format"
            alt="Custom Forge Porsche 911 GT3, Lamborghini, Defender, and G-Wagen on wet tarmac"
            loading="lazy"
          />
        </div>
        <div className="forge-full-banner-overlay" />
        <div className="forge-full-banner-content">
          <h2 className="forge-full-banner-title">Available Stock</h2>
          <p className="forge-full-banner-desc">
            Builds available for purchase, refined with intent, engineered with purpose, and ready to
            make a statement.
          </p>
          <ForgeButton text="Browse Stock" href="#contact" />
        </div>
      </section>

      {/* 11. Footer & Final CTA ("Refuse Ordinary") */}
      <footer id="contact" className="forge-footer-section">
        <div className="forge-footer-bg">
          <img
            src="https://cdn.sanity.io/images/ed72g2cx/production/c6f15b9448f9090f3c7d9f0b5fab4e3cbc8e7284-2880x1800.jpg?auto=format"
            alt="Three custom Forge vehicles in dark studio"
            loading="lazy"
          />
        </div>
        <div className="forge-footer-overlay" />

        <div className="forge-footer-cta-box">
          <p className="forge-footer-kicker">Are you ready to</p>
          <h2 className="forge-footer-title">Refuse Ordinary</h2>
          <ForgeButton text="Start Your Project" href="#contact" />
        </div>

        <div className="forge-footer-bottom-bar">
          <button type="button" onClick={scrollToTop} className="forge-back-to-top" aria-label="Back to Top">
            <span>
              {"Back to Top".split("").map((char, i) => (
                <span key={i} style={{ transitionDelay: `${i * 0.02}s` }}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <span aria-hidden="true">↑</span>
          </button>

          <div className="forge-footer-legals">
            <a href="#hero">Cookies</a>
            <a href="#hero">Privacy</a>
            <a href="#hero">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  </SmoothScrollProvider>
  );
}
