import { Segmented, Space } from "antd";
import type {
  DirectionFilter,
  StatusFilter,
} from "../hooks/useFilteredTransfers";

interface Props {
  direction: DirectionFilter;
  status: StatusFilter;
  onDirectionChange: (v: DirectionFilter) => void;
  onStatusChange: (v: StatusFilter) => void;
}

export const TransferFilters: React.FC<Props> = ({
  direction,
  onDirectionChange,
}) => {
  return (
    <Space style={{ marginBottom: 16 }}>
      <Segmented
        value={direction}
        onChange={(v) => onDirectionChange(v as DirectionFilter)}
        options={[
          { label: "All", value: "all" },
          { label: "Sending", value: "send" },
          { label: "Receiving", value: "receive" },
          { label: "Sent", value: "sent" },
          { label: "Received", value: "received" },
        ]}
      />
    </Space>
  );
};
