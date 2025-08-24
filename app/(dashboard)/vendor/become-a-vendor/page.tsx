"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type VendorForm = {
  storeName: string;
  email: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  stripeAccountId?: string;
  paypalMerchantId?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  supportEmail?: string;
};

const steps = [
  { label: "Store Info" },
  { label: "Branding" },
  { label: "Payments" },
  { label: "Policies" },
];

export default function BecomeVendorPage() {
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorForm>();

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleStepClick = (clickedIndex: number) => {
    if (clickedIndex <= step) {
      setStep(clickedIndex)
    }
  }

  const onSubmit = async (data: VendorForm) => {
    const res = await fetch("/api/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      alert("✅ Vendor application submitted!");
    } else {
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Become a Vendor</CardTitle>
          <div className="flex justify-between mt-4">
            {steps.map((s, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 text-center text-sm font-medium relative after:block after:h-1 after:w-full after:mt-2 transition-colors",
                  i <= step
                    ? "text-blue-600 after:bg-blue-600 cursor-pointer"
                    : "text-gray-400 after:bg-gray-200"
                )}
                onClick={() => { handleStepClick(i) }}
              >
                {s.label}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Step 1: Store Info */}
            {step === 0 && (
              <div className="space-y-3">
                <div>
                  <Input
                    placeholder="Store Name *"
                    {...register("storeName", { required: "Store Name is required" })}
                  />
                  {errors.storeName && (
                    <p className="text-red-500 text-sm mt-1">{errors.storeName.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Business Email *"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <Textarea
                  placeholder="Store Description (optional)"
                  {...register("description")}
                />
              </div>
            )}

            {/* Step 2: Branding */}
            {step === 1 && (
              <div className="space-y-3">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-500">Upload Logo (optional)</p>
                  <Input type="file" accept="image/*" {...register("logoUrl")} />
                </div>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-500">Upload Banner (optional)</p>
                  <Input type="file" accept="image/*" {...register("bannerUrl")} />
                </div>
              </div>
            )}

            {/* Step 3: Payments */}
            {step === 2 && (
              <div className="space-y-3">
                <Input placeholder="Stripe Account ID (optional)" {...register("stripeAccountId")} />
                <Input placeholder="PayPal Merchant ID (optional)" {...register("paypalMerchantId")} />
              </div>
            )}

            {/* Step 4: Policies */}
            {step === 3 && (
              <div className="space-y-3">
                <Textarea placeholder="Shipping Policy (optional)" {...register("shippingPolicy")} />
                <Textarea placeholder="Return Policy (optional)" {...register("returnPolicy")} />
                <Input placeholder="Support Email (optional)" {...register("supportEmail")} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={back}>
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < steps.length - 1 ? (
                <Button type="button" onClick={next}>
                  Next
                </Button>
              ) : (
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Submit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
