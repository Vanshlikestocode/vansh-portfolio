import { Hero } from "@/components/hero/Hero";
import { Lab } from "@/components/lab/Lab";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { CurrentlyBuilding } from "@/components/sections/CurrentlyBuilding";
import { GitHub } from "@/components/sections/GitHub";
import { HowIBuild } from "@/components/sections/HowIBuild";
import { Intro } from "@/components/sections/Intro";
import { Journey } from "@/components/sections/Journey";
import { Stack } from "@/components/sections/Stack";
import { Work } from "@/components/sections/Work";

// GitHub data is re-fetched at most once a day.
export const revalidate = 86400;

/*
 * The page is ordered as a story:
 * who is this → I build things → what has he built → how does he build →
 * with what → how did he get here → what's happening now → the workshop →
 * the person → contact.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Work />
      <HowIBuild />
      <Stack />
      <Journey />
      <GitHub />
      <CurrentlyBuilding />
      <Lab />
      <About />
      <Contact />
    </>
  );
}
