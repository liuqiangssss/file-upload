import axios from "axios"

const BASEURL = 'http://localhost:8080'

const SINGLE_FILE_UPLOAD_URL = BASEURL + '/api/upload'
const MULTIPLE_FILE_CHUNK_UPLOAD_URL = BASEURL + '/api/uploadChunk'



const instance = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
})

// instance.interceptors.request.use(
//   (config) => {})


export {
  SINGLE_FILE_UPLOAD_URL,
  MULTIPLE_FILE_CHUNK_UPLOAD_URL,
  instance as request
}