import { $api } from "~/lib/api";

export const useCreateUserApiMutation = () => {
  return $api.useMutation("post", "/v1/auth/sign-up", {
    onError: (error: unknown) => {
      if (error instanceof Error) {
        // This alert is critical for user feedback
        alert(`API Error: ${error.message}`);
      }
      console.error("createUserApi onError", error);
    },
    onSuccess: (data) => {
      console.log("create user in backend onSuccess");
      console.log(JSON.stringify(data, null, 2));
    },
  });
};
