import type { File } from "./components/Settings/file-upload.types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface AppConfig {
    sourcePort: number;
    destinationIp: string;
    destinationPort: number;
    outputDirectory: string | null;
  }

  interface Window {
    electron: {
      // ---------- Files ----------
      addFile: (file: {
        name: string;
        path: string;
        size: number;
        type: string;
      }) => Promise<{ id: number }>;

      listFiles: () => Promise<File[]>;

      clearFiles: () => Promise<boolean>;

      openFileDialog: () => Promise<
        {
          id: number;
          name: string;
          path: string;
          size: number;
          type: string;
          status: string;
        }[]
      >;

      sendFile: (fileId: number, ip: string) => Promise<boolean>;

      // ---------- Config ----------
      getConfig: () => Promise<AppConfig>;

      setConfig: (config: Partial<AppConfig>) => Promise<boolean>;

      selectOutputDir: () => Promise<string | null>;

      deleteFile: (fileId: number) => Promise<boolean>;

      onFileProgress: (
        cb: (data: { id: number; progress: number }) => void
      ) => void;

      onFileStatus: (
        cb: (data: { id: number; status: string }) => void
      ) => void;
    };
  }
}
