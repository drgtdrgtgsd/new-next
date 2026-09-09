---
date: 2024-03-17 22:06:15
title: TLS Record 灞傚垎鐗囨満鍒跺缃戠粶涓棿浠惰В鏋愯涓虹殑褰卞搷鐮旂┒
cover: "https://user-images.githubusercontent.com/58414694/154399776-6790111e-3646-4e25-9ddb-2e1ad2975feb.png"
tags:
- 缃戠粶
- 娓楅€?
- 闃茬伀澧?
---

鍙傝€冿細https://upb-syssec.github.io/blog/2023/record-fragmentation/
AMD https://ieeexplore.ieee.org/document/11023326/
## 鎽樿

TCP 鍒嗙墖锛圱CP Fragmentation锛夐暱鏈熶互鏉ヤ竴鐩存槸缃戠粶鍗忚鍒嗘瀽涓殑涓€涓粡鍏歌棰樸€傜劧鑰岋紝闅忕潃浼犺緭灞傚畨鍏ㄥ崗璁紙TLS锛夌殑骞挎硾鏅強锛屼粎浠呭叧娉?TCP 灞傞潰鐨勫垎鐗囧凡涓嶈冻浠ュ簲瀵瑰鏉傜殑缃戠粶鐜銆傛湰鏂囨彁鍑哄苟鍒嗘瀽浜嗕竴绉嶅熀浜?TLS 鍗忚鏍囧噯鐨?*鈥淭LS 璁板綍鍒嗙墖鈥濓紙TLS Record Fragmentation锛?*鏈哄埗銆傜爺绌惰〃鏄庯紝璇ユ満鍒跺畬鍏ㄧ鍚?RFC 瑙勮寖锛屼絾浼氬鐜版湁鐨勬祦閲忓璁¤澶囷紙DPI锛夊拰涓棿浠讹紙Middleboxes锛夌殑瑙ｆ瀽閫昏緫鏋勬垚鏄捐憲鎸戞垬銆傛垜浠垎鏋愪簡璇ユ満鍒剁殑鍘熺悊銆佹湇鍔″櫒鏀寔搴︼紝骞舵帰璁ㄤ簡涓嬩竴浠ｇ綉缁滀腑闂翠欢搴斿浣曟敼杩涗互閫傚簲杩欑鍚堟硶鐨勫崗璁舰鎬併€?

---

## 1. 鎶€鏈儗鏅?

### 1.1 TLS 鍗忚鐨勫垎灞傜粨鏋?
TLS 鍗忚鏃ㄥ湪涓轰簰鑱旂綉娴侀噺鎻愪緵鏈哄瘑鎬с€佺湡瀹炴€у拰瀹屾暣鎬с€傚敖绠＄洰鍓嶇粷澶у鏁?HTTP 娴侀噺閮介€氳繃 HTTPS锛圚TTP over TLS锛変紶杈擄紝浣嗗湪鍔犲瘑鏁版嵁浜ゆ崲涔嬪墠锛屽繀椤昏繘琛屾槑鏂囨彙鎵嬶紙Handshake锛夈€?

杩欎釜鏈姞瀵嗙殑鎻℃墜杩囩▼鍖呭惈浜嗕竴涓叧閿瓧娈碉細**鏈嶅姟鍣ㄥ悕绉版寚绀猴紙SNI, Server Name Indication锛?*銆傜綉缁滀腑闂翠欢閫氬父鍒╃敤 SNI 鏉ヨ瘑鍒祦閲忕殑鐩爣鍩熷悕銆?
<img src="\images\45bafea36d9427c4f9e887a4ac97dffb.png" width="100%" height="100%" title="鎷煎啓妫€鏌ュ伐鍏稧rammarly." alt="鎷煎啓妫€鏌ュ伐鍏稧rammarly."/>

### 1.2 TCP 鍒嗙墖涓庢祦閲嶇粍
TCP 鏄熀浜庘€滄祦鈥濓紙Stream锛夌殑鍗忚銆傚簲鐢ㄥ眰鏁版嵁琚垎鍓叉垚澶氫釜 TCP 娈碉紙Segment锛夈€傜綉缁滃垎鏋愯澶囦负浜嗘彁鍙栧簲鐢ㄥ眰淇℃伅锛屽繀椤诲湪鍐呭瓨涓淮鎶?TCP 杩炴帴鐨勭姸鎬侊紝灏嗕贡搴忔垨鍒嗙墖鐨?TCP 娈佃繘琛?*娴侀噸缁勶紙Stream Reassembly锛?*銆傜敱浜庣淮鎶ょ姸鎬侀渶瑕佹秷鑰楀唴瀛樺拰璁＄畻璧勬簮锛屾棭鏈熺殑閮ㄥ垎涓棿浠跺線寰€浼氬拷鐣ュ鏉傜殑 TCP 鍒嗙墖锛屼絾鐜颁唬璁惧宸插熀鏈叿澶囦簡澶勭悊 TCP 鍒嗙墖鐨勮兘鍔涖€?

<img src="\images\gergreg.jpg" width="100%" height="100%" title="鎷煎啓妫€鏌ュ伐鍏稧rammarly." alt="鎷煎啓妫€鏌ュ伐鍏稧rammarly."/>

---

## 2. TLS 璁板綍鍒嗙墖 (TLS Record Fragmentation)

涓?TCP 涓嶅悓锛孴LS 鏄熀浜?*鈥滆褰曗€濓紙Record锛?*鐨勫崗璁€傛牴鎹?RFC 5246 鍜?RFC 8446锛孴LS 鍗忚鏍堢敱涓ゅ眰缁勬垚锛?
1.  **TLS Record Protocol锛堣褰曞眰锛?*
2.  **TLS Handshake Protocol锛堟彙鎵嬪眰锛?*

### 2.1 鏈哄埗鍘熺悊
鍦ㄥ父瑙佺殑瀹炵幇涓紝涓€涓彙鎵嬫秷鎭紙濡?`ClientHello`锛夐€氬父琚皝瑁呭湪涓€涓嫭绔嬬殑 TLS Record 涓€傜劧鑰岋紝鍗忚鏍囧噯**鍏佽**灏嗕竴涓彙鎵嬫秷鎭垎鍓叉垚澶氫釜纰庣墖锛屽苟灏佽鍦ㄥ涓繛缁殑 TLS Record 涓€?
**鍥剧ず锛氬父瑙?vs 鍒嗙墖**
鍥剧墖锛?
<img src="\images\tls pt.jpg" width="100%" height="100%" title="鎷煎啓妫€鏌ュ伐鍏稧rammarly." alt="鎷煎啓妫€鏌ュ伐鍏稧rammarly."/>

鏂囧瓧璇存槑锛?
```text
[甯歌妯″紡 - Single Record]
+-------------------------------------------------------+
| TLS Record Header | Handshake Header | SNI Extension  |
+-------------------------------------------------------+

[鍒嗙墖妯″紡 - Fragmented Records]
+-----------------------------------+   +-----------------------------------+
| Record Header | Handshake Part 1  |   | Record Header | Handshake Part 2  |
|               | (鍖呭惈 SNI 鍓嶅崐閮ㄥ垎)|   |               | (鍖呭惈 SNI 鍚庡崐閮ㄥ垎)|
+-----------------------------------+   +-----------------------------------+
```

## 2.2 瀵规祦閲忚瘑鍒殑褰卞搷

杩欑鍒嗙墖瀹屽叏鏄湪 **TLS 搴旂敤灞?*瀹屾垚鐨勩€傚嵆浣胯繖涓や釜 TLS Record 琚墦鍖呭湪鍚屼竴涓?**TCP 鏁版嵁鍖?*涓紝瀵逛簬閭ｄ簺鍙繘琛岀畝鍗曗€滄ā寮忓尮閰嶁€濓紙Pattern Matching锛夋垨缂轰箯 TLS 鍗忚鏍堣В鏋愯兘鍔涚殑涓棿浠舵潵璇达紝**SNI 鍏抽敭瀛?*鍦ㄧ墿鐞嗗瓧鑺傛祦涓婃槸琚€滃垏鏂€濈殑銆?

杩欐剰鍛崇潃锛屼负浜嗘纭瘑鍒洰鏍囧煙鍚嶏紝涓棿浠朵笉浠呴渶瑕佸畬鎴?**TCP 娴侀噸缁?*锛岃繕蹇呴』瀹炵幇**TLS 璁板綍灞傜殑閲嶇粍閫昏緫**锛岃繖鏄捐憲澧炲姞浜嗚澶囪В鏋愬紩鎿庣殑澶嶆潅搴︺€?

## 3. 瀹為獙鍒嗘瀽涓庨獙璇?

涓轰簡璇勪及杩欑鏈哄埗鍦ㄧ湡瀹炵綉缁滅幆澧冧腑鐨勮〃鐜帮紝浠ュ強涓绘祦鏈嶅姟鍣ㄧ殑鍏煎鎬э紝鎴戜滑杩涜浜嗗箍娉涚殑娴嬭瘯銆?

### 3.1 娴嬭瘯鏂规硶
鎴戜滑鏋勫缓浜嗕竴涓伒寰?RFC 鏍囧噯鐨勫鎴风浠ｇ悊宸ュ叿锛岃兘澶熷鍙戝嚭鐨?`ClientHello` 娑堟伅杩涜涓嶅悓绮掑害鐨?TLS Record 鍒囧垎锛?
* **Early Split**: 鍦?SNI 鎵╁睍瀛楁涔嬪墠鍒囧垎銆?
* **Late Split**: 鍦?SNI 鎵╁睍瀛楁涓棿鍒囧垎銆?

### 3.2 涓棿浠剁殑椴佹鎬ф祴璇?
<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <thead>
        <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dee2e6;">
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Fragmentation (鍒嗙墖鏂瑰紡)</th>
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Split (鍒囧垎浣嶇疆)</th>
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Circumvents Censor (鑳藉惁缁曡繃)</th>
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

鍦ㄩ拡瀵瑰绉嶇綉缁滃畨鍏ㄧ綉鍏冲拰娴侀噺瀹¤璁惧鐨勬祴璇曚腑锛屾垜浠彂鐜帮細
* **TCP 鍒嗙墖**锛氬ぇ澶氭暟鐜颁唬璁惧鑳芥纭鐞嗐€?
* **TLS 璁板綍鍒嗙墖**锛氱浉褰撲竴閮ㄥ垎渚濊禆 DPI锛堟繁搴﹀寘妫€娴嬶級鐨勪腑闂翠欢鏃犳硶鎻愬彇琚垏鍒嗗埌涓嶅悓 Record 涓殑 SNI 淇℃伅銆?

杩欒〃鏄庯紝褰撳墠鐨勮澶氱綉缁滀腑闂翠欢鍦ㄨ璁℃椂锛屽亣璁句簡鈥滀竴涓彙鎵嬫秷鎭搴斾竴涓褰曗€濈殑绠€鍖栨ā鍨嬶紝浠庤€屽鑷翠簡婕忔锛團alse Negative锛夌殑鎯呭喌銆?

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <thead>
        <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dee2e6;">
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">List (鍩熷悕鍒楄〃)</th>
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Scanned Domains (鎵弿鏁伴噺)</th>
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Support TLS record fragmentation (鏀寔鐜?</th>
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

## 4. 鏈嶅姟鍣ㄦ敮鎸佸害璋冩煡 (Server Support)

涓€椤瑰叧閿殑闂鏄細*杩欑鍒嗙墖鍚庣殑鏁版嵁鍖咃紝鐩爣鏈嶅姟鍣ㄨ兘鐪嬫噦鍚楋紵*

涓轰簡鍥炵瓟杩欎釜闂锛屾垜浠 Tranco Top 1M 鍩熷悕鍒楄〃杩涜浜嗘壂鎻忓垎鏋愩€?


鏈夎叮鐨勬槸锛屽涓嬫墍绀猴紝TLS 璁板綍鍒嗙墖鍦?Tranco Top 1M 鍒楄〃鐨?*鎵€鏈夋帓鍚嶄腑**閮藉緱鍒颁簡骞挎硾鐨勬敮鎸侊紙鏇茬嚎淇濇寔骞崇ǔ锛屾湭闅忔帓鍚嶄笅闄嶈€屾尝鍔級銆?
<img src="\images\a2e03909-f896-419d-8260-0fef4a9a3534.png" width="100%" height="100%" title="鎷煎啓妫€鏌ュ伐鍏稧rammarly." alt="鎷煎啓妫€鏌ュ伐鍏稧rammarly."/>
鎬讳綋鑰岃█锛屾垜浠彂鐜版埅鑷崇洰鍓嶏紝TLS 鏈嶅姟鍣ㄦ櫘閬嶆敮鎸?TLS 璁板綍鍒嗙墖銆傝繖涓嶄粎閫傜敤浜庝簰鑱旂綉涓婄殑椤剁骇 TLS 鏈嶅姟鍣紝涔熼€傜敤浜庡彈瀹℃煡鐨勫煙鍚嶃€傝繖璇佹槑璇ユ満鍒舵槸 TLS 鍗忚鏍堟爣鍑嗗疄鐜扮殑涓€閮ㄥ垎锛屽叿鏈夋瀬楂樼殑鍏煎鎬с€?
**缁撴灉瑙ｈ锛?*
瓒呰繃 **92%** 鐨勪簰鑱旂綉涓绘祦鏈嶅姟鍣ㄥ畬鍏ㄦ敮鎸?TLS Record 鍒嗙墖銆傝繖璇佹槑浜嗚鏈哄埗鏄?TLS 鍗忚鏍堟爣鍑嗗疄鐜扮殑涓€閮ㄥ垎锛堝 OpenSSL, BoringSSL 绛夊潎鍘熺敓鏀寔锛夛紝鑰岄潪鏌愮闈炴爣鍑嗙殑鐣稿舰娴侀噺銆?

## 5. 璁ㄨ涓庡缓璁?

### 5.1 涓轰粈涔堜腑闂翠欢瑙ｆ瀽浼氬け鏁堬紵
璁稿涓棿浠朵负浜嗚拷姹傞珮鍚炲悙閲忓拰浣庡欢杩燂紝閲囩敤浜嗏€滃嵆鏃惰В鏋愨€濈瓥鐣ワ紝鑰岀壓鐗蹭簡瀹屾暣鐨勫崗璁爤閲嶇粍鑳藉姏銆傚畠浠線寰€鍙鏌ユ暟鎹寘鐨勫墠鍑犱釜瀛楄妭瀵绘壘 TLS 澶达紝涓€鏃﹀彂鐜扮粨鏋勪笉绗﹀悎棰勬湡鐨勨€滄爣鍑嗗瀷鈥濓紝渚垮彲鑳借烦杩囨娴嬫垨鍙戠敓瑙ｆ瀽閿欒銆?

### 5.2 瀵圭綉缁滃畨鍏ㄨ澶囩殑寤鸿
闅忕潃鍗忚鐨勬紨杩涳紙濡?TLS 1.3 鐨勬櫘鍙婂拰 ECH 鐨勬彁妗堬級锛屾祦閲忕壒寰佹鍙樺緱瓒婃潵瓒婇殣钄姐€傚浜庨槻鐏銆乄AF 鍜屾祦閲忓璁＄郴缁熺殑寮€鍙戣€咃紝鎴戜滑寤鸿锛?

* **鏀惧純鍩轰簬鐗瑰緛鐮佺殑绠€鍗曞尮閰?*锛氫笉鍐嶄緷璧栭潤鎬佺殑瀛楄妭搴忓垪鍖归厤銆?
* **瀹炵幇鍏ㄦ爤閲嶇粍**锛氬繀椤诲湪瑙ｆ瀽寮曟搸涓紩鍏ュ畬鏁寸殑 TLS 璁板綍灞傜姸鎬佹満锛岃兘澶熺紦瀛樺苟閲嶇粍璺ㄨ褰曠殑鎻℃墜娑堟伅銆?
* **鍏虫敞 RFC 杈圭晫鎯呭喌**锛氬湪浜у搧娴嬭瘯闃舵锛屽簲鍔犲叆閽堝鍗忚鍒嗙墖銆佷贡搴忕瓑杈圭紭鎯呭喌鐨勮鐩栨祴璇曘€?

### 5.3 娴忚鍣ㄧ殑瑙掕壊
鐩墠锛屾祻瑙堝櫒閫氬父涓嶄細涓诲姩鍙戦€佸垎鐗囩殑 TLS Record锛堥櫎闈炴秷鎭繃澶э級銆備絾濡傛灉娴忚鍣ㄥ巶鍟嗘湭鏉ヤ负浜嗘彁楂橀殣绉佷繚鎶ゆ垨浼犺緭鏁堢巼鑰屽紩鍏ヨ繖绉嶆満鍒讹紝鐜版湁鐨勪腑闂翠欢鐢熸€佸彲鑳戒細闈复澶ц妯″け鏁堢殑椋庨櫓銆?

## 6. 缁撹

鏈枃鎺㈣浜?TLS Record 鍒嗙墖杩欎竴绗﹀悎鏍囧噯鐨勫崗璁壒鎬с€傜爺绌跺彂鐜帮紝灏界缁濆ぇ澶氭暟鏈嶅姟鍣ㄨ兘澶熸甯稿鐞嗘绫绘祦閲忥紝浣嗚澶氱綉缁滀腑闂翠欢缂轰箯鐩稿簲鐨勮В鏋愯兘鍔涖€傝繖鎻愰啋缃戠粶鍗忚璁捐鑰呭拰瀹夊叏璁惧寮€鍙戣€咃紝蹇呴』閲嶈鍗忚鏍囧噯涓殑鐏垫椿鎬ф潯娆撅紝鏋勫缓鏇村姞鍋ュ．锛圧obust锛夌殑娴侀噺鍒嗘瀽绯荤粺銆
