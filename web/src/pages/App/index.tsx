import React, { useState } from "react";
import { FileUpload } from "../../components/FileUpload";
import { FileTable } from "../../components/FileTable";
import Style from "./style.module.less";

type TUploadType = 0 | 1 | 2 | 3 | 4 | 5;

interface IFileUploadType {
  name: string;
  type: TUploadType;
}

const FILEIPLAODTYPE: IFileUploadType[] = [
  {
    name: "单文件长传",
    type: 0,
  },
  {
    name: "多文件上传",
    type: 1,
  },
  {
    name: "单文件分片上传",
    type: 2,
  },
  {
    name: "多文件分片上传",
    type: 3,
  },
  {
    name: "单文件断点续传",
    type: 4,
  },
  {
    name: "多文件断点续传",
    type: 5,
  },
];

export const App: React.FC = () => {
  // 上传文件方式
  const [fileUploadWay, setFileUploadWay] = useState<TUploadType>(0)
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
      <body className={Style.body_show}>
        <div className={Style.file_upload}>
          <FileUpload />
        </div>
        <div className={Style.file_table_show}>
          <FileTable />
        </div>
      </body>
    </div>
  );
};
