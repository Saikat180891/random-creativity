import { UploadOutlined } from "@ant-design/icons";
import "./file-upload.css";
import useFileHandler from "../../store/file.store";

export const FileUpload = () => {
  const { listFiles } = useFileHandler();
  const handleDialogOpen = async () => {
    try {
      await window.electron.openFileDialog();
    } catch (err) {
      console.log(err);
    } finally {
      listFiles();
    }
  };

  return (
    <button className="btn btn-primary FileUpload" onClick={handleDialogOpen}>
      <UploadOutlined />
      <span>Share</span>
    </button>
  );
};
