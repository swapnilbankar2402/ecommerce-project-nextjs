import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/types";


interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-grow">
                <Image
                    src={product.images[0] || "/product-placeholder.jpg"}
                    alt={product.title}
                    width={250}
                    height={250}
                    className="mx-auto mb-4 object-cover"
                />
                <CardTitle>{product.title}</CardTitle>
                <CardDescription>{product.description.substring(0, 100)}...</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-xl font-bold text-primary mb-4">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Button asChild>
                    <Link href={`/products/${product._id}`}>View Details</Link>
                </Button>
                <Button variant="outline">Add to Cart</Button>
            </CardFooter>
        </Card>
    );
}





