import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

if (!globalThis.__B44_DB__) {
  globalThis.__B44_DB__ = {
    auth: {
      isAuthenticated: async () => true,
      me: async () => ({
        id: 'mock-user-id',
        email: 'admin@teamgraph.com',
        role: 'admin',
        name: 'Sunil Kumar'
      }),
      loginViaEmailPassword: async (email, password) => {
        console.log('Mock login:', email);
        return { user: { email, name: 'Sunil Kumar' } };
      },
      loginWithProvider: (provider, returnTo) => {
        console.log('Mock provider login:', provider, returnTo);
        window.location.href = returnTo || '/';
      },
      register: async ({ email, password }) => {
        console.log('Mock register:', email);
        return { success: true };
      },
      verifyOtp: async ({ email, otpCode }) => {
        console.log('Mock OTP verification:', email, otpCode);
        return { access_token: 'mock-access-token' };
      },
      setToken: (token) => {
        console.log('Mock setToken:', token);
      },
      resetPasswordRequest: async (email) => {
        console.log('Mock resetPasswordRequest:', email);
        return { success: true };
      },
      resetPassword: async ({ token, password }) => {
        console.log('Mock resetPassword:', token);
        return { success: true };
      },
      logout: (redirectUrl) => {
        console.log('Mock logout');
        if (redirectUrl) window.location.href = redirectUrl;
        else window.location.reload();
      },
      redirectToLogin: (redirectUrl) => {
        console.log('Mock redirect to login');
        window.location.href = '/login?returnTo=' + encodeURIComponent(redirectUrl || '/');
      }
    },
    entities: new Proxy({}, {
      get: (target, entityName) => {
        return {
          filter: async () => [],
          get: async () => null,
          create: async () => ({}),
          update: async () => ({}),
          delete: async () => ({})
        };
      }
    }),
    integrations: {
      Core: {
        UploadFile: async () => ({ file_url: '' })
      }
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
