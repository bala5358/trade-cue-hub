import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Bell, TrendingUp, Zap, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

const Landing = () => {
  const features = [
    {
      icon: Bell,
      title: "Real-Time Signal Alerts",
      description: "Get instant buy/sell signal notifications for equities in India and US markets",
    },
    {
      icon: TrendingUp,
      title: "Smart Trading Signals",
      description: "AI-powered buy and sell signals to inform your trading decisions",
    },
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description: "Receive trading signal notifications within seconds of opportunities",
    },
    {
      icon: Shield,
      title: "Reliable Signals",
      description: "Accurate buy/sell recommendations to support your financial wellness",
    },
    {
      icon: Globe,
      title: "India & US Markets",
      description: "Comprehensive equity signal coverage across two major markets",
    },
  ];

  return (
    <>
      <SEO
        title="Home"
        description="Super Pi - Your complete financial wellness platform. Get expert equity trading signals for India and US markets with AI-powered buy and sell recommendations."
        keywords="financial wellness, equity trading, stock signals, trading signals, India stock market, US stock market"
      />
      <div className="min-h-screen" role="main">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20 md:py-32" aria-label="Hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" aria-hidden="true" />
                Expert Trading Signals
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Your Complete{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Financial Wellness
                </span>{" "}
                Journey
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Super Pi is your all-in-one financial wellness platform. Start with expert equity 
                trading signals for India and US markets, with more services launching soon.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/services">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto" aria-label="Explore our services">
                    Explore Services
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" aria-label="View pricing plans">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32" aria-label="Features">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Live Now: Equity Trading Signals
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started with our flagship service - expert buy/sell signal recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 shadow-card hover:shadow-elevated transition-all">
                <div className="rounded-lg bg-gradient-primary p-3 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Start Your Financial Wellness Journey Today
            </h2>
            <p className="text-lg text-muted-foreground">
              Begin with equity trading signals, with comprehensive financial wellness services coming soon
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services">
                <Button variant="hero" size="lg">
                  View All Services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  See Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Landing;
