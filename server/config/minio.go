package config

type Minio struct {
	AccessKey  string `mapstructure:"access_key" json:"access_key" yaml:"access_key"`
	SecretKey  string `mapstructure:"secret_key" json:"secret_key" yaml:"secret_key"`
	Port       string `mapstructure:"port" json:"port" yaml:"port"`
	Endpoint   string `mapstructure:"end_point" json:"end_point" yaml:"end_point"`
	BucketName string `mapstructure:"bucket_name" json:"bucket_name" yaml:"bucket_name"`
}
