"use client";

import localFont from "next/font/local";
import Link from "next/link";
import { Button } from "./ui/Button";
import clsx from "clsx";
import { FalIcon } from "./FalIcon";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const accentFont = localFont({
  src: "../../assets/fonts/jogansoft-bold-webfont.woff2",
});

export function Nav() {
  return (
    <div className="py-2 w-full z-50 px-2 md:px-8 flex items-center">
      <div className="flex flex-1 items-center">
        <div className="flex flex-col space-y-2">
          <Link href="/" className="flex flex-row items-center space-x-2">
            <h1
              className={clsx(
                "tracking-wide text-lg md:text-2xl",
                accentFont.className
              )}
            >
              3D<span className="opacity-50">Canvas</span>
            </h1>
          </Link>
          <div className="hidden md:flex flex-row space-x-1 items-center text-xs">
            <span className="opacity-50">powered by</span>
            <a href="https://fal.ai">
              <FalIcon className="w-9" />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-row space-x-2 items-center">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href="https://github.com/fal-ai/interactive-3d-demo-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubLogoIcon className="w-6 h-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
