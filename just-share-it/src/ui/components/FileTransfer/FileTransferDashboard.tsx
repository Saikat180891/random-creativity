import { useEffect, useState } from "react";
import { Table } from "antd";
import useFileHandler from "../../store/file.store";
import { TransferFilters } from "./components/TransferFilters";
import {
  useFilteredTransfers,
  type DirectionFilter,
  type StatusFilter,
} from "./hooks/useFilteredTransfers";
import { transferColumns } from "./columns/transfer.columns";

export const FileTransferDashboard = () => {
  const { files, listFiles, loading, error } = useFileHandler();

  const [direction, setDirection] = useState<DirectionFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  useEffect(() => {
    listFiles();
  }, []);

  const filteredFiles = useFilteredTransfers(files, direction, status);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <TransferFilters
        direction={direction}
        status={status}
        onDirectionChange={setDirection}
        onStatusChange={setStatus}
      />

      <Table
        rowKey="id"
        columns={transferColumns(listFiles)}
        dataSource={filteredFiles}
      />
    </>
  );
};
