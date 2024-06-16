package errors

import "file-upload/common/response"

var (
	ErrUploadFile = response.NewBusinessError(1001, "文件上传失败")
	// 其他错误...
)
