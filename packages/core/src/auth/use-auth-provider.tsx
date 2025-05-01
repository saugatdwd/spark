import { useContext } from "react";
import { AuthProviderContext } from "./auth-provider-context";


export const useAuthProvider = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined) throw new Error("useAuth must be used within a AuthProvider");

  return context;
};
