"use client";

import { useMutation } from "@tanstack/react-query";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { $api } from "~/lib/api";
import { auth } from "~/lib/firebase";
import { useCreateUserApiMutation, useLoginMutation, useLogoutMutation } from "~/query";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [successfulMutationResult, setSuccessfulMutationResult] = useState<string | null>(null);
  const [failedMutationResult, setFailedMutationResult] = useState<string | null>(null);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const createUserApiMutation = useCreateUserApiMutation();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const createUserCredentialMutation = useMutation({
    mutationKey: [firstName, lastName, email],
    mutationFn: async () => {
      if (!firstName || !lastName || !email || !password) {
        alert("Error: Please fill in all fields.");
        throw new Error("All fields are required.");
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      createUserApiMutation.mutate({
        body: {
          id: userCredential.user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
        },
      });
    },
    onSuccess: () => {
      alert("Success: Account created successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      }
      console.log("createUserCredential onError", error);
    },
  });

  const successfulMutation = $api.useMutation("post", "/v1/users", {
    mutationKey: ["example successfull api request"],
    onSuccess: (data) => {
      console.log("Successfully executed mutation");
      console.log(JSON.stringify(data, null, 2));
      setSuccessfulMutationResult(JSON.stringify(data, null, 2));
      setFailedMutationResult(null);
    },
    onError: (error) => {
      console.log("Failed to execute mutation");
      console.log(JSON.stringify(error, null, 2));
      setSuccessfulMutationResult(null);
      setFailedMutationResult(JSON.stringify(error, null, 2));
    },
  });

  const failedMutation = $api.useMutation("post", "/v1/users", {
    mutationKey: ["example failed api request"],
    onSuccess: (data) => {
      console.log("Successfully executed mutation");
      console.log(JSON.stringify(data, null, 2));
      setSuccessfulMutationResult(JSON.stringify(data, null, 2));
      setFailedMutationResult(null);
    },
    onError: (error) => {
      console.log("Failed to execute mutation");
      console.log(JSON.stringify(error, null, 2));
      setSuccessfulMutationResult(null);
      setFailedMutationResult(JSON.stringify(error, null, 2));
    },
  });

  if (!isClientMounted) {
    return null;
  }

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome!</h1>
          <div className="space-y-2 text-sm">
            <p>
              <strong>UID:</strong> {user.uid}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.displayName && (
              <p>
                <strong>Name:</strong> {user.displayName}
              </p>
            )}
            <p>
              <strong>Created At:</strong>{" "}
              {user.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Last Sign-In:</strong>{" "}
              {user.metadata.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleString()
                : "N/A"}
            </p>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="w-full px-5 py-2 border border-black rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </button>
          <div className="flex gap-4 pt-4">
            <button
              onClick={() =>
                failedMutation.mutate({
                  body: {
                    // @ts-expect-error for demo purposes
                    wrong: "data",
                  }
                })
              }
              disabled={failedMutation.isPending}
              className="flex-1 px-5 py-2 border border-black rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {failedMutation.isPending ? "loading" : "Test API err"}
            </button>
            <button
              onClick={() =>
                successfulMutation.mutate({
                  body: {
                    id: nanoid(),
                    firstName: nanoid(),
                    lastName: nanoid(),
                    email: `${nanoid()}@gmail.com`,
                  },
                })
              }
              disabled={successfulMutation.isPending}
              className="flex-1 px-5 py-2 border border-black rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {successfulMutation.isPending ? "loading" : "Test API success"}
            </button>
          </div>
          <div className="w-full max-h-96 overflow-auto pt-4">
            {successfulMutationResult && (
              <div className="bg-gray-100 p-4 rounded border border-gray-300">
                <h3 className="font-bold mb-2 text-black">
                  Successful API Call Result:
                </h3>
                <pre className="text-sm font-mono text-black whitespace-pre-wrap">
                  {JSON.stringify(successfulMutationResult, null, 2)}
                </pre>
              </div>
            )}
            {failedMutationResult && (
              <div className="bg-gray-100 p-4 rounded border border-gray-300">
                <h3 className="font-bold mb-2 text-black">
                  Failed API Call Error:
                </h3>
                <pre className="text-sm font-mono text-black whitespace-pre-wrap">
                  {JSON.stringify(failedMutationResult, null, 2)}
                </pre>
              </div>
            )}
            {!successfulMutationResult && !failedMutationResult && (
              <p className="text-gray-500 text-sm text-center mt-4">
                Perform an API test to see the result here.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isCreatingAccount ? "Create Account" : "Login"}
        </h1>
        {isCreatingAccount && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded text-black placeholder-gray-500"
              autoCapitalize="words"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded text-black placeholder-gray-500"
              autoCapitalize="words"
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 px-3 border border-gray-300 rounded text-black placeholder-gray-500"
          autoCapitalize="none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 px-3 border border-gray-300 rounded text-black placeholder-gray-500"
        />
        {isCreatingAccount ? (
          <button
            onClick={() => createUserCredentialMutation.mutate()}
            disabled={
              createUserCredentialMutation.isPending ||
              createUserApiMutation.isPending
            }
            className="w-full px-5 py-2 border border-black rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {createUserCredentialMutation.isPending ||
              createUserApiMutation.isPending
              ? "Creating..."
              : "Create Account"}
          </button>
        ) : (
          <button
            onClick={() => loginMutation.mutate({ email, password })}
            disabled={loginMutation.isPending}
            className="w-full px-5 py-2 border border-black rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        )}
        <div className="h-2" />
        <button
          onClick={() => setIsCreatingAccount(!isCreatingAccount)}
          className="w-full px-5 py-2 border border-black rounded-full hover:bg-gray-100 transition-colors"
        >
          {isCreatingAccount ? "Back to Login" : "Create Account"}
        </button>
      </div>
    </div>
  );
}
