export * from './request'
export * from './request.ts'

import { request } from "./request";
import { IUploadFileInfo } from "./type";

// 获取上传文件列表信息
export async function getUploadFileInfo() {
  try {
    const { data} = await request.get<{file: IUploadFileInfo[]}>('/api/fileInfo')
  } catch (error) {
    
  }
}

