package main

import (
	"file-upload/controllers/upload"
	"file-upload/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(middleware.CorsMiddleware())
	apiGroup := router.Group("/api")
	apiGroup.POST("/uploadChunk", upload.UploadChunk)
	apiGroup.POST("/upload", upload.UploadFile)
	router.Run(":8080")
}
