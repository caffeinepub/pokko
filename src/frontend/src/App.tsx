import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart2,
  Check,
  Copy,
  DollarSign,
  Download,
  Menu,
  Pause,
  Play,
  TrendingUp,
  Twitter,
  Upload,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiTiktok } from "react-icons/si";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

// ─── Types ───────────────────────────────────────────────────────────────────
interface DexPair {
  priceUsd?: string;
  priceChange?: { h24?: number };
  volume?: { h24?: number };
  marketCap?: number;
  fdv?: number;
  info?: { holders?: number };
  txns?: { h24?: { buys?: number; sells?: number } };
}

interface DexData {
  price: string;
  change24h: string;
  volume24h: string;
  marketCap: string;
  fdv: string;
  holders: string;
  isPositive: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const CA = "7umFi5LNNVV8YyqxptQTcUVg3D2qYxSC4fFouNHbpump";
const X_URL = "https://x.com/i/communities/2039037148221841636";
const TIKTOK_URL = "https://www.tiktok.com/@pokko42";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatNum(n: number | undefined): string {
  if (n == null || Number.isNaN(n)) return "--";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

async function fetchDexData(): Promise<DexData> {
  const res = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${CA}`,
  );
  const json = await res.json();
  const pair: DexPair = json?.pairs?.[0] ?? {};
  const change = pair.priceChange?.h24 ?? 0;
  return {
    price: pair.priceUsd
      ? `$${Number.parseFloat(pair.priceUsd).toFixed(8)}`
      : "--",
    change24h: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
    volume24h: formatNum(pair.volume?.h24),
    marketCap: formatNum(pair.marketCap),
    fdv: formatNum(pair.fdv),
    holders: pair.info?.holders ? pair.info.holders.toLocaleString() : "--",
    isPositive: change >= 0,
  };
}

// ─── Live Price Ticker Bar ────────────────────────────────────────────────────
function PriceTickerBar() {
  const { data } = useQuery<DexData>({
    queryKey: ["dex"],
    queryFn: fetchDexData,
    refetchInterval: 30000,
    staleTime: 25000,
  });

  const d = data;
  const items = [
    {
      label: "POKKO",
      value: d?.price ?? "--",
      icon: <DollarSign className="w-3 h-3" />,
    },
    {
      label: "24h",
      value: d?.change24h ?? "--",
      color: d?.isPositive ? "text-green-400" : "text-red-400",
      icon: <TrendingUp className="w-3 h-3" />,
    },
    {
      label: "Vol",
      value: d?.volume24h ?? "--",
      icon: <BarChart2 className="w-3 h-3" />,
    },
    {
      label: "MCap",
      value: d?.marketCap ?? "--",
      icon: <DollarSign className="w-3 h-3" />,
    },
    {
      label: "FDV",
      value: d?.fdv ?? "--",
      icon: <DollarSign className="w-3 h-3" />,
    },
    {
      label: "Holders",
      value: d?.holders ?? "--",
      icon: <Users className="w-3 h-3" />,
    },
  ];

  const tickerText = Array(6)
    .fill(items.map((i) => `${i.label}: ${i.value}`).join("  •  "))
    .join("   ✨   ");

  return (
    <div
      className="w-full text-xs font-bold overflow-hidden"
      style={{
        background: "oklch(0.37 0.07 50)",
        color: "oklch(0.98 0.01 75)",
      }}
    >
      <div className="marquee-container h-9 flex items-center">
        <span className="ticker-content whitespace-nowrap px-4">
          {tickerText}&nbsp;&nbsp;&nbsp;{tickerText}
        </span>
      </div>
    </div>
  );
}

// ─── Header / Nav ─────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "How to Buy", href: "#how-to-buy" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Gallery", href: "#gallery" },
  { label: "Community", href: "#community" },
  { label: "FAQ", href: "#faq" },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all ${
          scrolled ? "shadow-md" : ""
        }`}
        style={{ background: "oklch(0.965 0.022 75)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2"
            data-ocid="nav.link"
          >
            <img
              src="/assets/pokko-hero.png"
              alt="POKKO"
              className="w-10 h-10 rounded-full object-cover border-2"
              style={{ borderColor: "oklch(0.48 0.09 52)" }}
            />
            <span
              className="text-2xl font-fredoka tracking-wide"
              style={{
                color: "oklch(0.37 0.07 50)",
                fontFamily: "'Fredoka One', cursive",
              }}
            >
              POKKO
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-ocid="nav.link"
                className="text-sm font-bold transition-colors hover:opacity-70"
                style={{ color: "oklch(0.37 0.07 50)" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#how-to-buy"
              data-ocid="nav.primary_button"
              className="hidden md:block btn-primary text-sm"
            >
              BUY $POKKO
            </a>
            <button
              type="button"
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              data-ocid="nav.open_modal_button"
              style={{ color: "oklch(0.37 0.07 50)" }}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setMobileOpen(false);
              }}
              role="button"
              tabIndex={0}
              aria-label="Close menu"
            />
            <motion.div
              className="relative ml-auto w-72 h-full flex flex-col p-6 shadow-xl"
              style={{ background: "oklch(0.965 0.022 75)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              data-ocid="nav.modal"
            >
              <button
                type="button"
                className="self-end mb-6 p-1"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.close_button"
                style={{ color: "oklch(0.37 0.07 50)" }}
              >
                <X className="w-6 h-6" />
              </button>
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    data-ocid="nav.link"
                    className="text-lg font-bold py-2 border-b transition-colors hover:opacity-70"
                    style={{
                      color: "oklch(0.37 0.07 50)",
                      borderColor: "oklch(0.86 0.04 70)",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
              <button
                type="button"
                data-ocid="nav.primary_button"
                className="btn-primary text-center mt-6"
                onClick={() => {
                  setMobileOpen(false);
                  document
                    .getElementById("how-to-buy")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                BUY $POKKO 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Marquee Banner ───────────────────────────────────────────────────────────
function MarqueeBanner() {
  const text = Array(20).fill("✨ POKKO").join("  ");
  return (
    <div
      className="w-full py-2 overflow-hidden font-fredoka text-lg font-bold"
      style={{
        background: "oklch(0.74 0.12 68)",
        color: "oklch(0.22 0.04 45)",
        fontFamily: "'Fredoka One', cursive",
      }}
    >
      <div className="marquee-container">
        <span className="marquee-content">
          {text}&nbsp;&nbsp;&nbsp;{text}
        </span>
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    toast.success("CA copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden py-16 md:py-24"
      style={{ background: "oklch(0.943 0.030 75)" }}
    >
      {/* Floating paw decorations */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {["✨0", "🌟1", "✨2", "✨3", "🌟4", "✨5", "✨6", "🌟7"].map(
          (e, i) => (
            <span
              key={e}
              className={`absolute text-4xl opacity-10 ${
                i % 2 === 0 ? "paw-float" : "paw-float-delay"
              }`}
              style={{
                left: `${(i * 13 + 5) % 95}%`,
                top: `${(i * 17 + 10) % 85}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              {e}
            </span>
          ),
        )}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Hero image */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="/assets/pokko-hero.png"
            alt="Pokko"
            className="w-72 md:w-96 lg:w-[440px] drop-shadow-2xl rounded-3xl"
          />
        </motion.div>

        {/* Copy */}
        <motion.div
          className="flex-1 flex flex-col items-start gap-6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            style={{
              fontFamily: "'Fredoka One', cursive",
              color: "oklch(0.37 0.07 50)",
            }}
          >
            Meet POKKO 🚀
          </h1>
          <p
            className="text-lg md:text-xl font-semibold"
            style={{ color: "oklch(0.52 0.04 50)" }}
          >
            The viral character that took TikTok by storm — 60M+ views, 100K+
            followers in a week. Pure meme gold. Now riding the blockchain wave!
            🚀
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#how-to-buy"
              data-ocid="hero.primary_button"
              className="btn-primary text-base"
            >
              BUY $POKKO 🚀
            </a>
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.secondary_button"
              className="btn-blue text-base"
            >
              Join Community 🚀
            </a>
          </div>

          {/* CA */}
          <div
            className="w-full rounded-2xl p-4 flex items-center gap-2 flex-wrap"
            style={{
              background: "oklch(0.90 0.04 75)",
              border: "2px solid oklch(0.86 0.04 70)",
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "oklch(0.52 0.04 50)" }}
            >
              CA:
            </span>
            <span
              className="font-mono text-xs md:text-sm flex-1 break-all"
              style={{ color: "oklch(0.37 0.07 50)" }}
            >
              {CA}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              data-ocid="hero.button"
              className="p-2 rounded-xl hover:opacity-70 transition-all"
              style={{
                background: "oklch(0.48 0.09 52)",
                color: "oklch(0.98 0.01 75)",
              }}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Video Section ────────────────────────────────────────────────────────────
function VideoSection() {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0);

  const togglePlay = () => {
    setPlaying((p) => !p);
  };

  const toggleMute = () => {
    setMuted((m) => !m);
    if (muted) setVolume(80);
    else setVolume(0);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number.parseInt(e.target.value);
    setVolume(v);
    setMuted(v === 0);
  };

  return (
    <section
      className="w-full py-16"
      style={{ background: "oklch(0.22 0.04 45)" }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-8"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "oklch(0.98 0.01 75)",
          }}
        >
          POKKO in Action 🎬
        </h2>

        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: "#000" }}
        >
          {/* TikTok embed */}
          <div
            className="relative"
            style={{ paddingBottom: "56.25%", height: 0 }}
          >
            <iframe
              src="https://www.tiktok.com/embed/@pokko42"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="POKKO TikTok"
            />
          </div>

          {/* Video controls overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4"
            style={{
              background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            }}
          >
            <button
              type="button"
              onClick={togglePlay}
              data-ocid="video.button"
              className="p-2 rounded-full text-white hover:opacity-80 transition-all"
              style={{ background: "oklch(0.48 0.09 52)" }}
            >
              {playing ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              data-ocid="video.toggle"
              className="p-2 rounded-full text-white hover:opacity-80 transition-all"
            >
              {muted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={handleVolume}
              data-ocid="video.input"
              className="flex-1 accent-amber-500"
            />

            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-bold flex items-center gap-1 hover:opacity-80"
            >
              <SiTiktok className="w-4 h-4" /> @pokko42
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Tokenomics Section ───────────────────────────────────────────────────────
function TokenomicsSection() {
  const { data } = useQuery<DexData>({
    queryKey: ["dex"],
    queryFn: fetchDexData,
    staleTime: 25000,
  });

  const slices = [
    { label: "Community", pct: 40, color: "oklch(0.72 0.10 185)" },
    { label: "Liquidity", pct: 30, color: "oklch(0.48 0.09 52)" },
    { label: "Development", pct: 20, color: "oklch(0.74 0.12 68)" },
    { label: "Marketing", pct: 10, color: "oklch(0.57 0.12 228)" },
  ];

  // Build SVG donut
  const r = 70;
  const cx = 90;
  const cy = 90;
  let cumulPct = 0;

  const paths = slices.map((s) => {
    const startAngle = (cumulPct / 100) * 360 - 90;
    const endAngle = ((cumulPct + s.pct) / 100) * 360 - 90;
    const start = {
      x: cx + r * Math.cos((startAngle * Math.PI) / 180),
      y: cy + r * Math.sin((startAngle * Math.PI) / 180),
    };
    const end = {
      x: cx + r * Math.cos((endAngle * Math.PI) / 180),
      y: cy + r * Math.sin((endAngle * Math.PI) / 180),
    };
    const largeArc = s.pct > 50 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    cumulPct += s.pct;
    return { ...s, d };
  });

  const stats = [
    { label: "Price", value: data?.price ?? "--", icon: "💰" },
    {
      label: "24h Change",
      value: data?.change24h ?? "--",
      icon: "📈",
      color: data?.isPositive ? "text-green-600" : "text-red-600",
    },
    { label: "24h Volume", value: data?.volume24h ?? "--", icon: "📊" },
    { label: "Market Cap", value: data?.marketCap ?? "--", icon: "🏦" },
    { label: "FDV", value: data?.fdv ?? "--", icon: "💎" },
    { label: "Holders", value: data?.holders ?? "--", icon: "👥" },
  ];

  return (
    <section
      id="tokenomics"
      className="py-16 px-4"
      style={{ background: "oklch(0.943 0.030 75)" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "oklch(0.37 0.07 50)",
          }}
        >
          POKKOomics 🍯
        </h2>

        {/* Live stats grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
          data-ocid="tokenomics.panel"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="section-card text-center py-5 px-3"
              data-ocid={`tokenomics.card.${i + 1}` as never}
            >
              <div className="text-3xl mb-1">{s.icon}</div>
              <div
                className={`text-lg md:text-xl font-bold ${s.color ?? ""}`}
                style={{ color: s.color ? undefined : "oklch(0.37 0.07 50)" }}
              >
                {s.value}
              </div>
              <div
                className="text-xs mt-1 font-semibold"
                style={{ color: "oklch(0.52 0.04 50)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="section-card flex flex-col md:flex-row items-center gap-8">
          {/* Left: supply info */}
          <div className="flex-1 space-y-4">
            <h3
              className="text-2xl font-bold"
              style={{
                fontFamily: "'Fredoka One', cursive",
                color: "oklch(0.37 0.07 50)",
              }}
            >
              Token Distribution
            </h3>
            <p style={{ color: "oklch(0.52 0.04 50)" }}>
              Total Supply: <strong>1,000,000,000 POKKO</strong>
            </p>
            <p style={{ color: "oklch(0.52 0.04 50)" }}>
              Network: <strong>Solana</strong> ☀️
            </p>
            <div className="space-y-3 mt-4">
              {slices.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ background: s.color }}
                  />
                  <span
                    className="font-semibold"
                    style={{ color: "oklch(0.37 0.07 50)" }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="ml-auto font-bold"
                    style={{ color: "oklch(0.37 0.07 50)" }}
                  >
                    {s.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: donut chart */}
          <div className="flex-shrink-0">
            <svg
              width="180"
              height="180"
              viewBox="0 0 180 180"
              role="img"
              aria-label="POKKO Token Distribution Chart"
            >
              <title>POKKO Token Distribution</title>
              {paths.map((p) => (
                <path
                  key={p.label}
                  d={p.d}
                  fill={p.color}
                  stroke="oklch(0.965 0.022 75)"
                  strokeWidth={2}
                />
              ))}
              <circle cx={cx} cy={cy} r={40} fill="oklch(0.965 0.022 75)" />
              <text
                x={cx}
                y={cy - 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight="bold"
                fill="oklch(0.37 0.07 50)"
              >
                POKKO
              </text>
              <text
                x={cx}
                y={cy + 12}
                textAnchor="middle"
                fontSize={9}
                fill="oklch(0.52 0.04 50)"
              >
                1B Supply
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How to Buy Section ───────────────────────────────────────────────────────
function HowToBuySection() {
  const steps = [
    {
      icon: "👛",
      title: "Get Phantom",
      desc: "Download the Phantom wallet app or browser extension at phantom.app",
    },
    {
      icon: "☀️",
      title: "Buy SOL",
      desc: "Purchase Solana (SOL) on Coinbase, Binance, or any major exchange",
    },
    {
      icon: "🔄",
      title: "Swap on Jupiter",
      desc: "Visit jup.ag, paste the POKKO contract address, and swap SOL for POKKO",
    },
    {
      icon: "🎉",
      title: "Hold & Enjoy!",
      desc: "You're now a POKKO holder! Join the community and ride the wave 🚀",
    },
  ];

  return (
    <section
      id="how-to-buy"
      className="py-16 px-4"
      style={{ background: "oklch(0.90 0.04 75)" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "oklch(0.37 0.07 50)",
          }}
        >
          How to Buy 🛒
        </h2>
        <p
          className="text-center mb-12 text-lg"
          style={{ color: "oklch(0.52 0.04 50)" }}
        >
          Get your POKKO in 4 easy steps!
        </p>

        {/* Steps */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          data-ocid="how-to-buy.panel"
        >
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative"
              data-ocid={`how-to-buy.item.${i + 1}` as never}
            >
              <div className="section-card text-center h-full">
                <div className="text-5xl mb-3">{s.icon}</div>
                <div
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: "oklch(0.48 0.09 52)" }}
                >
                  {i + 1}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{
                    color: "oklch(0.37 0.07 50)",
                    fontFamily: "'Fredoka One', cursive",
                  }}
                >
                  {s.title}
                </h3>
                <p className="text-sm" style={{ color: "oklch(0.52 0.04 50)" }}>
                  {s.desc}
                </p>
              </div>
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 z-10 text-2xl -translate-y-1/2">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Jupiter embed */}
        <div className="section-card p-0 overflow-hidden">
          <h3
            className="text-2xl font-bold p-6 pb-0"
            style={{
              fontFamily: "'Fredoka One', cursive",
              color: "oklch(0.37 0.07 50)",
            }}
          >
            Swap on Jupiter 🔄
          </h3>
          <iframe
            src={`https://jup.ag/swap/SOL-${CA}`}
            width="100%"
            height="600"
            className="rounded-3xl"
            allow="clipboard-write; encrypted-media"
            title="Jupiter Swap"
            data-ocid="how-to-buy.panel"
          />
        </div>
      </div>
    </section>
  );
}

// ─── DexScreener Chart ────────────────────────────────────────────────────────
function ChartSection() {
  return (
    <section
      className="py-16 px-4"
      style={{ background: "oklch(0.22 0.04 45)" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-8"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "oklch(0.98 0.01 75)",
          }}
        >
          Live Chart 📈
        </h2>
        <div className="rounded-3xl overflow-hidden" style={{ height: 600 }}>
          <iframe
            src={`https://dexscreener.com/solana/${CA}?embed=1&theme=dark`}
            width="100%"
            height="600"
            allow="clipboard-write; encrypted-media"
            title="DexScreener Chart"
            className="w-full h-full"
            data-ocid="chart.panel"
          />
        </div>
      </div>
    </section>
  );
}

// ─── Meme Gallery + PFP Generator ────────────────────────────────────────────
const MEME_IMAGES = [
  "/assets/generated/pokko-meme1-transparent.dim_400x400.png",
  "/assets/generated/pokko-meme2-transparent.dim_400x400.png",
  "/assets/generated/pokko-meme3-transparent.dim_400x400.png",
  "/assets/generated/pokko-meme4-transparent.dim_400x400.png",
  "/assets/generated/pokko-meme5-transparent.dim_400x400.png",
  "/assets/generated/pokko-meme6-transparent.dim_400x400.png",
];

function GallerySection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pfpReady, setPfpReady] = useState(false);
  const [uploading, setUploading] = useState(false);

  const downloadMeme = (src: string, idx: number) => {
    const a = document.createElement("a");
    a.href = src;
    a.download = `pokko-meme-${idx + 1}.png`;
    a.click();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const userImg = new Image();
      userImg.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = 400;
        canvas.height = 400;

        // Draw user image (square crop)
        const size = Math.min(userImg.width, userImg.height);
        const sx = (userImg.width - size) / 2;
        const sy = (userImg.height - size) / 2;
        ctx.drawImage(userImg, sx, sy, size, size, 0, 0, 400, 400);

        // Overlay Pokko sticker
        const sticker = new Image();
        sticker.onload = () => {
          ctx.drawImage(sticker, 260, 260, 130, 130);
          // Watermark text
          ctx.font = "bold 32px 'Fredoka One', cursive";
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.strokeStyle = "rgba(0,0,0,0.5)";
          ctx.lineWidth = 3;
          ctx.strokeText("POKKO", 12, 388);
          ctx.fillText("POKKO", 12, 388);
          setPfpReady(true);
          setUploading(false);
        };
        sticker.src = "/assets/pokko-hero2.png";
      };
      userImg.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const downloadPfp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "pokko-pfp.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    toast.success("PFP downloaded! 🎉");
  };

  return (
    <section
      id="gallery"
      className="py-16 px-4"
      style={{ background: "oklch(0.943 0.030 75)" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "oklch(0.37 0.07 50)",
          }}
        >
          POKKO Gallery & PFP Generator 🎨
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="section-card">
            <h3
              className="text-2xl font-bold mb-6"
              style={{
                fontFamily: "'Fredoka One', cursive",
                color: "oklch(0.37 0.07 50)",
              }}
            >
              Meme Gallery 🖼️
            </h3>
            <div className="grid grid-cols-3 gap-3" data-ocid="gallery.panel">
              {MEME_IMAGES.map((src, i) => (
                <button
                  type="button"
                  key={src}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer text-left w-full"
                  style={{ background: "oklch(0.90 0.04 75)" }}
                  onClick={() => downloadMeme(src, i)}
                  data-ocid={`gallery.item.${i + 1}` as never}
                >
                  <img
                    src={src}
                    alt={`Pokko meme ${i + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                </button>
              ))}
            </div>
            <p
              className="text-sm mt-3 text-center"
              style={{ color: "oklch(0.52 0.04 50)" }}
            >
              Click any image to download 📥
            </p>
          </div>

          {/* PFP Generator */}
          <div
            className="section-card flex flex-col items-center gap-6"
            style={{ border: "2px solid oklch(0.48 0.09 52)" }}
          >
            <h3
              className="text-2xl font-bold"
              style={{
                fontFamily: "'Fredoka One', cursive",
                color: "oklch(0.37 0.07 50)",
              }}
            >
              Make Your POKKO PFP 🎨
            </h3>
            <p
              className="text-sm text-center"
              style={{ color: "oklch(0.52 0.04 50)" }}
            >
              Upload your photo and get a POKKO-branded PFP in seconds!
            </p>

            <canvas
              ref={canvasRef}
              className="rounded-2xl shadow-md"
              style={{
                width: "100%",
                maxWidth: 280,
                aspectRatio: "1",
                background: pfpReady ? undefined : "oklch(0.90 0.04 75)",
                display: "block",
              }}
            />

            {!pfpReady && (
              <div
                className="w-full max-w-[280px] aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 -mt-[280px] relative z-10"
                style={{ pointerEvents: "none" }}
              >
                <span className="text-5xl">🎨</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "oklch(0.52 0.04 50)" }}
                >
                  Your photo here
                </span>
              </div>
            )}

            <label
              className="btn-primary cursor-pointer flex items-center gap-2"
              data-ocid="gallery.upload_button"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Processing..." : "Upload Your Photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>

            {pfpReady && (
              <Button
                onClick={downloadPfp}
                data-ocid="gallery.button"
                className="btn-blue flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PFP
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Community Section ────────────────────────────────────────────────────────
interface Message {
  text: string;
  author: string;
  timestamp: bigint;
}

function CommunitySection() {
  const queryClient = useQueryClient();
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const { actor, isFetching: actorLoading } = useActor();

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages();
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 10000,
  });

  const { mutate: postMsg, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.postMessage(author.trim(), text.trim());
    },
    onSuccess: () => {
      setAuthor("");
      setText("");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message posted! 🚀");
    },
    onError: () => toast.error("Failed to post message"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    postMsg();
  };

  const last20 = [...messages].reverse().slice(0, 20);

  return (
    <section
      id="community"
      className="py-16 px-4"
      style={{ background: "oklch(0.90 0.04 75)" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "oklch(0.37 0.07 50)",
          }}
        >
          Community 🌟
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Join the Fam */}
          <div className="section-card flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <img
                src="/assets/pokko-hero2.png"
                alt="Pokko"
                className="w-20 h-20 rounded-2xl object-cover"
              />
              <div>
                <h3
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    color: "oklch(0.37 0.07 50)",
                  }}
                >
                  Join the Fam! 🌟
                </h3>
                <p className="text-sm" style={{ color: "oklch(0.52 0.04 50)" }}>
                  Be part of the POKKO movement
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="section-card text-center py-4"
                style={{ background: "oklch(0.943 0.030 75)" }}
              >
                <div
                  className="text-3xl font-bold"
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    color: "oklch(0.37 0.07 50)",
                  }}
                >
                  60M+
                </div>
                <div
                  className="text-sm"
                  style={{ color: "oklch(0.52 0.04 50)" }}
                >
                  TikTok Views
                </div>
              </div>
              <div
                className="section-card text-center py-4"
                style={{ background: "oklch(0.943 0.030 75)" }}
              >
                <div
                  className="text-3xl font-bold"
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    color: "oklch(0.37 0.07 50)",
                  }}
                >
                  100K+
                </div>
                <div
                  className="text-sm"
                  style={{ color: "oklch(0.52 0.04 50)" }}
                >
                  Followers
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="community.link"
                className="flex items-center gap-3 p-4 rounded-2xl font-bold text-white transition-all hover:opacity-90"
                style={{ background: "oklch(0.22 0.04 45)" }}
              >
                <Twitter className="w-6 h-6" /> Follow on X (Twitter)
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="community.link"
                className="flex items-center gap-3 p-4 rounded-2xl font-bold text-white transition-all hover:opacity-90"
                style={{ background: "oklch(0.40 0.05 320)" }}
              >
                <SiTiktok className="w-6 h-6" /> Follow on TikTok
              </a>
            </div>
          </div>

          {/* Chat */}
          <div
            className="section-card flex flex-col gap-4"
            data-ocid="community.panel"
          >
            <h3
              className="text-2xl font-bold"
              style={{
                fontFamily: "'Fredoka One', cursive",
                color: "oklch(0.37 0.07 50)",
              }}
            >
              Community Chat 💬
            </h3>

            <div
              className="flex-1 overflow-y-auto rounded-2xl p-4 space-y-3 min-h-[220px] max-h-80"
              style={{ background: "oklch(0.943 0.030 75)" }}
            >
              {isLoading ? (
                <div
                  className="flex items-center justify-center h-full"
                  data-ocid="community.loading_state"
                >
                  <span className="text-3xl animate-bounce">🌟</span>
                </div>
              ) : last20.length === 0 ? (
                <div
                  className="text-center py-8"
                  data-ocid="community.empty_state"
                >
                  <div className="text-4xl">🌟</div>
                  <p
                    className="text-sm mt-2"
                    style={{ color: "oklch(0.52 0.04 50)" }}
                  >
                    Be the first to say hi!
                  </p>
                </div>
              ) : (
                last20.map((m, i) => (
                  <div
                    key={`msg-${Number(m.timestamp)}-${i}`}
                    className="flex gap-3"
                    data-ocid={`community.item.${i + 1}` as never}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background: "oklch(0.48 0.09 52)",
                        color: "oklch(0.98 0.01 75)",
                      }}
                    >
                      {m.author.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <span
                        className="text-xs font-bold"
                        style={{ color: "oklch(0.37 0.07 50)" }}
                      >
                        {m.author}
                      </span>
                      <p
                        className="text-sm"
                        style={{ color: "oklch(0.52 0.04 50)" }}
                      >
                        {m.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3"
              data-ocid="community.panel"
            >
              <Input
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                maxLength={50}
                data-ocid="community.input"
                className="rounded-xl"
              />
              <Textarea
                placeholder="Say something nice..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={280}
                rows={2}
                data-ocid="community.textarea"
                className="rounded-xl resize-none"
              />
              <Button
                type="submit"
                disabled={isPending || !author.trim() || !text.trim()}
                data-ocid="community.submit_button"
                className="btn-primary w-full"
              >
                {isPending ? "Posting..." : "Send Message 🚀"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "What is POKKO?",
    a: "POKKO is a Solana memecoin inspired by a viral TikTok character. @pokko42 exploded with 60M+ views and 100K+ followers in a week via adorable animations — pure meme gold. The token was launched to fuel the hype and redirect fees to the creator for an authentic onboard boost.",
  },
  {
    q: "How do I buy POKKO?",
    a: "1. Get a Phantom wallet. 2. Buy SOL on any exchange. 3. Go to jup.ag and swap SOL for POKKO using CA: 7umFi5LNNVV8YyqxptQTcUVg3D2qYxSC4fFouNHbpump. 4. Hold and enjoy the ride! 🚀",
  },
  {
    q: "Is POKKO on Solana?",
    a: `Yes! POKKO is a Solana SPL token. Contract Address: ${CA}. You can verify it on DexScreener or Solscan.`,
  },
  {
    q: "Where can I follow POKKO?",
    a: `Follow us on X (Twitter): ${X_URL} and TikTok: ${TIKTOK_URL} for the latest updates, memes, and community events!`,
  },
  {
    q: "Is POKKO safe?",
    a: "POKKO is a community memecoin for entertainment purposes. Like all memecoins, it carries high risk. Never invest more than you can afford to lose. Always do your own research (DYOR). POKKO is not a financial product or investment vehicle.",
  },
  {
    q: "Where can I trade POKKO?",
    a: "You can swap POKKO on Jupiter (jup.ag), Raydium, or any Solana DEX that supports SPL tokens. The easiest way is via the Jupiter swap widget on this page!",
  },
];

function FaqSection() {
  return (
    <section
      id="faq"
      className="py-16 px-4"
      style={{ background: "oklch(0.943 0.030 75)" }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "oklch(0.37 0.07 50)",
          }}
        >
          FAQ 🌟
        </h2>
        <Accordion
          type="single"
          collapsible
          className="space-y-3"
          data-ocid="faq.panel"
        >
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="section-card border-none"
              data-ocid={`faq.item.${i + 1}` as never}
            >
              <AccordionTrigger
                className="text-left font-bold hover:no-underline"
                style={{
                  color: "oklch(0.37 0.07 50)",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent style={{ color: "oklch(0.52 0.04 50)" }}>
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ─── Trade Buttons Row ────────────────────────────────────────────────────────
function TradeRow() {
  return (
    <section
      className="py-10 px-4"
      style={{ background: "oklch(0.72 0.10 185)" }}
    >
      <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center items-center">
        <span
          className="text-2xl font-bold"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "oklch(0.22 0.04 45)",
          }}
        >
          Trade POKKO Now!
        </span>
        <a
          href={`https://jup.ag/swap/SOL-${CA}`}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="trade.primary_button"
          className="btn-primary"
        >
          🔄 Jupiter Swap
        </a>
        <a
          href={`https://dexscreener.com/solana/${CA}`}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="trade.secondary_button"
          className="btn-blue"
        >
          📊 DexScreener
        </a>
        <a
          href={`https://birdeye.so/token/${CA}`}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="trade.button"
          className="font-bold rounded-full px-6 py-3 hover:opacity-90 transition-all"
          style={{
            background: "oklch(0.22 0.04 45)",
            color: "oklch(0.98 0.01 75)",
          }}
        >
          🦅 Birdeye
        </a>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="py-10 px-4"
      style={{ background: "oklch(0.37 0.07 50)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img
                src="/assets/pokko-hero.png"
                alt="POKKO"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span
                className="text-2xl font-bold"
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  color: "oklch(0.98 0.01 75)",
                }}
              >
                POKKO
              </span>
            </div>
            <p className="text-sm" style={{ color: "oklch(0.80 0.04 70)" }}>
              © {year} POKKO. To the moon! 🚀
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-2 md:items-center">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-ocid="footer.link"
                className="text-sm hover:opacity-70 transition-colors"
                style={{ color: "oklch(0.80 0.04 70)" }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Social */}
          <div className="flex flex-col gap-4 md:items-end">
            <div className="flex gap-4">
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.link"
                className="p-3 rounded-full hover:opacity-80 transition-all"
                style={{
                  background: "oklch(0.22 0.04 45)",
                  color: "oklch(0.98 0.01 75)",
                }}
                aria-label="X / Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.link"
                className="p-3 rounded-full hover:opacity-80 transition-all"
                style={{
                  background: "oklch(0.40 0.05 320)",
                  color: "oklch(0.98 0.01 75)",
                }}
                aria-label="TikTok"
              >
                <SiTiktok className="w-5 h-5" />
              </a>
            </div>
            <p
              className="text-xs text-right"
              style={{ color: "oklch(0.65 0.04 60)" }}
            >
              Built with ❤️ using{" "}
              <a
                href={caffeineUrl}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>

        <div
          className="pt-6 text-xs text-center"
          style={{
            borderTop: "1px solid oklch(0.52 0.04 50)",
            color: "oklch(0.65 0.04 60)",
          }}
        >
          ⚠️ POKKO is a meme token with no intrinsic value. Not financial advice.
          Always DYOR.
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Header />
      <PriceTickerBar />
      <MarqueeBanner />
      <main className="flex-1">
        <HeroSection />
        <VideoSection />
        <TokenomicsSection />
        <HowToBuySection />
        <ChartSection />
        <GallerySection />
        <CommunitySection />
        <FaqSection />
        <TradeRow />
      </main>
      <Footer />
    </div>
  );
}
