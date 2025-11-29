'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, CalendarClock, User, Users } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { href: '/profile', label: 'My Profile', icon: User, description: "View and edit your personal details" },
  { href: '/sessions', label: 'Sessions', icon: CalendarClock, description: "View and manage attendance sessions" },
  { href: '/members', label: 'Members', icon: Users, description: "Browse and manage club members" },
  { href: '/reports', label: 'Reports', icon: BarChart3, description: "Generate and export attendance data" },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome to AttendX
        </h1>
      </div>
      <p className="text-muted-foreground">Select an option below to get started.</p>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="hover:bg-muted/50 hover:border-primary/50 transition-all transform hover:-translate-y-1 h-full flex flex-col">
              <CardHeader className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-md">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">{item.label}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardDescription className="px-6 pb-4 text-sm">
                {item.description}
              </CardDescription>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
