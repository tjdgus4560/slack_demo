import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 | Monorepo Slack",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--linear-bg)] px-4 py-8">
      <SignUp
        fallbackRedirectUrl="/"
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </main>
  );
}
