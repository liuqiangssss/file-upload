import React, { useState } from "react";
import { FileUpload } from "../../components/FileUpload";
import { FileTable } from "../../components/FileTable";
import { getUploadFileInfo } from "../../server";
import Style from "./style.module.less";

export enum FileUploadType {
   single = 0,
   chunk = 1
}

interface IFileUploadType {
  name: string;
  type: FileUploadType;
}

const FILEIPLAODTYPE: IFileUploadType[] = [
  {
    name: "文件整体上传",
    type: 0,
  },
  {
    name: "文件分片上传",
    type: 1,
  }
];

export const App: React.FC = () => {
  // 上传文件方式
  const [fileUploadWay, setFileUploadWay] = useState<FileUploadType>(FileUploadType.single)
  const typeButton = FILEIPLAODTYPE.map((button) => {
    return (
      <div key={button.type} className={`${Style.type_button} ${ fileUploadWay === button.type && Style.type_active}`} onClick={() => {
        setFileUploadWay(button.type)
      }}>
        {button.name}
      </div>
    );
  });

  return (
    <div className={Style.app_container}>
      <header className={Style.header_switch}>{typeButton}</header>
      <div className={Style.body_show}>
        <div className={Style.file_upload}>
          <FileUpload uploadType={fileUploadWay} />
        </div>
        <div className={Style.file_table_show}>
          <FileTable />
        </div>
      </div>
    </div>
  );
};
