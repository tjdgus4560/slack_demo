"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[var(--linear-bg)] px-6 text-zinc-100">
        <section className="w-full max-w-sm rounded-md border border-white/10 bg-[var(--linear-panel)] p-5 text-center">
          <h1 className="text-sm font-semibold text-zinc-100">
            Convex 설정이 필요합니다
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            NEXT_PUBLIC_CONVEX_URL을 설정한 뒤 Next.js 개발 서버를 다시
            시작해 주세요.
          </p>
        </section>
      </main>
    );
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
