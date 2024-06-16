package global

import (
	"file-upload/config"
	"github.com/minio/minio-go/v7"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var (
	Config      *config.Configuration
	MinioClient *minio.Client
	Log         *zap.Logger
	DB          *gorm.DB
)
