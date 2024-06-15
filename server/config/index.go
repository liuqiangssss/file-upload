package config

type Configuration struct {
	App   App   `mapstructure:"app" json:"app" yaml:"app"`
	Minio Minio `mapstructure:"minio" json:"minio" yaml:"minio"`
}
