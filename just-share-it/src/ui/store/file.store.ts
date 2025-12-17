/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { fileService } from "../services/fileService";
import type { File } from "../components/Settings/file-upload.types";

interface UseFileHandlerProps {
  files: File[];
  loading: boolean;
  error?: string;

  listFiles: () => Promise<void>;
  addFiles: (files: Omit<File, "id" | "status">[]) => Promise<void>;
  clearFiles: () => Promise<void>;
}

const useFileHandler = create<UseFileHandlerProps>((set) => ({
  files: [],
  loading: false,
  error: undefined,

  // 🔹 Fetch files asynchronously from SQLite via IPC
  listFiles: async () => {
    try {
      set({ loading: true, error: undefined });
      const files = await fileService.list();
      set({ files, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message ?? "Failed to load files",
      });
    }
  },

  // 🔹 Add files (optional helper)
  addFiles: async (files) => {
    try {
      set({ loading: true, error: undefined });

      for (const file of files) {
        await fileService.add(file);
      }

      const updated = await fileService.list();
      set({ files: updated, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message ?? "Failed to add files",
      });
    }
  },

  // 🔹 Clear DB + UI
  clearFiles: async () => {
    await window.electron.clearFiles();
    set({ files: [] });
  },
}));

window.electron.onFileProgress(({ id, progress }) => {
  useFileHandler.setState((state) => ({
    files: state.files.map((f) =>
      f.id === id ? { ...f, progress } : f
    ),
  }));
});

window.electron.onFileStatus(({ id, status }) => {
  useFileHandler.setState((state) => ({
    files: state.files.map((f) =>
      f.id === id ? { ...f, status: status as File["status"] } : f
    ),
  }));
});

export default useFileHandler;
