import { ChangeEvent, useState } from "react";
import { FileShow } from "./FileShow";
import { FileUploader, fileUploader } from "../../utils/File";
import Style from "./style.module.less";

interface IFileUpload {
  isMultiple?: boolean;
}

export const FileUpload: React.FC<IFileUpload> = ({ isMultiple = false }) => {
  const [selectFileData, setSelectFileData] = useState<
    { file: File; selectTime: number }[]
  >([]);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  // 选择文件
  const selectedFileEvent = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files?.length === 0) {
      return;
    }
    const fileList = e.target.files as FileList;
    const file = fileList[0];
    setSelectFileData([
      {
        file,
        selectTime: Date.now(),
      },
    ]);
    fileUploader.upload({
      file,
      onProgress: (percent: number) => {
        setUploadPercent(percent);
      },
      onFinish: (resp: any) => {
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

  return (
    <div className={Style.file_upload_container}>
      <div className={Style.file_upload}>
        <div className={Style.upload_icon}>+</div>
        <input
          type="file"
          className={Style.input_button}
          multiple={isMultiple}
          onChange={selectedFileEvent}
        />
      </div>
      <div className={Style.show_file}>{showFileDom(selectFileData)}</div>
    </div>
  );
};
