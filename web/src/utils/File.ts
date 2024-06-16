import Worker from "./HashWorker.ts?worker";

class FileProcessor {
  private CHUNK_SIZE = 1024 * 1024 * 10; //10M

  private checkNeedSlice(file: File): boolean {
    return file.size > this.CHUNK_SIZE;
  }

  public async process(file: File): Promise<any> {
    const needSlice = this.checkNeedSlice(file);
    let hash = "";
    let chunks: Blob[] = [];
    if (needSlice) {
      chunks = this.getChunks(file);
      hash = await this.getHash(chunks);
    }
    return {
      hash,
      needSlice,
      chunks: chunks,
      file: file,
    };
  }

  // private getHash(): string {
  //     const spark = new SparkMD5.ArrayBuffer()
  //     for (const chunk of this.chunks) {
  //         const reader = new FileReader()
  //         reader.readAsArrayBuffer(chunk)
  //         reader.onload = (e) => {
  //             spark.append(e.target!.result as ArrayBuffer)
  //         }
  //     }
  //     return spark.end()
  // }
  private getHash(chunks: Blob[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const worker = new Worker();
      worker.postMessage({ chunks });
      worker.onmessage = function (e) {
        resolve(e.data.hash);
        worker.terminate();
      };

      worker.onerror = function (e) {
        reject(e);
        worker.terminate();
      };
    });
  }

  private getChunks(file: File): Blob[] {
    const chunks = [];
    let start = 0;
    while (start < file.size) {
      chunks.push(file.slice(start, start + this.CHUNK_SIZE));
      start += this.CHUNK_SIZE;
    }
    return chunks;
  }
}

class FileUploader {
  private readonly url: string;
  private readonly fileProcessor: FileProcessor;

  constructor({ url }: any) {
    this.url = url;
    this.fileProcessor = new FileProcessor();
  }

  public async upload({
    file,
    onProgress,
    onFinish,
  }: {
    file: File;
    onProgress?: (percent: number) => void;
    onFinish?: (result: Response) => void;
  }) {
    const { hash, needSlice, chunks } = await this.fileProcessor.process(file);
    console.log("====================", hash, needSlice, chunks, file);
    if (needSlice) {
      return this.uploadChunks(hash, chunks, onProgress, onFinish);
    } else {
      return this.uploadFile(file, onProgress, onFinish);
    }
  }

  private async sendRequest({
    formData,
    onFinish,
    onProgress,
  }: {
    formData: FormData;
    onProgress?: (percent: number) => void;
    onFinish?: (result: Response) => void;
  }) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status === 200) {
          if (!onFinish) {
            return;
          }
          const resp = JSON.parse(xhr.responseText);
          resolve(onFinish && onFinish(resp));
          resolve(xhr.responseText);
        } else {
          reject(new Error(xhr.responseText));
        }
      };
      xhr.upload.onprogress = (e) => {
        if (!onProgress) {
          return;
        }
        const percent = Math.floor((e.loaded / e.total) * 100);
        onProgress(percent);
      };
      xhr.open("post", this.url);
      xhr.send(formData);
    });
  }

  private async uploadFile(
    file: File,
    onProgress?: (percent: number) => void,
    onFinish?: (result: Response) => void
  ) {
    const formData = new FormData();
    formData.append("file", file);
    this.sendRequest({ formData, onProgress, onFinish });
  }

  // private async uploadFile(file: File) {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   return fetch(this.url, {
  //     method: "POST",
  //     body: formData,
  //   });
  // }

  // private async uploadChunks(hash: string, chunks: Blob[]) {
  //   const requests = chunks.map((chunk, index) => {
  //     const formData = new FormData();
  //     formData.append("file", chunk);
  //     formData.append("hash", hash);
  //     formData.append("index", index.toString());
  //     formData.append("total", chunks.length.toString());
  //     return fetch(this.url, {
  //       method: "POST",
  //       body: formData,
  //     });
  //   });
  //   return Promise.all(requests);
  // }

  private async uploadChunks(
    hash: string,
    chunks: Blob[],
    onProgress?: (percent: number) => void,
    onFinish?: (result: Response) => void
  ) {
    for (let i = 0; i < chunks.length; i++) {
      const chunkIndex = i;
      const formData = new FormData();
      formData.append("file", chunks[i]);
      formData.append("hash", hash);
      formData.append("index", chunkIndex.toString());
      formData.append("total", chunks.length.toString());
      await this.sendRequest({ formData, onFinish: onFinish });
      const percent = Math.floor(((chunkIndex + 1) / chunks.length) * 100);
      onProgress && onProgress(percent);
    }
  }
}

const fileUploader = new FileUploader({
  url: "http://localhost:8080/api/upload",
});

export { fileUploader, FileProcessor, FileUploader };
