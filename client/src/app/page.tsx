import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Heart,
  Clock,
  BarChart2,
  AlertTriangle,
  UserPlus,
  PlusCircle,
  Send,
  MessageSquare
} from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";

const Header = () => (
  <header className="p-4 flex justify-between items-center container mx-auto">
    <Link href="/" className="font-bold text-xl tracking-tight">
      StatusDeck
    </Link>
    <nav className="hidden md:flex gap-6 items-center">
      <Link
        href="#features"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Features
      </Link>
      <Link
        href="#how-it-works"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        How It Works
      </Link>
      <Link
        href="#testimonials"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Testimonials
      </Link>
    </nav>
    <div className="flex gap-2 sm:gap-4 items-center">
      <SignedIn>
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Get Started Free</Button>
        </Link>
      </SignedOut>
    </div>
  </header>
);

const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-card p-6 rounded-lg">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const HowItWorksStep = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground max-w-xs">{description}</p>
  </div>
);

const TestimonialCard = ({
  quote,
  avatar,
  name,
  company
}: {
  quote: string;
  avatar: string;
  name: string;
  company: string;
}) => (
  <div className="bg-card p-6 rounded-lg flex flex-col">
    <MessageSquare className="w-8 h-8 text-primary/50 mb-4" />
    <p className="text-muted-foreground mb-4 flex-grow">"{quote}"</p>
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{company}</p>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-muted/50 border-t">
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h3 className="font-bold text-xl mb-2">StatusDeck</h3>
          <p className="text-muted-foreground max-w-md">
            Monitor your websites and APIs in real-time with beautiful
            dashboards and instant alerts.
          </p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} StatusDeck. All rights reserved.
        </p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="#" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-foreground">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="text-center py-20 sm:py-32 px-4">
          <div className="container mx-auto">
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight">
              Never wonder if your site is down again
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Monitor your websites and APIs in real-time. Get instant alerts
              when things go wrong and build trust with your users with
              beautiful, transparent status pages.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="mt-16 px-4">
              <Image
                src="/dashboard.jpeg"
                alt="StatusDeck Dashboard"
                width={1200}
                height={750}
                className="rounded-lg shadow-2xl mx-auto"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-24 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Everything you need to monitor your services
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                From real-time monitoring to beautiful status pages, Status Deck
                has all the tools your team needs to stay on top of your
                infrastructure.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Clock className="w-8 h-8" />}
                title="Real-time Monitoring"
                description="Get instant notifications when your services go down. We support HTTP(S), TCP, and ping checks with sub-minute checks."
              />
              <FeatureCard
                icon={<BarChart2 className="w-8 h-8" />}
                title="Beautiful Dashboards"
                description="Intuitive interface showing all your monitors at a glance. Dig into the details to analyze the uptime patterns."
              />
              <FeatureCard
                icon={<AlertTriangle className="w-8 h-8" />}
                title="Incident History"
                description="Complete timeline of all incidents with detailed logs. Track downtime, root cause, monitor resolution, and resolution details."
              />
              <FeatureCard
                icon={<Heart className="w-8 h-8" />}
                title="Public Status Pages"
                description="Build trust with beautiful public status pages with your branding. Keep everyone informed during incidents automatically."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-8 h-8" />}
                title="Secure & Private"
                description="Your data is safe, everything is encrypted. Role-based access control and secure authentication with Clerk."
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8" />}
                title="Fully Open Source"
                description="Built with transparency with open source code. Self-hostable and a great service, community-driven development."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 sm:py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Get started monitoring your services in just three simple steps.
                No complex setup or lengthy configuration required.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-start">
              <HowItWorksStep
                icon={<UserPlus className="w-8 h-8" />}
                title="Sign Up"
                description="Create your account in seconds with secure Clerk authentication. No credit card required to get started."
              />
              <HowItWorksStep
                icon={<PlusCircle className="w-8 h-8" />}
                title="Add Monitors"
                description="Add your websites or API endpoints to monitor. Configure check intervals and customize alert settings."
              />
              <HowItWorksStep
                icon={<Send className="w-8 h-8" />}
                title="Get Alerts"
                description="Receive instant alerts via email, SMS, or webhooks when issues are detected. Share status with your team."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 sm:py-24 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Trusted by developers worldwide
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Status Deck is used by startups and Fortune 500 companies to
                monitor their critical services.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="Status Deck has been a game-changer for our team. We can finally sleep at night knowing we'll be alerted the second something hits our infrastructure."
                name="Sarah Chen"
                company="Lead Engineer, Innovate Inc."
                avatar="https://randomuser.me/api/portraits/women/68.jpg"
              />
              <TestimonialCard
                quote="The public status pages are exactly what we needed to improve transparency with our customers. And it's so easy to set up and customize."
                name="Marcus Rodrigues"
                company="CTO, DevSolutions"
                avatar="https://randomuser.me/api/portraits/men/32.jpg"
              />
              <TestimonialCard
                quote="Finally, a monitoring tool that developers actually enjoy using. The interface is clean, the alerts are fast, and the feature set is perfect for our needs."
                name="Emily Watson"
                company="SRE Manager, CloudSphere"
                avatar="https://randomuser.me/api/portraits/women/44.jpg"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-24 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Start monitoring your services today
            </h2>
            <p className="text-muted-foreground mt-2 mb-8 max-w-2xl mx-auto">
              Join hundreds of companies that trust StatusDeck to keep their
              services running smoothly. Get started for free, no credit card
              required.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
