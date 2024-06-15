package main

import (
	"file-upload/bootstrap"
)

func main() {
	// 初始化配置
	bootstrap.InitializeConfig()
	// 初始化minio
	bootstrap.InitMinioClient()
	// 启动服务器
	bootstrap.RunServer()
}
