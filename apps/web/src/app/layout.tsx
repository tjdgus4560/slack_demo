import type { Metadata } from "next";
import { koKR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { ClerkKoreanDomPatch } from "./clerk-korean-dom-patch";
import { ConvexClientProvider } from "./convex-client-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monorepo Slack",
  description:
    "Clerk와 Convex Cloud로 동작하는 Monorepo Slack 협업 워크스페이스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full overflow-hidden bg-background text-foreground">
        <ClerkProvider
          afterSignOutUrl="/"
          appearance={{
            cssLayerName: "clerk",
          }}
          localization={koKR}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <ClerkKoreanDomPatch />
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
