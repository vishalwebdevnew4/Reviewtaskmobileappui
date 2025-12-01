  import React from "react";
  import { createRoot } from "react-dom/client";
  import { GoogleOAuthProvider } from '@react-oauth/google';
  import App from "./App.tsx";
  import "./index.css";
<<<<<<< HEAD
  import { initDatabase } from "./db/database";
  import { AuthProvider } from "./contexts/AuthContext";
  import { ErrorBoundary } from "./components/ErrorBoundary";

  // Google OAuth Client ID (replace with your actual client ID)
  // Try multiple ways to get the env variable
  const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  
  // Fallback: Hardcode for now if env not working (remove after fixing)
  const GOOGLE_CLIENT_ID = envClientId || '401788002919-h667labjnm38m9jff9rja95rkm4d0kdq.apps.googleusercontent.com';
  
  // Debug: Log the Client ID (remove in production)
  console.log('🔍 Environment check:');
  console.log('  - import.meta.env.VITE_GOOGLE_CLIENT_ID:', envClientId || '❌ Not found');
  console.log('  - Source:', envClientId ? '✅ .env file' : '⚠️ Hardcoded fallback');
  
  if (GOOGLE_CLIENT_ID) {
    // Show first and last part of Client ID for verification (security)
    const masked = GOOGLE_CLIENT_ID.substring(0, 10) + '...' + GOOGLE_CLIENT_ID.substring(GOOGLE_CLIENT_ID.length - 10);
    console.log('📋 Client ID (masked):', masked);
    console.log('✅ Google OAuth should work now!');
  }
  
  if (!envClientId) {
    console.warn('⚠️ NOTE: Using hardcoded Client ID. .env file not being read.');
    console.warn('   This is a temporary fix. To use .env:');
    console.warn('   1. Delete .env.local if it exists');
    console.warn('   2. Restart dev server');
    console.warn('   3. Check .env file is in root directory');
  }

  // Initialize database before rendering app
  const AppWithProviders = () => {
    return React.createElement(
      ErrorBoundary,
      {},
      React.createElement(
        GoogleOAuthProvider,
        { clientId: GOOGLE_CLIENT_ID },
        React.createElement(
          AuthProvider,
          {},
          React.createElement(App)
        )
      )
    );
  };

  const renderApp = () => {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      console.error("Root element not found!");
      return;
    }
    const root = createRoot(rootElement);
    root.render(<AppWithProviders />);
  };

  // Show loading state while initializing
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;"><div style="text-align: center;"><div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #6B4BFF; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div><p style="color: #666;">Loading app...</p></div></div><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>';
  }

  // Add error boundary and better error handling
  try {
    initDatabase()
      .then(() => {
        console.log("✅ Database initialized successfully");
        renderApp();
      })
      .catch((error) => {
        console.error("❌ Failed to initialize database:", error);
        // Still render app even if database fails
        renderApp();
      });
  } catch (error) {
    console.error("❌ Critical error during initialization:", error);
    // Render app anyway
    renderApp();
  }
=======
  import { AuthProvider } from "./contexts/AuthContext.tsx";

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
  