package upload

import (
	"file-upload/global"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"log"
	"net/http"
	"os"
	"time"
)

type Response struct {
	Code    int         `json:"code"`    // 自定义错误码
	Data    interface{} `json:"data"`    // 数据
	Message string      `json:"message"` // 信息
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
	//pwd, _ := os.Getwd()
	//_ = ctx.SaveUploadedFile(file, pwd+"/server/static/"+file.Filename)
	// 打开文件
	src, err := file.Open()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to open the file"})
		return
	}
	defer src.Close()

	// 使用当前时间生成唯一的文件名
	objectName := fmt.Sprintf("%d-%s", time.Now().Unix(), file.Filename)

	// 上传文件到Minio
	_, err = global.MinioClient.PutObject(ctx, global.Config.Minio.BucketName, objectName, src, file.Size, minio.PutObjectOptions{ContentType: file.Header.Get("Content-Type")})
	if err != nil {
		log.Printf("Error uploading file: %v\n", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to upload the file"})
		return
	}

	// 生成文件的URL
	fileURL := fmt.Sprintf("http://%s:%s/%s/%s", global.Config.Minio.Endpoint, global.Config.Minio.Port, global.Config.Minio.BucketName, objectName)
	// 返回文件的URL
	ctx.JSON(http.StatusOK, Response{
		0,
		fileURL,
		"ok",
	})
}
