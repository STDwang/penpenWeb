// Stage-one design renderer. Generates editable SVG and PNG; no application code.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(process.env.DESIGN_NODE_MODULES || root, 'package.json'));
const sharp = require('sharp');
const C = { bg:'#0B1014', panel:'#11191F', panel2:'#151F26', line:'#283740', text:'#EDF3F5', muted:'#9CAEB8', faint:'#718690', cyan:'#71E2D4', blue:'#82BDFF', amber:'#E7BA77' };
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const rect = (x,y,w,h,fill=C.panel,stroke='none',rx=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}"/>`;
const line = (x1,y1,x2,y2,color=C.line,width=1,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
const path = (d,color=C.line,width=1,extra='') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const circle = (x,y,r,fill,stroke='none') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}"/>`;
const text = (x,y,s,size=16,fill=C.text,weight=400,extra='') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(s)}</text>`;
const mono = (x,y,s,size=11,fill=C.muted,extra='') => text(x,y,s,size,fill,400,`font-family="Consolas, monospace" ${extra}`);
const lines = (x,y,items,size=16,leading=28,fill=C.muted,weight=400) => items.map((s,i)=>text(x,y+i*leading,s,size,fill,weight)).join('');
const tag = (x,y,label,color=C.muted) => text(x,y,label,11,color,400,'letter-spacing="1"');
const arrow = (x,y,color=C.text) => path(`M ${x} ${y+10} l 10 -10 M ${x+1} ${y} h 9 v 9`,color,1.5);
const button = (x,y,w,label,primary=false) => rect(x,y,w,46,primary?C.cyan:'transparent',primary?'none':C.line,4)+text(x+18,y+29,label,14,primary?C.bg:C.text,500)+arrow(x+w-30,y+18,primary?C.bg:C.muted);
const link = (x,y,label,color=C.muted) => text(x,y,label,14,color)+arrow(x+label.length*14+10,y-11,color);
const icon = (x,y) => path(`M ${x} ${y+21} V ${y} h 7 M ${x+15} ${y} v 21 h -7`,C.cyan,2)+line(x+6,y+15,x+11,y+6,C.cyan,2);
const section = (y,n,en,title,right='') => mono(88,y,n,11,C.cyan)+mono(124,y,en,11,C.muted,'letter-spacing="2"')+text(88,y+57,title,34,C.text,500)+(right?link(1180,y+51,right):'');
const miniSection = (y,n,en,title) => mono(24,y,`${n} / ${en}`,10,C.cyan,'letter-spacing="1"')+text(24,y+42,title,24,C.text,500);

function mapGraphic(x,y,w,h,mobile=false) {
  let s=rect(x,y,w,h,'#0E171D',C.line,6);
  s+=`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 680 470" preserveAspectRatio="xMidYMid meet">`;
  s+=rect(0,0,680,470,'url(#mapgrid)');
  const blocks=[[75,90,108,65],[235,73,72,85],[462,90,135,60],[65,245,107,83],[247,265,76,86],[477,272,122,70],[354,345,60,80]];
  for(const [a,b,c,d] of blocks)s+=rect(a,b,c,d,'#131F27','#1B2C35',8);
  const roads=['M -40 208 L 208 208 Q 252 208 282 185 L 364 117 Q 390 94 390 60 L 390 -30','M 390 500 L 390 281 Q 390 208 465 208 L 720 208','M -40 386 L 135 386 Q 208 386 208 317 L 208 -20','M 718 400 L 516 400 Q 455 400 455 338 L 455 -30'];
  for(const d of roads){s+=path(d,'#344550',42);s+=path(d,'#192730',39);s+=path(d,'#61747E',1,'stroke-dasharray="7 10"');}
  s+=path('M -25 198 L 206 198 Q 251 198 279 174 L 355 109 Q 379 89 379 53 L 379 -10',C.cyan,2.5);
  s+=path('M 401 470 L 401 283 Q 401 220 465 220 L 700 220',C.blue,2);
  if(!mobile)s+=path('M 197 8 L 197 311 Q 197 375 133 375 L 10 375','#567A8B',2);
  for(const [a,b] of (mobile?[[293,163],[401,330],[543,220]]:[[130,198],[293,163],[379,60],[401,330],[543,220],[197,280]])) {
    s+=rect(a-8,b-4,17,8,a===401||a===543?C.blue:C.cyan,'none',2);
  }
  s+=circle(293,163,18,'#71E2D416',C.cyan)+circle(293,163,5,C.cyan);
  s+=path('M 311 154 L 340 139 L 420 139',C.cyan,1);
  s+=rect(420,112,153,52,'#17282E',C.line,4)+mono(434,132,'VEHICLE / 014',10,C.cyan)+mono(434,151,'轨迹选中 · 状态可追溯',10,C.text);
  s+=rect(263,226,50,15,'#E7BA7715',C.amber,2)+mono(268,237,'检查点',8,C.amber);
  s+=mono(24,29,'SCENE / ROAD NETWORK',11,C.muted)+mono(24,447,'固定演示数据 · 非真实仿真输出',10,C.faint);
  s+=`</svg>`;
  s+=rect(x+w-99,y+16,80,23,C.panel2,C.line,3)+text(x+w-87,y+32,'交互示意',10,C.muted);
  return s;
}
function timeline(x,y,w) {
  let s=rect(x,y,w,66,C.panel,C.line,5);
  s+=rect(x+15,y+20,28,27,C.panel2,C.line,3)+rect(x+24,y+28,3,11,C.cyan)+rect(x+30,y+28,3,11,C.cyan);
  s+=line(x+61,y+32,x+w-119,y+32,'#354750',3)+line(x+61,y+32,x+w*.55,y+32,C.cyan,3)+circle(x+w*.55,y+32,5,C.cyan);
  s+=mono(x+w-96,y+36,'00:12 / 00:30',10,C.muted);
  return s;
}
function railway(x,y,w,h) {
  let s=rect(x,y,w,h,C.panel,C.line,6);
  s+=mono(x+25,y+31,'TESSNG / RAIL TRANSIT',10,C.muted,'letter-spacing="1"');
  s+=rect(x+1,y+51,w-2,h-52,'url(#mapgrid)');
  const cy=y+h*.53;
  s+=path(`M ${x+30} ${cy+30} H ${x+w*.32} Q ${x+w*.4} ${cy+30} ${x+w*.47} ${cy-20} T ${x+w*.63} ${cy-68} H ${x+w-25}`,'#3C555F',16);
  s+=path(`M ${x+30} ${cy+30} H ${x+w*.32} Q ${x+w*.4} ${cy+30} ${x+w*.47} ${cy-20} T ${x+w*.63} ${cy-68} H ${x+w-25}`,C.cyan,2);
  s+=path(`M ${x+w*.47} ${cy-20} Q ${x+w*.57} ${cy+50} ${x+w*.69} ${cy+50} H ${x+w-25}`,'#4A6673',9);
  const stations=[[.16,30,'起点站'],[.48,-25,'换乘站'],[.79,-68,'终点站']];
  for(const [f,dy,name] of stations) {s+=circle(x+w*f,cy+dy,8,C.panel,C.cyan)+circle(x+w*f,cy+dy,3,C.cyan)+text(x+w*f-18,cy+dy+34,name,11,C.muted);}
  s+=rect(x+w*.35,cy+17,46,13,C.cyan,'none',3)+line(x+w*.36,cy+20,x+w*.4,cy+20,C.bg,2);
  s+=rect(x+25,y+h-76,w-50,49,'#101A20',C.line,4);
  s+=mono(x+40,y+h-56,'建模',10,C.text)+mono(x+w*.29,y+h-56,'持久化',10,C.text)+mono(x+w*.55,y+h-56,'运行',10,C.text)+mono(x+w*.78,y+h-56,'结果',10,C.text);
  s+=path(`M ${x+74} ${y+h-60} h ${w*.15} M ${x+w*.39} ${y+h-60} h ${w*.12} M ${x+w*.63} ${y+h-60} h ${w*.12}`,C.faint);
  s+=text(x+40,y+h-39,'DATA → MODEL → SIMULATION',8,C.faint,400,'font-family="Consolas, monospace"');
  s+=text(x+w-105,y+31,'架构示意',10,C.faint);
  return s;
}
function layerGraphic(x,y,w,h) {
  let s=rect(x,y,w,h,C.panel,C.line,5);
  for(let i=2;i>=0;i--)s+=`<path d="M ${x+w*.5} ${y+24+i*21} l ${w*.31} 45 l -${w*.31} 45 l -${w*.31} -45 Z" fill="${i===0?'#183A3B':'#17242C'}" stroke="${i===0?C.cyan:'#3C515F'}"/>`;
  s+=mono(x+20,y+h-18,'业务 → 映射 → 拾取 → 数据',10,C.muted);
  return s;
}
function mesoGraphic(x,y,w,h) {
  let s=rect(x,y,w,h,C.panel,C.line,5);
  for(let r=0;r<4;r++) for(let c=0;c<9;c++) s+=circle(x+27+c*(w-54)/8,y+31+r*22,2.5,r===1?C.cyan:'#49616E');
  s+=path(`M ${x+35} ${y+107} C ${x+w*.4} ${y+107} ${x+w*.58} ${y+31} ${x+w-25} ${y+31}`,C.cyan,2);
  s+=mono(x+20,y+h-18,'MICRO ↔ MESO / OD → METRICS',10,C.muted);
  return s;
}
const gpu = await readFile(join(root,'design/assets/gpuview-timeline.png'));
const dream = await readFile(join(root,'design/assets/dreamscape-ingame.png'));
const img = (buf,x,y,w,h,id) => `<defs><clipPath id="${id}">${rect(x,y,w,h,'white','none',5)}</clipPath></defs><image x="${x}" y="${y}" width="${w}" height="${h}" href="data:image/png;base64,${buf.toString('base64')}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;

function desktop(){
 let s=icon(88,32)+text(119,49,'王帅鹏',17,C.text,500)+mono(197,49,'/ ENGINEER',10,C.faint);
 ['工程案例','实验室','关于','博客 ↗'].forEach((v,i)=>s+=text(797+i*107,49,v,13,C.muted));
 s+=rect(1262,24,90,39,'transparent',C.line,4)+text(1286,49,'简历 ↗',13,C.text)+line(88,80,1352,80);
 s+=mono(88,160,'SIMULATION / SYSTEMS / VISUALIZATION',11,C.cyan,'letter-spacing="2"');
 s+=text(88,215,'王帅鹏 · C++ / 仿真平台工程师',17,C.muted);
 s+=lines(88,304,['让复杂系统','可建模、可运行、','可验证。'],54,77,C.text,600);
 s+=rect(88,487,3,40,C.cyan)+lines(104,503,['四年交通仿真平台研发经验，','关注机器人与智驾仿真工具链。'],16,29,C.muted);
 s+=button(88,564,183,'查看工程案例',true)+button(283,564,157,'下载简历');
 s+=mono(88,665,'C++17   /   Qt   /   仿真建模   /   性能与稳定性',11,C.faint);
 s+=mapGraphic(700,161,652,430)+timeline(700,605,652);
 s+=mono(700,704,'把建模、运行与验证串成一个工程闭环。',11,C.muted);
 s+=line(88,762,1352,762);
 const metrics=[['04','年商业仿真研发','从专业编辑器到仿真结果链路'],['跨模块','平台闭环交付','UI · 路网 · 数据 · 模型 · 仿真 · 接口'],['可靠性','贯穿设计与发布','生命周期 · 兼容性 · 回归验证']];
 metrics.forEach(([v,a,b],i)=>{let x=88+i*435;s+=text(x,842,v,34,C.text,500)+text(x,879,a,14,C.text)+text(x,909,b,13,C.muted);if(i<2)s+=line(x+402,804,x+402,916);});
 s+=section(1026,'01','SELECTED ENGINEERING','在复杂系统里，把问题做透。','全部案例');
 s+=railway(88,1133,744,369);
 s+=tag(880,1158,'核心产品研发 / 2026',C.cyan)+text(880,1210,'轨道交通仿真模块',29,C.text,500);
 s+=lines(880,1252,['从线路与站台建模，到列车运行与结果输出，','打通插件化模块的完整仿真闭环。'],15,28);
 s+=line(880,1332,1352,1332)+mono(880,1365,'我的职责',10,C.faint)+text(880,1394,'架构拆分 · 核心研发 · 联调验收',14,C.text);
 s+=mono(880,1433,'C++ / Qt / SQLite / 状态机',11,C.muted)+link(880,1483,'查看架构与技术取舍',C.cyan);
 s+=layerGraphic(88,1550,612,161)+mesoGraphic(740,1550,612,161);
 s+=mono(88,1743,'02 / EDITOR & INTERACTION',10,C.faint)+text(88,1786,'编辑图层与复杂场景拾取',23,C.text,500);
 s+=text(88,1822,'在层级、持久化与重叠对象之间，保持一致的交互语义。',14,C.muted)+link(88,1868,'查看案例',C.cyan);
 s+=mono(740,1743,'03 / MULTI-SCALE SIMULATION',10,C.faint)+text(740,1786,'中观仿真与微中观协同',23,C.text,500);
 s+=text(740,1822,'围绕路网转换、OD 需求与结果评价，设计可复用接口。',14,C.muted)+link(740,1868,'查看案例',C.cyan);
 s+=line(88,1941,1352,1941)+section(2021,'02','ENGINEERING PRACTICE','技术能力，有具体问题作证。');
 const caps=[['建模与运行时','状态机 / 模型接入 / 仿真输出','轨道交通模块'],['专业编辑与可视化','Qt / QML / Graphics View','图层与拾取系统'],['性能与并发','区间索引 / LOD / 异步快照','GPUView'],['工程质量与交付','回归矩阵 / 数据兼容 / 发布','产品研发经历']];
 caps.forEach(([a,b,c],i)=>{let x=88+i*325;s+=mono(x,2153,`0${i+1}`,10,C.cyan)+text(x,2191,a,19,C.text,500)+text(x,2225,b,12,C.muted)+text(x,2270,c,12,C.cyan)+arrow(x+235,2259,C.cyan);});
 s+=section(2405,'03','PERSONAL LAB','把想法，做成可运行的作品。','进入实验室');
 s+=img(gpu,88,2510,744,328,'gpu-d')+img(dream,872,2510,480,328,'dream-d');
 s+=mono(108,2537,'实际项目截图',10,C.cyan)+rect(88,2838,744,152,C.panel)+rect(872,2838,480,152,C.panel);
 s+=text(112,2878,'GPUView',25,C.text,500)+tag(692,2876,'公开代码',C.muted)+text(112,2914,'百万教学事件时间线、精确选区统计与异步快照。',14,C.muted)+mono(112,2956,'C++17 / Qt 6 / 性能可视化',11,C.faint)+arrow(790,2942,C.cyan);
 s+=text(896,2878,'Dreamscape · 梦境废墟',23,C.text,500)+text(896,2914,'程序化建模与场景生成的个人探索。',14,C.muted)+mono(896,2956,'Godot / Blender / GDScript',11,C.faint)+arrow(1311,2942,C.cyan);
 s+=line(88,3031,1352,3031)+text(88,3072,'MISTLOOP / 雾林回环',17,C.text)+text(88,3105,'Three.js · 程序化场景 · 状态与声音交互',12,C.muted)+arrow(650,3060,C.cyan);
 s+=text(740,3072,'ImagePlayer',17,C.text)+text(740,3105,'C++ / Qt · 多视图图像工具 · 早期项目',12,C.muted)+arrow(1312,3060,C.cyan);
 s+=line(88,3161,1352,3161)+section(3240,'04','EXPERIENCE & NEXT','下一站，深入智能系统仿真。');
 s+=mono(88,3386,'2022.09 — 2026.08',12,C.cyan)+text(385,3386,'上海济达交通科技有限公司',20,C.text,500)+text(385,3422,'C++ / Qt 研发工程师 · TESSNG 核心产品研发',14,C.muted);
 s+=mono(88,3484,'2026 / PERSONAL PRACTICE',11,C.faint)+text(385,3484,'性能可视化与交互项目',17,C.text)+text(385,3518,'通过公开代码、测量记录与项目说明，持续积累工程证据。',14,C.muted);
 s+=rect(88,3590,1264,184,C.panel,C.line,6)+tag(117,3625,'LET’S BUILD RELIABLE SYSTEMS',C.cyan)+text(117,3672,'有合适的仿真平台机会，欢迎聊聊。',29,C.text,500);
 s+=text(117,3719,'138 4948 9395',16,C.text)+text(348,3719,'1946262980@qq.com',16,C.text)+link(1144,3719,'查看简历',C.cyan);
 s+=mono(88,3831,'© 2026 王帅鹏 / STDwang',11,C.faint)+text(1040,3831,'GitHub ↗     CSDN ↗',13,C.muted);
 return wrap(1440,3870,s,'王帅鹏个人网站 · 桌面首页视觉稿');
}

function mobile(){
 let s=icon(24,25)+text(55,43,'王帅鹏',16,C.text,500)+text(258,43,'简历 ↗',12,C.muted)+line(338,30,366,30,C.text)+line(338,38,366,38,C.text)+line(24,69,366,69);
 s+=mono(24,110,'SIMULATION / SYSTEMS / VISUALIZATION',9,C.cyan,'letter-spacing=".4"');
 s+=text(24,151,'王帅鹏 · C++ / 仿真平台工程师',14,C.muted);
 s+=lines(24,213,['让复杂系统','可建模、可运行、','可验证。'],35,52,C.text,600);
 s+=lines(24,363,['四年交通仿真平台研发经验，','关注机器人与智驾仿真工具链。'],14,25);
 s+=button(24,421,175,'查看工程案例',true)+button(210,421,156,'下载简历');
 s+=mapGraphic(24,501,342,267,true)+timeline(24,780,342)+mono(24,872,'固定演示数据 · 支持静态降级',10,C.faint);
 s+=line(24,915,366,915);
 [['04 年','商业仿真研发'],['跨模块','平台闭环交付'],['可靠性','贯穿设计与发布']].forEach(([a,b],i)=>{let y=959+i*69;s+=text(24,y,a,23,C.text,500)+text(181,y-1,b,13,C.muted)+line(24,y+25,366,y+25);});
 s+=miniSection(1200,'01','SELECTED ENGINEERING','在复杂系统里，把问题做透。');
 s+=railway(24,1272,342,250);
 s+=tag(24,1557,'核心产品研发 / 2026',C.cyan)+text(24,1601,'轨道交通仿真模块',25,C.text,500);
 s+=lines(24,1639,['从线路与站台建模，到列车运行与结果输出，','打通插件化模块的完整仿真闭环。'],13,25);
 s+=mono(24,1711,'C++ / Qt / SQLite / 状态机',10,C.faint)+link(24,1751,'查看架构与技术取舍',C.cyan);
 s+=layerGraphic(24,1792,342,151)+text(24,1984,'编辑图层与复杂场景拾取',22,C.text,500);
 s+=lines(24,2020,['在层级、持久化与重叠对象之间，','保持一致的交互语义。'],13,24)+link(24,2090,'查看案例',C.cyan);
 s+=mesoGraphic(24,2131,342,151)+text(24,2324,'中观仿真与微中观协同',22,C.text,500);
 s+=lines(24,2360,['围绕路网转换、OD 需求与结果评价，','设计可复用接口。'],13,24)+link(24,2430,'查看案例',C.cyan);
 s+=line(24,2480,366,2480)+miniSection(2540,'02','ENGINEERING PRACTICE','技术能力，有具体问题作证。');
 const caps=[['建模与运行时','状态机 / 模型接入 / 仿真输出','轨道交通模块'],['专业编辑与可视化','Qt / QML / Graphics View','图层与拾取系统'],['性能与并发','区间索引 / LOD / 异步快照','GPUView'],['工程质量与交付','回归矩阵 / 数据兼容 / 发布','产品研发经历']];
 caps.forEach(([a,b,c],i)=>{let y=2655+i*130;s+=mono(24,y,`0${i+1}`,10,C.cyan)+text(58,y,a,18,C.text,500)+text(58,y+29,b,12,C.muted)+text(58,y+61,c,12,C.cyan)+arrow(343,y+50,C.cyan)+line(24,y+85,366,y+85);});
 s+=miniSection(3228,'03','PERSONAL LAB','把想法，做成可运行的作品。');
 s+=img(gpu,24,3300,342,181,'gpu-m')+rect(24,3481,342,146,C.panel)+text(42,3519,'GPUView',24,C.text,500);
 s+=lines(42,3550,['百万教学事件时间线、精确选区统计','与异步快照。'],12,22)+mono(42,3607,'C++17 / Qt 6 / 公开代码',10,C.faint)+arrow(333,3595,C.cyan);
 s+=img(dream,24,3659,342,216,'dream-m')+rect(24,3875,342,123,C.panel)+text(42,3913,'Dreamscape · 梦境废墟',21,C.text,500)+text(42,3946,'程序化建模与场景生成的个人探索。',12,C.muted)+mono(42,3978,'Godot / Blender / GDScript',10,C.faint);
 s+=text(24,4050,'MISTLOOP / 雾林回环',17,C.text)+text(24,4080,'Three.js · 程序化场景 · 状态与声音交互',11,C.muted)+arrow(343,4038,C.cyan)+line(24,4110,366,4110);
 s+=text(24,4148,'ImagePlayer',17,C.text)+text(24,4178,'C++ / Qt · 多视图图像工具 · 早期项目',11,C.muted)+arrow(343,4136,C.cyan)+line(24,4221,366,4221);
 s+=miniSection(4286,'04','EXPERIENCE & NEXT','下一站，深入智能系统仿真。');
 s+=mono(24,4396,'2022.09 — 2026.08',11,C.cyan)+text(24,4435,'上海济达交通科技有限公司',19,C.text,500)+lines(24,4468,['C++ / Qt 研发工程师','TESSNG 核心产品研发'],13,24);
 s+=mono(24,4554,'2026 / PERSONAL PRACTICE',10,C.faint)+text(24,4590,'性能可视化与交互项目',18,C.text)+lines(24,4621,['通过公开代码、测量记录与项目说明，','持续积累工程证据。'],13,24);
 s+=rect(24,4702,342,258,C.panel,C.line,6)+mono(44,4738,'LET’S BUILD RELIABLE SYSTEMS',9,C.cyan);
 s+=lines(44,4785,['有合适的仿真平台机会，','欢迎聊聊。'],22,36,C.text,500)+text(44,4879,'138 4948 9395',16,C.text)+text(44,4910,'1946262980@qq.com',14,C.muted)+link(44,4940,'查看简历',C.cyan);
 s+=text(24,5016,'GitHub ↗      CSDN ↗',13,C.muted)+mono(24,5057,'© 2026 王帅鹏 / STDwang',10,C.faint);
 return wrap(390,5090,s,'王帅鹏个人网站 · 手机首页视觉稿');
}

function wrap(w,h,body,title){return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${title}</title><defs><pattern id="mapgrid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 H 0 V 28" fill="none" stroke="#22323C" stroke-opacity=".4" stroke-width=".6"/><circle cx="0" cy="0" r="1" fill="#39515B"/></pattern></defs>${rect(0,0,w,h,C.bg)}<g font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif">${body}</g></svg>`;}

await mkdir(join(root,'design/mockups'),{recursive:true});
await mkdir(join(root,'previews'),{recursive:true});
for(const [name,svg] of [['home-desktop',desktop()],['home-mobile',mobile()]]){
 await writeFile(join(root,`design/mockups/${name}.svg`),svg);
 await sharp(Buffer.from(svg)).png().toFile(join(root,`previews/${name}.png`));
 console.log(`Rendered ${name}`);
}
// A readable first-screen preview for review in chat.
await sharp(join(root,'previews/home-desktop.png')).extract({left:0,top:0,width:1440,height:970}).png().toFile(join(root,'previews/home-desktop-hero.png'));
await sharp(join(root,'previews/home-desktop.png')).resize({width:900}).png().toFile(join(root,'previews/home-desktop-overview.png'));
await sharp(join(root,'previews/home-mobile.png')).extract({left:0,top:0,width:390,height:910}).png().toFile(join(root,'previews/home-mobile-hero.png'));
