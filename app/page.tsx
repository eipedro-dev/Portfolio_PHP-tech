import { Hero } from "./components/hero/Index";
import { About } from "./components/about/Index";
import { WhyItMatters } from "./components/whyItMatters/Index";
import { Statement } from "./components/statement/Index";

export const metadata = {
  title: "Pedro Henrique",
  description: "Pedro Henrique",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <WhyItMatters />
      <About />
    </>
  );
}
