import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export function useAuth() {
  const auth = useSelector((state: RootState) => state.auth);
  return auth;
}

export function useHasRole(
  roles: ("customer" | "vendor" | "admin")[],
  requireAll = false
) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return false;

  return requireAll
    ? roles.every((role) => user.roles.includes(role))
    : roles.some((role) => user.roles.includes(role));
}

export function useIsVendor() {
  return useHasRole(["vendor"]);
}

export function useIsAdmin() {
  return useHasRole(["admin"]);
}
