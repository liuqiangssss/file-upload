package routers

import (
	"file-upload/controllers/upload"
	"github.com/gin-gonic/gin"
)

func SetApiGroupRoutes(router *gin.RouterGroup) {
	router.POST("/upload", upload.UploadFile)
	router.POST("/uploadChunk", upload.UploadChunk)
	router.GET("/list", upload.List)
}
