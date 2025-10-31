import { Card } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using SUPER Pi's services, you accept and agree to be bound by the terms 
              and provisions of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground">
              SUPER Pi provides financial market signals and notifications to help users make informed 
              trading decisions. Our service includes real-time alerts, historical data, and analytical tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. User Obligations</h2>
            <p className="text-muted-foreground mb-2">As a user of our service, you agree to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Use the service only for lawful purposes</li>
              <li>Not share your account with others</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Financial Disclaimer</h2>
            <p className="text-muted-foreground">
              The information provided by SUPER Pi is for informational purposes only and should not be 
              considered financial advice. Trading involves substantial risk of loss. Past performance does 
              not guarantee future results. You should consult with a licensed financial advisor before 
              making any investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Subscription and Payment</h2>
            <p className="text-muted-foreground">
              Certain features of our service require a paid subscription. You agree to pay all fees 
              associated with your chosen subscription plan. Subscriptions automatically renew unless 
              cancelled before the renewal date. Refunds are provided in accordance with our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, features, and functionality of SUPER Pi, including but not limited to text, 
              graphics, logos, and software, are the exclusive property of SUPER Pi and are protected 
              by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              SUPER Pi shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages resulting from your use of or inability to use the service. Our total 
              liability shall not exceed the amount paid by you for the service in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Service Modifications</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify, suspend, or discontinue any aspect of our service at any 
              time without prior notice. We may also update these terms periodically, and continued use 
              of the service constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to terminate or suspend your account and access to the service at our 
              sole discretion, without notice, for conduct that we believe violates these terms or is 
              harmful to other users, us, or third parties, or for any other reason.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which SUPER Pi operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at legal@superpi.com
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
