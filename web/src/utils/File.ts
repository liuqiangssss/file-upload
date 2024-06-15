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

  public async upload(file: File) {
    const { hash, needSlice, chunks } = await this.fileProcessor.process(file);
    console.log("====================", hash, needSlice, chunks, file);
    if (needSlice) {
      return this.uploadChunks(hash, chunks);
    } else {
      return this.uploadFile(file);
    }
  }

  private async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(this.url, {
      method: "POST",
      body: formData,
    });
  }

  private async uploadChunks(hash: string, chunks: Blob[]) {
    const requests = chunks.map((chunk, index) => {
      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("hash", hash);
      formData.append("index", index.toString());
      formData.append("total", chunks.length.toString());
      return fetch(this.url, {
        method: "POST",
        body: formData,
      });
    });
    return Promise.all(requests);
  }
}

const fileUploader = new FileUploader({
  url: "http://localhost:8080/api/upload",
});

export { fileUploader, FileProcessor, FileUploader };
