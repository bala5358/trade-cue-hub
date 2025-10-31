import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const planName = searchParams.get('plan');
  const market = searchParams.get('market');
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRisks, setAgreedToRisks] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Redirect if no plan selected
  useEffect(() => {
    if (!planName || !market) {
      navigate('/pricing');
    }
  }, [planName, market, navigate]);

  const getPlanDetails = () => {
    const plans: Record<string, { price: string; features: string[] }> = {
      'India-Basic': {
        price: '₹999/month',
        features: [
          'Real-time NSE & BSE signal notifications',
          'Up to 50 buy/sell signals per month',
          'Basic technical analysis insights',
          'Email & SMS signal alerts',
          'Mobile app access',
        ],
      },
      'India-Pro': {
        price: '₹2,499/month',
        features: [
          'Unlimited NSE & BSE buy/sell signals',
          'Advanced technical analysis insights',
          'Real-time push signal notifications',
          'Portfolio tracking suggestions',
          'Priority support',
          'Custom stock watchlists',
        ],
      },
      'US-Basic': {
        price: '$29/month',
        features: [
          'Real-time NYSE & NASDAQ signal alerts',
          'Up to 50 buy/sell signals per month',
          'Basic market analysis insights',
          'Email & SMS signal alerts',
          'Mobile app access',
        ],
      },
      'US-Pro': {
        price: '$79/month',
        features: [
          'Unlimited US market buy/sell signals',
          'Advanced AI-powered signal analysis',
          'After-hours trading signal alerts',
          'Multi-asset signal tracking',
          'Dedicated support',
          'Custom signal strategies',
        ],
      },
    };

    return plans[`${market}-${planName}`] || { price: 'N/A', features: [] };
  };

  const handlePayment = async () => {
    if (!agreedToTerms || !agreedToRisks) {
      toast({
        title: 'Agreement Required',
        description: 'Please agree to all terms and conditions before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    // TODO: Integrate with Azure backend payment gateway
    // Placeholder for future implementation
    setTimeout(() => {
      toast({
        title: 'Payment Processing',
        description: 'Payment gateway integration pending. This is a placeholder.',
      });
      setIsProcessing(false);
      // navigate('/dashboard');
    }, 2000);
  };

  const planDetails = getPlanDetails();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/pricing')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pricing
        </Button>

        <h1 className="text-4xl font-bold mb-2">Complete Your Subscription</h1>
        <p className="text-muted-foreground mb-8">
          {market} Market - {planName} Plan
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-semibold">{planName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Market</p>
                  <p className="font-semibold">{market}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{planDetails.price}</p>
                </div>
                <ul className="space-y-2 pt-4 border-t text-sm">
                  {planDetails.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* Legal & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Risk Disclaimer */}
            <Alert className="border-warning bg-warning/5">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <AlertDescription className="ml-2">
                <h3 className="font-semibold mb-2">Investment Risk Disclosure</h3>
                <p className="text-sm text-muted-foreground">
                  Trading in financial markets involves substantial risk of loss and is not suitable for all investors. 
                  Past performance is not indicative of future results. The signals provided are for informational purposes 
                  only and should not be considered as financial advice. You should carefully consider your financial 
                  situation and consult with a licensed financial advisor before making any investment decisions.
                </p>
              </AlertDescription>
            </Alert>

            {/* Terms and Conditions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Legal Agreement</h2>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto p-4 bg-muted/30 rounded-lg">
                <section className="space-y-2">
                  <h3 className="font-semibold">1. Service Description</h3>
                  <p className="text-sm text-muted-foreground">
                    SUPER Pi provides market signals and notifications as an informational service. We do not provide 
                    personalized investment advice or recommendations tailored to your specific financial situation.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-semibold">2. No Financial Advice</h3>
                  <p className="text-sm text-muted-foreground">
                    All information provided is for educational and informational purposes only. SUPER Pi is not a 
                    registered investment advisor, broker-dealer, or financial planner. You should not construe any 
                    information provided as investment advice.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-semibold">3. Risk Acknowledgment</h3>
                  <p className="text-sm text-muted-foreground">
                    You acknowledge that trading involves substantial risk of loss. You may lose all or more than your 
                    initial investment. Do not invest money you cannot afford to lose. Before trading, you should carefully 
                    consider your investment objectives, level of experience, and risk tolerance.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-semibold">4. No Guarantees</h3>
                  <p className="text-sm text-muted-foreground">
                    Past performance does not guarantee future results. SUPER Pi makes no representations or warranties 
                    regarding the accuracy, completeness, or timeliness of the information provided. Market conditions 
                    can change rapidly and without warning.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-semibold">5. Regulatory Compliance</h3>
                  <p className="text-sm text-muted-foreground">
                    You are solely responsible for ensuring compliance with all applicable laws and regulations in your 
                    jurisdiction. Different countries have different rules regarding trading and investment services. 
                    It is your responsibility to verify that you are legally permitted to use our services.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-semibold">6. Subscription Terms</h3>
                  <p className="text-sm text-muted-foreground">
                    Your subscription will automatically renew each month unless cancelled. You may cancel at any time 
                    through your account settings. No refunds are provided for partial months. By subscribing, you agree 
                    to our full <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                    <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-semibold">7. Limitation of Liability</h3>
                  <p className="text-sm text-muted-foreground">
                    SUPER Pi, its officers, directors, employees, and affiliates shall not be liable for any losses or 
                    damages arising from your use of our services, including but not limited to trading losses, lost 
                    profits, or consequential damages. Our maximum liability is limited to the subscription fees you 
                    have paid in the past 12 months.
                  </p>
                </section>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I have read and agree to the{' '}
                    <Link to="/terms-of-service" className="text-primary hover:underline">
                      Terms of Service
                    </Link>
                    {', '}
                    <Link to="/privacy-policy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    {', and '}
                    <Link to="/cookie-policy" className="text-primary hover:underline">
                      Cookie Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="risks"
                    checked={agreedToRisks}
                    onCheckedChange={(checked) => setAgreedToRisks(checked as boolean)}
                  />
                  <Label htmlFor="risks" className="text-sm leading-relaxed cursor-pointer">
                    I acknowledge the investment risks and understand that SUPER Pi does not provide financial advice. 
                    I understand that trading can result in significant financial losses and I should consult with a 
                    licensed financial advisor before making investment decisions.
                  </Label>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={!agreedToTerms || !agreedToRisks || isProcessing}
                className="w-full mt-6"
                size="lg"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Secure payment processing. Your information is protected.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
