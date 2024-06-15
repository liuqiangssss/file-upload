import { ChangeEvent } from "react";
import Style from "./style.module.less";

interface IFileUpload {
  isMultiple?: boolean;
}

export const FileUpload: React.FC<IFileUpload> = ({ isMultiple = false }) => {

  // 选择文件
  const selectedFileEvent = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files?.length === 0) {
      return;
    }
    const fileList = e.target.files as FileList;
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target!.result);
    };
    reader.readAsDataURL(file);
  }


  return (
    <div className={Style.file_upload}>
      <div className={Style.upload_icon}>+</div>
      <input
        type="file"
        className={Style.input_button}
        multiple={isMultiple}
        onChange={selectedFileEvent}
      />
    </div>
  );
};
