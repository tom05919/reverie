"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupCompany, setSignupCompany] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (loginEmail === "demo@reverie.ai" && loginPassword === "password") {
      localStorage.setItem("reverie_auth", "true");
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Try demo@reverie.ai / password");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signupCompany || !signupEmail || !signupPassword) {
      setError("All fields are required.");
      return;
    }

    localStorage.setItem("reverie_auth", "true");
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-violet-500/8 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
            <span className="text-sm font-bold text-white">R</span>
          </div>
          <span className="text-xl font-semibold tracking-tight font-martian-mono">
            Reverie
          </span>
        </div>

        <Card className="border-border/50">
          <Tabs defaultValue="login">
            <CardHeader className="pb-4">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">
                  Log In
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex-1">
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}

              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="login-email">
                      Email
                    </label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="demo@reverie.ai"
                      className="bg-background border-border/50"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="login-password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="bg-background border-border/50 pr-10"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white"
                  >
                    Log In
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Demo credentials: demo@reverie.ai / password
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="signup-company"
                    >
                      Company Name
                    </label>
                    <Input
                      id="signup-company"
                      type="text"
                      placeholder="Your company name"
                      className="bg-background border-border/50"
                      value={signupCompany}
                      onChange={(e) => setSignupCompany(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="signup-email"
                    >
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@company.com"
                      className="bg-background border-border/50"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="signup-password"
                    >
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      className="bg-background border-border/50"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white"
                  >
                    Create Account
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    By signing up, you agree to Reverie&apos;s terms and privacy
                    policy.
                  </p>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
