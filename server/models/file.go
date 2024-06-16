package models

import "time"

type File struct {
	ID       uint      `json:"id" gorm:"primaryKey"`
	Filename string    `json:"filename" gorm:"column:filename;not null;comment:文件名"`
	Size     int64     `json:"size" gorm:"not null;comment:文件大小"`
	Original string    `json:"original" gorm:"not null;comment:原文件名"`
	Hash     string    `json:"hash" gorm:"not null;comment:文件哈希"`
	Status   int32     `json:"status" gorm:"not null;comment:上传状态"` // 0 | 1 | 2  0 上传中 1 成功 2 失败
	CreateAt time.Time `json:"create_at"`
	UpdateAt time.Time `json:"update_at"`
}
