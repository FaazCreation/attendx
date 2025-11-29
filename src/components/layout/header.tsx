"use client";
import Link from "next/link";
import { AttendXIcon } from "@/components/icons";
import { UserNav } from "@/components/layout/user-nav";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b bg-card px-4 sm:px-6 sm:justify-between">
      <div className="hidden sm:flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
            <AttendXIcon className="h-7 w-7 text-primary" />
            <span className="text-lg font-semibold text-foreground font-headline">
            AttendX
            </span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-sm text-center text-muted-foreground">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserNav />
      </div>
    </header>
  );
}
