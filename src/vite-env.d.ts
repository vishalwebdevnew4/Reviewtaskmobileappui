/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string
  readonly SMTP_HOST?: string
  readonly SMTP_PORT?: string
  readonly SMTP_SECURE?: string
  readonly SMTP_AUTH_USER?: string
  readonly SMTP_AUTH_PASS?: string
  readonly EMAIL_FROM?: string
  readonly EMAIL_TO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

