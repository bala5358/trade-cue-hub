import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = (plan: typeof plans[0]) => {
    if (!isAuthenticated) {
      // Store selected plan in sessionStorage before redirecting to auth
      sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
      navigate('/auth');
    } else {
      // User is already logged in, go directly to payment
      navigate(`/payment?plan=${encodeURIComponent(plan.name)}&market=${encodeURIComponent(plan.market)}`);
    }
  };

  const plans = [
    {
      name: "Basic",
      market: "India",
      price: "₹999",
      period: "month",
      description: "Start receiving equity buy/sell signals for Indian markets",
      features: [
        "Real-time NSE & BSE signal notifications",
        "Up to 50 buy/sell signals per month",
        "Basic technical analysis insights",
        "Email & SMS signal alerts",
        "Mobile app access",
      ],
    },
    {
      name: "Pro",
      market: "India",
      price: "₹2,499",
      period: "month",
      description: "Premium buy/sell signals for serious equity traders in Indian markets",
      features: [
        "Unlimited NSE & BSE buy/sell signals",
        "Advanced technical analysis insights",
        "Real-time push signal notifications",
        "Portfolio tracking suggestions",
        "Priority support",
        "Custom stock watchlists",
      ],
      popular: true,
    },
    {
      name: "Basic",
      market: "US",
      price: "$29",
      period: "month",
      description: "Receive expert buy/sell signals for US equity markets",
      features: [
        "Real-time NYSE & NASDAQ signal alerts",
        "Up to 50 buy/sell signals per month",
        "Basic market analysis insights",
        "Email & SMS signal alerts",
        "Mobile app access",
      ],
    },
    {
      name: "Pro",
      market: "US",
      price: "$79",
      period: "month",
      description: "Comprehensive buy/sell signal service for US equity markets",
      features: [
        "Unlimited US market buy/sell signals",
        "Advanced AI-powered signal analysis",
        "After-hours trading signal alerts",
        "Multi-asset signal tracking",
        "Dedicated support",
        "Custom signal strategies",
      ],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your trading needs. Start with our basic plan
            and upgrade as you grow.
          </p>
        </div>

        {/* India Plans */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-2xl font-bold">India Market Plans</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans
              .filter((plan) => plan.market === "India")
              .map((plan, index) => (
                <Card
                  key={index}
                  className={`p-8 shadow-card hover:shadow-elevated transition-all ${
                    plan.popular
                      ? "border-2 border-primary relative"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {plan.description}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>

                    <Button
                      variant={plan.popular ? "hero" : "outline"}
                      className="w-full"
                      size="lg"
                      onClick={() => handleGetStarted(plan)}
                    >
                      Get Started
                    </Button>

                    <div className="space-y-3 pt-6 border-t border-border">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="rounded-full bg-success/10 p-1 mt-0.5">
                            <Check className="h-4 w-4 text-success" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* US Plans */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-2xl font-bold">US Market Plans</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans
              .filter((plan) => plan.market === "US")
              .map((plan, index) => (
                <Card
                  key={index}
                  className={`p-8 shadow-card hover:shadow-elevated transition-all ${
                    plan.popular
                      ? "border-2 border-primary relative"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {plan.description}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>

                    <Button
                      variant={plan.popular ? "hero" : "outline"}
                      className="w-full"
                      size="lg"
                      onClick={() => handleGetStarted(plan)}
                    >
                      Get Started
                    </Button>

                    <div className="space-y-3 pt-6 border-t border-border">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="rounded-full bg-success/10 p-1 mt-0.5">
                            <Check className="h-4 w-4 text-success" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* FAQ Note */}
        <div className="mt-16 text-center">
          <Card className="p-8 max-w-3xl mx-auto shadow-card">
            <h3 className="text-xl font-bold mb-4">Need Both Markets?</h3>
            <p className="text-muted-foreground mb-4">
              Get 20% off when you subscribe to both India and US market plans.
              Contact our support team to customize your perfect trading package.
            </p>
            <Button 
              variant="hero"
              onClick={() => window.location.href = 'mailto:sales@example.com?subject=Custom Trading Package Inquiry'}
            >
              Contact Sales
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
