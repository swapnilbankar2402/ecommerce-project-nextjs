"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { z } from "zod";
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { loginUser } from "@/store/slices/authSlice"
import { AppDispatch } from "@/store/store"
import { useRouter } from "next/navigation"

const signInSchema = z.object({
    email: z.email('Email is required'),
    password: z.string('Email is required')
})

type SignInFormValues = z.infer<typeof signInSchema>;

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: SignInFormValues) => {
        try {
            // Dispatch the signInUser thunk
            const result = await dispatch(loginUser(data))

            if (loginUser.fulfilled.match(result)) {
                toast.success("Signed in successfully");
                // Redirect to products page
                router.push('/products');
            } else {
                // Handle error case
                const errorMessage = result.payload as string;
                toast.error(errorMessage || "Sign in failed");
            }
        } catch (error: any) {
            console.error("Signin failed", error);
            toast.error(error.error || "Authentication failed");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com"  {...register('email')} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                </div>
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/auth/forgot-password"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <Input id="password" type="password" {...register('password')} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting} >
                    {isSubmitting ? "Signing up..." : "Sign in"}
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    {/* <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span> */}
                </div>
            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="underline underline-offset-4">
                    Sign up
                </Link>
            </div>
        </form>
    )
}
