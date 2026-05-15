---
title: TLS Record 层分片机制对网络中间件解析行为的影响研究
cover: "https://user-images.githubusercontent.com/58414694/154399776-6790111e-3646-4e25-9ddb-2e1ad2975feb.png"
tags:
- 网络
- 渗透
- 防火墙
---

参考：https://upb-syssec.github.io/blog/2023/record-fragmentation/
AMD https://ieeexplore.ieee.org/document/11023326/
## 摘要

TCP 分片（TCP Fragmentation）长期以来一直是网络协议分析中的一个经典课题。然而，随着传输层安全协议（TLS）的广泛普及，仅仅关注 TCP 层面的分片已不足以应对复杂的网络环境。本文提出并分析了一种基于 TLS 协议标准的**“TLS 记录分片”（TLS Record Fragmentation）**机制。研究表明，该机制完全符合 RFC 规范，但会对现有的流量审计设备（DPI）和中间件（Middleboxes）的解析逻辑构成显著挑战。我们分析了该机制的原理、服务器支持度，并探讨了下一代网络中间件应如何改进以适应这种合法的协议形态。

---

## 1. 技术背景

### 1.1 TLS 协议的分层结构
TLS 协议旨在为互联网流量提供机密性、真实性和完整性。尽管目前绝大多数 HTTP 流量都通过 HTTPS（HTTP over TLS）传输，但在加密数据交换之前，必须进行明文握手（Handshake）。

这个未加密的握手过程包含了一个关键字段：**服务器名称指示（SNI, Server Name Indication）**。网络中间件通常利用 SNI 来识别流量的目标域名。
<img src="\images\45bafea36d9427c4f9e887a4ac97dffb.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

### 1.2 TCP 分片与流重组
TCP 是基于“流”（Stream）的协议。应用层数据被分割成多个 TCP 段（Segment）。网络分析设备为了提取应用层信息，必须在内存中维护 TCP 连接的状态，将乱序或分片的 TCP 段进行**流重组（Stream Reassembly）**。由于维护状态需要消耗内存和计算资源，早期的部分中间件往往会忽略复杂的 TCP 分片，但现代设备已基本具备了处理 TCP 分片的能力。

<img src="\images\gergreg.jpg" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

---

## 2. TLS 记录分片 (TLS Record Fragmentation)

与 TCP 不同，TLS 是基于**“记录”（Record）**的协议。根据 RFC 5246 和 RFC 8446，TLS 协议栈由两层组成：
1.  **TLS Record Protocol（记录层）**
2.  **TLS Handshake Protocol（握手层）**

### 2.1 机制原理
在常见的实现中，一个握手消息（如 `ClientHello`）通常被封装在一个独立的 TLS Record 中。然而，协议标准**允许**将一个握手消息分割成多个碎片，并封装在多个连续的 TLS Record 中。
**图示：常规 vs 分片**
图片：
<img src="\images\tls pt.jpg" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>

文字说明：
```text
[常规模式 - Single Record]
+-------------------------------------------------------+
| TLS Record Header | Handshake Header | SNI Extension  |
+-------------------------------------------------------+

[分片模式 - Fragmented Records]
+-----------------------------------+   +-----------------------------------+
| Record Header | Handshake Part 1  |   | Record Header | Handshake Part 2  |
|               | (包含 SNI 前半部分)|   |               | (包含 SNI 后半部分)|
+-----------------------------------+   +-----------------------------------+
```

## 2.2 对流量识别的影响

这种分片完全是在 **TLS 应用层**完成的。即使这两个 TLS Record 被打包在同一个 **TCP 数据包**中，对于那些只进行简单“模式匹配”（Pattern Matching）或缺乏 TLS 协议栈解析能力的中间件来说，**SNI 关键字**在物理字节流上是被“切断”的。

这意味着，为了正确识别目标域名，中间件不仅需要完成 **TCP 流重组**，还必须实现**TLS 记录层的重组逻辑**，这显著增加了设备解析引擎的复杂度。

## 3. 实验分析与验证

为了评估这种机制在真实网络环境中的表现，以及主流服务器的兼容性，我们进行了广泛的测试。

### 3.1 测试方法
我们构建了一个遵循 RFC 标准的客户端代理工具，能够对发出的 `ClientHello` 消息进行不同粒度的 TLS Record 切分：
* **Early Split**: 在 SNI 扩展字段之前切分。
* **Late Split**: 在 SNI 扩展字段中间切分。

### 3.2 中间件的鲁棒性测试
<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <thead>
        <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dee2e6;">
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Fragmentation (分片方式)</th>
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Split (切分位置)</th>
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Circumvents Censor (能否绕过)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">None</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">-</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">-</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;" rowspan="2">TCP</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">Early</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; color: green; font-weight: bold;">Yes</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">Late</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">-</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;" rowspan="2">TLS</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">Early</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; color: green; font-weight: bold;">Yes</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">Late</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; color: green; font-weight: bold;">Yes</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;" rowspan="2">TLS + TCP</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">Early</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; color: green; font-weight: bold;">Yes</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">Late</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; color: green; font-weight: bold;">Yes</td>
        </tr>
    </tbody>
</table>

在针对多种网络安全网关和流量审计设备的测试中，我们发现：
* **TCP 分片**：大多数现代设备能正确处理。
* **TLS 记录分片**：相当一部分依赖 DPI（深度包检测）的中间件无法提取被切分到不同 Record 中的 SNI 信息。

这表明，当前的许多网络中间件在设计时，假设了“一个握手消息对应一个记录”的简化模型，从而导致了漏检（False Negative）的情况。

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <thead>
        <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dee2e6;">
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">List (域名列表)</th>
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Scanned Domains (扫描数量)</th>
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Support TLS record fragmentation (支持率)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">CitizenLab</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">1,135</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">1,092 (96.21%)</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">Tranco Top 1M</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">830,357</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">766,909 (92.36%)</td>
        </tr>
    </tbody>
</table>

## 4. 服务器支持度调查 (Server Support)

一项关键的问题是：*这种分片后的数据包，目标服务器能看懂吗？*

为了回答这个问题，我们对 Tranco Top 1M 域名列表进行了扫描分析。


有趣的是，如下所示，TLS 记录分片在 Tranco Top 1M 列表的**所有排名中**都得到了广泛的支持（曲线保持平稳，未随排名下降而波动）。
<img src="\images\a2e03909-f896-419d-8260-0fef4a9a3534.png" width="100%" height="100%" title="拼写检查工具Grammarly." alt="拼写检查工具Grammarly."/>
总体而言，我们发现截至目前，TLS 服务器普遍支持 TLS 记录分片。这不仅适用于互联网上的顶级 TLS 服务器，也适用于受审查的域名。这证明该机制是 TLS 协议栈标准实现的一部分，具有极高的兼容性。
**结果解读：**
超过 **92%** 的互联网主流服务器完全支持 TLS Record 分片。这证明了该机制是 TLS 协议栈标准实现的一部分（如 OpenSSL, BoringSSL 等均原生支持），而非某种非标准的畸形流量。

## 5. 讨论与建议

### 5.1 为什么中间件解析会失效？
许多中间件为了追求高吞吐量和低延迟，采用了“即时解析”策略，而牺牲了完整的协议栈重组能力。它们往往只检查数据包的前几个字节寻找 TLS 头，一旦发现结构不符合预期的“标准型”，便可能跳过检测或发生解析错误。

### 5.2 对网络安全设备的建议
随着协议的演进（如 TLS 1.3 的普及和 ECH 的提案），流量特征正变得越来越隐蔽。对于防火墙、WAF 和流量审计系统的开发者，我们建议：

* **放弃基于特征码的简单匹配**：不再依赖静态的字节序列匹配。
* **实现全栈重组**：必须在解析引擎中引入完整的 TLS 记录层状态机，能够缓存并重组跨记录的握手消息。
* **关注 RFC 边界情况**：在产品测试阶段，应加入针对协议分片、乱序等边缘情况的覆盖测试。

### 5.3 浏览器的角色
目前，浏览器通常不会主动发送分片的 TLS Record（除非消息过大）。但如果浏览器厂商未来为了提高隐私保护或传输效率而引入这种机制，现有的中间件生态可能会面临大规模失效的风险。

## 6. 结论

本文探讨了 TLS Record 分片这一符合标准的协议特性。研究发现，尽管绝大多数服务器能够正常处理此类流量，但许多网络中间件缺乏相应的解析能力。这提醒网络协议设计者和安全设备开发者，必须重视协议标准中的灵活性条款，构建更加健壮（Robust）的流量分析系统。