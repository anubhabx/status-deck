"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { useSignUp } from "@clerk/nextjs";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const SignUpFormSchema = z.object({
  email: z.string().min(2, { message: "Email is required" }).email(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().optional(),
  code: z.string().length(6, { message: "Code must be 6 digits" }).optional()
});

type SignUpStep = "form" | "verification";

const SignUpForm = () => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("form");
  const [loading, setLoading] = useState(false);
  const { isLoaded, setActive, signUp } = useSignUp();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      code: ""
    }
  });

  const handleEmailSubmit = async (data: z.infer<typeof SignUpFormSchema>) => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      await signUp.create({
        emailAddress: data.email,
        firstName: data.firstName,
        lastName: data.lastName
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code"
      });

      setCurrentStep("verification");
      toast.success("Verification code sent to your email");
    } catch (error: any) {
      console.error("Error during sign-up:", error);
      toast.error(error.errors?.[0]?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (data: z.infer<typeof SignUpFormSchema>) => {
    if (!isLoaded || !data.code) return;

    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error during verification:", error);
      toast.error(error.errors?.[0]?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof SignUpFormSchema>) => {
    if (currentStep === "verification") {
      await handleVerificationSubmit(data);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {currentStep === "form" && (
        <>
          <OAuthButtons />
          <div className="flex items-center w-full gap-2">
            <hr className="flex-1" />
            <span className="text-sm text-muted-foreground">
              or continue with
            </span>
            <hr className="flex-1" />
          </div>
        </>
      )}

      {currentStep === "verification" && (
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            A 6-digit verification code has been sent to:
          </p>
          <p className="font-medium">{form.getValues("email")}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {currentStep === "form" && (
            <EmailForm
              form={form}
              onEmailFormSubmit={handleEmailSubmit}
              loading={loading}
            />
          )}
          {currentStep === "verification" && (
            <CodeForm form={form} loading={loading} />
          )}
        </form>
      </Form>
    </div>
  );
};

const EmailForm = ({
  form,
  onEmailFormSubmit,
  loading
}: {
  form: UseFormReturn<z.infer<typeof SignUpFormSchema>>;
  onEmailFormSubmit: (data: z.infer<typeof SignUpFormSchema>) => void;
  loading: boolean;
}) => {
  const watchedFields = form.watch(["email", "firstName"]);
  const [email, firstName] = watchedFields;
  const isDisabled = !email?.trim() || !firstName?.trim() || loading;

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEmailFormSubmit(form.getValues());
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Email" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        type="button"
        onClick={handleSubmit}
        variant="secondary"
        disabled={isDisabled}
        className="w-full"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Continue
      </Button>
    </div>
  );
};

const CodeForm = ({
  form,
  loading
}: {
  form: UseFormReturn<z.infer<typeof SignUpFormSchema>>;
  loading: boolean;
}) => {
  const code = form.watch("code");
  const isDisabled = !code?.trim() || loading;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input 
                placeholder="6-digit code" 
                {...field}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" disabled={isDisabled} className="w-full">
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Verify & Create Account
      </Button>
    </div>
  );
};

const OAuthButtons = () => {
  const { signUp } = useSignUp();

  const handleOAuth = async (strategy: "oauth_google" | "oauth_github") => {
    if (!signUp) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard"
      });
    } catch (error: any) {
      console.error("OAuth error:", error);
      toast.error(error.errors?.[0]?.message || "Something went wrong with OAuth.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        type="button"
        onClick={() => handleOAuth("oauth_google")}
      >
        <FaGoogle className="w-4 h-4 mr-2" />
        Google
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => handleOAuth("oauth_github")}
      >
        <FaGithub className="w-4 h-4 mr-2" />
        GitHub
      </Button>
    </div>
  );
};

export default SignUpForm;
