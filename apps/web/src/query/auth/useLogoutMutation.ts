import { useMutation } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { auth } from "~/lib/firebase";

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => {
      return signOut(auth);
    },
    onSuccess: () => {
      alert("Success: Logged out successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        console.error(error);
      }
    },
  });
};
