import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from "react-native"; // Added ScrollView
import auth from "@react-native-firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { $api, fetchClient } from "@/lib/api";
import { nanoid } from "nanoid";
import { Button } from "@/components";
import { create } from "domain"; // This import seems unused, you might want to remove it

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); // New state for mode

  // State to hold API call results
  const [successfulMutationResult, setSuccessfulMutationResult] = useState<any>(null);
  const [failedMutationResult, setFailedMutationResult] = useState<any>(null);

  const createUserMutation = $api.useMutation("post", "/v1/auth/sign-up", {
    onError: (error: unknown) => {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
      console.log("createUser onError", error);
    },
    onSuccess: (data) => {
      console.log("create user onSuccess");
      console.log(JSON.stringify(data, null, 2));
      Alert.alert("Success", "Account created successfully!");
    },
  });

  const createUserCredentialMutation = useMutation({
    mutationKey: [firstName, lastName, email],
    mutationFn: async () => {
      if (!firstName || !lastName || !email) {
        Alert.alert("Error", "Please enter your first, last name, and email.");
        return;
      }
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({
        displayName: `${firstName} ${lastName}`,
      });
      createUserMutation.mutate({
        body: {
          id: userCredential.user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
        },
      });
    },
  });

  const successfulMutation = $api.useMutation("post", "/v1/users", {
    mutationKey: ["example successfull api request"],
    onSuccess: (data) => {
      console.log("Successfully executed mutation");
      console.log(JSON.stringify(data, null, 2));
      setSuccessfulMutationResult(data); // Set successful result
      setFailedMutationResult(null); // Clear failed result
    },
    onError: (error) => {
      console.log("Failed to execute mutation");
      console.log(JSON.stringify(error, null, 2));
      setSuccessfulMutationResult(null); // Clear successful result
      setFailedMutationResult(error); // Set failed result
    },
  });

  const failedMutation = $api.useMutation("post", "/v1/users", {
    mutationKey: ["example failed api request"],
    onSuccess: (data) => {
      console.log("Successfully executed mutation");
      console.log(JSON.stringify(data, null, 2));
      setSuccessfulMutationResult(data); // Set successful result (even if it was intended to fail)
      setFailedMutationResult(null); // Clear failed result
    },
    onError: (error) => {
      console.log("Failed to execute mutation");
      console.log(JSON.stringify(error, null, 2));
      setSuccessfulMutationResult(null); // Clear successful result
      setFailedMutationResult(error); // Set failed result
    },
  });

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      Alert.alert("Success", "Logged in successfully!");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        console.error(error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      Alert.alert("Success", "Logged out successfully!");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        console.error(error);
      }
    }
  };


  if (user) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {" "}
        {/* Use ScrollView for better content display */}
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.info}>UID: {user.uid}</Text>
        <Text style={styles.info}>Email: {user.email}</Text>
        {user.displayName && <Text style={styles.info}>Name: {user.displayName}</Text>}
        <Text style={styles.info}>Created At: {new Date(user.metadata.creationTime).toLocaleString()}</Text>
        <Text style={styles.info}>Last Sign-In: {new Date(user.metadata.lastSignInTime).toLocaleString()}</Text>
        <Button text="Logout" onPress={() => handleLogout()} />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 20,
            paddingTop: 20,
          }}
        >
          <Button
            text={failedMutation.isPending ? "loading" : "Test API err"}
            onPress={() =>
              failedMutation.mutate({
                body: {
                  wrong: "data",
                } as any,
              })
            }
          />
          <Button
            text={successfulMutation.isPending ? "loading" : "Test API success"}
            onPress={() =>
              successfulMutation.mutate({
                body: {
                  id: nanoid(),
                  firstName: nanoid(),
                  lastName: nanoid(),
                  email: `${nanoid()}@gmail.com`,
                },
              })
            }
          />
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20, // Added padding
            maxHeight: '50%'
          }}
        >
          {successfulMutationResult && (
            <ScrollView contentContainerStyle={styles.resultContainer}>
              <Text style={styles.resultTitle}>Successful API Call Result:</Text>
              <Text style={styles.resultText}>{JSON.stringify(successfulMutationResult, null, 2)}</Text>
            </ScrollView>
          )}
          {failedMutationResult && (
            <ScrollView contentContainerStyle={styles.resultContainer}>
              <Text style={styles.resultTitle}>Failed API Call Error:</Text>
              <Text style={styles.resultText}>{JSON.stringify(failedMutationResult, null, 2)}</Text>
            </ScrollView>
          )}
          {!successfulMutationResult && !failedMutationResult && (
            <Text style={styles.resultPlaceholder}>
              Perform an API test to see the result here.
            </Text>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isCreatingAccount ? "Create Account" : "Login"}</Text>
      {isCreatingAccount && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor={"gray"}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={"gray"}
            autoCapitalize="words"
          />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={"gray"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={"gray"}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isCreatingAccount ? (
        <Button
          text={
            createUserCredentialMutation.isPending || createUserMutation.isPending
              ? "loading..."
              : "Create Account"
          }
          onPress={() => createUserCredentialMutation.mutate()}
        />
      ) : (
        <Button text="Login" onPress={handleLogin} />
      )}
      <View style={{ height: 10 }} />
      <Button
        text={isCreatingAccount ? "Back to Login" : "Create Account"}
        onPress={() => setIsCreatingAccount(!isCreatingAccount)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Use flexGrow with ScrollView
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    color: "black",
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
  resultContainer: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resultTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
    color: 'black',
  },
  resultText: {
    fontSize: 14,
    fontFamily: "monospace",
    color: "black",
  },
  resultPlaceholder: {
    fontSize: 14,
    color: "gray",
    marginTop: 20,
  }
});

export default LoginScreen;
