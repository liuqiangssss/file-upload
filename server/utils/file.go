package utils

import (
	"os"
	"path/filepath"
)

func CheckFileExists(dir, fileName string) (bool, error) {
	filePath := filepath.Join(dir, fileName)
	_, err := os.Stat(filePath)
	if err == nil {
		// File exists
		return true, nil
	}
	if os.IsNotExist(err) {
		// File does not exist
		return false, nil
	}
	// Some other error occurred
	return false, err
}
