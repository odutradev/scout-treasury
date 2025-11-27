/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CONTROL_ACCESS: string;
    readonly VITE_PRODUCTION: string;
    readonly VITE_BASEURL: string;
    readonly VITE_PIN_NORMAL: string;
    readonly VITE_PIN_ADMIN: string;
    readonly VITE_PIN_TITLE: string;
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}