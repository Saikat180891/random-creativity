export interface File {
  /** Primary key from SQLite */
  id: number;

  /** File metadata */
  name: string;
  path: string;
  size: number;
  type: string;

  /** Transfer direction */
  direction: "send" | "receive";

  /** Current transfer status */
  status: "queued" | "sending" | "receiving" | "paused" | "completed" | "error";

  /** Transfer progress (0–100) */
  progress?: number;

  /** Optional error message */
  error?: string;

  /** Created timestamp (from DB) */
  created_at?: string;
}
