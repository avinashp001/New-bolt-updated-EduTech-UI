/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_MISTRAL_API_KEY?: string;
  readonly VITE_RAZORPAY_KEY_ID: string; // NEW
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// NEW: Declare the Razorpay global object
declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}