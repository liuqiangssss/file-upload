import Worker from './hashWorker?worker'

class ChunkProcesser {
  private chunkSize
  private file: File | null = null

  constructor(chunkSize: number = 1024 * 1024 * 10) {
    this.chunkSize = chunkSize
  }

  public async chunkProcess(file: File) {
    this.file = file
    const chunks = this.getChunks()
    const fileHash = await this.getHash(chunks)
    return {
      chunks: chunks,
      fileHash: fileHash
    }
  }

  private getChunks() {
    const fileSize = this.file!.size
    const chunkCount = Math.ceil(fileSize / this.chunkSize)
    let chunkArr: Blob[] = []
    for (let i = 0; i < chunkCount; i++) {
      const start = i * this.chunkSize
      const end = Math.min(start + this.chunkSize, fileSize)
      chunkArr.push(this.file!.slice(start, end))
    }
    return chunkArr
  }

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

}

export {
  ChunkProcesser
}