package upload

import (
	"file-upload/common/response"
	"file-upload/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Response struct {
	Code    int         `json:"code"`    // 自定义错误码
	Data    interface{} `json:"data"`    // 数据
	Message string      `json:"message"` // 信息
}

// 分片上传
func UploadChunk(ctx *gin.Context) {
	hash := ctx.PostForm("hash")
	fileHash := ctx.PostForm("fileHash")
	index := ctx.PostForm("index")
	file, _ := ctx.FormFile("file")
	total := ctx.PostForm("total")
	// 保存文件,在程序根目录，/server/uploads 目录下新建一个对应hash的目录，保存文件名为hash-index，写出相应代码
	services.UploadFileChunk(file, hash, fileHash, index, total)
	ctx.JSON(http.StatusOK, Response{
		0,
		nil,
		"ok",
	})

}

// 普通上传
func UploadFile(ctx *gin.Context) {
	file, _ := ctx.FormFile("file")
	hash := ctx.PostForm("hash")
	url := services.UploadFile(file, hash)
	// 返回文件的URL
	ctx.JSON(http.StatusOK, response.Success(url))
}

func List(ctx *gin.Context) {
	// 获取文件列表
	files := services.List()
	// 返回文件列表
	ctx.JSON(http.StatusOK, response.Success(files))
}
