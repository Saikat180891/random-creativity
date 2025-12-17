import { useMemo } from "react";
import type { File } from "../../Settings/file-upload.types";

export type DirectionFilter = "all" | "send" | "receive";
export type StatusFilter = "all" | "active" | "completed";

export function useFilteredTransfers(
  files: File[],
  direction: DirectionFilter,
  status: StatusFilter
) {
  return useMemo(() => {
    return files.filter((f) => {
      if (direction !== "all" && f.direction !== direction) {
        return false;
      }

      if (status === "active") {
        return f.status !== "completed";
      }

      if (status === "completed") {
        return f.status === "completed";
      }

      return true;
    });
  }, [files, direction, status]);
}
