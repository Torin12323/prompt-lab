import type { UiLang } from "@/lib/i18n";

export type CatId =
  | "image"
  | "video"
  | "comfy"
  | "ecom"
  | "poster"
  | "ip"
  | "illust"
  | "render"
  | "photo"
  | "arch"
  | "copy"
  | "params"
  | "other";

export type SubId = "hunyuan" | "minimax" | "hero" | "detail" | "live" | "price";

export type CopyText = { "zh-CN": string; en: string };

export type PromptItem = {
  id: string;
  cat: CatId;
  sub?: SubId;
  title: CopyText;
  blurb: CopyText;
  author: string;
  votes: number;
  createdAt: string;
  image: string;
  positive: CopyText;
  negative?: CopyText;
  params?: string;
};

export type Category = {
  id: CatId;
  zh: string;
  en: string;
  introZh: string;
  introEn: string;
  leadZh: string;
  leadEn: string;
  image: string;
  subs?: { id: SubId; zh: string; en: string }[];
};

export const categories: Category[] = [
  {
    id: "image",
    zh: "图像生成",
    en: "Image generation",
    introZh: "通用生图提示词与描述结构模板",
    introEn: "General image prompts and description structures",
    leadZh: "通用生图提示词。本分类共 6 条（示例数据），仅按社区投票排序；本站不对提示词效果做评测。",
    leadEn: "General image prompts. 6 entries (sample data), ranked only by community votes. This site does not grade results.",
    image: "/media/cabin.jpg",
  },
  {
    id: "video",
    zh: "视频生成",
    en: "Video generation",
    introZh: "混元竖屏、MiniMax 横屏的镜头与动作描述",
    introEn: "Vertical Hunyuan and landscape MiniMax shots",
    leadZh: "镜头与动作描述。本分类共 5 条（示例数据），含混元竖屏与 MiniMax 横屏。",
    leadEn: "Shot and motion descriptions. 5 entries (sample data), covering Hunyuan vertical and MiniMax landscape.",
    image: "/media/street.jpg",
    subs: [
      { id: "hunyuan", zh: "混元竖屏", en: "Hunyuan vertical" },
      { id: "minimax", zh: "MiniMax 横屏", en: "MiniMax landscape" },
    ],
  },
  {
    id: "comfy",
    zh: "ComfyUI 工作流",
    en: "ComfyUI workflows",
    introZh: "节点流程、正反向与参数模板",
    introEn: "Node graphs, prompts and parameter templates",
    leadZh: "节点流程与参数模板。本分类共 2 条（示例数据）。",
    leadEn: "Node graphs and parameter templates. 2 entries (sample data).",
    image: "/media/night.jpg",
  },
  {
    id: "ecom",
    zh: "电商设计",
    en: "E-commerce design",
    introZh: "主图、详情页、直播贴片、价格标签",
    introEn: "Hero images, detail pages, live overlays, price tags",
    leadZh: "主图、详情、直播贴片与价格标签。本分类共 8 条（示例数据）。",
    leadEn: "Hero shots, detail pages, live overlays and price tags. 8 entries (sample data).",
    image: "/media/bottle.jpg",
    subs: [
      { id: "hero", zh: "主图", en: "Hero image" },
      { id: "detail", zh: "详情页", en: "Detail page" },
      { id: "live", zh: "直播贴片", en: "Live overlay" },
      { id: "price", zh: "价格标签", en: "Price tag" },
    ],
  },
  {
    id: "poster",
    zh: "品牌与海报",
    en: "Branding & posters",
    introZh: "海报版式与品牌视觉提示词",
    introEn: "Poster layouts and brand visuals",
    leadZh: "海报版式与品牌视觉。本分类共 3 条（示例数据）。",
    leadEn: "Poster layouts and brand visuals. 3 entries (sample data).",
    image: "/media/still.jpg",
  },
  {
    id: "ip",
    zh: "IP 与手办",
    en: "Characters & figures",
    introZh: "盲盒、手办与 Q 版角色",
    introEn: "Blind boxes, figures and chibi characters",
    leadZh: "盲盒、手办与 Q 版角色相关提示词。本分类共 12 条（示例数据），仅按社区投票排序；本站不对提示词效果做评测。",
    leadEn: "Blind-box, figure and chibi prompts. 12 entries (sample data), ranked only by votes. This site does not grade results.",
    image: "/media/clay.jpg",
  },
  {
    id: "illust",
    zh: "插画与动漫",
    en: "Illustration & anime",
    introZh: "动漫风、线描、水彩与厚涂",
    introEn: "Anime, line art, watercolor, impasto",
    leadZh: "动漫、线描、水彩与厚涂。本分类共 4 条（示例数据）。",
    leadEn: "Anime, line art, watercolor and impasto. 4 entries (sample data).",
    image: "/media/dragon.jpg",
  },
  {
    id: "render",
    zh: "3D 与产品渲染",
    en: "3D & product render",
    introZh: "三视图、C4D / OC 渲染",
    introEn: "Turnarounds, C4D / Octane renders",
    leadZh: "三视图与 C4D / Octane 渲染。本分类共 3 条（示例数据）。",
    leadEn: "Turnarounds and C4D / Octane renders. 3 entries (sample data).",
    image: "/media/white.jpg",
  },
  {
    id: "photo",
    zh: "摄影与人像",
    en: "Photo & portrait",
    introZh: "人像、头像与街拍质感",
    introEn: "Portraits, avatars, street photo looks",
    leadZh: "人像、头像与街拍质感。本分类共 4 条（示例数据）。不含名人肖像。",
    leadEn: "Portraits, avatars and street looks. 4 entries (sample data). No celebrity likenesses.",
    image: "/media/cafe.jpg",
  },
  {
    id: "arch",
    zh: "建筑与空间",
    en: "Architecture & space",
    introZh: "建筑立面、街景与室内空间",
    introEn: "Facades, streets and interiors",
    leadZh: "立面、街景与室内。本分类共 3 条（示例数据）。",
    leadEn: "Facades, streets and interiors. 3 entries (sample data).",
    image: "/media/forest.jpg",
  },
  {
    id: "copy",
    zh: "文案与短视频脚本",
    en: "Copy & video scripts",
    introZh: "短视频开场、电商卖点、口播脚本",
    introEn: "Video hooks, product copy, voice-over scripts",
    leadZh: "短视频开场、卖点与口播。本分类共 2 条（示例数据）。",
    leadEn: "Hooks, product copy and voice-over scripts. 2 entries (sample data).",
    image: "/media/beach.jpg",
  },
  {
    id: "params",
    zh: "反向词与参数",
    en: "Negatives & params",
    introZh: "通用反向词与步数 / CFG / 采样器",
    introEn: "Negative prompts, steps / CFG / samplers",
    leadZh: "通用反向词与采样参数。本分类共 2 条（示例数据）。",
    leadEn: "Negative prompts and sampler settings. 2 entries (sample data).",
    image: "/media/price.jpg",
  },
  {
    id: "other",
    zh: "其他",
    en: "Other",
    introZh: "结构模板与不便归类的条目",
    introEn: "Structure templates and uncategorized entries",
    leadZh: "结构模板。本分类共 1 条（示例数据）。",
    leadEn: "Structure templates. 1 entry (sample data).",
    image: "/media/fox.jpg",
  },
];

const T = (zh: string, en: string): CopyText => ({ "zh-CN": zh, en });

export const prompts: PromptItem[] = [
  item("cabin", "image", undefined, "水彩山间小屋", "Watercolor mountain cabin", "湿润纸纹的山间木屋，晨雾留白，适合做封面。", "A damp-paper cabin in morning mist, with room left for a cover.", "夜航船", 142, "2026-03-02", "/media/cabin.jpg", "山间木屋，水彩，湿润纸纹，晨雾，冷青与暖赭，留白天空，远山层次，无人物，无文字", "mountain cabin, watercolor, damp paper grain, morning mist, cool teal and warm ochre, open sky, layered ridges, no people, no text", "照片写实，锐利数码，文字，水印，人物", "photoreal, sharp digital, text, watermark, people"),
  item("forest", "image", undefined, "森林晨雾 · 写实风景", "Misty forest · realistic", "低对比晨雾林，树干节奏清楚，可换季节。", "Low-contrast morning forest with a clear trunk rhythm. Swap the season.", "moxi", 118, "2026-04-11", "/media/forest.jpg", "写实森林，晨雾，柔光，树干垂直节奏，地面湿苔，浅景深，电影宽宽容", "realistic forest, morning fog, soft light, vertical trunk rhythm, wet moss, shallow depth, cinematic latitude", "过饱和，城市，人物，文字", "oversaturated, city, people, text"),
  item("night", "image", undefined, "赛博朋克城市夜景", "Cyberpunk city at night", "雨后路面反光，霓虹只作色块，不出现可读招牌。", "Wet street reflections. Neon is color only, never readable signage.", "夜航船", 84, "2026-05-19", "/media/night.jpg", "雨夜城市街道，湿地反光，品红与青色光，雾，无可读文字，无标志，电影感", "rainy night street, wet reflections, magenta and cyan light, haze, no readable text, no logos, cinematic", "白天，干净地面，文字，品牌标志", "daylight, dry pavement, text, brand marks"),
  item("still", "image", undefined, "柔光静物", "Soft-light still life", "亚麻、陶瓷与一只梨，浅色台面，适合替换主体。", "Linen, ceramic and one pear on a pale table. Swap the subject.", "阿槿", 71, "2026-06-02", "/media/still.jpg", "柔光静物，浅色木桌，亚麻布，陶瓷杯，一只梨，空气感，无文字", "soft-light still life, pale wood table, linen, ceramic cup, one pear, airy, no text", "硬闪，杂乱背景，包装文字", "hard flash, cluttered background, packaging text"),
  item("alley", "image", undefined, "雨后霓虹巷", "Neon alley after rain", "窄巷，一盏暖灯，地面水洼只反射色块。", "A narrow alley, one warm lamp, puddles reflecting color only.", "moxi", 62, "2026-07-08", "/media/night.jpg", "雨后窄巷，一盏暖灯，冷色墙面，水洼反光，无人脸，无招牌文字", "narrow alley after rain, one warm lamp, cool walls, puddle reflections, no faces, no sign text", "人群，可读招牌，白天", "crowd, readable signs, daylight"),
  item("plant", "image", undefined, "窗边植物静物", "Window-side plant still life", "侧窗自然光，一片叶子，背景虚成浅灰。", "Side-window daylight, one leaf, background falling to light gray.", "阿槿", 48, "2026-08-14", "/media/still.jpg", "窗边植物，侧光，浅灰背景，单片叶子为视觉中心，安静，无花盆文字", "plant by a window, side light, light gray background, one leaf as the center, quiet, no pot text", "塑料感，强饱和，文字", "plastic look, heavy saturation, text"),
  item("street", "video", "hunyuan", "竖屏 · 街头漫步", "Vertical · street walk", "9:16 跟拍，步伐稳定，街面只保留光斑。", "9:16 follow shot, steady pace, street reduced to light patches.", "frame24", 131, "2026-02-18", "/media/street.jpg", "竖屏 9:16，手持跟拍行人步伐，浅景深，城市傍晚，动作缓慢，无字幕", "vertical 9:16, handheld follow of a walking pace, shallow depth, city dusk, slow motion, no subtitles", "横屏，快速摇镜，字幕，标志", "landscape, fast whip pan, subtitles, logos", "时长 4s · 24fps · 竖屏"),
  item("cafe", "video", "hunyuan", "竖屏 · 咖啡店一角", "Vertical · café corner", "杯子推近，蒸汽上升，背景人声压低。", "Push in on a cup, steam rising, room tone kept low.", "frame24", 97, "2026-03-21", "/media/cafe.jpg", "竖屏，咖啡店一角，杯子与蒸汽，缓慢推近，暖色台灯光，无菜单文字", "vertical, café corner, cup and steam, slow push-in, warm counter light, no menu text", "晃镜，人脸特写，字幕", "shaky camera, face close-up, subtitles", "时长 5s · 竖屏"),
  item("beach", "video", "minimax", "横屏 · 海边日落", "Landscape · beach sunset", "16:9 固定机位，潮线慢慢上移。", "16:9 locked camera, the tide line creeping up.", "frame24", 88, "2026-04-02", "/media/beach.jpg", "横屏 16:9，海边日落，固定机位，浪潮缓慢，暖色天空，无人脸，无文字", "landscape 16:9, beach sunset, locked camera, slow waves, warm sky, no faces, no text", "竖屏，快速剪辑，字幕", "vertical, fast cuts, subtitles", "时长 6s · 横屏"),
  item("aerial", "video", "minimax", "横屏 · 森林公路航拍", "Landscape · forest road aerial", "缓速前飞，公路只作引导线。", "A slow forward flyover. The road is only a leading line.", "frame24", 76, "2026-05-09", "/media/aerial.jpg", "横屏航拍，森林公路，缓慢前飞，晨雾，无车辆文字，无标志", "landscape aerial, forest road, slow forward move, morning mist, no vehicle text, no logos", "俯冲，城市，字幕", "dive, city, subtitles", "时长 6s · 横屏"),
  item("umbrella", "video", "hunyuan", "竖屏 · 雨中撑伞", "Vertical · umbrella in rain", "伞面占画面上三分之一，脚步入画。", "The umbrella fills the top third. Footsteps enter the frame.", "frame24", 64, "2026-08-01", "/media/street.jpg", "竖屏，雨中撑伞，伞面构图，脚步入画，冷色，无品牌，无字幕", "vertical, umbrella in rain, canopy composition, footsteps entering, cool grade, no brands, no subtitles", "晴天，标志，字幕", "sunny, logos, subtitles", "时长 4s · 竖屏"),
  item("bottle", "ecom", "hero", "玻璃瓶 · 清透水花", "Glass bottle · clear splash", "透明瓶身，一圈水花，浅灰无缝背景。", "A clear bottle and one ring of splash on a light gray seamless.", "阿槿", 126, "2026-01-28", "/media/bottle.jpg", "玻璃瓶产品主图，清透水花，浅灰无缝背景，高光干净，无标签文字", "glass bottle hero, clear water splash, light gray seamless, clean highlights, no label text", "杂乱道具，手指，可读标签", "clutter, fingers, readable label"),
  item("white", "ecom", "hero", "极简白底产品图", "Minimal white-background product", "纯白背景，产品居中，阴影只留一层。", "Pure white ground, product centered, one soft shadow only.", "阿槿", 93, "2026-02-09", "/media/white.jpg", "白底产品图，居中，一层软阴影，边缘干净，无文字无标志", "white-background product, centered, one soft shadow, clean edges, no text, no logo", "灰底，倒影过重，文字", "gray ground, heavy reflection, text"),
  item("sale", "ecom", "live", "直播贴片 · 限时秒杀", "Live overlay · flash sale", "左侧产品，右侧只留色块，不写价格数字。", "Product on the left, a color block on the right. No price numerals.", "阿槿", 81, "2026-03-15", "/media/sale.jpg", "直播贴片构图，产品在左，右侧纯色块，高对比，无具体价格文字", "live overlay layout, product left, solid color block right, high contrast, no price text", "密集小字，二维码，水印", "dense small type, QR code, watermark"),
  item("price", "ecom", "price", "价格标签 · 黄标促销", "Price tag · yellow promo", "黄标只作为色块，数字留给后期。", "The yellow tag is a color block. Numbers stay for later.", "阿槿", 74, "2026-04-18", "/media/price.jpg", "价格标签构图，黄色色块，牛皮纸盒，留出数字位置，无可读文字", "price-tag composition, yellow block, kraft box, space left for numerals, no readable text", "真实价格，品牌名，条码", "real prices, brand names, barcodes"),
  item("material", "ecom", "detail", "详情页 · 材质特写", "Detail page · material close-up", "斜侧微距，能看见纤维或颗粒。", "An oblique macro that shows fiber or grain.", "阿槿", 58, "2026-06-11", "/media/still.jpg", "详情页材质特写，微距，斜侧光，纹理清楚，背景虚化，无文字", "detail-page material macro, oblique light, visible texture, blurred ground, no text", "全景，包装文案", "wide shot, packaging copy"),
  item("float", "ecom", "hero", "主图 · 悬浮成分", "Hero · floating ingredients", "主体居中，配料悬浮但不重叠。", "Subject centered. Ingredients float and do not overlap.", "阿槿", 51, "2026-07-01", "/media/bottle.jpg", "主图，主体居中，配料悬浮，浅色背景，间距均匀，无文字", "hero image, subject centered, floating ingredients, pale ground, even gaps, no text", "重叠，阴影脏，文字", "overlap, dirty shadows, text"),
  item("bogo", "ecom", "live", "直播贴片 · 买一赠一", "Live overlay · BOGO", "两件产品并置，中间留一条空隙给后期字。", "Two products side by side, a gap in the middle for type later.", "阿槿", 44, "2026-07-22", "/media/sale.jpg", "两件产品并置，中间留白，直播贴片，无促销文字", "two products side by side, gap in the middle, live overlay, no promo text", "价格，二维码，水印", "prices, QR, watermark"),
  item("member", "ecom", "price", "价格标签 · 会员价", "Price tag · member price", "深色标签对浅色产品，对比只靠明度。", "A dark tag against a light product. Contrast is value only.", "阿槿", 39, "2026-08-20", "/media/price.jpg", "会员价标签构图，深色块，浅色产品，无数字无品牌", "member-price tag layout, dark block, light product, no numerals, no brand", "真实折扣文案，条码", "real discount copy, barcodes"),
  item("clay", "ip", undefined, "Q 版黏土公仔 · 棚拍", "Chibi clay figure · studio", "圆头 Q 版黏土公仔，柔和棚灯，浅灰背景，换主体即可用。", "Round chibi clay figure, soft studio light, light gray ground. Swap the subject.", "moxi", 128, "2026-01-12", "/media/clay.jpg", "Q 版黏土公仔，圆头，棚拍，柔光，浅灰背景，全身，脚边留白，无商标", "chibi clay figure, round head, studio, soft light, light gray background, full body, space at the feet, no trademark", "写实皮肤，尖锐塑料，文字，知名角色", "realistic skin, sharp plastic, text, known characters"),
  item("fox", "ip", undefined, "低多边形小狐狸", "Low-poly fox", "面数少，边缘干净，适合三视图。", "Low face count, clean edges, ready for a turnaround.", "pixel_lu", 96, "2026-02-02", "/media/fox.jpg", "低多边形小狐狸，干净边缘，三点布光，灰色背景，无贴图文字", "low-poly fox, clean edges, three-point light, gray background, no texture text", "高模写实毛发，商标", "high-poly realistic fur, trademarks"),
  item("mech", "ip", undefined, "红色机甲小人", "Red mech figure", "小比例机甲，关节清楚，棚拍灰底。", "A small mech, readable joints, gray studio ground.", "pixel_lu", 86, "2026-02-26", "/media/mech.jpg", "红色机甲小人，关节清楚，棚拍，灰色背景，无编号文字", "red mech figure, readable joints, studio, gray background, no serial text", "模糊涂装，知名机甲外形，文字", "muddy paint, known mecha silhouettes, text"),
  item("dragon", "ip", undefined, "国风小龙摆件", "Chinese dragon figurine", "玉色与少量金，案头比例，不写吉祥话。", "Jade with a little gold, desk scale, no auspicious lettering.", "moxi", 79, "2026-03-09", "/media/dragon.jpg", "国风小龙摆件，玉色与金，木案，柔光，无书法文字", "Chinese dragon figurine, jade and gold, wood desk, soft light, no calligraphy", "卡通贴纸风，文字，商标", "sticker cartoon, text, trademarks"),
  item("astro", "ip", undefined, "宇航员玩具", "Astronaut toy", "圆头盔，哑光白，脚底有接触阴影。", "Round helmet, matte white, a contact shadow under the feet.", "moxi", 68, "2026-04-04", "/media/clay.jpg", "宇航员玩具，圆头盔，哑光白，棚拍，接触阴影，无国旗无文字", "astronaut toy, round helmet, matte white, studio, contact shadow, no flags, no text", "写实宇航服，品牌", "realistic spacesuit, brands"),
  item("sailor", "ip", undefined, "水手玩偶", "Sailor doll", "布面，缝线可见，浅色背景。", "Cloth surface, visible stitching, pale background.", "pixel_lu", 61, "2026-04-28", "/media/fox.jpg", "水手玩偶，布面缝线，浅色背景，柔光，无文字", "sailor doll, cloth stitches, pale background, soft light, no text", "真人，制服商标", "real person, uniform trademarks"),
  item("ninja", "ip", undefined, "忍者手办", "Ninja figure", "低饱和，武器轮廓清楚，不出现具体流派标志。", "Low saturation, clear weapon silhouette, no specific school marks.", "pixel_lu", 55, "2026-05-16", "/media/mech.jpg", "忍者手办，低饱和，武器轮廓清楚，棚拍，无文字", "ninja figure, low saturation, clear weapon silhouette, studio, no text", "血腥，真实武器照片，文字", "gore, real weapon photos, text"),
  item("angel", "ip", undefined, "天使摆件", "Angel figurine", "小翅膀，石膏白，背景保持中性。", "Small wings, plaster white, a neutral ground.", "moxi", 49, "2026-06-06", "/media/clay.jpg", "天使小摆件，石膏白，小翅膀，中性背景，无光环文字", "small angel figurine, plaster white, small wings, neutral ground, no halo text", "宗教经文，商标", "religious scripture, trademarks"),
  item("candy", "ip", undefined, "糖果怪物", "Candy monster", "圆润，半透明糖壳，不要尖牙。", "Rounded, a translucent sugar shell, no fangs.", "moxi", 43, "2026-06-27", "/media/still.jpg", "糖果怪物，圆润，半透明糖壳，浅色背景，可爱，无尖牙无文字", "candy monster, rounded, translucent sugar shell, pale ground, cute, no fangs, no text", "恐怖，牙齿，包装文字", "horror, teeth, packaging text"),
  item("linefig", "ip", undefined, "线稿小人", "Line-art figure", "均匀线重，适合后再上色。", "Even line weight, ready to color later.", "pixel_lu", 38, "2026-07-15", "/media/white.jpg", "线稿小人，均匀线重，白底，全身，无阴影文字", "line-art figure, even weight, white ground, full body, no shaded text", "照片，上色，水印", "photo, color fill, watermark"),
  item("woodcar", "ip", undefined, "木制小车", "Wooden car", "可见木纹，轮子简单，桌面俯拍。", "Visible grain, simple wheels, a tabletop overhead.", "moxi", 33, "2026-08-03", "/media/fox.jpg", "木制小车，可见木纹，桌面俯拍，自然光，无商标", "wooden toy car, visible grain, overhead tabletop, daylight, no trademark", "金属玩具品牌，文字", "branded metal toys, text"),
  item("clay2", "ip", undefined, "黏土二次元", "Clay anime bust", "半身，大眼睛用简单球形，不要具体作品角色。", "A bust. Eyes are simple spheres. No characters from existing works.", "moxi", 29, "2026-08-25", "/media/clay.jpg", "黏土二次元半身，大眼睛为简单球形，棚拍浅灰，原创，无文字", "clay anime bust, simple sphere eyes, light gray studio, original, no text", "已知角色，商标，文字", "known characters, trademarks, text"),
  item("comfy-portrait", "comfy", undefined, "人像工作流 · 基础", "Portrait workflow · base", "正反向分开接，采样器与步数写在参数里。", "Positive and negative stay on separate nodes. Sampler and steps live in params.", "night", 41, "2026-03-30", "/media/cafe.jpg", "棚拍半身人像，自然肤色，柔光，浅灰背景，无名人五官", "studio half portrait, natural skin, soft light, light gray ground, no celebrity features", "畸形手，过锐，文字，名人", "malformed hands, oversharpen, text, celebrities", "steps 28 · CFG 5.5 · sampler DPM++ 2M Karras"),
  item("comfy-cut", "comfy", undefined, "产品抠图工作流", "Product cutout workflow", "白底输出，边缘留 8% 安全区。", "White output with an 8% safe margin.", "night", 36, "2026-05-22", "/media/white.jpg", "产品居中，白底，边缘干净，安全边 8%，无阴影文字", "product centered, white ground, clean edge, 8% safe margin, no shadow text", "杂边，灰底，商标", "fringing, gray ground, trademarks", "rembg · 输出 PNG"),
  item("swiss", "poster", undefined, "瑞士网格海报", "Swiss grid poster", "黑白，粗竖线，标题区留空，不生成文字。", "Black and white, a heavy vertical stroke, title area left empty. Do not generate type.", "grid", 47, "2026-02-14", "/media/night.jpg", "瑞士国际主义海报，黑白，粗竖线，大面积留白，无文字", "Swiss international style poster, black and white, heavy vertical stroke, large empty field, no text", "装饰花纹，渐变彩虹，文字", "ornament, rainbow gradient, text"),
  item("event", "poster", undefined, "活动主视觉", "Event key visual", "一个主体，底部留横条给后期标题。", "One subject. A band at the bottom is reserved for a title later.", "grid", 40, "2026-04-07", "/media/forest.jpg", "活动主视觉，单一主体，底部留白横条，高对比，无文字", "event key visual, single subject, empty band at the bottom, high contrast, no text", "多主体，小字，二维码", "many subjects, small type, QR"),
  item("brand", "poster", undefined, "品牌色块封面", "Brand color-block cover", "两块颜色，不做渐变，不放标志。", "Two flat colors. No gradient and no mark.", "grid", 34, "2026-06-19", "/media/still.jpg", "封面，两块纯色，几何分割，无渐变，无标志无文字", "cover, two flat colors, geometric split, no gradient, no logo, no text", "照片拼贴，渐变，文字", "photo collage, gradient, text"),
  item("watercolor-fig", "illust", undefined, "水彩人物", "Watercolor figure", "留白皮肤，颜色只落在衣服和背景。", "Skin stays as paper. Color sits on clothes and the ground.", "ink", 52, "2026-03-05", "/media/cafe.jpg", "水彩人物半身，皮肤留白，衣服有色，纸纹，无五官写真，无文字", "watercolor half figure, unpainted skin, colored clothes, paper grain, no photo face, no text", "厚重油画，文字", "heavy oil, text"),
  item("impasto", "illust", undefined, "厚涂角色", "Impasto character", "笔触可见，光源只有一处。", "Visible strokes, a single light source.", "ink", 45, "2026-04-21", "/media/dragon.jpg", "厚涂角色，可见笔触，单一光源，中性背景，原创，无文字", "impasto character, visible strokes, single light, neutral ground, original, no text", "平涂贴纸，已知角色", "flat sticker, known characters"),
  item("line-scene", "illust", undefined, "线稿场景", "Line-art scene", "室内一角，线重一致，不上色。", "An interior corner, consistent line weight, no color.", "ink", 37, "2026-06-08", "/media/white.jpg", "线稿室内一角，线重一致，白底，无上色无文字", "line-art interior corner, even line weight, white ground, no color, no text", "灰度上色，照片", "gray paint, photo"),
  item("anime-cover", "illust", undefined, "动漫封面", "Anime cover", "人物偏左，右侧留白给标题。", "Figure to the left, empty field on the right for a title.", "ink", 31, "2026-07-29", "/media/clay.jpg", "动漫封面构图，人物偏左，右侧留白，无标题文字，原创角色", "anime cover layout, figure left, empty right, no title text, original character", "已知作品角色，标题文字", "existing characters, title text"),
  item("turnaround", "render", undefined, "产品三视图", "Product turnaround", "正侧背同一灯光，白底对齐。", "Front, side and back under the same light, aligned on white.", "render", 50, "2026-02-20", "/media/white.jpg", "产品三视图，正侧背，同一灯光，白底对齐，无文字", "product turnaround, front side back, same light, aligned on white, no text", "透视夸张，阴影不统一，标志", "extreme perspective, mismatched shadows, logos"),
  item("octane", "render", undefined, "OC 玻璃材质", "Octane glass material", "清透玻璃，一盏主光，背景渐隐。", "Clear glass, one key light, background falling off.", "render", 42, "2026-05-03", "/media/bottle.jpg", "Octane 玻璃产品，清透，一盏主光，背景渐隐，无标签", "Octane glass product, clear, one key light, falling background, no label", "塑料感，脏反射，文字", "plastic, dirty reflections, text"),
  item("c4d", "render", undefined, "C4D 场景灯", "C4D set lighting", "三点布光，地面有轻微反射。", "Three-point lighting, a slight floor reflection.", "render", 35, "2026-07-11", "/media/mech.jpg", "C4D 产品场景，三点布光，轻微地面反射，灰色棚，无文字", "C4D product set, three-point light, slight floor reflection, gray cove, no text", "户外，复杂道具，标志", "outdoors, busy props, logos"),
  item("street-photo", "photo", undefined, "街拍人像", "Street portrait", "环境人像，脸部不要具体名人特征。", "Environmental portrait. The face should not match a celebrity.", "lens", 57, "2026-03-18", "/media/street.jpg", "街拍环境人像，自然光，浅景深，非名人，无文字", "street environmental portrait, daylight, shallow depth, not a celebrity, no text", "名人脸，商标，文字", "celebrity face, trademarks, text"),
  item("headshot", "photo", undefined, "棚拍头像", "Studio headshot", "肩上构图，背景均匀浅灰。", "Head and shoulders, an even light-gray ground.", "lens", 46, "2026-04-25", "/media/cafe.jpg", "棚拍头像，肩上构图，浅灰背景，柔光，非名人，无文字", "studio headshot, head and shoulders, light gray, soft light, not a celebrity, no text", "硬闪，名人，文字", "hard flash, celebrity, text"),
  item("half", "photo", undefined, "自然光半身", "Daylight half portrait", "窗光，身体转 30 度。", "Window light, body turned thirty degrees.", "lens", 39, "2026-06-14", "/media/still.jpg", "自然光半身，窗光，身体转三十度，安静背景，非名人", "daylight half portrait, window light, thirty-degree turn, quiet ground, not a celebrity", "夜店光，名人，文字", "nightclub light, celebrity, text"),
  item("rim", "photo", undefined, "夜景轮廓", "Night rim light", "只保留轮廓光，面部细节少。", "Rim light only, little facial detail.", "lens", 32, "2026-08-08", "/media/night.jpg", "夜景轮廓光人像，面部细节少，城市光斑，非名人，无文字", "night rim-light portrait, little facial detail, city bokeh, not a celebrity, no text", "正面闪光，可读招牌", "frontal flash, readable signs"),
  item("facade", "arch", undefined, "混凝土立面", "Concrete facade", "重复窗洞，阴天，无店铺招牌。", "Repeated window bays, overcast, no shop signs.", "arch", 48, "2026-01-30", "/media/forest.jpg", "混凝土建筑立面，重复窗洞，阴天，无招牌无文字", "concrete facade, repeated window bays, overcast, no signs, no text", "玻璃幕墙广告，人物", "glass-ad curtain wall, people"),
  item("interior", "arch", undefined, "日式室内", "Japanese interior", "榻榻米边缘入画，光从纸门来。", "A tatami edge in frame, light from a paper screen.", "arch", 41, "2026-05-27", "/media/still.jpg", "日式室内，榻榻米边缘，纸门光，安静，无书法", "Japanese interior, tatami edge, light through a paper screen, quiet, no calligraphy", "现代杂物，文字", "modern clutter, text"),
  item("citystreet", "arch", undefined, "城市街景", "City street", "建筑为主，行人很小，不拍车牌。", "Buildings lead. People stay small. No license plates.", "arch", 36, "2026-07-18", "/media/street.jpg", "城市街景，建筑为主，行人很小，无车牌无招牌文字", "city street, buildings first, tiny people, no plates, no sign text", "车牌，可读广告", "license plates, readable ads"),
  item("hook", "copy", undefined, "短视频开场 · 三句式", "Short-video hook · three lines", "三句口播：问题、反差、动作。不写具体品牌。", "Three spoken lines: problem, contrast, action. No brand names.", "copy", 66, "2026-02-22", "/media/cafe.jpg", "三句口播结构：先提一个具体问题，再给一个反差，最后给一个可执行动作。不出现品牌名与价格。", "Three spoken lines: a specific problem, a contrast, then one action. No brand names or prices.", "夸张承诺，医疗效果，品牌名", "exaggerated claims, medical effects, brand names"),
  item("sell", "copy", undefined, "电商卖点口播", "Product benefit voice-over", "只讲材质、尺寸和用法，不讲折扣。", "Talk material, size and use. Do not mention discounts.", "copy", 53, "2026-06-23", "/media/bottle.jpg", "口播只包含材质、尺寸和一种用法。语气平静。不出现价格、折扣和品牌。", "Voice-over covers material, size and one use. Calm tone. No price, discount or brand.", "绝对化用语，虚假数据，价格", "absolute claims, fake stats, prices"),
  item("neg-quality", "params", undefined, "通用反向词 · 画质", "General negatives · quality", "画质、解剖和文字类反向词，可直接接在负向。", "Quality, anatomy and text negatives. Paste straight into the negative.", "param", 59, "2026-01-20", "/media/white.jpg", "低质量，模糊，过曝，欠曝，畸形手指，多余肢体，水印，文字，标志，压缩噪声", "low quality, blurry, overexposed, underexposed, malformed fingers, extra limbs, watermark, text, logo, compression noise"),
  item("sampler", "params", undefined, "步数 / CFG / 采样器", "Steps / CFG / sampler", "一组稳妥起点，不保证所有模型。", "A safe starting point. Not a guarantee for every model.", "param", 44, "2026-04-14", "/media/price.jpg", "作为参数说明使用，而不是画面描述。", "Use as parameter notes, not as an image description.", undefined, undefined, "steps 30 · CFG 6 · sampler Euler a · 512→1024 hires off"),
  item("structure", "other", undefined, "提示词结构模板", "Prompt structure template", "主体、光线、镜头、背景、排除项，五段式。", "Subject, light, lens, ground, exclusions. Five parts.", "moxi", 28, "2026-08-28", "/media/fox.jpg", "按顺序写：主体；光线；镜头或画幅；背景；不要出现的东西。每段一句。", "Write in order: subject; light; lens or frame; ground; exclusions. One sentence each.", "空泛形容词堆叠，品牌，名人", "stacks of empty adjectives, brands, celebrities"),
];

function item(
  id: string,
  cat: CatId,
  sub: SubId | undefined,
  zhTitle: string,
  enTitle: string,
  zhBlurb: string,
  enBlurb: string,
  author: string,
  votes: number,
  createdAt: string,
  image: string,
  zhPos: string,
  enPos: string,
  zhNeg?: string,
  enNeg?: string,
  params?: string,
): PromptItem {
  return {
    id,
    cat,
    sub,
    title: T(zhTitle, enTitle),
    blurb: T(zhBlurb, enBlurb),
    author,
    votes,
    createdAt,
    image,
    positive: T(zhPos, enPos),
    negative: zhNeg && enNeg ? T(zhNeg, enNeg) : undefined,
    params,
  };
}

export function catById(id: string) {
  return categories.find((c) => c.id === id);
}

export function catName(cat: Category, lang: UiLang) {
  return lang === "en" ? cat.en : cat.zh;
}

export function catIntro(cat: Category, lang: UiLang) {
  return lang === "en" ? cat.introEn : cat.introZh;
}

export function catLead(cat: Category, lang: UiLang) {
  return lang === "en" ? cat.leadEn : cat.leadZh;
}

export const HOME_CATS: CatId[] = ["image", "video", "ecom", "ip"];

export const MOSAIC = [
  "/media/clay.jpg",
  "/media/cabin.jpg",
  "/media/street.jpg",
  "/media/bottle.jpg",
  "/media/dragon.jpg",
  "/media/white.jpg",
  "/media/cafe.jpg",
  "/media/forest.jpg",
  "/media/night.jpg",
  "/media/still.jpg",
  "/media/beach.jpg",
  "/media/sale.jpg",
];

export function textOf(value: CopyText, lang: UiLang) {
  return value[lang];
}

export function seedById(id: string) {
  return prompts.find((p) => p.id === id);
}
