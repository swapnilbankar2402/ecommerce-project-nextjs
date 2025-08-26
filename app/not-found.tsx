// app/not-found.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg space-y-8"
            >
                {/* Animated 404 icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex justify-center"
                >
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileQuestion className="h-12 w-12 text-primary" />
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                            className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-white font-bold text-lg"
                        >
                            404
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-none shadow-lg">
                        <CardHeader className="text-center space-y-2 pb-6">
                            <CardTitle className="text-3xl font-bold">Page Not Found</CardTitle>
                            <CardDescription className="text-lg">
                                We couldn't find the page you're looking for.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-muted/50 rounded-lg p-4"
                            >
                                <h3 className="font-medium mb-2">What might have happened?</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        The page may have been moved or deleted
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        You might have mistyped the URL
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        There could be a temporary network issue
                                    </li>
                                </ul>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-3"
                            >
                                <Button asChild className="flex-1">
                                    <Link href="/">
                                        <Home className="mr-2 h-4 w-4" />
                                        Homepage
                                    </Link>
                                </Button>
                                <Button variant="outline" onClick={() => window.history.back()} className="flex-1">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Go Back
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center"
                >
                    <p className="text-sm text-muted-foreground">
                        Need help?{' '}
                        <Link href="/contact" className="text-primary hover:underline">
                            Contact support
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}