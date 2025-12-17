/* eslint-disable @typescript-eslint/no-explicit-any */
// ConfigPage/useConfigForm.ts
import { useEffect, useState } from "react";
import { Form, message } from "antd";
import { useNavigate } from "react-router";

export function useConfigForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Load existing config
  useEffect(() => {
    (async () => {
      try {
        const config = await window.electron.getConfig();
        if (config) {
          form.setFieldsValue({
            sourcePort: config.sourcePort,
            destinationIp: config.destinationIp,
            destinationPort: config.destinationPort,
            outDir: config.outputDirectory,
          });
        }
      } catch {
        message.error("Failed to load configuration");
      }
    })();
  }, [form]);

  const closeConfig = () => {
    navigate(-1);
  };

  // Save config
  const saveConfig = async (values: any) => {
    try {
      setLoading(true);
      await window.electron.setConfig({
        sourcePort: Number(values.sourcePort),
        destinationIp: values.destinationIp,
        destinationPort: Number(values.destinationPort),
        outputDirectory: values.outDir,
      });
      message.success("Configuration saved");
    } catch {
      message.error("Failed to save configuration");
    } finally {
      closeConfig();
      setLoading(false);
    }
  };

  // Pick output directory
  const pickOutputDir = async () => {
    try {
      const dir = await window.electron.selectOutputDir();
      if (dir) form.setFieldValue("outDir", dir);
    } catch {
      message.error("Failed to select directory");
    }
  };

  // Clear DB
  const clearDb = async () => {
    try {
      await window.electron.clearFiles();
      message.success("Database cleared");
    } catch {
      message.error("Failed to clear database");
    }
  };

  return {
    form,
    loading,
    saveConfig,
    pickOutputDir,
    clearDb,
    closeConfig
  };
}
