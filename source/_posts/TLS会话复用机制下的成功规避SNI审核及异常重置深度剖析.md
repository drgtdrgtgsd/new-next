---
title: TLS会话复用机制下的成功规避SNI审核及异常重置深度剖析——基于TLS与TCP协议层的抓包分析及SNI阻断研究
cover: "https://img.cdn1.vip/i/690249709cc7a_1761757552.webp"
tags:
- 网络
- tls
- couldflare
---
## 前言:
www.高粱.top 不提供任何海外图片加速
如果图片加载不出来请自行解决
封面图片源：ts2.tc.mm.bing.net
图片存放源：edgeone
## 背景与研究动机:
#### 背景：
在现代网络架构中，TLS（Transport Layer Security）协议作为保障数据传输机密性与完整性的核心机制，其交互过程的稳定性直接决定了应用层服务的可用性。本次研究聚焦于一个典型的 “访问时好时坏” 现象，通过 Wireshark 抓包工具对成功与失败场景进行深度拆解，旨在从协议栈底层揭示TCP 连接管理、TLS 握手流程、CDN 会话复用策略及SNI（Server Name Indication）阻断机制之间的复杂关联，为网络运维、安全分析等领域提供可复用的排查方法论。
#### 研究动机：
最近发现了一个神奇现象，在tls协议的网站加上在hosts加上对应ip能正常打开，研究半天，当时我以为浏览器是默认打开quic
直到我第二天凌  晨发现突然打不开，一直在已重置连接，这下意识到可能是sni阻断了
于是打开抓包工具复现情况，在tcp握手后tls第一次握手没有返回正常server hello而是出现了一大堆的tcp rst阻断
<img src="\images\8136d60e-6b45-4ca6-9237-407c9dd6e33c.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>
<img src="\images\bc15b718-38f5-4544-8fd5-1a43c4c9ec78.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>


### 关于异常重置深度剖析
#### 首先要知道为什么会重置
第一次连接网页首先tcp会进行3次握手
第一次握手：客户端发送SYN包请求连接
第二次握手：服务端回应SYN/ACK包，确认收到并提供初始序列号
第三次握手：客户端发送ACK包确认服务端的序列号，双方进入连接状态
<img src="\images\17742457d403c9b8fe8ee95c61944bf3.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

##### 然后到tls四次握手
第一次握手：客户端发出请求（Client Hello）
第二次握手：服务器回应（Server Hello）
第三次握手：客户端回应（客户端收到服务器的回应后，首先验证服务器证书）
第四次握手：服务器回应
<img src="\images\9d0a1c0819ada171ff1d79ede8cf19ba.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>
<img src="\images\v2-6807f239f8bed250c31466604586d4c7_1440w.jpg" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>
在tls第一次握手后，其中会发送Client Hello报文消息
跟服务器打招呼，其中主要携带：
客户端的TLS版本号（Version）、
客户端支持的加密套件列表（Cipher Suites）、
客户端生成的随机数（Client Random）
其中会有sni明文信息

<img src="\images\v2-f7130881122df3953474a2bfc9e7ede1_r.jpg" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

###### 就在sever_name里面
<img src="\images\qq_pic_merged_1761843478606.jpg" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

###### 数据经过防火墙，防火墙会检测sni明文名称，如果在黑名单，则会发送tcp rst阻断，其表现为已重置连接

#### 问题来了，在进行正常握手后，第二次不用特殊方式改hosts能直接进去，这是为什么呢？
##### 那么我们来抓个包吧：
###### 这是访问x的记录，前面用特殊办法访问了一次
重新访问可以看见
<img src="\images\屏幕截图 2025-10-31 011014.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

开始并没有做tcp还有tls握手，直接开始传数据了
这也说明，tcp一直在连接，tls也没有sni校验
这就是tcp与tls会话复用，一般在应用层实现
经过查找ip，x的服务器竟然用的是couldflare的cdn，那么问题突然就通了
像couldflare这些cdn厂商，他们允许多应用/线程/实例 可以共用一个管道，就能达到复用的效果
###### 所以就会出现无需tcp和sni再握手

## 结论
###### 本次研究通过对 “成功 / 失败” 两种场景的抓包分析，揭示了TLS 会话复用的时效性与SNI 阻断的靶向性是导致 “访问时好时坏” 的核心原因。从技术本质看，这是 CDN 性能优化策略（会话复用）与网络访问管控策略（SNI 阻断）在协议层的一次 “碰撞”。
###### 对网络工程师而言，此类分析不仅能快速定位问题根源，更能深入理解 TCP、TLS、CDN 等技术的协同与冲突逻辑；对普通用户而言，也能从 “网页能不能打开” 的表象，窥见网络世界底层协议的精妙博弈。未来，随着 QUIC 协议的普及（其内置的 0-RTT 握手也涉及会话复用），类似的 “协议层策略冲突” 可能会以新的形式出现，值得持续关注与研究。
###### 但这也仅限于允许多应用/线程/实例 可以共用一个管道的才能达到复用效果

## 软件想法
###### 既然正常握手一次，会有一段时间无需再次重复进行，那么在代理软件进行改造将可以复用的网站进行特殊管理，这样不仅速度快，而且对vps的消耗也会减少