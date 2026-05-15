---
title: 在TLS传输层规避SNI审查实现直连
cover: "https://s.secrss.com/anquanneican/5bcb1202f187332977b1da3b90afe917.png"
tags:
- 网络
- tls分片
- couldflare
---
## 前言:
www.高粱.top 不提供任何海外图片加速
如果图片加载不出来请自行解决
封面图片源：GitHub
图片存放源：edgeone
## 研究背景:
#### 我们知道内陆连接境外服务器，可能会有：
##### 1、dns污染
##### 2、sni阻断
##### 3、tcp重置
##### 4、深度包检测DPI
##### 5、协议检测还有通过时序判断等
##### 最近看了一则报告,x加入cloudflare网络,说明服务器是在cloudflare所有ip服务器,我们知道cloudflare很多ip在中国是没有黑名单的，确实如此通过域名发送了ping包都可以ping通
<img src="\images\ping x.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

### 那么是不是说明我们可以直连x ？？？
## 过程
#### 很明确我们现在最主要问题是sni问题
##### 先讲一下tls和sni是什么：
###### TLS：
传输层安全性协议（TLS）[&是一种设计用来保护网络通信安全的协议，它通过加密和身份验证来确保数据传输的安全性和完整性。TLS协议是在安全套接字层（SSL）的基础上发展而来的，目前最广泛使用的版本是TLS 1.2&]，而TLS 1.3是最新的版本，提供了更高的安全性和效率。
<img src="\images\26d4cd1c44d8e3edc587aa65efb4f8a0.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>
TLS 在 OSI 模型 中位于 传输层和应用层之间

###### sni:
SNI 是 TLS 协议（以前称为 SSL 协议）的扩展
该协议在 HTTPS 中使用，它包含在 TLS/SSL 握手流程中
以确保客户端设备能够看到他们尝试访问的网站的正确 SSL 证书
在**初始握手阶段**，客户端向服务器发送“客户端问候”消息。此消息包含 SNI 字段，其中包含客户端想要连接的域信息的明文内容,这些明文内容会被检测，即使使用了doh也照样，典型就是tcp重置，或者是直接丢包让客户端一直处于加载中
<img src="\images\b6cf25748eaa96f005b8caecc2cd5b1f.webp" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

##### 那么有没有办法可以实现sni明文不被看见呢？
1、用quic协议，虽然说quic协议实现了加密sni明文字段但是很有可能会被qos效果会非常不好

2、sni伪装，之前看到了GitHub一个项目：https://github.com/SpaceTimee/Sheas-Cealer
原理：利用 Chromium 内核的启动参数特性伪造 SNI 拓展标记
具体：https://nicebowl.fun/24_8

3、tls分片，其实这个也不是什么新东西早在xray就实现了：https://xtls.github.io/config/outbounds/freedom.html
在GitHub有通过tls分片来达到访问的项目：https://github.com/maoist2009/TlsFragment

##### 这里我们来用tls分片
这个软件原理：将TCP连接Client的第一个包（这个包一般来说是TLS ClientHello，一般应用层不会分片）在TLS层和TCP层分别进行分片，将sni拆入多个包以绕过。

下载软件后，安装好之后，我们运行，打开设置代理
ip为：127.0.0.1
端口：2500
打开chrome你会发现x能够打开并且搜索地区是中国大陆
<img src="\images\sni x.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

<img src="\images\grok kk.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

## 杂碎
##### 如果你觉得访问x很慢，可以试试CF优选ip工具测速
###### 此工具修改ip在py的config文件里

###### 当然除了x你可以利用这来访问Google和YouTube还有别的网站也是有效的，前提你要找到对应服务器没在黑名单上的ip

<img src="\images\IP.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

## 最后
###### 本文章纯技术探究，请勿用于违反行为！！！

### 如还有其他问题请在评论区发！
## 发癫专区：
啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
好想去看鹿乃10周年演出，本人来中国了，16号的上海听说非常好，这几天一堆事广州也去不了😭😭😭
下次演出我必来
<img src="\images\qq_pic_merged_1760674875903.jpg" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>
<img src="\images\Image_1760621301154.jpg" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

<div style="position: relative; padding: 30% 45%;">
<iframe style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;" src="//player.bilibili.com/player.html?isOutside=true&aid=115384631951924&bvid=BV1PcWzzbEmA&cid=33131725232&p=1"  scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
</div>