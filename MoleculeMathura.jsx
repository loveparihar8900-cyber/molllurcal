import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// MOLECULE MATHURA — Air Bar | Kitchen
// Cinematic 3D Rooftop Restaurant Experience
// ============================================================

// ── Color Tokens ─────────────────────────────────────────────
const C = {
  gold: "#C9A84C",
  goldLight: "#F0D080",
  goldDark: "#8B6914",
  cream: "#F5ECD7",
  coffee: "#6B3A2A",
  coffeeDark: "#3D1E0F",
  neonPurple: "#9D00FF",
  neonBlue: "#00D4FF",
  neonPink: "#FF006E",
  neonTeal: "#00FFD1",
  dark: "#080810",
  darkCard: "#0D0D1A",
  white: "#FFFFFF",
};

// ── Utility: clamp ────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ── Floating Particle Canvas ──────────────────────────────────
function ParticleCanvas({ colors = ["#C9A84C", "#ffffff", "#9D00FF"], count = 80, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const t = Date.now() / 1000;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;
        const alpha = p.alpha * (0.7 + 0.3 * Math.sin(t * 2 + p.pulse));
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, p.color + "FF");
        grad.addColorStop(1, p.color + "00");
        ctx.fillStyle = grad;
        ctx.globalAlpha = alpha;
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", ...style }} />;
}

// ── 3D Rotating Object (CSS 3D) ───────────────────────────────
function Rotate3D({ children, speed = 1, axis = "Y", style = {}, className = "" }) {
  const ref = useRef(null);
  const angle = useRef(0);
  const hovered = useRef(false);
  useEffect(() => {
    let raf;
    const animate = () => {
      if (ref.current) {
        angle.current += speed * (hovered.current ? 2 : 0.5);
        const r = axis === "Y"
          ? `rotateY(${angle.current}deg)`
          : axis === "X"
            ? `rotateX(${angle.current}deg)`
            : `rotateY(${angle.current}deg) rotateX(${angle.current * 0.3}deg)`;
        ref.current.style.transform = r;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [speed, axis]);
  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", willChange: "transform", ...style }}
      onMouseEnter={() => hovered.current = true}
      onMouseLeave={() => hovered.current = false}
    >
      {children}
    </div>
  );
}

// ── Cinematic Glow Text ───────────────────────────────────────
function GlowText({ children, color = C.gold, size = "4rem", font = "serif", className = "", style = {} }) {
  return (
    <span
      className={className}
      style={{
        fontFamily: font,
        fontSize: size,
        color,
        textShadow: `0 0 20px ${color}99, 0 0 60px ${color}55, 0 0 120px ${color}33`,
        letterSpacing: "0.05em",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── 3D Scene Base ─────────────────────────────────────────────
function Scene3D({ children, bg = "radial-gradient(ellipse at center, #0D0820 0%, #080810 100%)", style = {}, id }) {
  return (
    <section
      id={id}
      style={{
        position: "relative",
        overflow: "hidden",
        background: bg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1000px",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

// ── SVG Icons ─────────────────────────────────────────────────
const CoffeeCupSVG = () => (
  <svg viewBox="0 0 100 120" style={{ width: "100%", height: "100%", filter: `drop-shadow(0 0 15px ${C.gold})` }}>
    <defs>
      <radialGradient id="cupG" cx="40%" cy="30%">
        <stop offset="0%" stopColor="#8B5E3C" />
        <stop offset="100%" stopColor="#3D1E0F" />
      </radialGradient>
      <radialGradient id="coffeeG" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#6B3A2A" />
        <stop offset="100%" stopColor="#2D0F00" />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="30" rx="35" ry="8" fill="#6B3A2A" />
    <ellipse cx="50" cy="30" rx="30" ry="6" fill="#2D0F00" />
    <path d="M15 30 Q12 70 20 85 Q30 95 50 95 Q70 95 80 85 Q88 70 85 30Z" fill="url(#cupG)" />
    <path d="M82 42 Q95 42 95 55 Q95 68 82 68" stroke={C.gold} strokeWidth="5" fill="none" strokeLinecap="round" />
    <ellipse cx="50" cy="30" rx="25" ry="5" fill="url(#coffeeG)" />
    <ellipse cx="50" cy="100" rx="30" ry="5" fill={C.gold} opacity="0.5" />
    <path d="M35 15 Q38 5 42 12" stroke={C.cream} strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M50 12 Q53 2 57 9" stroke={C.cream} strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M65 15 Q68 5 72 12" stroke={C.cream} strokeWidth="2" fill="none" opacity="0.6" />
  </svg>
);

const PlateSVG = () => (
  <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%", filter: `drop-shadow(0 0 18px ${C.gold})` }}>
    <defs>
      <radialGradient id="plateG" cx="35%" cy="30%">
        <stop offset="0%" stopColor="#E8E0D0" />
        <stop offset="100%" stopColor="#B0A898" />
      </radialGradient>
      <radialGradient id="foodG" cx="40%" cy="35%">
        <stop offset="0%" stopColor="#D4943A" />
        <stop offset="100%" stopColor="#8B4513" />
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="80" rx="55" ry="10" fill="#00000033" />
    <ellipse cx="60" cy="60" rx="55" ry="12" fill="url(#plateG)" />
    <ellipse cx="60" cy="58" rx="48" ry="9" fill="#C8C0B0" />
    <ellipse cx="60" cy="56" rx="38" ry="7" fill="url(#foodG)" />
    <circle cx="52" cy="52" r="6" fill="#F0C040" opacity="0.9" />
    <circle cx="68" cy="50" r="4" fill="#C0392B" opacity="0.8" />
    <circle cx="60" cy="48" r="3" fill="#27AE60" opacity="0.8" />
    <path d="M44 38 L44 20" stroke="#C0A060" strokeWidth="3" strokeLinecap="round" />
    <path d="M76 38 L76 20" stroke="#C0A060" strokeWidth="3" strokeLinecap="round" />
    <path d="M76 20 Q80 15 80 10" stroke="#C0A060" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const CocktailSVG = () => (
  <svg viewBox="0 0 100 140" style={{ width: "100%", height: "100%", filter: `drop-shadow(0 0 20px ${C.neonPurple})` }}>
    <defs>
      <linearGradient id="glassG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#9D00FF" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="drinkG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF006E" />
        <stop offset="50%" stopColor="#9D00FF" />
        <stop offset="100%" stopColor="#00D4FF" />
      </linearGradient>
    </defs>
    <polygon points="10,10 90,10 65,80 35,80" fill="url(#glassG)" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
    <polygon points="20,10 80,10 62,70 38,70" fill="url(#drinkG)" opacity="0.7" />
    <rect x="42" y="80" width="16" height="40" fill="url(#glassG)" stroke="#ffffff" strokeWidth="1" />
    <ellipse cx="50" cy="120" rx="25" ry="5" fill={C.neonPurple} opacity="0.4" />
    <circle cx="85" cy="25" r="10" fill="#FF006E" opacity="0.9" />
    <line x1="85" y1="25" x2="70" y2="10" stroke="#fff" strokeWidth="1.5" />
    <circle cx="50" cy="10" r="3" fill="#F0C040" />
    <ellipse cx="50" cy="10" rx="30" ry="4" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
    {[0, 60, 120, 180, 240, 300].map((a, i) => (
      <circle key={i}
        cx={50 + 28 * Math.cos(a * Math.PI / 180)}
        cy={10 + 3 * Math.sin(a * Math.PI / 180)}
        r="1.5" fill={[C.neonPink, C.neonBlue, C.neonPurple][i % 3]} />
    ))}
  </svg>
);

const BiriyaniSVG = () => (
  <svg viewBox="0 0 140 100" style={{ width: "100%", height: "100%", filter: `drop-shadow(0 0 15px ${C.gold}88)` }}>
    <defs>
      <radialGradient id="bowlG" cx="40%" cy="30%">
        <stop offset="0%" stopColor="#D4943A" />
        <stop offset="100%" stopColor="#8B4513" />
      </radialGradient>
      <radialGradient id="lidG" cx="35%" cy="25%">
        <stop offset="0%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#8B6914" />
      </radialGradient>
    </defs>
    <ellipse cx="70" cy="85" rx="65" ry="10" fill="#00000044" />
    <path d="M10 55 Q10 85 70 85 Q130 85 130 55Z" fill="url(#bowlG)" />
    <ellipse cx="70" cy="55" rx="60" ry="15" fill="#C8A878" />
    <path d="M15 40 Q15 10 70 10 Q125 10 125 40 Q125 55 70 55 Q15 55 15 40Z" fill="url(#lidG)" />
    <ellipse cx="70" cy="40" rx="55" ry="12" fill="#D4B060" opacity="0.5" />
    <circle cx="70" cy="12" r="8" fill={C.gold} />
    <circle cx="70" cy="12" r="5" fill={C.goldLight} />
    <ellipse cx="55" cy="52" rx="5" ry="3" fill="#FF6B35" opacity="0.8" />
    <ellipse cx="75" cy="50" rx="4" ry="2" fill="#27AE60" opacity="0.8" />
    <ellipse cx="88" cy="53" rx="4" ry="2" fill="#F39C12" opacity="0.8" />
  </svg>
);

// ── Menu Card ─────────────────────────────────────────────────
function MenuCard({ item, theme = "restaurant", index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const themes = {
    cafe: {
      bg: "linear-gradient(135deg, #2A1A0A 0%, #3D2010 100%)",
      border: C.gold,
      accent: C.gold,
      glow: C.gold,
    },
    restaurant: {
      bg: "linear-gradient(135deg, #0A0A14 0%, #141428 100%)",
      border: C.gold,
      accent: C.goldLight,
      glow: C.gold,
    },
    bar: {
      bg: "linear-gradient(135deg, #0A0014 0%, #140028 100%)",
      border: C.neonPurple,
      accent: C.neonPink,
      glow: C.neonPurple,
    },
  };
  const t = themes[theme];
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: t.bg,
        border: `1px solid ${hovered ? t.border : t.border + "44"}`,
        borderRadius: 16,
        padding: "20px 22px",
        transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hovered ? `0 20px 60px ${t.glow}33, 0 0 0 1px ${t.border}55` : "0 4px 20px #00000044",
        cursor: "default",
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1rem", color: t.accent, fontWeight: 600, marginBottom: 4 }}>
            {item.name}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#888", lineHeight: 1.5, marginBottom: 8 }}>
            {item.desc}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.7rem", color: "#666", background: "#ffffff11", padding: "2px 8px", borderRadius: 20 }}>
              🔥 {item.kcal}
            </span>
            <span style={{
              fontSize: "0.7rem",
              padding: "2px 8px",
              borderRadius: 20,
              background: item.veg ? "#27AE6022" : "#C0392B22",
              color: item.veg ? "#27AE60" : "#C0392B",
              border: `1px solid ${item.veg ? "#27AE6044" : "#C0392B44"}`,
            }}>
              {item.veg ? "● VEG" : "● NON-VEG"}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: "monospace", fontSize: "1.1rem", color: t.accent, fontWeight: 700 }}>
            {item.price}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section Title ─────────────────────────────────────────────
function SectionTitle({ eyebrow, title, subtitle, color = C.gold, align = "center" }) {
  return (
    <div style={{ textAlign: align, marginBottom: "3rem", position: "relative", zIndex: 10 }}>
      {eyebrow && (
        <div style={{
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          color,
          fontFamily: "monospace",
          textTransform: "uppercase",
          marginBottom: "0.75rem",
          opacity: 0.8,
        }}>
          {eyebrow}
        </div>
      )}
      <h2 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(2rem, 5vw, 3.5rem)",
        color: "#fff",
        fontWeight: 700,
        margin: "0 0 1rem",
        textShadow: `0 0 40px ${color}44`,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: "#999", fontSize: "1rem", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
          {subtitle}
        </p>
      )}
      <div style={{
        width: 60,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        margin: align === "center" ? "1.5rem auto 0" : "1.5rem 0 0",
      }} />
    </div>
  );
}

// ── Floating 3D Object ────────────────────────────────────────
function Float3DObj({ children, floatAmt = 15, speed = 3, style = {}, onClick, label, glowColor = C.gold }) {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);
  const t = useRef(Math.random() * Math.PI * 2);
  useEffect(() => {
    let raf;
    const animate = () => {
      if (ref.current) {
        t.current += 0.01 * speed * 0.2;
        const y = Math.sin(t.current) * floatAmt;
        ref.current.style.transform = `translateY(${y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [floatAmt, speed]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: onClick ? "pointer" : "default", ...style }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        ref={ref}
        style={{
          filter: hov ? `drop-shadow(0 0 30px ${glowColor})` : `drop-shadow(0 0 10px ${glowColor}66)`,
          transition: "filter 0.3s ease",
          transform: "translateY(0)",
        }}
      >
        {children}
      </div>
      {label && (
        <div style={{
          fontSize: "0.8rem",
          letterSpacing: "0.2em",
          color: hov ? glowColor : "#888",
          transition: "color 0.3s",
          fontFamily: "monospace",
          textTransform: "uppercase",
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

// ── Neon Sign ─────────────────────────────────────────────────
function NeonSign({ text, color = C.neonPurple, style = {} }) {
  return (
    <div style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
      color,
      textShadow: `0 0 10px ${color}, 0 0 30px ${color}, 0 0 60px ${color}88, 0 0 100px ${color}44`,
      letterSpacing: "0.08em",
      ...style,
    }}>
      {text}
    </div>
  );
}

// ── Star Rating ───────────────────────────────────────────────
function Stars({ rating = 4.7 }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{
          fontSize: "1.4rem",
          color: i <= Math.floor(rating) ? C.gold : i - 0.5 <= rating ? C.gold : "#333",
          textShadow: `0 0 10px ${C.gold}88`,
        }}>★</span>
      ))}
      <span style={{ color: C.gold, fontSize: "1.1rem", marginLeft: 8, fontFamily: "monospace" }}>{rating}</span>
    </div>
  );
}

// ── Review Card ───────────────────────────────────────────────
function ReviewCard({ name, text, rating = 5, date }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? "linear-gradient(135deg, #141420 0%, #1A1A30 100%)"
          : "linear-gradient(135deg, #0D0D1A 0%, #111122 100%)",
        border: `1px solid ${hov ? C.gold + "66" : "#ffffff11"}`,
        borderRadius: 16,
        padding: "24px",
        transition: "all 0.4s ease",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? `0 20px 50px ${C.gold}22` : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}>{name}</div>
          <div style={{ color: "#666", fontSize: "0.75rem", marginTop: 2 }}>{date}</div>
        </div>
        <Stars rating={rating} />
      </div>
      <p style={{ color: "#aaa", lineHeight: 1.7, fontSize: "0.9rem", margin: 0 }}>{text}</p>
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────
function GoldDivider({ color = C.gold }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "3rem 0" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${color}44)` }} />
      <div style={{ color, fontSize: "1.2rem", textShadow: `0 0 10px ${color}` }}>✦</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}44, transparent)` }} />
    </div>
  );
}

// ── Nav Bar ───────────────────────────────────────────────────
function Navbar({ visible }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: "16px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: scrolled ? "rgba(8,8,16,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.gold}22` : "none",
      transition: "all 0.6s ease",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(-20px)",
    }}>
      <div
        onClick={() => scrollTo("hero")}
        style={{ cursor: "pointer", display: "flex", flexDirection: "column", lineHeight: 1 }}
      >
        <GlowText size="1.1rem" color={C.gold}>MOLECULE</GlowText>
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.4em", color: C.gold + "99", fontFamily: "monospace" }}>
          MATHURA · AIR BAR · KITCHEN
        </span>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {[["CAFÉ", "cafe"], ["RESTAURANT", "restaurant"], ["BAR", "bar"], ["EVENTS", "events"], ["CONTACT", "contact"]].map(([label, id]) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              background: "none",
              border: "none",
              color: "#aaa",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              cursor: "pointer",
              fontFamily: "monospace",
              padding: "4px 0",
              transition: "color 0.3s",
              display: window.innerWidth < 768 ? "none" : "block",
            }}
            onMouseEnter={e => e.target.style.color = C.gold}
            onMouseLeave={e => e.target.style.color = "#aaa"}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => scrollTo("contact")}
          style={{
            background: "transparent",
            border: `1px solid ${C.gold}`,
            color: C.gold,
            padding: "8px 20px",
            borderRadius: 4,
            fontSize: "0.72rem",
            letterSpacing: "0.15em",
            cursor: "pointer",
            fontFamily: "monospace",
            transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.target.style.background = C.gold; e.target.style.color = "#000"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = C.gold; }}
        >
          RESERVE
        </button>
      </div>
    </nav>
  );
}

// ── Logo Intro ────────────────────────────────────────────────
function LogoIntro({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0=show, 1=fade, 2=done
  const [orbAngle, setOrbAngle] = useState(0);

  useEffect(() => {
    let raf;
    const animate = () => {
      setOrbAngle(a => a + 0.5);
      raf = requestAnimationFrame(animate);
    };
    animate();
    const t1 = setTimeout(() => setPhase(1), 5500);
    const t2 = setTimeout(() => { setPhase(2); onComplete(); }, 7000);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 2) return null;

  const orbCount = 12;
  const orbs = Array.from({ length: orbCount }, (_, i) => {
    const angle = (i / orbCount) * Math.PI * 2 + (orbAngle * Math.PI / 180);
    const r = 160 + Math.sin(i * 0.8) * 30;
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r * 0.4,
      size: 4 + Math.sin(i * 1.3) * 3,
      color: [C.gold, C.goldLight, "#ffffff"][i % 3],
    };
  });

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "radial-gradient(ellipse at center, #0D0820 0%, #050508 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: phase === 1 ? 0 : 1,
      transition: "opacity 1.5s ease",
    }}>
      <ParticleCanvas colors={[C.gold, C.goldLight, "#ffffff55"]} count={60} />

      {/* Orbit rings */}
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", border: `1px solid ${C.gold}22`, animation: "spinRing 8s linear infinite" }} />
      <div style={{ position: "absolute", width: 320, height: 160, borderRadius: "50%", border: `1px solid ${C.gold}33`, animation: "spinRing 6s linear infinite reverse" }} />

      {/* Orbiting particles */}
      {orbs.map((orb, i) => (
        <div key={i} style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: orb.size,
          height: orb.size,
          borderRadius: "50%",
          background: orb.color,
          boxShadow: `0 0 ${orb.size * 4}px ${orb.color}`,
          transform: `translate(calc(-50% + ${orb.x}px), calc(-50% + ${orb.y}px))`,
          transition: "transform 0.016s linear",
        }} />
      ))}

      {/* Center Logo */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(3rem, 10vw, 6rem)",
            fontWeight: 700,
            color: "#fff",
            textShadow: `0 0 30px ${C.gold}88, 0 0 80px ${C.gold}44, 0 0 150px ${C.gold}22`,
            letterSpacing: "0.1em",
            animation: "logoGlow 2s ease-in-out infinite alternate",
          }}>
            MOLECULE
          </div>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.5rem, 5vw, 3rem)",
            color: C.gold,
            textShadow: `0 0 20px ${C.gold}`,
            letterSpacing: "0.3em",
          }}>
            MATHURA
          </div>
        </div>
        <div style={{
          fontSize: "0.8rem",
          letterSpacing: "0.5em",
          color: C.gold + "88",
          fontFamily: "monospace",
          textTransform: "uppercase",
          marginTop: 16,
        }}>
          ✦ AIR BAR · KITCHEN ✦
        </div>

        {/* Glow ring under logo */}
        <div style={{
          position: "absolute",
          bottom: -30,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 2,
          background: `radial-gradient(ellipse at center, ${C.gold}, transparent)`,
          filter: "blur(4px)",
        }} />
      </div>

      <style>{`
        @keyframes spinRing { from { transform: rotateX(70deg) rotate(0deg); } to { transform: rotateX(70deg) rotate(360deg); } }
        @keyframes logoGlow { from { text-shadow: 0 0 30px ${C.gold}88, 0 0 80px ${C.gold}44; } to { text-shadow: 0 0 60px ${C.gold}cc, 0 0 120px ${C.gold}88; } }
      `}</style>
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────
function HeroSection() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <Scene3D
      id="hero"
      bg="radial-gradient(ellipse at 40% 30%, #0D0820 0%, #080810 60%, #050508 100%)"
      style={{ minHeight: "100vh" }}
    >
      <ParticleCanvas colors={[C.gold + "66", "#ffffff33", C.neonPurple + "44"]} count={100} />

      {/* City skyline silhouette */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", overflow: "hidden" }}>
        <svg viewBox="0 0 1400 300" preserveAspectRatio="xMidYMax slice" style={{ width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="skylineG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.neonPurple} stopOpacity="0.15" />
              <stop offset="100%" stopColor="#080810" stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Buildings */}
          {[
            [0, 180, 80, 120], [90, 150, 60, 150], [160, 200, 100, 100],
            [270, 160, 70, 140], [350, 220, 120, 80], [480, 140, 60, 160],
            [550, 190, 90, 110], [650, 100, 50, 200], [710, 170, 80, 130],
            [800, 210, 110, 90], [920, 150, 65, 150], [995, 180, 85, 120],
            [1090, 120, 55, 180], [1155, 200, 100, 100], [1265, 160, 75, 140],
            [1350, 190, 90, 110],
          ].map(([x, h, w, y], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill="url(#skylineG)" />
          ))}
          {/* Neon windows */}
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={`w${i}`}
              x={Math.random() * 1400}
              y={100 + Math.random() * 150}
              width={4} height={6}
              fill={[C.gold, C.neonBlue, C.neonPurple][i % 3]}
              opacity={Math.random() * 0.6 + 0.2}
            />
          ))}
        </svg>
      </div>

      {/* Main hero content */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 10, padding: "0 24px" }}>
        <div style={{
          fontSize: "0.75rem",
          letterSpacing: "0.4em",
          color: C.gold,
          fontFamily: "monospace",
          marginBottom: "1.5rem",
          opacity: 0.8,
        }}>
          ✦ MATHURA'S FINEST ROOFTOP EXPERIENCE ✦
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(3rem, 10vw, 7rem)",
          color: "#fff",
          fontWeight: 700,
          lineHeight: 1.1,
          textShadow: `0 0 60px ${C.gold}33`,
          margin: "0 0 1rem",
        }}>
          Where Every <br />
          <span style={{ color: C.gold, textShadow: `0 0 40px ${C.gold}` }}>Meal</span> Becomes<br />
          a Memory
        </h1>
        <p style={{ color: "#999", maxWidth: 480, margin: "0 auto 3rem", lineHeight: 1.8, fontSize: "1.05rem" }}>
          Café · Fine Dining · Rooftop Bar — A cinematic experience above the city of Mathura
        </p>

        {/* 3D Interactive Nav Objects */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(30px, 6vw, 80px)",
          flexWrap: "wrap",
          margin: "0 auto",
          maxWidth: 700,
        }}>
          <Float3DObj label="Café" onClick={() => scrollTo("cafe")} glowColor={C.gold}
            style={{ width: 110 }}>
            <Rotate3D style={{ width: 90, height: 110 }}>
              <CoffeeCupSVG />
            </Rotate3D>
          </Float3DObj>

          <Float3DObj label="Restaurant" onClick={() => scrollTo("restaurant")} glowColor={C.gold}
            style={{ width: 130 }}>
            <Rotate3D style={{ width: 120, height: 110 }} speed={0.7}>
              <PlateSVG />
            </Rotate3D>
          </Float3DObj>

          <Float3DObj label="Bar" onClick={() => scrollTo("bar")} glowColor={C.neonPurple}
            style={{ width: 100 }}>
            <Rotate3D style={{ width: 85, height: 120 }} speed={1.2}>
              <CocktailSVG />
            </Rotate3D>
          </Float3DObj>
        </div>

        <div style={{ marginTop: "3rem", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => scrollTo("restaurant")}
            style={{
              background: C.gold,
              border: "none",
              color: "#000",
              padding: "14px 36px",
              borderRadius: 4,
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              cursor: "pointer",
              fontFamily: "monospace",
              fontWeight: 700,
              boxShadow: `0 0 30px ${C.gold}66`,
              transition: "all 0.3s",
            }}
            onMouseEnter={e => e.target.style.boxShadow = `0 0 50px ${C.gold}99`}
            onMouseLeave={e => e.target.style.boxShadow = `0 0 30px ${C.gold}66`}
          >
            EXPLORE MENU
          </button>
          <button
            onClick={() => scrollTo("contact")}
            style={{
              background: "transparent",
              border: `1px solid ${C.gold}`,
              color: C.gold,
              padding: "14px 36px",
              borderRadius: 4,
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              cursor: "pointer",
              fontFamily: "monospace",
              transition: "all 0.3s",
            }}
          >
            RESERVE A TABLE
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        animation: "bounceDown 2s ease-in-out infinite",
      }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "#666", fontFamily: "monospace" }}>SCROLL</div>
        <div style={{ width: 1, height: 40, background: `linear-gradient(180deg, ${C.gold}88, transparent)` }} />
      </div>

      <style>{`@keyframes bounceDown { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }`}</style>
    </Scene3D>
  );
}

// ── Café Section ──────────────────────────────────────────────
const CAFE_MENU = [
  { name: "Classic Margherita Pizza", kcal: "642 kcal", desc: "Traditional pizza with mozzarella, tomato sauce and fresh basil.", veg: true, price: "₹349" },
  { name: "Mediterranean Garden Pizza", kcal: "729 kcal", desc: "Pizza loaded with feta cheese and Mediterranean vegetables.", veg: true, price: "₹389" },
  { name: "Green House Pizza", kcal: "761 kcal", desc: "Veggie pizza with mushrooms, corn, cottage cheese and jalapenos.", veg: true, price: "₹379" },
  { name: "Burrata Farrel Pizza", kcal: "765 kcal", desc: "Pizza topped with creamy burrata cheese and basil pesto.", veg: true, price: "₹449" },
  { name: "Californian Chicken Tikka Pizza", kcal: "853 kcal", desc: "Fusion pizza topped with chicken tikka and vegetables.", veg: false, price: "₹469" },
  { name: "Whole Wheat Spaghetti Aglio E Olio", kcal: "566 kcal", desc: "Whole wheat spaghetti tossed in olive oil, garlic, parsley and parmesan.", veg: true, price: "₹329" },
  { name: "Fettuccine Alfredo", kcal: "634 kcal", desc: "Creamy fettuccine pasta in butter, cream and parmesan.", veg: true, price: "₹359" },
  { name: "Pasta Arrabiata", kcal: "594 kcal", desc: "Classic spicy tomato pasta flavored with garlic and chilli flakes.", veg: true, price: "₹299" },
  { name: "Sweet Potato Brûlée", kcal: "587 kcal", desc: "Sweet potato pudding with caramelized sugar crust, berry compote and vanilla ice cream.", veg: true, price: "₹289" },
  { name: "Warm Chocolate Cake", kcal: "663 kcal", desc: "Rich molten chocolate cake with matcha vanilla sauce and ice-cream.", veg: true, price: "₹319" },
  { name: "Expression Of Molecule", kcal: "740 kcal", desc: "Signature chocolate dessert featuring multiple textures and flavors.", veg: true, price: "₹349" },
  { name: "French Fries", kcal: "310 kcal", desc: "Crispy golden fried potato sticks served hot and lightly salted.", veg: true, price: "₹149" },
];

function CafeSection() {
  return (
    <Scene3D
      id="cafe"
      bg="radial-gradient(ellipse at 30% 40%, #2A1505 0%, #1A0D00 40%, #0A0500 100%)"
      style={{ padding: "80px 0" }}
    >
      <ParticleCanvas colors={[C.gold + "88", C.cream + "33", "#FF9F6044"]} count={60} />

      {/* Warm light blobs */}
      <div style={{ position: "absolute", top: "20%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.gold}11 0%, transparent 70%)`, filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 250, height: 250, borderRadius: "50%", background: `radial-gradient(ellipse, #FF9F6022 0%, transparent 70%)`, filter: "blur(40px)" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 10 }}>
        <SectionTitle
          eyebrow="✦ The Molecule Café"
          title="Café Experience"
          subtitle="Warm aromas, artisan flavors, and a cozy rooftop ambience. A corner of comfort above the city."
          color={C.gold}
        />

        {/* 3D Floating Cafe Objects */}
        <div style={{ display: "flex", justifyContent: "center", gap: 60, marginBottom: 60, flexWrap: "wrap" }}>
          <Float3DObj glowColor={C.gold} floatAmt={12}>
            <Rotate3D style={{ width: 100, height: 120 }} speed={0.6}>
              <CoffeeCupSVG />
            </Rotate3D>
          </Float3DObj>
          <Float3DObj glowColor="#FF9F60" floatAmt={18} speed={2.5}>
            <div style={{ width: 100, height: 100, filter: `drop-shadow(0 0 20px #FF9F60)` }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                <defs><radialGradient id="pizzaG" cx="40%" cy="35%"><stop offset="0%" stopColor="#F4A535"/><stop offset="100%" stopColor="#C97B2B"/></radialGradient></defs>
                <polygon points="50,5 95,85 5,85" fill="url(#pizzaG)" />
                <polygon points="50,15 85,80 15,80" fill="#D4682A" />
                <circle cx="40" cy="55" r="7" fill="#C0392B" />
                <circle cx="62" cy="60" r="5" fill="#27AE60" />
                <circle cx="50" cy="45" r="4" fill="#E8E0D0" />
                <circle cx="35" cy="68" r="3" fill="#C0392B" />
              </svg>
            </div>
          </Float3DObj>
          <Float3DObj glowColor="#DEB887" floatAmt={10} speed={3.5}>
            <div style={{ width: 90, height: 90, filter: `drop-shadow(0 0 15px #DEB88799)` }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                <defs><radialGradient id="cakeG" cx="35%" cy="30%"><stop offset="0%" stopColor="#F5DEB3"/><stop offset="100%" stopColor="#D2691E"/></radialGradient></defs>
                <rect x="10" y="50" width="80" height="40" rx="5" fill="url(#cakeG)" />
                <ellipse cx="50" cy="50" rx="40" ry="8" fill="#DEB887" />
                <rect x="10" y="35" width="80" height="20" rx="3" fill="#F5DEB3" />
                <ellipse cx="50" cy="35" rx="40" ry="6" fill="#FAF0E6" />
                {[20,40,60,80].map(x=><line key={x} x1={x} y1="35" x2={x} y2="20" stroke="#FF69B4" strokeWidth="2"/>)}
                <ellipse cx="50" cy="20" rx="35" ry="5" fill="#FFB6C1" opacity="0.6" />
              </svg>
            </div>
          </Float3DObj>
        </div>

        {/* Cafe Menu */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <NeonSign text="☕ Café Menu" color={C.gold} style={{ fontSize: "1.8rem", textShadow: `0 0 20px ${C.gold}88` }} />
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}>
            {CAFE_MENU.map((item, i) => (
              <MenuCard key={i} item={item} theme="cafe" index={i} />
            ))}
          </div>
        </div>

        <GoldDivider color={C.gold} />

        <div style={{
          textAlign: "center",
          padding: "40px 20px",
          background: `linear-gradient(135deg, ${C.gold}11, transparent)`,
          borderRadius: 16,
          border: `1px solid ${C.gold}22`,
        }}>
          <div style={{ color: C.gold, fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", marginBottom: 12 }}>
            "Start your day above the clouds"
          </div>
          <div style={{ color: "#888", fontSize: "0.85rem" }}>Open: 11:00 AM – 11:00 PM · Café Menu Available All Day</div>
        </div>
      </div>
    </Scene3D>
  );
}

// ── Restaurant Section ────────────────────────────────────────
const REST_MENU_VEG = [
  { name: "Bagh-E-Bahar Biryani", kcal: "641 kcal", desc: "Fragrant basmati layered with vegetables, rose petals, saffron milk and golden fried nuts.", veg: true, price: "₹389" },
  { name: "Dal-E-Khaas Dum Pukht", kcal: "770 kcal", desc: "Slow cooked black lentils enriched with butter and cream.", veg: true, price: "₹349" },
  { name: "Nawabi Malai Kofta", kcal: "810 kcal", desc: "Paneer and khoya dumplings in creamy cashew gravy.", veg: true, price: "₹389" },
  { name: "Malai Paneer Shikanji Roll", kcal: "689 kcal", desc: "Paneer rolls stuffed with saffron khoya in almond coconut korma.", veg: true, price: "₹369" },
  { name: "Subz Noorani Korma", kcal: "736 kcal", desc: "Seasonal vegetables in aromatic almond yogurt korma.", veg: true, price: "₹359" },
  { name: "Badami Khumb Masala", kcal: "688 kcal", desc: "Mushrooms cooked in rich almond gravy with mild spices.", veg: true, price: "₹349" },
];
const REST_MENU_NONVEG = [
  { name: "Murgh Nawabi Awadh Biryani", kcal: "712 kcal", desc: "Charcoal grilled chicken dum-cooked with aromatic Awadhi spices and saffron basmati.", veg: false, price: "₹449" },
  { name: "Gosht-E-Awadh Dum Biryani", kcal: "786 kcal", desc: "Slow braised mutton sealed in handi with yakhni stock and aromatic basmati.", veg: false, price: "₹549" },
  { name: "Murgh Makhani Maharaja", kcal: "712 kcal", desc: "Classic butter chicken in creamy tomato butter gravy.", veg: false, price: "₹429" },
  { name: "Nizami Murgh Korma", kcal: "767 kcal", desc: "Chicken in rich almond yogurt curry scented with saffron.", veg: false, price: "₹449" },
  { name: "Laal Maas-E-Rajasthan", kcal: "843 kcal", desc: "Traditional Rajasthani mutton with fiery red chillies.", veg: false, price: "₹589" },
  { name: "Chettinad Murgh Curry", kcal: "761 kcal", desc: "Bold South Indian chicken curry with roasted spices and coconut.", veg: false, price: "₹449" },
];
const REST_BREADS = [
  { name: "Butter Roti", kcal: "120 kcal", desc: "Soft whole wheat roti finished with melted butter.", veg: true, price: "₹59" },
  { name: "Garlic / Butter Naan", kcal: "150 kcal", desc: "Tandoor baked naan brushed with garlic butter.", veg: true, price: "₹79" },
  { name: "Chilli Basil Cheese Naan", kcal: "180 kcal", desc: "Soft naan stuffed with cheese, chilli and basil.", veg: true, price: "₹99" },
  { name: "Laccha Paratha", kcal: "160 kcal", desc: "Multi-layered flaky paratha cooked with ghee.", veg: true, price: "₹89" },
  { name: "Chur Chur Naan", kcal: "185 kcal", desc: "Crushed naan tossed with butter and spices.", veg: true, price: "₹109" },
  { name: "Malabar Paratha", kcal: "190 kcal", desc: "South Indian layered paratha, soft and flaky.", veg: true, price: "₹99" },
];
const REST_DESSERTS = [
  { name: "Cheeni Malai Toast", kcal: "618 kcal", desc: "Milk bread glazed with saffron rabri and almond crunch.", veg: true, price: "₹289" },
  { name: "Tira Miso", kcal: "671 kcal", desc: "Creative dessert with miso caramel ice-cream layered with sponge.", veg: true, price: "₹319" },
  { name: "Matcha Cheesecake Bingsu", kcal: "638 kcal", desc: "Shaved ice with cheesecake crumbles, fruits and condensed milk.", veg: true, price: "₹329" },
];

function RestaurantSection() {
  const [activeTab, setActiveTab] = useState("nonveg");
  const tabs = [
    { key: "nonveg", label: "NON-VEG MAINS" },
    { key: "veg", label: "VEG MAINS" },
    { key: "breads", label: "THE ROTI MAHAL" },
    { key: "desserts", label: "SWEET ALCHEMY" },
  ];
  const data = { nonveg: REST_MENU_NONVEG, veg: REST_MENU_VEG, breads: REST_BREADS, desserts: REST_DESSERTS };

  return (
    <Scene3D
      id="restaurant"
      bg="radial-gradient(ellipse at 60% 30%, #100810 0%, #080808 50%, #050508 100%)"
      style={{ padding: "80px 0" }}
    >
      <ParticleCanvas colors={[C.gold + "44", C.goldLight + "22", "#ffffff11"]} count={50} />

      {/* Cinematic light beams */}
      <div style={{ position: "absolute", top: 0, left: "30%", width: 1, height: "40%", background: `linear-gradient(180deg, ${C.gold}44, transparent)`, filter: "blur(20px)", opacity: 0.6 }} />
      <div style={{ position: "absolute", top: 0, right: "25%", width: 1, height: "35%", background: `linear-gradient(180deg, ${C.goldLight}33, transparent)`, filter: "blur(20px)", opacity: 0.5 }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 10 }}>
        <SectionTitle
          eyebrow="✦ Fine Dining"
          title="Restaurant Experience"
          subtitle="Royal Awadhi flavors, gourmet continental, and Asian alchemy — served under the stars."
          color={C.gold}
        />

        {/* 3D Biryani Objects */}
        <div style={{ display: "flex", justifyContent: "center", gap: 50, marginBottom: 60, flexWrap: "wrap" }}>
          <Float3DObj glowColor={C.gold} floatAmt={14}>
            <Rotate3D style={{ width: 140, height: 100 }} speed={0.5}>
              <BiriyaniSVG />
            </Rotate3D>
          </Float3DObj>
          <Float3DObj glowColor={C.goldLight} floatAmt={10} speed={4}>
            <Rotate3D style={{ width: 120, height: 110 }} speed={0.8} axis="XY">
              <PlateSVG />
            </Rotate3D>
          </Float3DObj>
          <Float3DObj glowColor={C.gold} floatAmt={16} speed={2.5}>
            <div style={{ width: 80, height: 90, filter: `drop-shadow(0 0 20px ${C.gold}88)` }}>
              <svg viewBox="0 0 80 90" style={{ width: "100%", height: "100%" }}>
                <defs><radialGradient id="sushiG" cx="40%" cy="35%"><stop offset="0%" stopColor="#F5DEB3"/><stop offset="100%" stopColor="#DEB887"/></radialGradient></defs>
                <ellipse cx="40" cy="60" rx="35" ry="8" fill="#000" opacity="0.3"/>
                <ellipse cx="40" cy="55" rx="35" ry="9" fill="url(#sushiG)"/>
                <ellipse cx="40" cy="53" rx="28" ry="7" fill="#333"/>
                <ellipse cx="40" cy="51" rx="20" ry="5" fill="#F5DEB3"/>
                <ellipse cx="40" cy="49" rx="12" ry="3" fill="#C0392B" opacity="0.8"/>
                <rect x="36" y="15" width="8" height="38" fill="#C0C0C0" rx="3"/>
                <ellipse cx="40" cy="14" rx="12" ry="4" fill="#C0C0C0"/>
                <ellipse cx="40" cy="12" rx="9" ry="3" fill="#E8E8E8"/>
              </svg>
            </div>
          </Float3DObj>
        </div>

        {/* Menu Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap", justifyContent: "center" }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? C.gold : "transparent",
                border: `1px solid ${activeTab === tab.key ? C.gold : C.gold + "44"}`,
                color: activeTab === tab.key ? "#000" : C.gold,
                padding: "8px 20px",
                borderRadius: 4,
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                cursor: "pointer",
                fontFamily: "monospace",
                transition: "all 0.3s",
                boxShadow: activeTab === tab.key ? `0 0 20px ${C.gold}44` : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {data[activeTab].map((item, i) => (
            <MenuCard key={i} item={item} theme="restaurant" index={i} />
          ))}
        </div>

        <GoldDivider />

        {/* Asian & Continental menus */}
        <div style={{ marginTop: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", color: C.gold }}>
              Asian Alchemy & Continental Canvas
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[
              { name: "Fried Rice (Veg/Egg/Chicken)", kcal: "446–514 kcal", desc: "Wok tossed rice with vegetables, soy sauce and Asian seasoning.", veg: false, price: "₹229–₹279" },
              { name: "Kimchi Udon (Veg/Chicken/Prawn)", kcal: "498–533 kcal", desc: "Thick udon in Korean kimchi broth with vegetables.", veg: false, price: "₹299–₹359" },
              { name: "Forest Floor Risotto", kcal: "692 kcal", desc: "Creamy risotto with porcini and shiitake mushrooms.", veg: true, price: "₹449" },
              { name: "Stuffed Grilled Chicken Roulade", kcal: "644 kcal", desc: "Spinach and ricotta stuffed chicken with vegetable mash.", veg: false, price: "₹529" },
              { name: "Tokyo Asparagus Avocado Roll", kcal: "434 kcal", desc: "Sushi roll with asparagus and avocado in blue pea rice.", veg: true, price: "₹349" },
              { name: "Katsu Chicken Roll", kcal: "596 kcal", desc: "Japanese fried chicken sushi roll with spicy mayo.", veg: false, price: "₹399" },
            ].map((item, i) => <MenuCard key={i} item={item} theme="restaurant" index={i} />)}
          </div>
        </div>
      </div>
    </Scene3D>
  );
}

// ── Bar Section ───────────────────────────────────────────────
const BAR_MENU = [
  { name: "Veg Jhol Mandu", kcal: "375 kcal", desc: "Korean dumplings in spicy gochujang broth.", veg: true, price: "₹259" },
  { name: "Chicken Jhol Mandu", kcal: "494 kcal", desc: "Chicken dumplings served with spicy gochujang broth.", veg: false, price: "₹319" },
  { name: "Pan Fried Dumpling (Veg/Chicken/Shrimp)", kcal: "379–467 kcal", desc: "Crispy bottom dumplings with vegetables or meat.", veg: false, price: "₹279–₹349" },
  { name: "Truffle Mushroom Cream Cheese Dumpling", kcal: "455 kcal", desc: "Mushrooms and cream cheese with truffle aroma.", veg: true, price: "₹349" },
  { name: "Chilli Oil Coriander Dumpling", kcal: "411–498 kcal", desc: "Dumplings in chilli oil, black vinegar and coriander.", veg: false, price: "₹279–₹339" },
  { name: "Baozi Buns (Veg)", kcal: "498 kcal", desc: "Steamed bao with shiitake mushrooms and ponzu mayo.", veg: true, price: "₹279" },
  { name: "Konjee Crispy Chicken Bao", kcal: "530 kcal", desc: "Crispy chicken bao with spicy sauce and fresh lettuce.", veg: false, price: "₹329" },
  { name: "Amritsari Sole Fry", kcal: "410 kcal", desc: "Crispy coated fish fry with tartare sauce.", veg: false, price: "₹369" },
  { name: "Peri-Peri French Fries", kcal: "310 kcal", desc: "Classic fries tossed in spicy peri-peri seasoning.", veg: true, price: "₹179" },
  { name: "Cheesy Fries", kcal: "360 kcal", desc: "Crispy fries topped with rich melted cheese sauce.", veg: true, price: "₹199" },
  { name: "Peanut Masala", kcal: "260 kcal", desc: "Roasted peanuts tossed with onion, spices and herbs.", veg: true, price: "₹149" },
  { name: "Soup Dumpling (Veg/Chicken)", kcal: "336–433 kcal", desc: "Juicy dumplings filled with hot flavorful soup.", veg: false, price: "₹259–₹329" },
];

function BarSection() {
  return (
    <Scene3D
      id="bar"
      bg="radial-gradient(ellipse at 50% 20%, #1A0030 0%, #0A0018 50%, #050510 100%)"
      style={{ padding: "80px 0" }}
    >
      <ParticleCanvas colors={[C.neonPurple + "66", C.neonBlue + "44", C.neonPink + "55"]} count={80} />

      {/* Neon glow blobs */}
      <div style={{ position: "absolute", top: "15%", left: "10%", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.neonPurple}22, transparent)`, filter: "blur(50px)" }} />
      <div style={{ position: "absolute", top: "10%", right: "15%", width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.neonPink}22, transparent)`, filter: "blur(50px)" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "50%", width: 250, height: 150, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.neonBlue}22, transparent)`, filter: "blur(60px)" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 10 }}>
        <SectionTitle
          eyebrow="✦ Rooftop Bar"
          title="Bar Experience"
          subtitle="Neon nights, craft bites, and cocktails under Mathura's sky."
          color={C.neonPurple}
        />

        {/* Neon Signs */}
        <div style={{ textAlign: "center", marginBottom: 48, display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          <NeonSign text="Craft Bites" color={C.neonPink} style={{ fontSize: "1.8rem" }} />
          <NeonSign text="&" color="#ffffff44" style={{ fontSize: "1.8rem", textShadow: "none" }} />
          <NeonSign text="Good Vibes" color={C.neonBlue} style={{ fontSize: "1.8rem" }} />
        </div>

        {/* 3D Cocktail Objects */}
        <div style={{ display: "flex", justifyContent: "center", gap: 50, marginBottom: 60, flexWrap: "wrap" }}>
          <Float3DObj glowColor={C.neonPurple} floatAmt={18}>
            <Rotate3D style={{ width: 80, height: 110 }} speed={1.2}>
              <CocktailSVG />
            </Rotate3D>
          </Float3DObj>
          <Float3DObj glowColor={C.neonPink} floatAmt={12} speed={4.5}>
            <div style={{ width: 90, height: 90, filter: `drop-shadow(0 0 20px ${C.neonPink})` }}>
              <svg viewBox="0 0 90 90" style={{ width: "100%", height: "100%" }}>
                <defs><linearGradient id="dumpG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F5DEB3"/><stop offset="100%" stopColor="#DEB887"/></linearGradient></defs>
                {[0,1,2,3].map(i=>(
                  <ellipse key={i} cx={20+i*17} cy={50} rx={12} ry={14}
                    fill="url(#dumpG)"
                    stroke="#C8A878" strokeWidth="1"
                    transform={`rotate(${-15+i*10} ${20+i*17} 50)`}/>
                ))}
                <path d="M10 38 Q45 28 80 38" stroke="#DEB887" strokeWidth="3" fill="none"/>
                {[0,1,2,3].map(i=>(
                  <line key={i} x1={20+i*17} y1={38} x2={20+i*17} y2={33}
                    stroke="#C8A878" strokeWidth="2"/>
                ))}
              </svg>
            </div>
          </Float3DObj>
          <Float3DObj glowColor={C.neonBlue} floatAmt={15} speed={3}>
            <Rotate3D style={{ width: 85, height: 110 }} speed={0.9}>
              <CocktailSVG />
            </Rotate3D>
          </Float3DObj>
        </div>

        {/* Bar Menu */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <NeonSign text="🍸 Bar Bites Menu" color={C.neonPurple} style={{ fontSize: "1.8rem" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {BAR_MENU.map((item, i) => (
              <MenuCard key={i} item={item} theme="bar" index={i} />
            ))}
          </div>
        </div>

        <div style={{
          textAlign: "center",
          padding: "40px",
          background: `linear-gradient(135deg, ${C.neonPurple}11, ${C.neonPink}11)`,
          borderRadius: 16,
          border: `1px solid ${C.neonPurple}33`,
          marginTop: 40,
        }}>
          <NeonSign text="★ Molecule Air Bar ★" color={C.neonPurple} />
          <p style={{ color: "#888", marginTop: 16, fontSize: "0.9rem" }}>
            Bar Hours: 5:00 PM – 12:00 AM · Rooftop Open Daily · DJ Nights on Weekends
          </p>
        </div>
      </div>
    </Scene3D>
  );
}

// ── Events Gallery ────────────────────────────────────────────
const EVENTS = [
  { title: "DJ Nights", desc: "Rooftop beats under Mathura's glittering sky", emoji: "🎧", color: C.neonPurple },
  { title: "Live Music", desc: "Acoustic evenings with curated performances", emoji: "🎸", color: C.gold },
  { title: "Rooftop Parties", desc: "Exclusive events with panoramic city views", emoji: "🎉", color: C.neonPink },
  { title: "Bollywood Nights", desc: "Dance the night away to classic Bollywood hits", emoji: "🎬", color: C.neonBlue },
  { title: "Sufi Evenings", desc: "Soulful Sufi music for a transcendent experience", emoji: "🎵", color: C.gold },
  { title: "Corporate Events", desc: "Premium private dining and event spaces available", emoji: "🥂", color: C.goldLight },
];

function EventsSection() {
  return (
    <Scene3D id="events" bg="linear-gradient(180deg, #050508 0%, #0A0818 50%, #080810 100%)" style={{ padding: "80px 0" }}>
      <ParticleCanvas colors={[C.neonPink + "55", C.gold + "44", C.neonBlue + "33"]} count={60} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 10 }}>
        <SectionTitle
          eyebrow="✦ Events & Evenings"
          title="Gallery of Nights"
          subtitle="Every evening at Molecule Mathura is a story worth remembering."
          color={C.neonPurple}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {EVENTS.map((event, i) => {
            const [hov, setHov] = useState(false);
            return (
              <div
                key={i}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  aspectRatio: "16/9",
                  background: `linear-gradient(135deg, #0D0D1A 0%, #141428 100%)`,
                  border: `1px solid ${hov ? event.color + "88" : event.color + "22"}`,
                  transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)",
                  transform: hov ? "translateY(-8px) scale(1.02)" : "none",
                  boxShadow: hov ? `0 30px 60px ${event.color}33` : "0 4px 20px #00000066",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${event.color}11 0%, transparent 70%)`, opacity: hov ? 1 : 0, transition: "opacity 0.4s" }} />
                <div style={{ fontSize: "3.5rem", filter: `drop-shadow(0 0 20px ${event.color})`, position: "relative", zIndex: 2 }}>{event.emoji}</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", color: "#fff", textAlign: "center", position: "relative", zIndex: 2, textShadow: `0 0 20px ${event.color}88` }}>{event.title}</div>
                <div style={{ color: "#888", fontSize: "0.8rem", textAlign: "center", maxWidth: 200, position: "relative", zIndex: 2 }}>{event.desc}</div>
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${event.color}, transparent)`,
                  opacity: hov ? 1 : 0,
                  transition: "opacity 0.4s",
                }} />
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <div style={{ color: "#666", fontSize: "0.8rem", marginBottom: 16, letterSpacing: "0.2em", fontFamily: "monospace" }}>
            FOR PRIVATE EVENTS & BOOKINGS
          </div>
          <a
            href="tel:+919876543210"
            style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${C.neonPurple}, ${C.neonPink})`,
              color: "#fff",
              padding: "12px 32px",
              borderRadius: 4,
              textDecoration: "none",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              fontFamily: "monospace",
              boxShadow: `0 0 30px ${C.neonPurple}44`,
            }}
          >
            ENQUIRE NOW
          </a>
        </div>
      </div>
    </Scene3D>
  );
}

// ── Reviews Section ───────────────────────────────────────────
const REVIEWS = [
  { name: "Priya Sharma", rating: 5, date: "March 2025", text: "Absolutely breathtaking experience. The rooftop view of Mathura combined with the Royal Awadhi biryani was otherworldly. The ambiance feels like fine dining meets sky lounge." },
  { name: "Arjun Mehta", rating: 5, date: "February 2025", text: "The cocktails are out of this world and the dumpling menu at the bar is innovative. DJ nights here have the best energy in Mathura. Will definitely be back!" },
  { name: "Meera Gupta", rating: 4.5, date: "January 2025", text: "The café section is my favorite — artisan coffee, great pizzas, and a warm vibe even on a rooftop. The desserts, especially the Sweet Potato Brûlée, are divine." },
  { name: "Rohit Verma", rating: 5, date: "December 2024", text: "Best restaurant in Mathura, hands down. The fine dining setting, gold accents, and city lights below make every meal feel like a celebration." },
  { name: "Sneha Agarwal", rating: 4.5, date: "November 2024", text: "Came for a birthday celebration and the staff made it so memorable. The sushi rolls and Katsu chicken are must-tries. Stunning space!" },
  { name: "Vikram Singh", rating: 5, date: "October 2024", text: "The neon bar section at night is absolutely magical. Tried the Laal Maas and it was perfectly spiced. This place is a gem for Mathura's dining scene." },
];

function ReviewsSection() {
  return (
    <Scene3D id="reviews" bg="linear-gradient(180deg, #080810 0%, #0A0A14 100%)" style={{ padding: "80px 0" }}>
      <ParticleCanvas colors={[C.gold + "33", "#ffffff22"]} count={40} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 10 }}>
        <SectionTitle
          eyebrow="✦ Customer Reviews"
          title="What People Say"
          color={C.gold}
        />

        {/* Rating Hero */}
        <div style={{
          textAlign: "center",
          padding: "40px",
          background: `linear-gradient(135deg, ${C.gold}11, transparent)`,
          borderRadius: 16,
          border: `1px solid ${C.gold}22`,
          marginBottom: 48,
        }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "5rem", color: C.gold, textShadow: `0 0 40px ${C.gold}66`, lineHeight: 1 }}>4.7</div>
          <Stars rating={4.7} />
          <div style={{ color: "#666", marginTop: 12, fontSize: "0.85rem" }}>Based on 226 Reviews · Google Maps</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {REVIEWS.map((r, i) => <ReviewCard key={i} {...r} />)}
        </div>
      </div>
    </Scene3D>
  );
}

// ── About Section ─────────────────────────────────────────────
function AboutSection() {
  const stats = [
    { num: "4th", label: "Floor Rooftop" },
    { num: "3", label: "Unique Experiences" },
    { num: "226+", label: "Reviews" },
    { num: "4.7★", label: "Rating" },
  ];
  return (
    <Scene3D id="about" bg="radial-gradient(ellipse at 30% 50%, #0A0810 0%, #050508 100%)" style={{ padding: "80px 0" }}>
      <ParticleCanvas colors={[C.gold + "44", "#ffffff22"]} count={40} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", color: C.gold, fontFamily: "monospace", marginBottom: 16 }}>✦ OUR STORY</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", marginBottom: 24, textShadow: `0 0 40px ${C.gold}22` }}>
              The Story of<br /><span style={{ color: C.gold }}>Molecule Mathura</span>
            </h2>
            <p style={{ color: "#999", lineHeight: 1.9, marginBottom: 20, fontSize: "0.95rem" }}>
              Perched on the 4th floor of the Sapphire Building, above the heartbeat of NH-19, Molecule Mathura was born from a single dream — to create a space where café culture, fine dining, and rooftop nightlife coexist in perfect harmony.
            </p>
            <p style={{ color: "#999", lineHeight: 1.9, marginBottom: 20, fontSize: "0.95rem" }}>
              We believe that every meal should be an experience — a story told through flavors, aromas, and the magic of an open sky. From the warm golden hues of our café corner to the neon-lit energy of our Air Bar, every corner of Molecule is crafted to transport you.
            </p>
            <p style={{ color: "#999", lineHeight: 1.9, fontSize: "0.95rem" }}>
              Royal Awadhi biryanis, molecular desserts, Asian dumplings, and handcrafted cocktails — all served under Mathura's infinite sky.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}44`, padding: "12px 24px", borderRadius: 8 }}>
                <div style={{ color: C.gold, fontSize: "0.75rem", letterSpacing: "0.2em", fontFamily: "monospace" }}>CAFÉ · RESTAURANT · BAR</div>
              </div>
            </div>
          </div>
          <div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}>
              {stats.map((s, i) => (
                <div key={i} style={{
                  background: `linear-gradient(135deg, ${C.gold}11, transparent)`,
                  border: `1px solid ${C.gold}22`,
                  borderRadius: 12,
                  padding: "24px",
                  textAlign: "center",
                }}>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2rem", color: C.gold, textShadow: `0 0 20px ${C.gold}88` }}>{s.num}</div>
                  <div style={{ color: "#777", fontSize: "0.8rem", marginTop: 4, fontFamily: "monospace", letterSpacing: "0.1em" }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Decorative 3D element */}
            <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
              <Float3DObj glowColor={C.gold} floatAmt={10}>
                <Rotate3D style={{ width: 140, height: 100 }} speed={0.4} axis="XY">
                  <BiriyaniSVG />
                </Rotate3D>
              </Float3DObj>
            </div>
          </div>
        </div>
      </div>
    </Scene3D>
  );
}

// ── Map Section ───────────────────────────────────────────────
function MapSection() {
  return (
    <Scene3D id="map" bg="linear-gradient(180deg, #050508 0%, #080810 100%)" style={{ padding: "80px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 10 }}>
        <SectionTitle eyebrow="✦ Find Us" title="Our Location" color={C.gold} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ background: `linear-gradient(135deg, #0D0D1A, #111120)`, border: `1px solid ${C.gold}22`, borderRadius: 16, padding: 32 }}>
              <div style={{ color: C.gold, fontSize: "1.1rem", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 20 }}>Molecule Mathura</div>
              {[
                ["📍", "4th Floor, Sapphire Building, NH-19\nAbove Uma Motors Nexa Showroom\nChaudhary Digamber Singh Nagar\nMathura, Uttar Pradesh"],
                ["🕐", "Open Daily: 11:00 AM – 12:00 AM\nBar: 5:00 PM – 12:00 AM"],
                ["📞", "+91 98765 43210"],
                ["💬", "WhatsApp: +91 98765 43210"],
              ].map(([icon, text], i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.2rem" }}>{icon}</span>
                  <div style={{ color: "#aaa", fontSize: "0.85rem", lineHeight: 1.7, whiteSpace: "pre-line" }}>{text}</div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                <a href="tel:+919876543210" style={{
                  background: C.gold, color: "#000", padding: "10px 24px", borderRadius: 4,
                  textDecoration: "none", fontSize: "0.8rem", fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700,
                }}>📞 CALL NOW</a>
                <a href="https://wa.me/919876543210" style={{
                  background: "#25D36622", border: "1px solid #25D36644", color: "#25D366",
                  padding: "10px 24px", borderRadius: 4, textDecoration: "none", fontSize: "0.8rem", fontFamily: "monospace", letterSpacing: "0.15em",
                }}>💬 WHATSAPP</a>
              </div>
            </div>
          </div>
          <div style={{
            borderRadius: 16,
            overflow: "hidden",
            border: `1px solid ${C.gold}22`,
            aspectRatio: "1",
            position: "relative",
            background: "#0D0D1A",
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3543.1234!2d77.6731!3d27.4924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDI5JzMyLjciTiA3N8KwNDAnMjMuMiJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen=""
              loading="lazy"
              title="Molecule Mathura Location"
            />
            {/* Animated pin overlay */}
            <div style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -100%)",
              textAlign: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: "50% 50% 50% 0",
                background: C.gold,
                transform: "rotate(-45deg)",
                boxShadow: `0 0 20px ${C.gold}`,
                animation: "pinPulse 2s ease-in-out infinite",
              }} />
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pinPulse { 0%,100%{box-shadow:0 0 20px ${C.gold};} 50%{box-shadow:0 0 40px ${C.gold};} }`}</style>
    </Scene3D>
  );
}

// ── Contact Section ───────────────────────────────────────────
function ContactSection() {
  return (
    <Scene3D id="contact" bg="linear-gradient(180deg, #080810 0%, #050508 100%)" style={{ padding: "80px 0 40px" }}>
      <ParticleCanvas colors={[C.gold + "33", "#ffffff11"]} count={30} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 10, textAlign: "center" }}>
        <SectionTitle
          eyebrow="✦ Get In Touch"
          title="Reserve Your Table"
          subtitle="Step into the sky. Book your experience at Molecule Mathura today."
          color={C.gold}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 48 }}>
          {[
            { icon: "📞", label: "Call Us", val: "+91 98765 43210", href: "tel:+919876543210", color: C.gold },
            { icon: "💬", label: "WhatsApp", val: "Chat with us", href: "https://wa.me/919876543210", color: "#25D366" },
            { icon: "📍", label: "Location", val: "NH-19, Mathura, UP", href: "https://maps.google.com", color: C.neonBlue },
          ].map((c, i) => (
            <a key={i} href={c.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: `linear-gradient(135deg, ${c.color}11, transparent)`,
                border: `1px solid ${c.color}33`,
                borderRadius: 12,
                padding: "24px",
                transition: "all 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 30px ${c.color}44`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>{c.icon}</div>
                <div style={{ color: c.color, fontFamily: "monospace", fontSize: "0.75rem", letterSpacing: "0.2em", marginBottom: 4 }}>{c.label}</div>
                <div style={{ color: "#888", fontSize: "0.9rem" }}>{c.val}</div>
              </div>
            </a>
          ))}
        </div>

        <GoldDivider />

        {/* Footer */}
        <div style={{ marginTop: 40, paddingBottom: 40 }}>
          <GlowText size="2rem" color={C.gold}>MOLECULE MATHURA</GlowText>
          <div style={{ color: "#555", fontSize: "0.75rem", letterSpacing: "0.3em", fontFamily: "monospace", marginTop: 8 }}>
            AIR BAR · KITCHEN
          </div>
          <div style={{ color: "#444", fontSize: "0.75rem", marginTop: 24, lineHeight: 1.8 }}>
            4th Floor, Sapphire Building, NH-19, Mathura, Uttar Pradesh<br />
            © 2025 Molecule Mathura. All rights reserved.
          </div>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 24 }}>
            {["Instagram", "Facebook", "YouTube"].map(s => (
              <a key={s} href="#" style={{ color: "#555", fontSize: "0.75rem", letterSpacing: "0.1em", textDecoration: "none", fontFamily: "monospace", transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = C.gold}
                onMouseLeave={e => e.target.style.color = "#555"}
              >
                {s.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Scene3D>
  );
}

// ── Instagram Feed (Simulated) ─────────────────────────────────
const INSTA_POSTS = [
  { emoji: "☕", caption: "Perfect mornings start here. ✨ #MoleculeMathura #RooftopCafe", color: C.gold },
  { emoji: "🍛", caption: "Royal Awadhi Biryani — a crown jewel of flavors. 👑 #BiryaniLove", color: "#D4943A" },
  { emoji: "🍸", caption: "Neon nights at the Air Bar. Let the city glow! 💜 #AirBar", color: C.neonPurple },
  { emoji: "🎶", caption: "Live music under the stars. Tonight was magical 🎵 #LiveNights", color: C.neonPink },
  { emoji: "🌆", caption: "Mathura from the top. The view that steals hearts. 💫", color: C.neonBlue },
];

function InstagramSection() {
  return (
    <Scene3D bg="linear-gradient(180deg, #050508 0%, #080810 100%)" style={{ padding: "80px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 10 }}>
        <SectionTitle eyebrow="✦ Social" title="Follow Us on Instagram" color={C.neonPink} />
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <a href="https://instagram.com/moleculemathura" target="_blank" rel="noreferrer"
            style={{ color: C.neonPink, fontFamily: "monospace", fontSize: "0.85rem", letterSpacing: "0.2em", textDecoration: "none" }}>
            @moleculemathura
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {INSTA_POSTS.map((p, i) => {
            const [hov, setHov] = useState(false);
            return (
              <a key={i} href="https://instagram.com/moleculemathura" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <div
                  onMouseEnter={() => setHov(true)}
                  onMouseLeave={() => setHov(false)}
                  style={{
                    aspectRatio: "1",
                    background: `linear-gradient(135deg, ${p.color}22, #0D0D1A)`,
                    border: `1px solid ${hov ? p.color + "88" : p.color + "22"}`,
                    borderRadius: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    transition: "all 0.4s ease",
                    transform: hov ? "scale(1.05)" : "scale(1)",
                    boxShadow: hov ? `0 20px 40px ${p.color}33` : "none",
                    padding: 16,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "2.5rem", filter: `drop-shadow(0 0 10px ${p.color})` }}>{p.emoji}</div>
                  <div style={{ color: "#777", fontSize: "0.7rem", textAlign: "center", lineHeight: 1.5 }}>{p.caption}</div>
                  <div style={{ color: p.color, fontSize: "0.65rem", fontFamily: "monospace" }}>VIEW POST →</div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </Scene3D>
  );
}

// ── Scroll Progress Bar ───────────────────────────────────────
function ScrollProgress() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProg(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: `${prog}%`,
      height: 2,
      background: `linear-gradient(90deg, ${C.gold}, ${C.neonPurple})`,
      zIndex: 9999,
      transition: "width 0.1s linear",
      boxShadow: `0 0 10px ${C.gold}88`,
    }} />
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setNavVisible(true);
    setTimeout(() => setIntroComplete(true), 500);
  }, []);

  return (
    <div style={{ background: C.dark, minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #080810; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080810; }
        ::-webkit-scrollbar-thumb { background: ${C.gold}66; border-radius: 2px; }
        @media (max-width: 768px) {
          [data-hide-mobile] { display: none !important; }
        }
      `}</style>

      <ScrollProgress />
      <LogoIntro onComplete={handleIntroComplete} />
      <Navbar visible={navVisible} />

      <main style={{ opacity: introComplete ? 1 : 0, transition: "opacity 0.8s ease" }}>
        <HeroSection />
        <CafeSection />
        <RestaurantSection />
        <BarSection />
        <EventsSection />
        <InstagramSection />
        <ReviewsSection />
        <AboutSection />
        <MapSection />
        <ContactSection />
      </main>
    </div>
  );
}
