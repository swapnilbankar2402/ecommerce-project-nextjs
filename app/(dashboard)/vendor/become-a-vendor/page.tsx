import ProtectedRoute from "@/components/auth/protected-route";
import VendorApplicationForm from "@/components/vendor-application-form";

export default function VendorApplyPage() {
  return <ProtectedRoute>
    <VendorApplicationForm />
  </ProtectedRoute>
}