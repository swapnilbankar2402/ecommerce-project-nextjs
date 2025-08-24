"use client";
import { PropsWithChildren } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Bell, Search, Store } from "lucide-react";


export default function AdminLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
            {/* Top bar */}
            <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-3 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Store className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-semibold">Admin</span>
                        <Separator orientation="vertical" className="mx-3 hidden sm:block" />
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-8 w-[320px]" placeholder="Search…" />
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
                    </div>
                </div>
            </header>


            <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
                {/* Sidebar */}
                <aside className="hidden rounded-2xl border bg-card p-4 lg:block">
                    <nav className="space-y-1">
                        {[
                            { label: "Overview", href: "/admin" },
                            { label: "Orders", href: "/admin/orders" },
                            { label: "Products", href: "/admin/products" },
                            { label: "Vendors", href: "/admin/vendors" },
                            { label: "Customers", href: "/admin/customers" },
                            { label: "Payouts", href: "/admin/payouts" },
                            { label: "Settings", href: "/admin/settings" },
                        ].map((i) => (
                            <Link key={i.href} href={i.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground hover:bg-muted">{i.label}</Link>
                        ))}
                    </nav>
                </aside>
                {/* Content */}
                <main className="space-y-6">{children}</main>
            </div>
        </div>
    );
}