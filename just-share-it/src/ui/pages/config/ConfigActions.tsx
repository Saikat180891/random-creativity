// ConfigPage/ConfigActions.tsx
import { Button, Space } from "antd";

interface Props {
  loading: boolean;
  onClearDb: () => void;
  onClose: () => void;
}

export function ConfigActions({ loading, onClearDb, onClose }: Props) {
  return (
    <Space>
      <Button danger onClick={onClearDb}>
        Clear DB
      </Button>
      <Button onClick={onClose}>
        Close
      </Button>
      <Button type="primary" htmlType="submit" loading={loading}>
        Save
      </Button>
    </Space>
  );
}
