# http

> http1

  1. 缓存控制If-Modified-Since,Expires；

> http1.1

  1. 解决http1中的每次一个接口请求都需要重新握手，返回新结果的缺点（keep-alive）存在队头阻塞问题；
  2. 更健全的缓存机制处理，比如：If-Match，If-None-Match，Entity tag，If-Unmodified-Since；
  3. 增加host字段;
  4. 带宽优化及网络连接的使用（允许发送部分资源内容）；

> http2

 1. 多路复用（解决1.1中的队头阻塞请求问题）；
 2. 新的二进制格式传输协议；
 3. header头压缩；
 4. 服务端推送；