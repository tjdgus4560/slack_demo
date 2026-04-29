import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | Monorepo Slack",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--linear-bg)] px-4 py-8">
      <SignIn
        fallbackRedirectUrl="/"
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />
    </main>
  );
}
