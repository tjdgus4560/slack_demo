"use client";

import { useEffect } from "react";

const CLERK_ATTRIBUTE_REPLACEMENTS = [
  {
    attribute: "placeholder",
    selector: 'input[name="password"][placeholder="Create a password"]',
    value: "비밀번호를 입력하세요",
  },
  {
    attribute: "aria-label",
    selector: 'button[aria-label="Show password"]',
    value: "비밀번호 보기",
  },
  {
    attribute: "aria-label",
    selector: 'button[aria-label="Hide password"]',
    value: "비밀번호 숨기기",
  },
  {
    attribute: "aria-label",
    selector: '[aria-label="Sign in with GitHub"]',
    value: "GitHub로 로그인",
  },
] as const;

function applyClerkKoreanPatches() {
  for (const replacement of CLERK_ATTRIBUTE_REPLACEMENTS) {
    document.querySelectorAll(replacement.selector).forEach((element) => {
      if (element.getAttribute(replacement.attribute) !== replacement.value) {
        element.setAttribute(replacement.attribute, replacement.value);
      }
    });
  }
}

export function ClerkKoreanDomPatch() {
  useEffect(() => {
    applyClerkKoreanPatches();

    const observer = new MutationObserver(applyClerkKoreanPatches);
    observer.observe(document.body, {
      attributeFilter: ["aria-label", "placeholder"],
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
