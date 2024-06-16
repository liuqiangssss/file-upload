export type OnFinish = (resp: any) => Promise<void>;
export type OnProgress = (progress: number) => Promise<void>;

export interface IUpload {
  formData: FormData
  onFinish?: OnFinish
  onProgress?: OnProgress
  url: string
}

export class UploadSend {

  public upload({formData, onFinish, onProgress, url}: IUpload) {
    this.validate(formData, url)
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => {
        if (xhr.status === 200) {
          const resp = JSON.parse(xhr.responseText)
          if (onFinish) {
            resolve(onFinish(resp))
          } else {
            resolve(resp)
          }
        } else {
          reject(new Error(xhr.responseText))
        }
      }
      xhr.onerror = () => {
        reject(new Error('Upload error: Network error or server not reachable'))
      }
      xhr.upload.onprogress = (e) => {
        if (!onProgress) {
          return
        }
        const percent = Math.floor(e.loaded / e.total * 100)
        onProgress(percent)
      }
      xhr.open('post', url, true)
      xhr.send(formData)
    })
  }

  private validate(formData: FormData, url: string) {
    if (!(formData instanceof FormData)) {
      throw new Error('formData 必须是 FormData 类型')
    }
    if (!url) {
      throw new Error('url 不能为空')
    }
  }
}