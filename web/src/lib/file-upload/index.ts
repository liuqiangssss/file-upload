import { UploadSend, OnFinish, OnProgress } from "./upload";
import { ChunkProcesser } from "./chunkProcesser";
import {
  SINGLE_FILE_UPLOAD_URL,
  MULTIPLE_FILE_CHUNK_UPLOAD_URL,
} from "../../server";

interface IFileUploader {
  chunkSize?: number;
  wholeUrl: string;
  fragmentUrl: string;
}

class FileUploader {
  private readonly uploadSend: UploadSend = new UploadSend();
  private readonly chunkProcesser: ChunkProcesser;
  private readonly wholeUrl: string;
  private readonly fragmentUrl: string;

  constructor({ chunkSize, wholeUrl, fragmentUrl }: IFileUploader) {
    this.chunkProcesser = new ChunkProcesser(chunkSize);
    this.wholeUrl = wholeUrl;
    this.fragmentUrl = fragmentUrl;
  }

  public upload({
    type = "whole",
    file,
    onFinish,
    onProgress,
  }: {
    type?: "whole" | "fragment";
    file: File;
    onFinish?: OnFinish;
    onProgress?: OnProgress;
  }) {
    if (type === "whole") {
      this.wholeUpload({ file, onFinish, onProgress });
    } else if (type === "fragment") {
      this.fragmentUpload({ file, onFinish, onProgress });
    }
  }

  // 分片上传
  private async fragmentUpload({
    file,
    onFinish,
    onProgress,
  }: {
    file: File;
    onFinish?: OnFinish;
    onProgress?: OnProgress;
  }) {
    const { chunks, fileHash } = await this.chunkProcesser.chunkProcess(file);
    console.log("🚀 ~ FileUploader ~ fileHash:", fileHash);
    let chunkIndex = 1;
    const request = chunks.map((chunk, index) => {
      console.log("🚀 ~ FileUploader ~ request ~ index:", index);
      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("fileHash", fileHash);
      formData.append("index", index.toString());

      const finish = async (resp: any) => {
        const percent = Math.floor((chunkIndex / chunks.length) * 100);
        chunkIndex++;
        onProgress && onProgress(percent);
        onFinish && onFinish(resp);
      };
      return this.uploadSend.upload({
        formData,
        onFinish: finish,
        url: this.fragmentUrl,
      });
    });
    await Promise.all(request);
  }

  // 整体上传
  private wholeUpload({
    file,
    onFinish,
    onProgress,
  }: {
    file: File;
    onFinish?: OnFinish;
    onProgress?: OnProgress;
  }) {
    const formData = new FormData();
    formData.append("file", file);
    this.uploadSend.upload({
      formData,
      onFinish,
      onProgress,
      url: this.wholeUrl,
    });
  }
}

const fileUploader = new FileUploader({
  chunkSize: 1024 * 1024 * 10,
  wholeUrl: SINGLE_FILE_UPLOAD_URL,
  fragmentUrl: MULTIPLE_FILE_CHUNK_UPLOAD_URL,
});

export { fileUploader };
