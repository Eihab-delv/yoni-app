import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Head from '@docusaurus/Head';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const LoginPage = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const initFirebaseUI = async () => {
      try {
        const firebaseui = await import('firebaseui');
        const uiConfig = {
          callbacks: {
            signInSuccessWithAuthResult: () => true,
            signInFailure: (error) => setError(error.message),
          },
          signInOptions: [
            { provider: 'google.com', customParameters: { prompt: 'select_account' } },
          ],
          signInFlow: 'popup',
        };

        const existingUI = firebaseui.auth.AuthUI.getInstance();
        if (existingUI) existingUI.delete();

        const ui = new firebaseui.auth.AuthUI(auth);
        ui.start('#firebaseui-auth-container', uiConfig);
      } catch (err) {
        setError(err.message);
      }
    };

    initFirebaseUI();
    return () => {
      if (typeof window !== 'undefined') {
        const firebaseui = window.firebaseui;
        const ui = firebaseui?.auth?.AuthUI?.getInstance();
        if (ui) ui.delete();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <link
          type="text/css"
          rel="stylesheet"
          href="https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.css"
        />
      </Head>
      <div className="login-container">
        <h1 className="login-title">Welcome to the ts-monorepo Wiki</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="auth-box">
          <div id="firebaseui-auth-container"></div>
        </div>
      </div>
    </>
  );
};

export default function Root({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return user ? <>{children}</> : <LoginPage />;
}

