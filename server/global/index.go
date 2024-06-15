package global

import (
	"file-upload/config"
	"github.com/minio/minio-go/v7"
)

var (
	Config      *config.Configuration
	MinioClient *minio.Client
)
