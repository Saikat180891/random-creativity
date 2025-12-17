import "./settings.css";
import { FileUpload } from "./file-upload";
import { Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

export const Settings = () => {
  const navigateTo = useNavigate();

  const navigateToConfigurePage = () => {
    navigateTo("/config");
  };

  return (
    <div className="Settings">
      <div>
        <h1 style={{padding: 0, margin: 0}}>Just Share It</h1>
      </div>
      <div className="RightControls">
        <div>
          <FileUpload />
        </div>
        <Button
          type="primary"
          size="small"
          title="Configure"
          icon={<SettingOutlined />}
          onClick={navigateToConfigurePage}
        ></Button>
      </div>
    </div>
  );
};
