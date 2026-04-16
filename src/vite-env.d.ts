/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAIN_ENVIRONMENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
