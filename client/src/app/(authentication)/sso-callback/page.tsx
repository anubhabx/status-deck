"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import UILoader from "@/components/loader";

const SSOCallbackPage = () => {
  return (
    <>
      <AuthenticateWithRedirectCallback />
      <UILoader />
    </>
  );
};

export default SSOCallbackPage;
