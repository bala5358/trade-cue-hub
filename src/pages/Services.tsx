import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  PiggyBank, 
  Shield, 
  GraduationCap, 
  Calculator,
  Wallet,
  LineChart,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: TrendingUp,
      title: "Equity Trading Signals",
      description: "Get real-time buy and sell signal notifications for India and US equity markets",
      features: [
        "Real-time NSE, BSE, NYSE & NASDAQ signals",
        "AI-powered technical analysis",
        "Entry, target & stop-loss recommendations",
        "Mobile push notifications",
      ],
      status: "active",
      link: "/dashboard",
    },
    {
      icon: LineChart,
      title: "Portfolio Management",
      description: "Track and optimize your investment portfolio across multiple asset classes",
      features: [
        "Real-time portfolio tracking",
        "Performance analytics",
        "Asset allocation suggestions",
        "Risk assessment tools",
      ],
      status: "coming-soon",
    },
    {
      icon: PiggyBank,
      title: "Savings & Investment Planning",
      description: "Personalized savings strategies and investment planning for your financial goals",
      features: [
        "Goal-based investment planning",
        "SIP calculator and recommendations",
        "Emergency fund planning",
        "Retirement corpus estimation",
      ],
      status: "coming-soon",
    },
    {
      icon: Shield,
      title: "Insurance Advisory",
      description: "Comprehensive insurance coverage analysis and recommendations",
      features: [
        "Life insurance needs analysis",
        "Health insurance optimization",
        "Term plan comparisons",
        "Coverage gap identification",
      ],
      status: "coming-soon",
    },
    {
      icon: Calculator,
      title: "Tax Optimization",
      description: "Smart tax planning strategies to maximize your savings",
      features: [
        "Tax-saving investment suggestions",
        "Deduction optimization",
        "Tax regime comparison",
        "Year-round tax planning",
      ],
      status: "coming-soon",
    },
    {
      icon: Wallet,
      title: "Expense Management",
      description: "Track spending, create budgets, and improve your financial health",
      features: [
        "Automated expense tracking",
        "Budget creation & monitoring",
        "Spending pattern analysis",
        "Financial health score",
      ],
      status: "coming-soon",
    },
    {
      icon: GraduationCap,
      title: "Financial Education",
      description: "Learn investing, trading, and personal finance through curated content",
      features: [
        "Expert-led video courses",
        "Market analysis articles",
        "Trading strategy guides",
        "Live webinars & Q&A",
      ],
      status: "coming-soon",
    },
    {
      icon: FileText,
      title: "Loan & Debt Management",
      description: "Optimize your loans and create debt-free strategies",
      features: [
        "EMI optimization suggestions",
        "Debt consolidation planning",
        "Loan comparison tools",
        "Prepayment strategies",
      ],
      status: "coming-soon",
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">
            Complete{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Financial Wellness
            </span>{" "}
            Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Super Pi offers a comprehensive suite of services to support every aspect of your 
            financial wellness journey - from trading signals to retirement planning.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`p-8 shadow-card hover:shadow-elevated transition-all ${
                service.status === "active" 
                  ? "border-2 border-primary" 
                  : "border border-border"
              }`}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 ${
                    service.status === "active" 
                      ? "bg-gradient-primary" 
                      : "bg-muted"
                  }`}>
                    <service.icon className={`h-6 w-6 ${
                      service.status === "active" 
                        ? "text-primary-foreground" 
                        : "text-muted-foreground"
                    }`} />
                  </div>
                  <Badge 
                    variant={service.status === "active" ? "default" : "secondary"}
                    className={service.status === "active" ? "bg-success" : ""}
                  >
                    {service.status === "active" ? "Live Now" : "Coming Soon"}
                  </Badge>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {service.status === "active" ? (
                  <Link to={service.link || "#"}>
                    <Button variant="hero" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Notify Me When Available
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <Card className="p-8 max-w-3xl mx-auto shadow-card bg-gradient-hero">
            <h3 className="text-2xl font-bold mb-4">
              Building Your Complete Financial Wellness Ecosystem
            </h3>
            <p className="text-muted-foreground mb-6">
              Start with our live equity trading signals today, and get early access to 
              upcoming services as we expand our financial wellness platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button variant="hero" size="lg">
                  View Pricing
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Try Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Services;
