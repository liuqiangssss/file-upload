import React from "react";
import { Table, TableProps } from "antd";

import Style from "./style.module.less";

interface TFileTableType {
  key: string;
  originName: string;
  newName: string;
  fileHash: string;
  fileSize: number;
  fileStatus: string;
}

const columns: TableProps<TFileTableType>["columns"] = [
  {
    title: "原文件名",
    dataIndex: "originName",
    key: "originName",
  },
  {
    title: "新文件名",
    dataIndex: "newName",
    key: "newName",
  },
  {
    title: "文件hash",
    dataIndex: "fileHash",
    key: "fileHash",
  },
  {
    title: "文件大小",
    dataIndex: "fileSize",
    key: "fileSize",
  },
  {
    title: "文件状态",
    dataIndex: "fileStatus",
    key: "fileStatus",
  },
];

const tableData: TFileTableType[] = [
  {
    key: "a1b2c3d4",
    originName: "file1.txt",
    newName: "newFile1.txt",
    fileHash: "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    fileSize: 1234,
    fileStatus: "pending",
  },
  {
    key: "b2c3d4e5",
    originName: "file2.txt",
    newName: "newFile2.txt",
    fileHash: "f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1",
    fileSize: 2345,
    fileStatus: "uploaded",
  },
  {
    key: "c3d4e5f6",
    originName: "file3.txt",
    newName: "newFile3.txt",
    fileHash: "g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2",
    fileSize: 3456,
    fileStatus: "failed",
  },
  {
    key: "d4e5f6g7",
    originName: "file4.txt",
    newName: "newFile4.txt",
    fileHash: "h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3",
    fileSize: 4567,
    fileStatus: "pending",
  },
];

export const FileTable: React.FC = () => {
  return (
    <div>
      <Table columns={columns} dataSource={tableData} />
    </div>
  );
};
