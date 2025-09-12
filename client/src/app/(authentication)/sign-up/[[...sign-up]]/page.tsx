import React from "react";
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
import SignUpForm from "@/components/sign-up-form";

const SignUpPage = () => {
  return (
    <Card className="w-full max-w-lg mx-8">
      <CardHeader className="text-center">
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Sign up to get started</CardDescription>
      </CardHeader>

      <CardContent>
        <SignUpForm />
      </CardContent>

      <Separator />

      <CardFooter className="justify-center">
        <CardDescription>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default SignUpPage;
