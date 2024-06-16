package bootstrap

import (
	"file-upload/global"
	"file-upload/utils"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
	"os"
	"time"
)

var (
	level   zapcore.Level // zap 日志等级
	options []zap.Option  // zap 配置项
)

func InitializeLog() {
	createRootDir()
	setLogLevel()
	if global.Config.Log.ShowLine {
		options = append(options, zap.AddCaller())
	}

	// 初始化
	logger := zap.New(getZapCore(), options...)
	global.Log = logger
}

func createRootDir() {
	if ok, _ := utils.PathExists(global.Config.Log.RootDir); !ok {
		_ = os.Mkdir(global.Config.Log.RootDir, os.ModePerm)
	}
}

func setLogLevel() {
	switch global.Config.Log.Level {
	case "debug":
		level = zap.DebugLevel
		options = append(options, zap.AddStacktrace(level))
	case "info":
		level = zap.InfoLevel
	case "warn":
		level = zap.WarnLevel
	case "error":
		level = zap.ErrorLevel
		options = append(options, zap.AddStacktrace(level))
	case "dpanic":
		level = zap.DPanicLevel
	case "panic":
		level = zap.PanicLevel
	case "fatal":
		level = zap.FatalLevel
	default:
		level = zap.InfoLevel
	}
}

// 扩展 Zap
func getZapCore() zapcore.Core {
	var encoder zapcore.Encoder

	// 调整编码器默认配置
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.EncodeTime = func(time time.Time, encoder zapcore.PrimitiveArrayEncoder) {
		encoder.AppendString(time.Format("[" + "2006-01-02 15:04:05.000" + "]"))
	}
	encoderConfig.EncodeLevel = func(l zapcore.Level, encoder zapcore.PrimitiveArrayEncoder) {
		encoder.AppendString(global.Config.App.Env + "." + l.String())
	}

	// 设置编码器
	if global.Config.Log.Format == "json" {
		encoder = zapcore.NewJSONEncoder(encoderConfig)
	} else {
		encoder = zapcore.NewConsoleEncoder(encoderConfig)
	}
	// 使用NewMultiWriteSyncer 方法加入多个日志写入器 ,写入文件同时控制台打印
	var writes = []zapcore.WriteSyncer{getLogWriter(), zapcore.AddSync(os.Stdout)}
	return zapcore.NewCore(encoder, zapcore.NewMultiWriteSyncer(writes...), level)
}

// 使用 lumberjack 作为日志写入器
func getLogWriter() zapcore.WriteSyncer {
	file := &lumberjack.Logger{
		Filename:   global.Config.Log.RootDir + "/" + global.Config.Log.Filename,
		MaxSize:    global.Config.Log.MaxSize,
		MaxBackups: global.Config.Log.MaxBackups,
		MaxAge:     global.Config.Log.MaxAge,
		Compress:   global.Config.Log.Compress,
	}

	return zapcore.AddSync(file)
}
