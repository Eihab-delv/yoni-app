import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "~/lib/firebase";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return signInWithEmailAndPassword(auth, email, password);
    },
    onSuccess: () => {
      alert("Success: Logged in successfully!");
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
