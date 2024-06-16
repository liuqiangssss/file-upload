package main

import (
	"file-upload/bootstrap"
)

func main() {
	// 初始化配置
	bootstrap.InitializeConfig()
	// 初始化minio
	bootstrap.InitMinioClient()

	// 初始化日志
	bootstrap.InitializeLog()

	// 初始化数据库
	bootstrap.InitializeDB()

	// 启动服务器
	bootstrap.RunServer()
}
