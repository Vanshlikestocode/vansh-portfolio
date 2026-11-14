"use client";

import { Check, House, Minus, Plus, ReceiptText, Search, ShoppingBag, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSequence } from "@/lib/hooks";
import { EASE_OUT, cn } from "@/lib/utils";

/*
 * A code-drawn QueueLess phone that runs the real order flow:
 * Menu → add to cart → Cart → place order → #27 → Accepted → Preparing → Ready → Collected.
 * Dish names, prices and categories are from the app's actual canteen catalogue.
 */

const PHASES = ["menu", "added", "cart", "placing", "placed", "accepted", "preparing", "ready", "collected"] as const;
const DURATIONS = [1500, 1300, 1400, 650, 2000, 1100, 1500, 1500, 1900] as const;

const ORANGE = "#ff6b35";
const NAVY = "#152040";

const dishes = [
  { name: "Masala Dosa", cat: "South Indian", price: 42, from: "#f6c065", to: "#b8621c" },
  { name: "Paneer Franky", cat: "Franky", price: 65, from: "#f4a261", to: "#8f3a1a" },
  { name: "Vada Pav", cat: "Chaat", price: 19, from: "#e9c46a", to: "#7d5420" },
  { name: "Cold Coffee with Ice Cream", cat: "Beverages", price: 75, from: "#cfae86", to: "#4f3324" },
];

type Screen = "menu" | "cart" | "placed" | "tracking";

const screenOf = (phase: number): Screen =>
  phase <= 1 ? "menu" : phase <= 3 ? "cart" : phase === 4 ? "placed" : "tracking";

export const LIFECYCLE = ["Order placed", "Preparing", "Ready", "Collected"] as const;

/** Which lifecycle stage (0–3) the phone is showing, or -1 before the order exists. */
export const lifecycleOf = (phase: number) => (phase < 4 ? -1 : phase < 6 ? 0 : phase - 5);

export function QueueLessPreview({ active, showRail = true }: { active: boolean; showRail?: boolean }) {
  const phase = useSequence(PHASES.length, DURATIONS, active, 6);
  const screen = screenOf(phase);
  const stage = lifecycleOf(phase);

  return (
    <div className="flex items-center justify-center gap-8 lg:gap-12">
      {showRail && <LifecycleRail stage={stage} className="hidden sm:flex" />}
      <Phone phase={phase} screen={screen} />
    </div>
  );
}

function LifecycleRail({ stage, className }: { stage: number; className?: string }) {
  return (
    <ol className={cn("flex-col gap-0", className)} aria-label="Order lifecycle">
      {LIFECYCLE.map((label, i) => {
        const done = stage >= i;
        const current = stage === i;
        return (
          <li key={label} className="flex flex-col items-start">
            <div className="flex items-center gap-3">
              <motion.span
                className="grid size-6 place-items-center rounded-full border"
                animate={{
                  borderColor: done ? ORANGE : "rgba(236,235,230,0.18)",
                  backgroundColor: done ? "rgba(255,107,53,0.14)" : "rgba(0,0,0,0)",
                  scale: current ? 1.12 : 1,
                }}
                transition={{ duration: 0.4 }}
              >
                <motion.span
                  className="size-1.5 rounded-full"
                  animate={{ backgroundColor: done ? ORANGE : "rgba(236,235,230,0.25)" }}
                />
              </motion.span>
              <motion.span
                className="label whitespace-nowrap"
                animate={{ color: done ? "rgb(236,235,230)" : "rgb(100,98,93)" }}
              >
                {label}
              </motion.span>
            </div>
            {i < LIFECYCLE.length - 1 && (
              <span className="relative ml-[11px] h-10 w-px bg-line-2">
                <motion.span
                  className="absolute inset-x-0 top-0 h-full origin-top"
                  style={{ backgroundColor: ORANGE }}
                  animate={{ scaleY: stage > i ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Phone({ phase, screen }: { phase: number; screen: Screen }) {
  const cartCount = phase >= 1 ? 2 : 1;
  return (
    <div
      className="relative h-[540px] w-[264px] shrink-0 rounded-[46px] border border-white/12 bg-[#0d0f18] p-[9px] shadow-[0_40px_100px_-30px_rgba(255,107,53,0.35),0_30px_60px_-20px_rgba(0,0,0,0.8)]"
      role="img"
      aria-label="QueueLess app preview: menu, cart, order placed and live tracking screens"
    >
      <div className="relative size-full overflow-hidden rounded-[38px] bg-[#0a0e1c] text-[#f1f2f7]">
        <div className="absolute left-1/2 top-2.5 z-30 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
        <div className="absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between px-6 pt-1 text-[10px] font-semibold">
          <span>12:45</span>
          <span className="flex items-center gap-1">
            <span className="flex items-end gap-px">
              {[3, 5, 7, 9].map((hgt) => (
                <span key={hgt} className="w-[2px] rounded-sm bg-current" style={{ height: hgt }} />
              ))}
            </span>
            <span className="ml-1 h-[9px] w-[18px] rounded-[3px] border border-current p-px">
              <span className="block h-full w-3/4 rounded-[1px] bg-current" />
            </span>
          </span>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full opacity-40 blur-3xl"
          style={{ background: `radial-gradient(circle, ${NAVY}, transparent 70%)` }}
        />

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={screen}
            className="absolute inset-0 px-4 pb-20 pt-12"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            {screen === "menu" && <MenuScreen phase={phase} />}
            {screen === "cart" && <CartScreen pressing={phase === 3} />}
            {screen === "placed" && <PlacedScreen />}
            {screen === "tracking" && <TrackingScreen phase={phase} />}
          </motion.div>
        </AnimatePresence>

        {/* Flying item: Masala Dosa → cart */}
        <AnimatePresence>
          {phase === 1 && (
            <motion.span
              key="fly"
              className="absolute z-40 size-3 rounded-full"
              style={{ backgroundColor: ORANGE, boxShadow: `0 0 12px ${ORANGE}` }}
              initial={{ left: "83%", top: "48.5%", scale: 1, opacity: 1 }}
              animate={{ left: ["83%", "60%", "37%"], top: ["48.5%", "38%", "92%"], scale: [1, 1.1, 0.5], opacity: [1, 1, 0] }}
              transition={{ duration: 0.75, ease: "easeInOut", delay: 0.15 }}
            />
          )}
        </AnimatePresence>

        {screen === "tracking" && <LiveStrip phase={phase} />}
        <TabBar screen={screen} cartCount={cartCount} bump={phase === 1} />
      </div>
    </div>
  );
}

function MenuScreen({ phase }: { phase: number }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QMark />
          <span className="text-[13px] font-semibold tracking-tight">QueueLess</span>
        </div>
        <span className="grid size-7 place-items-center rounded-full bg-white/10 text-[10px] font-semibold">
          <User className="size-3.5" />
        </span>
      </div>
      <p className="mt-4 text-[22px] font-semibold leading-tight tracking-tight">What&apos;s for lunch?</p>
      <div className="mt-3 flex h-9 items-center gap-2 rounded-xl bg-white/[0.07] px-3 text-[11px] text-white/45">
        <Search className="size-3.5" /> Search 284 dishes
      </div>
      <div className="no-scrollbar mt-3 flex gap-1.5 overflow-hidden">
        {["All", "South Indian", "Franky", "Chaat", "Beverages"].map((c, i) => (
          <span
            key={c}
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium",
              i === 0 ? "text-white" : "bg-white/[0.07] text-white/60",
            )}
            style={i === 0 ? { backgroundColor: ORANGE } : undefined}
          >
            {c}
          </span>
        ))}
      </div>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Popular now</p>
      <ul className="mt-2 space-y-2">
        {dishes.map((d, i) => (
          <motion.li
            key={d.name}
            className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.5, ease: EASE_OUT }}
          >
            <DishArt from={d.from} to={d.to} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold">{d.name}</p>
              <p className="text-[10px] text-white/45">
                {d.cat} · <span className="text-white/80">₹{d.price}</span>
              </p>
            </div>
            <motion.span
              className="grid size-7 place-items-center rounded-full text-white"
              style={{ backgroundColor: i === 0 && phase === 1 ? "#22c55e" : ORANGE }}
              animate={i === 0 && phase === 1 ? { scale: [1, 0.8, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.45 }}
            >
              {i === 0 && phase === 1 ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
            </motion.span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function CartScreen({ pressing }: { pressing: boolean }) {
  const items = [dishes[0], dishes[3]];
  return (
    <div>
      <p className="text-[22px] font-semibold tracking-tight">Your cart</p>
      <p className="text-[11px] text-white/45">2 items · pickup 12:50 – 13:00</p>
      <ul className="mt-4 space-y-2">
        {items.map((d) => (
          <li key={d.name} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-2">
            <DishArt from={d.from} to={d.to} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold">{d.name}</p>
              <p className="text-[11px] text-white/70">₹{d.price}</p>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-white/[0.07] px-2 py-1 text-[11px]">
              <Minus className="size-3 text-white/60" />1<Plus className="size-3 text-white/60" />
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.06] p-1 text-center text-[10px] font-medium">
        <span className="rounded-lg bg-white/90 py-1.5 text-[#0a0e1c]">Pay at counter</span>
        <span className="py-1.5 text-white/55">Pay online</span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[12px]">
        <span className="text-white/55">Total</span>
        <span className="font-semibold">₹117</span>
      </div>
      <motion.div
        className="relative mt-4 overflow-hidden rounded-2xl py-3 text-center text-[12px] font-semibold text-white"
        style={{ backgroundColor: ORANGE }}
        animate={{ scale: pressing ? 0.95 : 1 }}
        transition={{ duration: 0.2 }}
      >
        Place order · ₹117
        {pressing && (
          <motion.span
            className="absolute inset-y-0 w-1/3 bg-white/30 blur-md"
            initial={{ left: "-40%" }}
            animate={{ left: "120%" }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.div>
    </div>
  );
}

function PlacedScreen() {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex h-full flex-col items-center pt-6 text-center">
      <motion.span
        className="grid size-14 place-items-center rounded-full"
        style={{ backgroundColor: "rgba(34,197,94,0.15)" }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
      >
        <Check className="size-7 text-[#22c55e]" />
      </motion.span>
      <p className="mt-4 text-[13px] text-white/60">Order placed</p>
      <motion.p
        className="mt-1 text-[56px] font-semibold leading-none tracking-tighter"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6, ease: EASE_OUT }}
      >
        #27
      </motion.p>
      <p className="mt-2 text-[11px] text-white/50">Your pickup code — show it at the counter</p>

      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3 text-left">
        <svg viewBox="0 0 72 72" className="size-12 -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
          <motion.circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={ORANGE}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: c * 0.04 }}
            transition={{ duration: 2, ease: "linear" }}
          />
        </svg>
        <div>
          <p className="text-[12px] font-semibold">0:58 to change your mind</p>
          <p className="text-[10px] text-white/50">Modify or cancel within 60 s</p>
        </div>
      </div>
    </div>
  );
}

const STEPS = ["Placed", "Accepted", "Preparing", "Ready", "Collected"];
const MESSAGES = [
  "Accepted — the canteen has your order",
  "Preparing — about 6 minutes",
  "Ready! Show #27 at the counter",
  "Collected — enjoy your meal",
];

function TrackingScreen({ phase }: { phase: number }) {
  const current = phase - 4; // accepted=1 … collected=4
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-[22px] font-semibold tracking-tight">Order #27</p>
        <span className="text-[10px] text-white/45">Pickup 12:50</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={current}
          className="mt-3 rounded-2xl px-3 py-2.5 text-[11px] font-medium"
          style={{
            backgroundColor: current >= 3 ? "rgba(34,197,94,0.14)" : "rgba(255,107,53,0.14)",
            color: current >= 3 ? "#4ade80" : "#ffb38f",
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          {MESSAGES[current - 1]}
        </motion.p>
      </AnimatePresence>
      <ol className="mt-5 space-y-0">
        {STEPS.map((s, i) => {
          const done = i <= current;
          const now = i === current;
          return (
            <li key={s} className="flex gap-3">
              <div className="flex flex-col items-center">
                <motion.span
                  className="grid size-5 place-items-center rounded-full"
                  animate={{
                    backgroundColor: done ? ORANGE : "rgba(255,255,255,0.08)",
                    scale: now ? [1, 1.18, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {done && <Check className="size-3 text-white" />}
                </motion.span>
                {i < STEPS.length - 1 && (
                  <span className="relative h-7 w-[2px] bg-white/10">
                    <motion.span
                      className="absolute inset-0 origin-top"
                      style={{ backgroundColor: ORANGE }}
                      animate={{ scaleY: i < current ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </span>
                )}
              </div>
              <p className={cn("pt-0.5 text-[12px]", done ? "font-semibold text-white" : "text-white/40")}>{s}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function LiveStrip({ phase }: { phase: number }) {
  const label = ["Accepted", "Preparing", "Ready", "Collected"][phase - 5] ?? "Accepted";
  return (
    <motion.div
      className="absolute inset-x-3 bottom-[62px] z-20 flex items-center justify-between rounded-2xl px-3 py-2 text-[11px]"
      style={{ backgroundColor: NAVY }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      <span className="flex items-center gap-2">
        <span className="size-1.5 rounded-full" style={{ backgroundColor: ORANGE }} />
        #27 · {label}
      </span>
      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: ORANGE }}>
        Track
      </span>
    </motion.div>
  );
}

function TabBar({ screen, cartCount, bump }: { screen: Screen; cartCount: number; bump: boolean }) {
  const tabs = [
    { id: "menu", label: "Home", Icon: House },
    { id: "cart", label: "Cart", Icon: ShoppingBag },
    { id: "orders", label: "Orders", Icon: ReceiptText },
    { id: "profile", label: "Profile", Icon: User },
  ];
  const activeId = screen === "menu" ? "menu" : screen === "cart" ? "cart" : "orders";
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex h-[58px] items-start justify-around border-t border-white/[0.06] bg-[#0a0e1c]/95 px-2 pt-2">
      {tabs.map(({ id, label, Icon }) => (
        <span
          key={id}
          className={cn("relative flex flex-col items-center gap-0.5 text-[9px]", activeId === id ? "text-white" : "text-white/40")}
        >
          <Icon className="size-4" style={activeId === id ? { color: ORANGE } : undefined} />
          {label}
          {id === "cart" && (
            <motion.span
              key={cartCount}
              className="absolute -right-2 -top-1 grid size-3.5 place-items-center rounded-full text-[8px] font-bold text-white"
              style={{ backgroundColor: ORANGE }}
              initial={bump ? { scale: 0.4 } : false}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 14, delay: bump ? 0.8 : 0 }}
            >
              {cartCount}
            </motion.span>
          )}
        </span>
      ))}
    </div>
  );
}

function DishArt({ from, to }: { from: string; to: string }) {
  return (
    <span
      className="relative size-11 shrink-0 overflow-hidden rounded-xl"
      style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
    >
      <span className="absolute -right-2 -top-2 size-7 rounded-full bg-white/25 blur-[6px]" />
      <span className="absolute bottom-1.5 left-1.5 size-4 rounded-full bg-black/15" />
    </span>
  );
}

/** The QueueLess mark: a hexagonal Q in mauve on plum. */
function QMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#3e3148" />
      <path d="M16 6.5 24.2 11.25v9.5L16 25.5l-8.2-4.75v-9.5Z" fill="none" stroke="#8c7b87" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M16 13.2 18.4 14.6v2.8L16 18.8l-2.4-1.4v-2.8Z" fill="#8c7b87" />
      <path d="m19.5 19.5 4.2 4.2" stroke="#8c7b87" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
