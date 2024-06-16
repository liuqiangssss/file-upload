package response

// BusinessError 定义自定义业务错误
type Response struct {
	Code    int         `json:"code"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

// NewBusinessError 创建新的业务错误
func NewBusinessError(code int, message string) *Response {
	return &Response{
		Code:    code,
		Message: message,
	}
}

func Success(data interface{}) *Response {
	return &Response{
		Code:    0,
		Data:    data,
		Message: "ok",
	}
}
