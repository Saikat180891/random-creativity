// ConfigPage/ConfigPage.tsx
import { Button, Form, Input, Space } from "antd";
import { useConfigForm } from "./useConfigForm";
import { validateIp, validatePort } from "./config.schema";
import { ConfigActions } from "./ConfigActions";

const layout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
};

const ConfigPage = () => {
  const { form, loading, saveConfig, pickOutputDir, clearDb, closeConfig } =
    useConfigForm();

  return (
    <Form
      {...layout}
      form={form}
      style={{ maxWidth: 600, padding: "1rem" }}
      onFinish={saveConfig}
    >
      <Form.Item
        label="Source port"
        name="sourcePort"
        rules={[
          { required: true, message: "Source port is required" },
          { validator: validatePort },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Destination IP"
        name="destinationIp"
        rules={[
          { required: true, message: "Destination IP is required" },
          { validator: validateIp },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Destination Port"
        name="destinationPort"
        rules={[
          { required: true, message: "Destination Port is required" },
          { validator: validatePort },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Output directory" required>
        <Space.Compact style={{ width: "100%" }}>
          <Form.Item
            name="outDir"
            noStyle
            rules={[
              { required: true, message: "Output directory is required" },
            ]}
          >
            <Input readOnly />
          </Form.Item>

          <Button type="link" onClick={pickOutputDir}>
            Browse
          </Button>
        </Space.Compact>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6 }}>
        <ConfigActions
          loading={loading}
          onClearDb={clearDb}
          onClose={closeConfig}
        />
      </Form.Item>
    </Form>
  );
};

export default ConfigPage;
