package bootstrap

import (
	"context"
	"file-upload/common/middleware"
	"file-upload/global"
	"file-upload/routers"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func setupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.CorsMiddleware())
	//// 前端项目静态资源
	//router.StaticFile("/", "./static/dist/index.html")
	//router.Static("/assets", "./static/dist/assets")
	//router.StaticFile("/favicon.ico", "./static/dist/favicon.ico")
	//// 其他静态资源
	//router.Static("/public", "./static")
	router.Static("/static", "./static/")

	// 注册 api 分组路由
	apiGroup := router.Group("/api")
	routers.SetApiGroupRoutes(apiGroup)

	return router
}

// RunServer 启动服务器
func RunServer() {
	r := setupRouter()

	srv := &http.Server{
		Addr:    ":" + global.Config.App.Port,
		Handler: r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// 等待中断信号以优雅地关闭服务器（设置 5 秒的超时时间）
	quit := make(chan os.Signal)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	log.Println("Server exiting")
}
