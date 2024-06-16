package config

type Configuration struct {
	App      App      `mapstructure:"app" json:"app" yaml:"app"`
	Minio    Minio    `mapstructure:"minio" json:"minio" yaml:"minio"`
	Log      Log      `mapstructure:"log" json:"log" yaml:"log"`
	Database Database `mapstructure:"database" json:"database" yaml:"database"`
}
