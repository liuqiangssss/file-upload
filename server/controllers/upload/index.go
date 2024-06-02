package upload

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
)

type Response struct {
	code    int         `json:"code"`    // 自定义错误码
	data    interface{} `json:"data"`    // 数据
	message string      `json:"message"` // 信息
}

// 分片上传
func UploadChunk(ctx *gin.Context) {
	hash := ctx.PostForm("hash")
	index := ctx.PostForm("index")
	file, _ := ctx.FormFile("file")
	//total := ctx.PostForm("total")
	// 保存文件,在程序根目录，/server/uploads 目录下新建一个对应hash的目录，保存文件名为hash-index，写出相应代码
	pwd, _ := os.Getwd()
	_ = ctx.SaveUploadedFile(file, pwd+"/server/uploads/"+hash+"/"+hash+"-"+index)
	ctx.JSON(http.StatusOK, Response{
		0,
		nil,
		"ok",
	})

}

// 普通上传
func UploadFile(ctx *gin.Context) {
	file, _ := ctx.FormFile("file")
	//total := ctx.PostForm("total")
	// 保存文件,在程序根目录，/server/uploads 目录下新建一个对应hash的目录，保存文件名为hash-index，写出相应代码
	pwd, _ := os.Getwd()
	_ = ctx.SaveUploadedFile(file, pwd+"/server/static/"+file.Filename)
	ctx.JSON(http.StatusOK, Response{
		0,
		nil,
		"ok",
	})
}
