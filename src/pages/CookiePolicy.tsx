import { Card } from '@/components/ui/card';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">What Are Cookies</h2>
            <p className="text-muted-foreground">
              Cookies are small text files that are placed on your device when you visit our website. They are 
              widely used to make websites work more efficiently and provide information to website owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How We Use Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              Our cookies fall into the following categories:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Necessary Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies are essential for the website to function properly. They enable core functionality 
                  such as security, network management, and accessibility. You cannot opt-out of these cookies.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Analytics Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies help us understand how visitors interact with our website by collecting and reporting 
                  information anonymously. This helps us improve our website's functionality and user experience.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Marketing Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies are used to track visitors across websites. The intention is to display ads that are 
                  relevant and engaging for individual users, making them more valuable for publishers and advertisers.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Managing Your Cookie Preferences</h2>
            <p className="text-muted-foreground mb-2">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie 
              preferences by:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Using the cookie consent banner that appears when you first visit our website</li>
              <li>Adjusting your browser settings to refuse all or some cookies</li>
              <li>Visiting our cookie preference center</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Please note that if you choose to reject cookies, you may still use our website, but your access to 
              some functionality and areas may be restricted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Cookies</h2>
            <p className="text-muted-foreground">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics 
              of the website and deliver advertisements on and through the website. These third parties have their 
              own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Consent</h2>
            <p className="text-muted-foreground">
              By using our website, you consent to our use of cookies in accordance with this Cookie Policy. You can 
              withdraw your consent at any time by adjusting your cookie preferences or clearing your browser cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Updates to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or 
              our business operations. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about our use of cookies, please contact us at privacy@superpi.com
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

export default CookiePolicy;
