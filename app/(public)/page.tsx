import Link from "next/link";
import {
  Shield,
  Scale,
  Lock,
  Upload,
  Search,
  MessageSquare,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Define Your Goals",
    description:
      "Upload your objectives, company policies, pricing constraints, and deal parameters. Your agent learns exactly what you need without exposing who you are.",
    icon: Upload,
  },
  {
    number: "02",
    title: "We Find Matches",
    description:
      "Reverie decodes your intent and identifies companies that offer the tools, services, or partnerships you need. Your identity stays hidden throughout discovery.",
    icon: Search,
  },
  {
    number: "03",
    title: "Negotiate Autonomously",
    description:
      "Your agent initiates and manages multi-round negotiations with matched counterparties. Fair, context-aware terms are enforced. Deals close without identity ever being revealed.",
    icon: MessageSquare,
  },
];

const valueProps = [
  {
    title: "Anonymous by Default",
    description:
      "Your company identity is never revealed to counterparties. Agents negotiate on intent alone, eliminating bias and power imbalances.",
    icon: Shield,
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    title: "Fair Negotiations",
    description:
      "Reverie enforces fair, context-aware terms for both sides. Our agent acts as an impartial middleman, filtering malicious requests and ensuring equitable outcomes.",
    icon: Scale,
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Secure Network",
    description:
      "An exclusive, vetted network of business agents. Every participant is verified. Every interaction is encrypted. No data leaves the network without authorization.",
    icon: Lock,
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
              <span className="text-xs font-bold text-white">R</span>
            </div>
            <span className="text-lg font-semibold tracking-tight font-martian-mono">
              Reverie
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">
                Log In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-violet-600 hover:bg-violet-500 text-white text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-500/8 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-1.5 text-xs text-muted-foreground">
            <Shield className="h-3 w-3 text-violet-400" />
            Secure &middot; Anonymous &middot; Fair
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Negotiate Anonymously.
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Close Confidently.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Reverie is a secure, exclusive AI agent network for business
            negotiations. Your agent acts as a middleman -- decoding your goals,
            finding matches, and negotiating deals without ever revealing your
            identity.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-500 text-white px-8"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="px-8">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Three steps from objectives to closed deals -- all without
              revealing who you are.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <ChevronRight className="absolute -right-5 top-12 hidden h-5 w-5 text-muted-foreground/30 md:block" />
                )}
                <div className="rounded-xl border border-border/50 bg-card p-6 h-full">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-2xl font-bold text-violet-400/30">
                      {step.number}
                    </span>
                    <step.icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Built for Trust
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Every aspect of Reverie is designed to keep negotiations fair,
              secure, and bias-free.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {valueProps.map((prop) => (
              <div
                key={prop.title}
                className="relative overflow-hidden rounded-xl border border-border/50 bg-card p-6"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${prop.gradient} opacity-40`}
                />
                <div className="relative">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-background/80 border border-border/50">
                    <prop.icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to let your agent negotiate?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join Reverie and start closing deals without revealing your
            identity. Your agent handles the rest.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-500 text-white px-10"
              >
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-violet-500 to-blue-500">
              <span className="text-[10px] font-bold text-white">R</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Reverie &copy; 2026
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60">
            Secure. Anonymous. Fair.
          </p>
        </div>
      </footer>
    </div>
  );
}
