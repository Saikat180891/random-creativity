import type { File } from "../components/Settings/file-upload.types";

export const fileService = {
  add(file: Omit<File, "id" | "status">) {
    return window.electron.addFile(file);
  },
  list(): Promise<File[]> {
    return window.electron.listFiles();
  },
  // openDialog(): Promise<
  //   {
  //     name: string;
  //     path: string;
  //     size: number;
  //     type: string;
  //   }[]
  // > {
  //   return window.electron.openFileDialog();
  // },
  sendFile(fileId: number, ip: string): Promise<boolean> {
    return window.electron.sendFile(fileId, ip);
  },
};
