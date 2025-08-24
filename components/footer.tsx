// components/Footer.tsx
'use client';

import Link from 'next/link';
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    //   Paypal,
    Apple,
    //   Google
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function Footer() {
    const footerLinks = {
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Careers', href: '/careers' },
            { name: 'Press', href: '/press' },
            { name: 'Blog', href: '/blog' },
        ],
        customer: [
            { name: 'Contact Us', href: '/contact' },
            { name: 'FAQs', href: '/faqs' },
            { name: 'Shipping Policy', href: '/shipping' },
            { name: 'Returns & Exchanges', href: '/returns' },
        ],
        quick: [
            { name: 'Track Order', href: '/track-order' },
            { name: 'My Account', href: '/account' },
            { name: 'Wishlist', href: '/wishlist' },
            { name: 'Gift Cards', href: '/gift-cards' },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
        { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    ];

    const paymentMethods = [
        { icon: CreditCard, label: 'Credit Card' },
        // { icon: Paypal, label: 'PayPal' },
        { icon: Apple, label: 'Apple Pay' },
        // { icon: Google, label: 'Google Pay' },
    ];

    return (
        <footer className="bg-muted border-t">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="bg-primary rounded-lg p-2">
                                <span className="text-xl font-bold text-white">S</span>
                            </div>
                            <span className="text-xl font-bold">ShopHub</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Your one-stop destination for premium products at unbeatable prices.
                            Quality guaranteed, satisfaction assured.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-3 pt-2">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="bg-background rounded-full p-2 hover:bg-primary/10 transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
                        <ul className="space-y-3">
                            {footerLinks.customer.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
                            <p className="text-muted-foreground text-sm mb-3">
                                Subscribe to get special offers and updates
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1"
                                />
                                <Button type="submit" size="sm">
                                    Subscribe
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">support@shophub.com</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <span className="text-muted-foreground">
                                        123 Commerce St, Suite 100<br />
                                        San Francisco, CA 94105
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Quick Links (Mobile) */}
                <div className="md:hidden mt-8">
                    <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                    <ul className="space-y-3">
                        {footerLinks.quick.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Separator />

            {/* Bottom Footer */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} ShopHub. All rights reserved.
                    </div>

                    {/* Payment Methods */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.label}
                                className="flex items-center space-x-1 text-muted-foreground"
                            >
                                <method.icon className="h-4 w-4" />
                                <span className="text-xs">{method.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link
                            href="/privacy"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/accessibility"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Accessibility
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}