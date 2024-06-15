package bootstrap

import (
	"file-upload/global"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"log"
)

func InitMinioClient() {
	// 初始化MinIO客户端
	url := global.Config.Minio.Endpoint + ":" + global.Config.Minio.Port
	minioClient, err := minio.New(url, &minio.Options{
		Creds:  credentials.NewStaticV4(global.Config.Minio.AccessKey, global.Config.Minio.SecretKey, ""),
		Secure: false,
	})
	if err != nil {
		log.Fatalln(err)
	}

	global.MinioClient = minioClient
}
