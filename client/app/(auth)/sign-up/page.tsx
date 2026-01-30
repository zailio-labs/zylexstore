"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AuthAPI from '@/lib/api/auth';
import toast from 'react-hot-toast';
import Logo from '@/components/Logo';
import Container from '@/components/Container';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (AuthAPI.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthAPI.signup(formData);
      
      if (response.success) {
        toast.success(response.message || 'Account created! Please check your email for OTP');
        setStep('verify');
      } else {
        const errorMessage = response.errors 
          ? response.errors.map((e: any) => e.message).join(', ')
          : response.message || 'Signup failed';
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthAPI.verifyOTP({
        email: formData.email,
        otp,
        type: 'signup',
      });

      if (response.success) {
        toast.success('Email verified successfully! Welcome to ZylexStore');
        router.push('/');
        router.refresh();
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await AuthAPI.sendOTP(formData.email, 'signup');
      if (response.success) {
        toast.success('New OTP sent to your email');
      } else {
        toast.error(response.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Container className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <Logo className="text-3xl mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'signup' ? 'Create your account' : 'Verify your email'}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'signup' 
              ? 'Join ZylexStore and start shopping' 
              : 'Enter the 6-digit code sent to your email'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'signup' ? 'Sign Up' : 'Email Verification'}
            </CardTitle>
            <CardDescription>
              {step === 'signup' 
                ? 'Create your account to get started' 
                : `Code sent to ${formData.email}`}
            </CardDescription>
          </CardHeader>

          {step === 'signup' ? (
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <p className="text-sm text-center text-gray-600">
                  Already have an account?{' '}
                  <Link href="/sign-in" className="text-shop_dark_green hover:underline font-semibold">
                    Sign In
                  </Link>
                </p>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em] font-bold"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Enter the 6-digit code from your email
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-shop_dark_green hover:underline font-semibold"
                    >
                      Resend OTP
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
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setStep('signup');
                    setOtp('');
                  }}
                >
                  Back to Sign Up
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>

        <p className="text-xs text-center text-gray-500 mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </Container>
    </div>
  );
}
