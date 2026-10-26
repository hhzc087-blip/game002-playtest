import csv,json,pathlib,datetime
R=pathlib.Path(__file__).resolve().parents[1]
D='2026-10-26'; U='UNKNOWN'
sources={
'wx':('微信 / 中国','第三方人气榜','2026-10-25','https://www.momorank.com/rankings/popular'),
'dy':('抖音 / 中国','第三方热门榜','2026-10-26','https://www.momorank.com/douyin/rankings/popular'),
'gp':('Google Play / 美国','AppBrain免费Puzzle榜','2026-10-26','https://www.appbrain.com/stats/google-play-rankings/top_free/puzzle/us'),
'gc':('Google Play / 美国','AppBrain免费Casual榜','2026-10-25','https://www.appbrain.com/stats/google-play-rankings/top_free/casual/us'),
'ios':('App Store / 美国iPhone','官方免费Puzzle榜',D,'https://apps.apple.com/us/iphone/charts/7012?chart=top-free'),
'tap':('TapTap / 中国','聚光灯GameJam榜；非小游戏全市场榜',D,'https://www.taptap.cn/top/played'),
'pk':('Poki / 英文全球网页','Popular this week展示；非定量排名',D,'https://poki.com/en/popular'),
'cg':('CrazyGames / 网页','当日页面评分/累计投票；非近期增长',D,'https://www.crazygames.com/t/color'),
'itch':('itch.io / 全球网页','当日可见累计评分；经典对照',D,'https://itch.io/games/top-rated'),
}
# operation, loop length estimate, fail/retry, attraction hypothesis, art/content estimate, H5, IAA, risk
families={
'block':('拖动形块填满行列','估计2–8分钟；未计时','无块可放结束/立即重开','空间规划→多线清除→为下一手腾空间','低/低','高','较高：一次复活；不得故意发无解块','同质化极高；随机发牌可损害公平'),
'sort':('选择顶端颜色，再选空位或同色容器','估计1–5分钟；未计时','无有效移动/可撤销重开','把有限空位变成新的可行动空间','低/中；需可解生成器','高','高：提示/撤销；基础解不能依赖广告','可解性、循环移动与重复关卡'),
'jam':('移出阻挡物并送入匹配出口/载客位置','估计1–4分钟；未计时','缓冲位满或倒计时结束/重试','解开依赖关系后连续释放空间','中/中高','高；3D需简化','高：多一个临时位；必须保留免费解','与GAME001过近；手工关卡成本'),
'logic':('按局面约束标记与放置','估计2–8分钟；未计时','错误次数耗尽或矛盾/重试','从局部排除导出确定答案','低/中；需唯一解校验','高','中：提示；频繁广告打断推理','学习成本与猜谜/非唯一解'),
'physics':('瞄准发射或选择结构弱点','估计30–120秒；未计时','弹药耗尽且目标未清/重试','命中支点使结构连锁坍塌；角度可优化','低中/中；生成器验证','高；2D物理','高：结算一次额外弹药','物理随机性、无效命中、关卡重复'),
'mergefall':('选择落点，放下同级物体碰撞合成','估计2–8分钟；未计时','堆积越线/立即重试','追求下一级形态；落点引发连续合成','低/低','高；2D物理','较高：一次救场','经典对照；近期增长证据弱'),
'runner':('移动/跳跃/躲避','估计30–180秒；未计时','撞击或坠落/迅速重试','通过可归因失误提高距离纪录','中高/中','中高','高：一次复活','品质与速度曲线门槛高'),
'timing':('按住、松开以改变方向或摆荡','估计5–90秒；未计时','坠落/快速重开','同一规则下校准提前量与释放时机','低/低中','高','中高：失败后继续','控制手感难复制；内容重复'),
'management':('移动收集、生产、交付并升级','估计5–20分钟；未计时','通常无明确短局失败；瓶颈后继续','缩短物流回路、解除产能瓶颈','中高/高','中','中：加速；长期内容投入高','吸引力依赖内容/成长；本轮淘汰'),
'match':('选择可见同类，凑对或三件消除','估计1–5分钟；未计时','暂存槽满/重试','寻找同类、释放覆盖、减少杂乱','中/中','高','高：撤销/复活；不应制造必败','市场拥挤，遮挡可造成伪难度'),
'hidden':('在图景中寻找目标并点击','估计2–8分钟；未计时','时间/错误限制；机制因产品不同','从视觉搜索到发现目标','高/高','高','中：提示','内容产量与美术成本高'),
'defense':('部署或升级防御，抵挡波次','估计3–10分钟；未计时','基地被破坏/重试','资源分配与拦截效率提升','中/中高','中高','较高：补给/复活','平衡、敌人/武器内容成本'),
'sandbox':('放置单位或构造系统，观察涌现','估计5–20分钟；未计时','胜负机制需产品实查','观察因果与组合的新结果','中高/高','中','中低','很难短局；AI生成内容权利需检查'),
'unknown':(U,U,U,'未核实核心操作，不用于立项','UNKNOWN','UNKNOWN','UNKNOWN','证据不足；只计发现样本，不进最终三选'),
}
rows=[]
def add(name,src,rank,family,metric=U,link=None,classic=False,notes=''):
 platform,chart,date,url=sources[src]; vals=families[family]
 rows.append(dict(id=f'G{len(rows)+1:03}',name=name,platform=platform,chart=chart,rank=rank,chart_date=date,query_date=D,metrics=metric,downloads=U,active_users=U,heat_index=U,ad_revenue=U,total_revenue=U,genre=family,core_operation=vals[0],round_duration=vals[1],failure_retry=vals[2],attraction_hypothesis=vals[3],art_content_cost_estimate=vals[4],h5_fit_estimate=vals[5],iaa_fit_estimate=vals[6],competition_risk=vals[7],source_url=link or url,ranking_url=url,evidence_quality='官方榜单' if src in ['ios','tap'] else '第三方榜单' if src in ['wx','dy','gp','gc'] else '门户当前展示/累计口碑',recency='长期经典对照；累计口碑不代表近期增长' if classic else '近期榜单快照；未取得30–90天连续活跃数据',mechanics_basis='玩法类别为分析编码；详查见GAMEPLAY_ANALYSIS.md；未知项不推断',notes=notes))
for n,r,f in [('羊了个羊：星球',1,'match'),('偷上蛋快跑',2,'unknown'),('腾讯欢乐斗地主',3,'unknown'),('向末日开炮',4,'unknown'),('抓大鹅',5,'match'),('打个麻将',6,'unknown'),('不停找找找',7,'hidden'),('QQ经典农场',8,'management'),('开心消消乐',9,'match'),('解压超给力',10,'unknown')]:add(n,'wx',r,f)
for n,r,f,m in [('疯狂水世界',3,'management',U),('赵云与阿斗',4,'unknown',U),('躺平发育',5,'defense',U),('浪漫餐厅',6,'management',U),('合一合',7,'unknown','排名较前一日上升78；不是用户增幅'),('梦幻消除战',8,'unknown',U),('漂移小飞车',9,'unknown','新进榜；非新增用户数')]:add(n,'dy',r,f,m)
gp=[('Meowdoku: Brain Puzzle Games',1,'logic','4.7','29M'),('Gossip Harbor: Merge & Story',2,'management','4.4','98M'),('Rotate Rings',3,'logic','4.8','9.4M'),('Block Blast!',4,'block','4.8','1.1B'),('Magic Sort!',5,'sort','4.6','44M'),('Amaze GO!',6,'logic','4.8','130M'),('Sand Blocks: Drop Puzzle',10,'sort','4.1','580K'),('Loop Sort',11,'sort','4.5','6.9M'),('Smash Land!',14,'physics','4.6','2.2M'),('Fish Sort Puzzle',16,'sort','4.8','4.1M'),('Search It - Hidden Objects',18,'hidden','4.9','10M'),('Color Block: Combo Blast',21,'block','4.5','78M'),('Arrows – Puzzle Escape',23,'logic','4.7','120M'),('Color Block Jam',31,'jam','4.1','40M'),('Screw Out 3D: Nut Sort Jam',35,'match','4.7','4.7M')]
for n,r,f,rating,installs in gp:
 add(n,'gp',r,f,f'AppBrain显示评分{rating}/5；估计累计安装{installs}；非官方精确下载量')
 rows[-1]['downloads']=f'AppBrain第三方累计安装估计{installs}；时间口径不同于本月下载'
for n,r,f,m in [('Royal Smash! - Physics Puzzle',1,'physics','4.6/5；AppBrain累计安装估计13M'),('Bus Fever Party!',2,'jam','4.1/5；累计安装估计19M'),('Hole.io - Original Hole Game',19,'runner','3.1/5；累计安装估计430M')]:add(n,'gc',r,f,m)
for n,r,f,app in [('Block Out! - Color Sort Puzzle',2,'jam','block-out-color-sort-puzzle/id6752672568'),('Colony Flow!',7,'sort','colony-flow/id6779167923'),('CubeAway - 3DPuzzle',9,'logic','cubeaway-3dpuzzle/id6760325543'),('Jigsaw Drop: Solitaire Puzzle',21,'logic','jigsaw-drop-solitaire-puzzle/id6767091927')]:add(n,'ios',r,f,U,'https://apps.apple.com/us/app/'+app)
for n,r,f,app,score in [('灵涌',1,'sandbox','954103','9.6'),('火力不足恐惧症',2,'defense','972285','9.6'),('多米诺的子弹工厂',3,'unknown','956393','9.4'),('蔓延之城',4,'management','953922','9.5'),('今天孵什么鸟',9,'unknown','956529','9.8'),('ifso',10,'logic','970550','9.9')]:add(n,'tap',r,f,score+'/10；GameJam助力榜；不等于DAU','https://www.taptap.cn/app/'+app)
for n,f,slug in [('Subway Surfers','runner','subway-surfers'),('Master Chess','logic','master-chess'),('Aquapark.io','runner','aquaparkio'),('Drift Boss','timing','drift-boss'),('Stickman Hook','timing','stickman-hook'),('Monkey Mart','management','monkey-mart'),('Blocky Blast Puzzle','block','blocky-blast-puzzle'),('Level Devil','runner','level-devil')]:add(n,'pk',U,f,'当日Popular this week展示；不赋予序号排名','https://poki.com/en/g/'+slug)
for n,f,slug,m in [('Nuts Puzzle: Sort By Color','sort','nuts-puzzle-sort-by-color','8.4/10最近6个月评分；45K赞/7.7K踩，累计口碑'),('Screw Out: Bolts and Nuts','match','screw-out-bolts-and-nuts','8.6/10最近6个月评分；70K赞/11K踩，累计口碑'),('Drop & Merge the Numbers','mergefall','drop-merge-the-numbers','8.8/10最近6个月评分；37K赞/5.1K踩，累计口碑')]:add(n,'cg',U,f,m,'https://www.crazygames.com/game/'+slug,True)
add('Watermelon Drop','pk',U,'mergefall','4.5/5；675,808累计投票；不代表近期活跃','https://poki.com/en/g/watermelon-drop',True)
add('Six Cats Under','itch',U,'hidden','4.8/5；页面7,571累计评分；集合页7,624，抓取时刻不一致','https://teambeanloop.itch.io/six-cats-under',True,notes='明确保留两个页面统计差异，不选更大数作为当前唯一真值')
add('Sort the Court!','itch',U,'management','4.7/5；11,101累计评分；来自top-rated集合页','https://graebor.itch.io/sort-the-court',True)
(R/'docs/research/market-games.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
with (R/'docs/research/market-games.csv').open('w') as f:
 w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
md=['# 热门小游戏市场发现 — 2026-10-26','',f'共{len(rows)}款去重产品。微信10、抖音新增7、Google Play18、App Store新增4、TapTap6、Poki9、CrazyGames3、itch.io2。跨平台同名不重复计数。','',
'优先使用2026-10-25/26当前榜单；当前上榜证明近期可见度，不能证明30–90天增长、留存或IAA收入。Google Play分类在Casual与Puzzle间分散，均已覆盖。小游戏之外的移动轻休闲只作为可移植玩法样本。TapTap聚光灯是活动助力榜，不能代表全站活跃。itch经典为对照，不冒充新晋热门。',
'','原始逐项字段见CSV/JSON，14项要求全部有字段。玩法/时长/成本/广告适配标为分析或估计；未逐款计时。榜单来源与单品资料链接均保留。微信/抖音源为MomoRank公开前十，付费墙后数据未访问。','',
'|游戏|市场|榜单/位置|数据日期|指标（口径保留）|玩法方向|来源|','|---|---|---|---|---|---|---|']
for x in rows:md.append('|'+ '|'.join(str(x[k]).replace('|','/') for k in ['name','platform'])+'|'+x['chart']+' / '+str(x['rank'])+'|'+x['chart_date']+'|'+x['metrics']+'|'+x['genre']+'|[资料]('+x['source_url']+') / [榜单]('+x['ranking_url']+')|')
md+=['','## 资料局限','', '本地对AppBrain、MomoRank、itch的直连失败，使用web检索服务的可读页面复核；失败原始记录在source-index.json，不能把网络失败改写成实玩。门户本地抓取会跳转中文地区；英文Popular this week以web服务英文页面为准，未将不同地区列表混用。所有活跃用户、广告收入与游戏总收入均为UNKNOWN。','', '## 原始核对摘录（不是完整转载）','', '微信2026-10-25前十与抖音2026-10-26前十见数据表；字段为综合排名，单位人次未公开。GP Puzzle查询显示2026-10-26更新，Casual显示2026-10-25。Apple页面为查询时快照，无公开历史曲线。来源获取方式、HTTP错误、响应哈希见evidence/research/source-index.json。']
(R/'docs/research/MARKET_RESEARCH.md').write_text('\n'.join(md)+'\n')
print(json.dumps({'unique_games':len(rows),'current_chart_or_weekly':sum('长期经典' not in x['recency'] for x in rows),'markets':sorted(set(x['platform'] for x in rows))},ensure_ascii=False))
