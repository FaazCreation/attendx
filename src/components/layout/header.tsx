
"use client";
import Link from "next/link";
import { DocXIcon } from "@/components/icons";
import { UserNav } from "@/components/layout/user-nav";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
            <DocXIcon className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold text-foreground font-headline leading-none">
              DocX
            </span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <UserNav />
      </div>
    </header>
  );
}
