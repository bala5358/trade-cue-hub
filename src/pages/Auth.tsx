import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { msalInstance } from "@/lib/msalInstance";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      // Complete redirect flow if returning from Azure B2C
      const result = await msalInstance.handleRedirectPromise();
      if (result) {
        sessionStorage.setItem("id_token", result.idToken);
        sessionStorage.setItem("user", JSON.stringify(result.account));
        navigate("/dashboard");
      }
    };
    handleRedirect();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await msalInstance.loginRedirect();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    const account = msalInstance.getActiveAccount();
    await msalInstance.logoutRedirect({ account });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to Super Pi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <Button onClick={handleLogin} className="w-full">
            Sign in / Sign up with Azure B2C
          </Button>
          <Button variant="outline" onClick={handleLogout} className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
