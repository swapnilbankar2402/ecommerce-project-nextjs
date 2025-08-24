"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"

const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    avatarUrl: z.string().url("Must be a valid URL").or(z.literal("")),
    acceptTerms: z.boolean().refine((val) => val, {
        message: "You must accept the terms and conditions",
    }),
})

type SignUpFormValues = z.infer<typeof signUpSchema>;


export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            avatarUrl: "",
            acceptTerms: false,
        },
    })

    const onSubmit = async (data: SignUpFormValues) => {
        try {
            console.log("Submitting signup data:", data);
            const response = await fetch('/api/auth/sign-up', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            const result = await response.json();
            // console.log("result :", result);

            if (result.success) {
                toast(result.message)
            }

        } catch (err: any) {
            console.error("Signup failed", err);
            toast(err.error)
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
                        <div className="flex flex-col gap-6">

                            {/* Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="John Doe" {...register("name")} />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register("password")} />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            {/* Optional Avatar URL */}
                            <div className="grid gap-2">
                                <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
                                <Input id="avatarUrl" placeholder="https://example.com/avatar.png" {...register("avatarUrl")} />
                                {errors.avatarUrl && <p className="text-red-500 text-sm">{errors.avatarUrl.message}</p>}
                            </div>

                            {/* Terms */}
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="acceptTerms" {...register("acceptTerms")} />
                                <Label htmlFor="acceptTerms" className="text-xs">
                                    I agree to the{" "}
                                    <Link href="/terms-of-service" className="underline">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy-policy" className="underline">
                                        Privacy Policy
                                    </Link>
                                </Label>
                            </div>

                            {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>}

                            {/* Submit */}
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Signing up..." : "Sign Up"}
                            </Button>

                            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"></div>
                            {/* Switch */}
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/auth/sign-in" className="underline underline-offset-4">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholder.svg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <Link href="terms-of-service">Terms of Service</Link>
                and <Link href="privacy-policy">Privacy Policy</Link>.
            </div>
        </div>
    )
}
