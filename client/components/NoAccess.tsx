"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { AuthModal } from "./AuthModal";

const NoAccess = ({
  details = "Log in to view your cart items and checkout. Don't miss out on your favorite products!",
}: {
  details?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleSwitchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <>
      <div className="flex items-center justify-center py-12 md:py-32 bg-gray-100 p-4">
        <Card className="w-full max-w-md p-5">
          <CardHeader className="flex items-center flex-col">
            <Logo />
            <CardTitle className="text-2xl font-bold text-center">
              Welcome Back!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center font-medium text-darkColor/80">{details}</p>
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                setMode('signin');
                setIsOpen(true);
              }}
            >
              Sign in
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              Don&rsquo;t have an account?
            </div>
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => {
                setMode('signup');
                setIsOpen(true);
              }}
            >
              Create an account
            </Button>
          </CardFooter>
        </Card>
      </div>
      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={mode}
        onSwitchMode={handleSwitchMode}
      />
    </>
  );
};

export default NoAccess;
