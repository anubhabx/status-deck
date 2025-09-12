import React from "react";

import SignInForm from "@/components/sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const SignInPage = () => {
  return (
    <>
      <Card className="w-full max-w-lg mx-8 text-center">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <SignInForm />
        </CardContent>

        <Separator />

        <CardFooter>
          <CardDescription className="w-full">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-primary">
              Sign Up
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </>
  );
};

export default SignInPage;
