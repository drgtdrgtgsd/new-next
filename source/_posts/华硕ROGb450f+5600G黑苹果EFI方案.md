---
title: 华硕ROGb450f+5600G黑苹果EFI方案
cover: "https://photo.gaoliang.icu/file/592220ef0aed68a3f5eee.jpg"
tags:
- 系统
- EFI文件
- 黑苹果
---
## 视频教程
<div style="position: relative; padding: 30% 45%;">
<iframe style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;" src="//player.bilibili.com/player.html?isOutside=true&aid=112984399612120&bvid=BV1otp6exEN2&cid=500001654097227&p=1"  scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
</div>

## 制作参考

+   [AMD完美黑苹果系列教程『全站最细』\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1TZ421g7zN/?spm_id_from=333.788)     1、2、3集
    
+   GitHub - ChefKissInc/NootedRed: The AMD Vega iGPU support patch kext. No commercial use.
    
+   GitHub - Lengran1992/Hackintosh: Share my OC EFI  网卡出处
    

首先说一下为什么AMD核显可以驱动黑苹果：

一直以来，AMD 处理器的核显在黑苹果中是无法被驱动的，这个情况延续到锐龙时代显得有点可惜，因为 Zen 架构的大放异彩，AMD 处理器市场占有率逐步走高，玩家群体间有很大一部分带核显的锐龙处理器存量

所以许许多多的AMD开发者努力，如今这个新出炉的驱动 NootedRed.kext 正在将以往的不可能逐步变为可能。目前该驱动还在持续开发过程中，还存在一些兼容性问题，相信随着时间的推移，这些影响使用体验的问题绝大部分会被适当解决。

![6852d29270c3c5755f672.jpg](https://photo.gaoliang.icu/file/6852d29270c3c5755f672.jpg)

## 制作的经验

![986484020fc6ded5ac5de.jpg](https://photo.gaoliang.icu/file/986484020fc6ded5ac5de.jpg)

制作了EFI发现网卡无法驱动，并且频繁死机

解决办法：暂停网卡驱动然后修复网卡驱动

非常感谢这位的网卡驱动：

![18a6c41b716648a22abf9.jpg](https://photo.gaoliang.icu/file/18a6c41b716648a22abf9.jpg)

![815354b17e867d87a4f01.jpg](https://photo.gaoliang.icu/file/815354b17e867d87a4f01.jpg)

![99bfc639154a6166266e6.jpg](https://photo.gaoliang.icu/file/99bfc639154a6166266e6.jpg)

## 释放镜像

也可以不需要u盘

dmg用balenaEtcher对你指定的盘符释放

## **最后**

**BIOS一定要设置一下：制作参考第一个有是视频**

**尤其是那个核显缓存调一下（我的话是4G）**

![592220ef0aed68a3f5eee.jpg](https://photo.gaoliang.icu/file/592220ef0aed68a3f5eee.jpg)

![8762a69ec07d5664855be.jpg](https://photo.gaoliang.icu/file/8762a69ec07d5664855be.jpg)

## **EFI链接：**

**https://www.123pan.com/s/2xFLVv-1vR1h.html**
提取码:3147

## 休闲中。。。。。
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=1428179238&auto=1&height=66"></iframe>