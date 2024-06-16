import { ChangeEvent, useState } from "react";
import { message } from "antd";
import { FileShow } from "./FileShow";
import { fileUploader } from "../../lib/file-upload";
import { FileUploadType } from "../../pages/App";
import Style from "./style.module.less";

interface IFileUpload {
  uploadType: FileUploadType;
}

export const FileUpload: React.FC<IFileUpload> = ({ uploadType }) => {
  const [selectFileData, setSelectFileData] = useState<
    { file: File; selectTime: number }[]
  >([]);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  // 选择文件
  const selectedFileEvent = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 0) {
      return;
    }
    const fileList = e.target.files as FileList;
    const file = fileList[0];
    if (!fileSizeValidate(file)) {
      return;
    } // 文件大小判断
    setSelectFileData([
      {
        file,
        selectTime: Date.now(),
      },
    ]);
    fileUploader.upload({
      type: uploadType === FileUploadType.single ? 'whole' : 'fragment',
      file,
      onProgress: async (percent: number) => {
        setUploadPercent(percent);
      },
      onFinish: async  (resp: any) => {
        console.log(resp, "resp");
      },
    });
  };

  const showFileDom = (files: { file: File; selectTime: number }[]) => {
    return files.map((file) => {
      return (
        <FileShow
          key={file.selectTime}
          file={file.file}
          uploadProgress={uploadPercent}
        />
      );
    });
  };

  const fileSizeValidate = (file: File) => {
    if (file.size > 1024 * 1024 * 10 && uploadType === FileUploadType.single) {
      message.open({
        content: "文件整体上传大小不可以超过10M哦！",
        type: "warning",
        duration: 2,
      });
      return false;
    }
    return true;
  };

  return (
    <div className={Style.file_upload_container}>
      <div className={Style.file_upload}>
        <div className={Style.upload_icon}>+</div>
        <input
          type="file"
          className={Style.input_button}
          multiple={true}
          onChange={selectedFileEvent}
        />
      </div>
      <div className={Style.show_file}>{showFileDom(selectFileData)}</div>
    </div>
  );
};
