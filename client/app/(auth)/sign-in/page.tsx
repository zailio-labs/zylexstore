"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthAPI from '@/lib/api/auth';
import toast from 'react-hot-toast';
import Logo from '@/components/Logo';
import Container from '@/components/Container';

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Password login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP login state
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (AuthAPI.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthAPI.login({ email, password });
      
      if (response.success) {
        toast.success('Welcome back!');
        router.push('/');
        router.refresh();
      } else {
        toast.error(response.message || 'Invalid email or password');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthAPI.sendOTP(otpEmail, 'login');
      
      if (response.success) {
        toast.success('OTP sent to your email');
        setOtpSent(true);
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthAPI.verifyOTP({
        email: otpEmail,
        otp,
        type: 'login',
      });

      if (response.success) {
        toast.success('Login successful!');
        router.push('/');
        router.refresh();
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Container className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <Logo className="text-3xl mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-6">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <form onSubmit={handlePasswordLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link 
                        href="/forgot-password" 
                        className="text-sm text-shop_dark_green hover:underline"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  <p className="text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/sign-up" className="text-shop_dark_green hover:underline font-semibold">
                      Sign Up
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="otp">
              {!otpSent ? (
                <form onSubmit={handleSendOTP}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp-email">Email</Label>
                      <Input
                        id="otp-email"
                        type="email"
                        placeholder="john@example.com"
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      We'll send a 6-digit verification code to your email
                    </p>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send OTP'}
                    </Button>

                    <p className="text-sm text-center text-gray-600">
                      Don't have an account?{' '}
                      <Link href="/sign-up" className="text-shop_dark_green hover:underline font-semibold">
                        Sign Up
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              ) : (
                <form onSubmit={handleOTPLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp-code">Verification Code</Label>
                      <Input
                        id="otp-code"
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        maxLength={6}
                        className="text-center text-2xl tracking-[0.5em] font-bold"
                      />
                      <p className="text-xs text-gray-500 text-center">
                        Code sent to {otpEmail}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Didn't receive it?{' '}
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          className="text-shop_dark_green hover:underline font-semibold"
                        >
                          Resend
                        </button>
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? 'Verifying...' : 'Sign In'}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                      }}
                    >
                      Back
                    </Button>
                  </CardFooter>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </Container>
    </div>
  );
}
