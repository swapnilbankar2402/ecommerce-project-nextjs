// components/NavigationTabs.tsx
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Category {
    id: string;
    name: string;
    hasDropdown?: boolean;
}

const categories: Category[] = [
    { id: 'electronics', name: 'Electronics', },
    { id: 'tv-appliances', name: 'TVs & Appliances', },
    { id: 'men', name: 'Men', },
    { id: 'women', name: 'Women', },
    { id: 'baby-kids', name: 'Baby & Kids', },
    { id: 'home-furniture', name: 'Home & Furniture', },
    { id: 'sports-books', name: 'Sports, Books & More', },
    { id: 'flights', name: 'Flights' },
    { id: 'offer-zone', name: 'Offer Zone', },
];

export default function NavigationTabs() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if we're on mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseEnter = (id: string) => {
        if (!isMobile) {
            setActiveCategory(id);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setActiveCategory(null);
        }
    };

    const toggleCategory = (id: string) => {
        if (isMobile) {
            setActiveCategory(activeCategory === id ? null : id);
        }
    };

    // Debugging helper
    useEffect(() => {
        console.log('Active category:', activeCategory);
        console.log('Is mobile:', isMobile);
        console.log('Mobile menu open:', isMobileMenuOpen);
    }, [activeCategory, isMobile, isMobileMenuOpen]);

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
                {/* Mobile menu button */}
                <div className="md:hidden flex justify-between items-center py-3">
                    <span className="font-medium text-gray-700">Categories</span>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden flex text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button> */}

                {/* Desktop tabs */}
                <div className="hidden md:flex space-x-6 overflow-x-auto py-3">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="relative flex-shrink-0"
                            onMouseEnter={() => category.hasDropdown && handleMouseEnter(category.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                className={cn(
                                    "flex items-center text-sm font-medium transition-colors duration-200 hover:text-blue-600",
                                    activeCategory === category.id ? "text-blue-600" : "text-gray-700"
                                )}
                            >
                                {category.name}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-2">
                        {categories.map((category) => (
                            <div key={category.id} className="mb-1">
                                <button
                                    onClick={() => category.hasDropdown && toggleCategory(category.id)}
                                    className={cn(
                                        "flex justify-between items-center w-full px-3 py-2 text-sm font-medium rounded-md",
                                        activeCategory === category.id ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <span>{category.name}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}