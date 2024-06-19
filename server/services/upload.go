package services

import (
	"file-upload/common/errors"
	"file-upload/global"
	"file-upload/models"
	"fmt"
	"github.com/minio/minio-go/v7"
	"golang.org/x/net/context"
	"log"
	"mime/multipart"
	"time"
)

func UploadFile(file *multipart.FileHeader, hash string) string {
	var target models.File
	res := global.DB.Where("hash = ?", hash).First(&target)
	if res.Error != nil {
		panic(errors.ErrUploadFile) // 抛出自定义错误
	}

	if target.ID != 0 && target.Status == 1 {
		return fmt.Sprintf("http://%s:%s/%s/%s", global.Config.Minio.Endpoint, global.Config.Minio.Port, global.Config.Minio.BucketName, target.Filename)
	}

	src, err := file.Open()
	if err != nil {
		panic(errors.ErrUploadFile) // 抛出自定义错误
	}
	defer src.Close()

	// 使用当前时间生成唯一的文件名
	objectName := fmt.Sprintf("%d-%s", time.Now().Unix(), file.Filename)

	// 上传文件到Minio
	_, err = global.MinioClient.PutObject(context.Background(), global.Config.Minio.BucketName, objectName, src, file.Size, minio.PutObjectOptions{ContentType: file.Header.Get("Content-Type")})
	if err != nil {
		log.Printf("Error uploading file: %v\n", err)
		//ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to upload the file"})
		//return
	}

	// 生成文件的URL
	fileURL := fmt.Sprintf("http://%s:%s/%s/%s", global.Config.Minio.Endpoint, global.Config.Minio.Port, global.Config.Minio.BucketName, objectName)

	if target.ID != 0 && target.Status != 1 {
		target.Filename = objectName
		target.Status = 1
		result := global.DB.Save(&target)
		if result.Error != nil {
			log.Fatal("failed to update file: ", result.Error)
		}
		return fileURL
	}

	newfile := &models.File{
		Filename: objectName,
		Hash:     hash,
		Original: file.Filename,
		Size:     file.Size,
		Status:   1,
		CreateAt: time.Now(),
		UpdateAt: time.Now(),
	}
	log.Println(newfile)
	result := global.DB.Create(newfile)
	if result.Error != nil {
		log.Fatal("failed to create file: ", result.Error)
		panic(errors.ErrUploadFile) // 抛出自定义错误
	}
	return fileURL
}

func UploadFileChunk(file *multipart.FileHeader, hash string, fileHash string, index string, total string) string {
	src, err := file.Open()
	if err != nil {
		panic(errors.ErrUploadFile) // 抛出自定义错误
	}
	defer src.Close()
	var target models.File
	global.DB.Where("hash = ?", fileHash).First(&target)
	if target.ID != 0 && target.Status == 1 {
		return fmt.Sprintf("http://%s:%s/%s/%s", global.Config.Minio.Endpoint, global.Config.Minio.Port, global.Config.Minio.BucketName, target.Filename)
	}
	// 文件第一次上传
	if target.ID == 0 {
		filename := fmt.Sprintf("%d-%s", time.Now().Unix(), file.Filename) // 使用当前时间生成唯一的文件名
		newfile := &models.File{
			Filename: filename,
			Hash:     fileHash,
			Original: file.Filename,
			Size:     file.Size,
			Status:   1,
			CreateAt: time.Now(),
			UpdateAt: time.Now(),
		}
		result := global.DB.Create(newfile)
		if result.Error != nil {
			panic(errors.ErrUploadFile) // 抛出自定义错误
		}
	}
	// 文件之前上传过
	if target.ID != 0 && target.Status == 0 {

	}

	objectName := fmt.Sprintf("%s-%s", fileHash, index)
	_, err = global.MinioClient.PutObject(context.Background(), global.Config.Minio.BucketName, objectName, src, file.Size, minio.PutObjectOptions{ContentType: file.Header.Get("Content-Type")})
	if err != nil {
		panic(errors.ErrUploadFile) // 抛出自定义错误
	}
	return ""
}

func List() []models.File {
	var files []models.File
	global.DB.Find(&files)
	return files
}
