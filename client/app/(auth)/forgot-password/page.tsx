"use client";

import { useState } from 'react';
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthAPI.forgotPassword(email);
      
      if (response.success) {
        toast.success('Password reset OTP sent to your email');
        setStep('reset');
      } else {
        toast.error(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthAPI.resetPassword(email, otp, newPassword);
      
      if (response.success) {
        toast.success('Password reset successful! Please sign in');
        router.push('/sign-in');
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      toast.error(error.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await AuthAPI.forgotPassword(email);
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
            {step === 'request' ? 'Reset Password' : 'Create New Password'}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'request' 
              ? 'Enter your email to receive a reset code' 
              : 'Enter the code and your new password'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'request' ? 'Forgot Password' : 'Reset Password'}
            </CardTitle>
            <CardDescription>
              {step === 'request' 
                ? 'We\'ll send you a verification code' 
                : `Code sent to ${email}`}
            </CardDescription>
          </CardHeader>

          {step === 'request' ? (
            <form onSubmit={handleRequestReset}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </Button>

                <Link 
                  href="/sign-in" 
                  className="text-sm text-center text-shop_dark_green hover:underline font-semibold"
                >
                  Back to Sign In
                </Link>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendOTP}
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
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setStep('request');
                    setOtp('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  Back
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </Container>
    </div>
  );
}
