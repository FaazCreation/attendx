'use client';

import { BarChart3, ChevronLeft, LayoutDashboard, Users, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { AttendXIcon } from '../icons';

const adminNavItems = [
    { href: '/admin/dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { href: '/admin/members', label: 'সদস্য', icon: Users },
    { href: '/admin/reports', label: 'রিপোর্ট', icon: BarChart3 },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 flex-shrink-0 border-r bg-card flex flex-col">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span>অ্যাডমিন প্যানেল</span>
                </Link>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-4">
                    {adminNavItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href}>
                                <Button
                                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                                    className="w-full justify-start"
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto border-t p-4">
                 <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href="/dashboard">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    ব্যবহারকারী ড্যাশবোর্ড
                  </Link>
                </Button>
            </div>
        </aside>
    );
}
