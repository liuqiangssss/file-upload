package models

import "time"

type Chunk struct {
	ID       uint      `json:"id" gorm:"primaryKey"`
	FileId   uint      `json:"file_id" gorm:"not null;comment:文件ID"`
	Index    int       `json:"index" gorm:"not null;comment:分片索引"`
	Name     string    `json:"name" gorm:"not null;comment:分片名"`
	Size     int64     `json:"size" gorm:"not null;comment:分片大小"`
	Hash     string    `json:"hash" gorm:"not null;comment:分片哈希"`
	CreateAt time.Time `json:"create_at"`
	UpdateAt time.Time `json:"update_at"`
}
