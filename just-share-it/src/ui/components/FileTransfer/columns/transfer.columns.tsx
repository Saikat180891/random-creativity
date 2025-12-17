/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Progress, Space, Tag } from "antd";
import {
  DeleteFilled,
  PlaySquareOutlined,
  PauseOutlined,
} from "@ant-design/icons";
import { formatBytes } from "../../../utils/formatBytes";
import type { File } from "../../Settings/file-upload.types";

export const transferColumns = (onRefresh: () => void) => [
  {
    title: "File",
    render: (_: any, f: File) => f.name,
  },
  {
    title: "Size",
    render: (_: any, f: File) => formatBytes(f.size),
  },
  {
    title: "Direction",
    render: (_: any, f: File) =>
      f.direction === "send" ? (
        <Tag color="blue">Sending</Tag>
      ) : (
        <Tag color="green">Receiving</Tag>
      ),
  },
  {
    title: "Progress",
    render: (_: any, f: File) => (
      <Progress percent={f.progress ?? 0} size="small" />
    ),
  },
  {
    title: "Status",
    render: (_: any, f: File) => f.status,
  },
  {
    title: "Action",
    render: (_: any, f: File) => (
      <Space>
        {/* {f.direction === "send" && f.status === "queued" && ( */}
        <Button
          color="primary"
          variant="outlined"
          icon={<PlaySquareOutlined />}
          size="small"
          onClick={() => window.electron.sendFile(f.id, "127.0.0.1")}
        />
        {/* )} */}
        {f.direction === "send" && f.status === "sending" && (
          <Button icon={<PauseOutlined />} size="small" />
        )}
        <Button
          danger
          icon={<DeleteFilled />}
          size="small"
          onClick={async () => {
            await window.electron.deleteFile(f.id);
            onRefresh(); // ✅ refresh data
          }}
        />
      </Space>
    ),
  },
];
