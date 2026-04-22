insert into parent_accounts (id, display_name, phone, password, default_child_profile_id)
values (1, '星星妈妈', '13800000001', 'demo1234', 1);

insert into child_profiles (id, nickname, streak_days, total_stars, title, stage_label, avatar_color, parent_account_id)
values (1, '小星星', 7, 126, '晨光冒险家', '幼小衔接', '#ffcf70', 1),
       (2, '小火箭', 12, 188, '银河探险家', '幼小衔接', '#8ad1ff', 1),
       (3, '小海豚', 10, 172, '海湾领航员', '幼小衔接', '#8ee1b5', 1);

insert into subjects (code, title, subtitle, accent_color, display_order)
values ('math', '数学岛', '数感和规律正在闪闪发亮', '#ff8a5b', 1),
       ('chinese', '语文岛', '字形和拼音一起发芽', '#f2c14e', 2),
       ('english', '英语岛', '字母和单词在海风里唱歌', '#39b7a5', 3),
       ('olympiad', '奥数训练营', '从找规律到逻辑推理的思维闯关', '#4f7cff', 4);

insert into chapters (code, title, subtitle, stage_label, display_order, subject_code)
values ('math-numbers', '数字启蒙站', '从看见数量到会认数字，完成第一段数学冒险。', '幼小衔接', 1, 'math'),
       ('math-grade1-numbers', '百数启航站', '认识 100 以内的数，把位值和大小规律慢慢看清楚。', '一年级', 1, 'math'),
       ('math-grade1-life', '生活应用站', '把 20 以内加减法放进生活场景，学会用数学想问题。', '一年级', 2, 'math'),
       ('math-grade2-skills', '乘法巧思站', '把乘法和长度观察放到一起，让二年级数学更有条理。', '二年级', 1, 'math'),
       ('math-grade2-life', '时间应用站', '把应用题和时间问题放进生活里，继续培养数学思维。', '二年级', 2, 'math'),
       ('math-grade3-operations', '除法图形站', '从平均分到周长，开始看见三年级数学里的结构。', '三年级', 1, 'math'),
       ('math-grade3-thinking', '分数策略站', '用分数和多步应用题继续训练推理与表达。', '三年级', 2, 'math'),
       ('math-grade4-numbers', '小数图形站', '从小数到角和图形，把抽象概念放进可观察的画面。', '四年级', 1, 'math'),
       ('math-grade4-strategy', '运算策略站', '把综合运算和策略应用题拆开看，练习更清晰的思考。', '四年级', 2, 'math'),
       ('chinese-characters', '汉字花园', '跟着图像和生活场景认识常见字。', '幼小衔接', 1, 'chinese'),
       ('chinese-pinyin', '拼音乐园', '听声音、认拼读，把拼音读得更稳。', '幼小衔接', 2, 'chinese'),
       ('chinese-writing', '笔画写字屋', '跟着笔顺把字写整齐，越写越有信心。', '幼小衔接', 3, 'chinese'),
       ('chinese-grade1-words', '识字组词站', '从常见生字出发，试着把字放进词语里读一读。', '一年级', 1, 'chinese'),
       ('chinese-grade1-reading', '看图读句屋', '从拼音到词语再到句子，一步步把一年级基础读起来。', '一年级', 2, 'chinese'),
       ('chinese-grade2-words', '搭配排序站', '学会搭配词语、理清句子顺序，让表达更流畅。', '二年级', 1, 'chinese'),
       ('chinese-grade2-reading', '表达朗读屋', '从看图表达走到朗读理解，把二年级阅读基础搭起来。', '二年级', 2, 'chinese'),
       ('chinese-grade3-reading', '段落理解站', '读懂一小段话，也开始留意段落中的关键词。', '三年级', 1, 'chinese'),
       ('chinese-grade3-expression', '表达修辞屋', '认识简单修辞，试着把阅读感受说得更清楚。', '三年级', 2, 'chinese'),
       ('chinese-grade4-reading', '篇章理解站', '从段落走向篇章，学会抓住中心和线索。', '四年级', 1, 'chinese'),
       ('chinese-grade4-expression', '古诗语法屋', '积累古诗，也开始认识句子里的表达规则。', '四年级', 2, 'chinese'),
       ('english-letters', '字母海湾', '把 26 个字母分段点亮，读出熟悉的节奏。', '幼小衔接', 1, 'english'),
       ('english-phonics', '拼读码头', '听字母和开头音，把声音和单词连起来。', '幼小衔接', 2, 'english'),
       ('english-words', '单词沙滩', '把生活常见单词和图片配成一对。', '幼小衔接', 3, 'english'),
       ('english-story', '绘本港湾', '跟着图画和句子，把简单绘本一页页读下来。', '幼小衔接', 4, 'english'),
       ('english-grade1-words', '校园单词港', '把一年级常见校园和动作单词认出来、配起来。', '一年级', 1, 'english'),
       ('english-grade1-sentences', '问候句海湾', '从自然拼读到问候句，把英语说得更完整。', '一年级', 2, 'english'),
       ('english-grade2-phonics', '拼读进阶港', '继续认识字母组合和基础句型，把英语听懂一点、读顺一点。', '二年级', 1, 'english'),
       ('english-grade2-story', '表达故事湾', '从日常对话走进简单绘本，让英语表达更像真实场景。', '二年级', 2, 'english'),
       ('english-grade3-sentences', '句型变化港', '从句型变换到词组搭配，开始搭建更完整的英语表达。', '三年级', 1, 'english'),
       ('english-grade3-reading', '阅读表达湾', '读短文、聊主题，把英语从句子推进到小段表达。', '三年级', 2, 'english'),
       ('english-grade4-language', '时态语句港', '从时态线索到短文理解，学会判断句子发生的时间。', '四年级', 1, 'english'),
       ('english-grade4-expression', '话题综合湾', '围绕话题组织句子，并通过综合练习巩固表达。', '四年级', 2, 'english'),
       ('olympiad-grade1', '一年级奥数星图', '从观察规律和简单巧算开始，先让孩子觉得“想一想很好玩”。', '奥数训练', 1, 'olympiad'),
       ('olympiad-grade2', '二年级奥数星图', '把“有几种办法”和“图形怎么切”变成可操作的探索。', '奥数训练', 2, 'olympiad'),
       ('olympiad-grade3', '三年级奥数星图', '引入线段图和周期规律，让应用题开始有结构。', '奥数训练', 3, 'olympiad'),
       ('olympiad-grade4', '四年级奥数星图', '开始接触经典奥数模型，用故事题训练推理表达。', '奥数训练', 4, 'olympiad'),
       ('olympiad-grade5', '五年级奥数星图', '从行程和数论切入，让高年级思维题更像策略游戏。', '奥数训练', 5, 'olympiad'),
       ('olympiad-grade6', '六年级奥数星图', '面向小升初思维训练，强化综合建模和严谨推理。', '奥数训练', 6, 'olympiad');

insert into levels (code, summary_title, detail_title, status, description, reward_stars, reward_badge_name, display_order, chapter_code)
values ('math-numbers-001', '认识 0-10', '数字小探险', 'recommended', '拖一拖、选一选，把数字和数量变成好朋友。', 3, '数字小达人', 1, 'math-numbers'),
       ('math-numbers-002', '认识 11-20', '数到二十站', 'available', '继续认识 11 到 20，让数数变得更熟练。', 2, '十几数小勇士', 2, 'math-numbers'),
       ('math-addition-001', '10 以内加法', '糖果加加看', 'available', '看着糖果数量变化，学会简单加法。', 2, '加法闪光星', 3, 'math-numbers'),
       ('math-addition-002', '20 以内加法', '彩虹桥加法', 'available', '用 20 以内的数字继续练习加法。', 2, '20 以内加法星', 4, 'math-numbers'),
       ('math-thinking-001', '规律小火车', '规律小火车', 'available', '找一找颜色和图形的规律，让小火车继续往前开。', 2, '规律观察家', 5, 'math-numbers'),
       ('math-thinking-002', '图形规律屋', '图形规律屋', 'available', '继续观察图形和顺序，把规律一眼看出来。', 2, '图形观察家', 6, 'math-numbers'),
       ('math-subtraction-001', '水果减减看', '水果减减看', 'available', '点一点拿走水果，再想想还剩多少。', 2, '减法小能手', 7, 'math-numbers'),
       ('math-subtraction-002', '20 以内减法', '树上小鸟减法', 'available', '把 20 以内减法放进故事里，一边听一边算。', 2, '20 以内减法星', 8, 'math-numbers'),
       ('math-compare-001', '谁更多挑战', '谁更多挑战', 'available', '看一看两边的数量，选出更多的一组。', 2, '数感小雷达', 9, 'math-numbers'),
       ('math-equation-001', '图像列式屋', '图像列式屋', 'available', '看着图片把加法算式列出来。', 2, '列式小侦探', 10, 'math-numbers'),
       ('math-wordproblem-001', '故事应用题', '故事应用题', 'available', '听故事、看图画，再算出最后的答案。', 2, '应用题小勇士', 11, 'math-numbers'),
       ('math-shapes-001', '图形分类屋', '图形分类屋', 'available', '看一看圆形、三角形和正方形，把图形朋友认出来。', 2, '图形小侦探', 12, 'math-numbers'),
       ('math-position-001', '上下左右小地图', '上下左右小地图', 'available', '帮小动物找到上下左右的位置，建立空间方向感。', 2, '方位小导航', 13, 'math-numbers'),
       ('math-ordinal-001', '排队第几个', '排队第几个', 'available', '数一数队伍里的位置，认识第几个。', 2, '序数小队长', 14, 'math-numbers'),
       ('chinese-characters-001', '太阳和月亮', '汉字日月冒险', 'recommended', '从图像和笔画开始认识两个常见汉字。', 1, '识字小种子', 1, 'chinese-characters'),
       ('chinese-characters-002', '生活常见字', '生活常见字', 'available', '把身体和生活里的常见字认出来。', 2, '生活识字员', 2, 'chinese-characters'),
       ('chinese-characters-003', '身体小伙伴', '身体小伙伴', 'available', '把耳朵、眼睛和小手这些身体常见字认出来。', 2, '身体识字员', 3, 'chinese-characters'),
       ('chinese-radicals-001', '偏旁小树', '偏旁小树', 'available', '观察带木字旁的汉字，发现汉字里的小线索。', 2, '偏旁观察员', 4, 'chinese-characters'),
       ('chinese-pinyin-001', '拼音泡泡', '拼音泡泡大作战', 'available', '听一听、认一认，把声母和韵母连起来。', 1, '拼音小耳朵', 1, 'chinese-pinyin'),
       ('chinese-pinyin-002', '拼读小火车', '拼读小火车', 'available', '把拼读的声音和拼音火车连起来。', 2, '拼读小火车长', 2, 'chinese-pinyin'),
       ('chinese-pinyin-003', '声母找朋友', '声母找朋友', 'available', '听一听声母的声音，把一样的发音找出来。', 2, '声母小侦探', 3, 'chinese-pinyin'),
       ('chinese-pinyin-tone-001', '声调小山坡', '声调小山坡', 'available', '听一听四个声调的高低变化，把音调认出来。', 2, '声调小耳朵', 4, 'chinese-pinyin'),
       ('chinese-strokes-001', '笔顺小画家', '笔顺小画家', 'available', '按顺序点一点，把汉字的笔画排整齐。', 2, '笔顺小画家', 1, 'chinese-writing'),
       ('chinese-strokes-002', '日字描描乐', '日字描描乐', 'available', '继续按顺序点一点，把“日”字写完整。', 2, '小小写字家', 2, 'chinese-writing'),
       ('chinese-strokes-003', '人字起步', '人字起步', 'available', '从简单的两笔开始，把“人”字写稳写好。', 2, '起步写字星', 3, 'chinese-writing'),
       ('chinese-strokes-004', '横竖撇捺练习', '横竖撇捺练习', 'available', '认识横、竖、撇、捺四种基础笔画。', 2, '基础笔画星', 4, 'chinese-writing'),
       ('english-letters-001', '字母 A 到 F', '字母小船出发', 'recommended', '跟着发音和形状，认识第一组字母朋友。', 1, '字母小船长', 1, 'english-letters'),
       ('english-letters-002', '字母 G 到 L', '字母 G 到 L', 'available', '继续认识第二组字母朋友。', 1, '字母快帆手', 2, 'english-letters'),
       ('english-letters-003', '字母 M 到 R', '字母 M 到 R', 'available', '把第三组字母也读熟。', 1, '字母领航员', 3, 'english-letters'),
       ('english-letters-004', '字母 S 到 Z', '字母 S 到 Z', 'available', '完成 26 个字母的最后一程。', 2, '全字母船长', 4, 'english-letters'),
       ('english-case-001', '大小写找朋友', '大小写找朋友', 'available', '把大写字母和小写字母配成一对。', 2, '大小写配对星', 5, 'english-letters'),
       ('english-letter-sounds-001', '字母发音小剧场', '字母发音小剧场', 'available', '把字母名和常见字母音分开听、分开跟读。', 2, '字母发音星', 6, 'english-letters'),
       ('english-letter-sounds-002', '字母音 D 到 F', '字母音 D 到 F', 'available', '继续把 D、E、F 的字母音和例词一起读出来。', 2, '字母音续航星', 7, 'english-letters'),
       ('english-phonics-001', '字母藏在单词里', '字母藏在单词里', 'available', '听字母声音，再找出发音一样的单词。', 2, '拼读小船员', 1, 'english-phonics'),
       ('english-phonics-002', '开头声音侦探', '开头声音侦探', 'available', '听一听单词开头的声音，再找出发音一样的单词。', 2, '声音侦探员', 2, 'english-phonics'),
       ('english-words-001', '日常单词配对', '单词海风配对赛', 'available', '把常见生活单词和图像轻松对应起来。', 1, '单词小海星', 1, 'english-words'),
       ('english-words-002', '生活单词跟读', '生活单词跟读', 'available', '边配对边跟读，把常见生活单词读出来。', 2, '单词跟读手', 2, 'english-words'),
       ('english-words-003', '颜色单词沙堡', '颜色单词沙堡', 'available', '把颜色单词和对应的彩色旗子配成一对。', 2, '颜色小沙堡师', 3, 'english-words'),
       ('english-family-001', '家庭单词屋', '家庭单词屋', 'available', '把 family、mom、dad 和图标配成一对。', 2, '家庭单词星', 4, 'english-words'),
       ('english-word-sounds-001', '单词读音小耳朵', '单词读音小耳朵', 'available', '听单词读音，选择对应的日常单词卡。', 2, '单词读音星', 5, 'english-words'),
       ('english-word-sounds-002', '生活物品听辨', '生活物品听辨', 'available', '听一听 milk、bag、sun，选出对应的生活单词。', 2, '生活听辨星', 6, 'english-words'),
       ('english-story-001', '海湾小绘本', '海湾小绘本', 'available', '跟着图片读一读简单句子，把小故事完整读下来。', 2, '绘本小海鸥', 1, 'english-story'),
       ('english-story-002', '晨光小绘本', '晨光小绘本', 'available', '继续跟着图片读一读简单句子。', 2, '晨光朗读员', 2, 'english-story'),
       ('english-story-003', '晚安小绘本', '晚安小绘本', 'available', '跟着夜晚场景读句子，把晚安小绘本完整读下来。', 2, '晚安朗读星', 3, 'english-story'),
       ('english-story-004', '公园小绘本', '公园小绘本', 'available', '跟着公园场景读简单句子，把新绘本读完整。', 2, '公园朗读星', 4, 'english-story'),
       ('english-daily-sentences-001', '日常短句跟读', '日常短句跟读', 'available', '跟读早安、喜欢、感谢这些生活里马上能用的小句子。', 2, '日常表达星', 5, 'english-story'),
       ('english-dialogue-001', '问候对话跟读', '问候对话跟读', 'available', '把见面问候的小对话读顺，敢开口说第一句。', 2, '问候表达星', 6, 'english-story'),
       ('math-grade1-numbers-001', '认识 100 以内的数', '百数探险家', 'recommended', '看看两位数，学会辨认更大的数字。', 3, '百数小侦探', 1, 'math-grade1-numbers'),
       ('math-grade1-addition-001', '20 以内进位加法', '小桥进位加法', 'available', '先看故事里的数量变化，再算出进位加法。', 3, '进位加法星', 2, 'math-grade1-numbers'),
       ('math-grade1-subtraction-001', '20 以内退位减法', '退位减法小练习', 'available', '用生活故事练习退位减法，把答案想清楚。', 3, '退位减法星', 1, 'math-grade1-life'),
       ('math-grade1-wordproblem-001', '生活应用题', '文具盒应用题', 'available', '把数字放进文具和书包故事里，学会列出答案。', 3, '应用思考星', 2, 'math-grade1-life'),
       ('chinese-grade1-words-001', '生字组词', '词语小火车', 'recommended', '看看常见字能和谁组成词语，把词语读完整。', 2, '组词小达人', 1, 'chinese-grade1-words'),
       ('chinese-grade1-pinyin-001', '拼音拼读提升', '拼读加速站', 'available', '继续听拼音、认拼读，把一年级常见音节读稳。', 2, '拼读进步星', 2, 'chinese-grade1-words'),
       ('chinese-grade1-sentence-001', '看图读句', '图画读句屋', 'available', '跟着图片把短句读顺，把意思看明白。', 2, '读句小能手', 1, 'chinese-grade1-reading'),
       ('chinese-grade1-punctuation-001', '标点小卫士', '标点小卫士', 'available', '认识句号、问号和感叹号，让句子更完整。', 2, '标点观察员', 2, 'chinese-grade1-reading'),
       ('english-grade1-words-001', '校园单词配对', '校园单词配对', 'recommended', '把一年级常见校园单词和图标一一连起来。', 2, '校园单词星', 1, 'english-grade1-words'),
       ('english-grade1-phonics-001', 'CVC 拼读入门', '短音拼读屋', 'available', '先听开头音，再找到同样发音的短单词。', 2, '拼读启航星', 2, 'english-grade1-words'),
       ('english-grade1-sentence-001', '问候句跟读', '问候句跟读', 'available', '把简单问候句按顺序读出来，学会开口表达。', 2, '问候小海星', 1, 'english-grade1-sentences'),
       ('english-grade1-actions-001', '动作单词配对', '动作单词配对', 'available', '把 run、jump、read 这些动作单词和图标连起来。', 2, '动作单词星', 2, 'english-grade1-sentences'),
       ('math-grade2-multiply-001', '表内乘法起步', '乘法跳跳屋', 'recommended', '把一组一组的小物件数清楚，学会把乘法看成重复加法。', 3, '乘法起步星', 1, 'math-grade2-skills'),
       ('math-grade2-length-001', '长度单位比一比', '长度观察台', 'available', '看着尺子和生活物品，分清厘米和长度大小规律。', 3, '长度观察星', 2, 'math-grade2-skills'),
       ('math-grade2-wordproblem-001', '两步应用题', '文具店应用题', 'available', '在买和送的故事里学会两步思考，让应用题更清楚。', 3, '应用思考星', 1, 'math-grade2-life'),
       ('math-grade2-time-001', '时间小管家', '时间小管家', 'available', '从整点时间出发，学会把时间往前往后推。', 3, '时间管理星', 2, 'math-grade2-life'),
       ('chinese-grade2-phrase-001', '词语搭配', '词语搭配桥', 'recommended', '把意思自然的词语搭在一起，让表达更准确。', 2, '搭配小能手', 1, 'chinese-grade2-words'),
       ('chinese-grade2-order-001', '句子排序', '句子排序桥', 'available', '按事情发生的顺序整理句子，让表达更有条理。', 2, '排序观察星', 2, 'chinese-grade2-words'),
       ('chinese-grade2-picture-001', '看图表达', '看图表达屋', 'available', '跟着图画说完整句子，把画面内容有序表达出来。', 2, '表达小能手', 1, 'chinese-grade2-reading'),
       ('chinese-grade2-reading-001', '朗读理解', '朗读理解屋', 'available', '读一读二年级短文，试着感受画面和顺序。', 2, '朗读进步星', 2, 'chinese-grade2-reading'),
       ('english-grade2-phonics-001', '自然拼读进阶', '自然拼读进阶站', 'recommended', '听清楚字母组合的声音，再找到对应单词。', 2, '拼读进阶星', 1, 'english-grade2-phonics'),
       ('english-grade2-sentence-001', '句型理解', '句型彩虹桥', 'available', '从简单句型里认识人物、颜色和喜好，慢慢读出完整句子。', 2, '句型理解星', 2, 'english-grade2-phonics'),
       ('english-grade2-dialogue-001', '日常对话', '日常对话角', 'available', '跟着简短对话练习开口表达，把交流说完整。', 2, '对话海风星', 1, 'english-grade2-story'),
       ('english-grade2-story-001', '绘本理解', '小绘本理解屋', 'available', '按顺序读完简单绘本句子，看看故事发生了什么。', 2, '绘本理解星', 2, 'english-grade2-story'),
       ('math-grade3-division-001', '除法平均分', '平均分小队', 'recommended', '把物品平均分给几组，认识除法的意思。', 3, '平均分小队长', 1, 'math-grade3-operations'),
       ('math-grade3-perimeter-001', '周长小侦探', '操场周长探险', 'available', '绕着图形走一圈，学会把边长合起来求周长。', 3, '周长侦探星', 2, 'math-grade3-operations'),
       ('math-grade3-fraction-001', '分数初步', '披萨分数屋', 'available', '从平均分的图形开始认识几分之几。', 3, '分数启航星', 1, 'math-grade3-thinking'),
       ('math-grade3-wordproblem-001', '多步应用题', '图书角应用题', 'available', '把复杂问题拆成两步，学会一步一步解决。', 3, '策略应用星', 2, 'math-grade3-thinking'),
       ('chinese-grade3-paragraph-001', '段落理解', '段落理解屋', 'recommended', '按顺序读完一小段话，抓住主要画面。', 2, '段落理解星', 1, 'chinese-grade3-reading'),
       ('chinese-grade3-antonym-001', '近反义词', '词语镜子屋', 'available', '通过近义词和反义词更准确地理解词语。', 2, '词语镜子星', 2, 'chinese-grade3-reading'),
       ('chinese-grade3-rhetoric-001', '修辞感知', '比喻小画室', 'available', '认识简单比喻，感受句子的画面感。', 2, '修辞观察星', 1, 'chinese-grade3-expression'),
       ('chinese-grade3-expression-001', '阅读表达', '阅读表达屋', 'available', '读完短文后试着抓住主要画面并表达感受。', 2, '表达进步星', 2, 'chinese-grade3-expression'),
       ('english-grade3-transform-001', '句型变换', '句型变变屋', 'recommended', '把熟悉句型换一种方式说出来。', 2, '句型变换星', 1, 'english-grade3-sentences'),
       ('english-grade3-phrase-001', '词组搭配', '词组配对湾', 'available', '把常见词组和意思连起来，积累更自然的表达。', 2, '词组搭配星', 2, 'english-grade3-sentences'),
       ('english-grade3-reading-001', '阅读理解', '周末短文港', 'available', '读懂一小段英语短文，知道人物做了什么。', 2, '英语阅读星', 1, 'english-grade3-reading'),
       ('english-grade3-topic-001', '主题表达', '主题表达台', 'available', '围绕一个主题读三句话，再试着表达自己。', 2, '主题表达星', 2, 'english-grade3-reading'),
       ('math-grade4-decimal-001', '小数初步', '小数点灯塔', 'recommended', '从十分之几开始认识小数，理解 0.7 表示的数量。', 3, '小数启航星', 1, 'math-grade4-numbers'),
       ('math-grade4-angle-001', '角与图形', '角度观察屋', 'available', '认识锐角、直角和钝角，在图形里找角。', 3, '角度观察星', 2, 'math-grade4-numbers'),
       ('math-grade4-operation-001', '运算综合', '运算算盘屋', 'available', '认识混合运算顺序，把算式一步一步算清楚。', 3, '运算策略星', 1, 'math-grade4-strategy'),
       ('math-grade4-strategy-001', '策略应用题', '门票策略题', 'available', '把生活应用题拆成数量关系，再用策略求答案。', 3, '策略应用星', 2, 'math-grade4-strategy'),
       ('chinese-grade4-passage-001', '篇章理解', '篇章理解港', 'recommended', '从篇章片段中抓住中心画面和情绪。', 2, '篇章理解星', 1, 'chinese-grade4-reading'),
       ('chinese-grade4-writing-001', '写作表达', '写作观察台', 'available', '学习按顺序写观察，把细节说得更具体。', 2, '写作表达星', 2, 'chinese-grade4-reading'),
       ('chinese-grade4-poem-001', '古诗积累', '古诗积累亭', 'available', '按顺序朗读古诗句，感受画面和节奏。', 2, '古诗积累星', 1, 'chinese-grade4-expression'),
       ('chinese-grade4-grammar-001', '语法规范', '标点语法屋', 'available', '从问句和标点开始认识语法规范。', 2, '语法规范星', 2, 'chinese-grade4-expression'),
       ('english-grade4-tense-001', '时态初步', '时态小罗盘', 'recommended', '认识 yesterday 和过去式，感受动作发生的时间。', 2, '时态启航星', 1, 'english-grade4-language'),
       ('english-grade4-passage-001', '短文理解', 'Lucy 周末短文', 'available', '读懂一小段英文短文，理解人物做了什么。', 2, '短文理解星', 2, 'english-grade4-language'),
       ('english-grade4-topic-001', '话题表达', '季节话题屋', 'available', '围绕季节话题组织三句话，学习更完整的表达。', 2, '话题表达星', 1, 'english-grade4-expression'),
       ('english-grade4-review-001', '综合练习', '综合练习灯塔', 'available', '通过听辨关键词巩固已学表达。', 2, '综合练习星', 2, 'english-grade4-expression');

insert into levels (code, summary_title, detail_title, status, description, reward_stars, reward_badge_name, display_order, chapter_code)
values ('math-grade1-hundredchart-001', '百格图认数', '百格图认数', 'available', '在百格图里看十位和个位，找到数字的位置。', 3, '百格观察星', 3, 'math-grade1-numbers'),
       ('math-grade1-numberline-001', '数轴跳跳桥', '数轴跳跳桥', 'available', '沿着数轴往前跳，把加法看成移动。', 3, '数轴跳跳星', 4, 'math-grade1-numbers'),
       ('math-grade2-array-001', '乘法数组花园', '乘法数组花园', 'available', '把乘法摆成几行几列，看见乘法的结构。', 3, '数组花园星', 3, 'math-grade2-skills'),
       ('math-grade2-bar-model-001', '线段图应用题', '线段图应用题', 'available', '用线段图拆开两步应用题，先看关系再计算。', 3, '线段图思考星', 3, 'math-grade2-life'),
       ('math-grade3-area-model-001', '面积模型乘法', '面积模型乘法', 'available', '用长方形面积模型理解两位数乘一位数。', 3, '面积模型星', 3, 'math-grade3-operations'),
       ('math-grade3-fractionbar-001', '分数条比较', '分数条比较', 'available', '用分数条比较同分母分数的大小。', 3, '分数条观察星', 3, 'math-grade3-thinking');

insert into levels (code, summary_title, detail_title, status, description, reward_stars, reward_badge_name, display_order, chapter_code)
values ('math-grade4-hundredths-001', '小数百格图', '小数百格图', 'available', '用 100 格模型认识百分之几和两位小数。', 3, '百分位小数星', 2, 'math-grade4-numbers'),
       ('math-grade4-angle-classify-001', '角度分类挑战', '角度分类挑战', 'available', '观察角的张口，判断锐角、直角和钝角。', 3, '角度分类星', 4, 'math-grade4-numbers'),
       ('math-grade4-distributive-001', '面积模型巧算', '面积模型巧算', 'available', '用面积模型理解乘法分配律，把复杂乘法拆开算。', 3, '巧算模型星', 2, 'math-grade4-strategy'),
       ('math-grade4-distance-001', '路程线段图', '路程线段图', 'available', '用线段图分析速度、时间和路程的关系。', 3, '路程策略星', 4, 'math-grade4-strategy');

insert into levels (code, summary_title, detail_title, status, description, reward_stars, reward_badge_name, display_order, chapter_code)
values ('olympiad-g1-pattern-001', '找规律', '彩珠规律桥', 'recommended', '观察彩珠重复规律，选出下一颗应该出现的珠子。', 4, '规律启明星', 1, 'olympiad-grade1'),
       ('olympiad-g1-clever-calc-001', '巧算', '凑十魔法糖', 'available', '用凑十和拆分让加法变简单。', 4, '巧算小法师', 2, 'olympiad-grade1'),
       ('olympiad-g2-enumeration-001', '枚举法', '衣帽搭配站', 'available', '把衣服和帽子的搭配一组组列出来。', 4, '枚举小侦探', 1, 'olympiad-grade2'),
       ('olympiad-g2-shape-split-001', '图形分割', '披萨切切看', 'available', '观察图形被分割后出现了几个小形状。', 4, '图形切分星', 2, 'olympiad-grade2'),
       ('olympiad-g3-sum-diff-001', '和差倍', '彩带线段图', 'available', '用线段图看清两个数量之间的差和倍数。', 4, '线段图推理星', 1, 'olympiad-grade3'),
       ('olympiad-g3-period-001', '周期问题', '灯笼循环街', 'available', '找到循环节，再判断第几个位置是什么。', 4, '周期观察星', 2, 'olympiad-grade3'),
       ('olympiad-g4-chicken-rabbit-001', '鸡兔同笼', '农场脚印谜题', 'available', '用假设法分析头数和脚数，找出鸡和兔各有多少。', 5, '假设推理星', 1, 'olympiad-grade4'),
       ('olympiad-g4-reverse-001', '还原问题', '魔法盒倒推', 'available', '从最后结果倒着推回起点。', 5, '倒推策略星', 2, 'olympiad-grade4'),
       ('olympiad-g5-travel-001', '行程问题', '双车相遇线', 'available', '用线段图分析相遇问题里的速度、时间和路程。', 5, '行程模型星', 1, 'olympiad-grade5'),
       ('olympiad-g5-number-theory-001', '数论初步', '倍数星门', 'available', '观察因数、倍数和整除关系。', 5, '数论启明星', 2, 'olympiad-grade5'),
       ('olympiad-g6-work-001', '工程问题', '修桥协作队', 'available', '把工作总量看成 1，比较不同队伍的效率。', 5, '工程建模星', 1, 'olympiad-grade6'),
       ('olympiad-g6-logic-001', '逻辑推理', '侦探线索墙', 'available', '根据条件排除不可能，找到唯一答案。', 5, '逻辑侦探星', 2, 'olympiad-grade6');

update levels set display_order = 4 where code = 'math-grade1-addition-001';
update levels set display_order = 2 where code = 'math-grade1-hundredchart-001';
update levels set display_order = 3 where code = 'math-grade1-numberline-001';
update levels set display_order = 2 where code = 'math-grade2-array-001';
update levels set display_order = 3 where code = 'math-grade2-length-001';
update levels set display_order = 2 where code = 'math-grade2-bar-model-001';
update levels set display_order = 3 where code = 'math-grade2-time-001';
update levels set display_order = 3 where code = 'math-grade3-area-model-001';
update levels set display_order = 2 where code = 'math-grade3-fractionbar-001';
update levels set display_order = 3 where code = 'math-grade3-wordproblem-001';
update levels set display_order = 3 where code = 'math-grade4-angle-001';
update levels set display_order = 3 where code = 'math-grade4-strategy-001';

insert into level_steps (id, step_code, step_type, prompt, display_order, level_code)
values (1, 'step-1', 'drag-match', '把 5 个苹果拖进篮子', 1, 'math-numbers-001'),
       (2, 'step-2', 'tap-choice', '找到写着 5 的数字石牌', 2, 'math-numbers-001'),
       (3, 'step-1', 'tap-choice', '找到表示 14 的数字石牌', 1, 'math-numbers-002'),
       (4, 'step-1', 'tap-choice', '2 颗糖果加 3 颗，一共有几颗？', 1, 'math-addition-001'),
       (5, 'step-1', 'tap-choice', '9 只小鸟又飞来 5 只，一共有几只？', 1, 'math-addition-002'),
       (6, 'step-1', 'pattern-choice', '看看规律，选出下一节车厢', 1, 'math-thinking-001'),
       (7, 'step-1', 'pattern-choice', '看看图形规律，选出下一节车厢', 1, 'math-thinking-002'),
       (8, 'step-1', 'take-away', '从 8 个草莓里拿走 3 个', 1, 'math-subtraction-001'),
       (9, 'step-2', 'tap-choice', '还剩几个草莓？', 2, 'math-subtraction-001'),
       (10, 'step-1', 'story-choice', '树上有 15 只小鸟，飞走 6 只，还剩几只？', 1, 'math-subtraction-002'),
       (11, 'step-1', 'comparison-choice', '哪一边的小鱼更多？', 1, 'math-compare-001'),
       (12, 'step-1', 'equation-choice', '看图片，选出正确的算式', 1, 'math-equation-001'),
       (13, 'step-1', 'story-choice', '小兔子有 4 根胡萝卜，又收到 2 根，一共有几根？', 1, 'math-wordproblem-001'),
       (14, 'step-1', 'tap-choice', '找到像太阳的字', 1, 'chinese-characters-001'),
       (15, 'step-1', 'tap-choice', '找到表示“小手”的汉字', 1, 'chinese-characters-002'),
       (16, 'step-1', 'tap-choice', '找到表示“耳朵”的汉字', 1, 'chinese-characters-003'),
       (17, 'step-1', 'listen-choice', '听一听，选出读音正确的拼音泡泡', 1, 'chinese-pinyin-001'),
       (18, 'step-1', 'listen-choice', '听老师读，选出正确的拼读小火车', 1, 'chinese-pinyin-002'),
       (19, 'step-1', 'listen-choice', '听老师读，选出正确的声母', 1, 'chinese-pinyin-003'),
       (20, 'step-1', 'stroke-order', '按笔顺点出“口”的三笔', 1, 'chinese-strokes-001'),
       (21, 'step-1', 'stroke-order', '按笔顺点出“日”的四笔', 1, 'chinese-strokes-002'),
       (22, 'step-1', 'stroke-order', '按笔顺点出“人”的两笔', 1, 'chinese-strokes-003'),
       (23, 'step-1', 'follow-read', '跟读 A、B、C、D、E、F', 1, 'english-letters-001'),
       (24, 'step-1', 'follow-read', '跟读 G、H、I、J、K、L', 1, 'english-letters-002'),
       (25, 'step-1', 'follow-read', '跟读 M、N、O、P、Q、R', 1, 'english-letters-003'),
       (26, 'step-1', 'follow-read', '跟读 S、T、U、V、W、X、Y、Z', 1, 'english-letters-004'),
       (27, 'step-1', 'listen-choice', '听一听 /b/ 的声音，找到正确单词', 1, 'english-phonics-001'),
       (28, 'step-1', 'listen-choice', '听一听 /s/ 的声音，找到正确单词', 1, 'english-phonics-002'),
       (29, 'step-1', 'drag-match', '把 apple、book、cat 和图片连起来', 1, 'english-words-001'),
       (30, 'step-1', 'drag-match', '把 sun、bag、milk 和图片连起来', 1, 'english-words-002'),
       (31, 'step-1', 'drag-match', '把 red、blue、green 和颜色旗子连起来', 1, 'english-words-003'),
       (32, 'step-1', 'sentence-read', '按顺序读完这三句小绘本', 1, 'english-story-001'),
       (33, 'step-1', 'sentence-read', '按顺序读完晨光小绘本', 1, 'english-story-002'),
       (34, 'step-1', 'sentence-read', '按顺序读完晚安小绘本', 1, 'english-story-003'),
       (35, 'step-1', 'tap-choice', '找到表示 46 的数字卡', 1, 'math-grade1-numbers-001'),
       (36, 'step-1', 'story-choice', '9 只小鸭又游来 8 只，一共有几只？', 1, 'math-grade1-addition-001'),
       (37, 'step-1', 'story-choice', '16 个气球飞走 7 个，还剩几个？', 1, 'math-grade1-subtraction-001'),
       (38, 'step-1', 'story-choice', '文具盒里有 8 支铅笔，又放进 6 支，一共有几支？', 1, 'math-grade1-wordproblem-001'),
       (39, 'step-1', 'tap-choice', '找到能和“花”组成词语的字', 1, 'chinese-grade1-words-001'),
       (40, 'step-1', 'listen-choice', '听一听，选出正确的音节', 1, 'chinese-grade1-pinyin-001'),
       (41, 'step-1', 'sentence-read', '按顺序读完这三句图画短句', 1, 'chinese-grade1-sentence-001'),
       (42, 'step-1', 'tap-choice', '给句子选一个合适的标点', 1, 'chinese-grade1-punctuation-001'),
       (43, 'step-1', 'drag-match', '把 teacher、desk、book 和图片连起来', 1, 'english-grade1-words-001'),
       (44, 'step-1', 'listen-choice', '听一听 /k/ 的声音，找到正确单词', 1, 'english-grade1-phonics-001'),
       (45, 'step-1', 'sentence-read', '按顺序读完这三句问候句', 1, 'english-grade1-sentence-001'),
       (46, 'step-1', 'drag-match', '把 run、jump、read 和动作图片连起来', 1, 'english-grade1-actions-001'),
       (47, 'step-1', 'tap-choice', '3 组小星星，每组 4 颗，一共有几颗？', 1, 'math-grade2-multiply-001'),
       (48, 'step-1', 'story-choice', '尺子量出的铅笔大约有多长？', 1, 'math-grade2-length-001'),
       (49, 'step-1', 'story-choice', '先买了 8 本又买 6 本，再送出 5 本，还剩多少本？', 1, 'math-grade2-wordproblem-001'),
       (50, 'step-1', 'story-choice', '7 点开始再过 2 小时，是几点？', 1, 'math-grade2-time-001'),
       (51, 'step-1', 'tap-choice', '找到能和“认真”搭配的词语', 1, 'chinese-grade2-phrase-001'),
       (52, 'step-1', 'pattern-choice', '按顺序想一想，下一步应该做什么？', 1, 'chinese-grade2-order-001'),
       (53, 'step-1', 'sentence-read', '按顺序读完这三句看图表达短句', 1, 'chinese-grade2-picture-001'),
       (54, 'step-1', 'sentence-read', '按顺序读完这三句朗读短文', 1, 'chinese-grade2-reading-001'),
       (55, 'step-1', 'listen-choice', '听一听 /sh/ 的声音，找到正确单词', 1, 'english-grade2-phonics-001'),
       (56, 'step-1', 'sentence-read', '按顺序读完这三句句型练习', 1, 'english-grade2-sentence-001'),
       (57, 'step-1', 'sentence-read', '按顺序读完这三句日常对话', 1, 'english-grade2-dialogue-001'),
       (58, 'step-1', 'sentence-read', '按顺序读完这三句绘本句子', 1, 'english-grade2-story-001'),
       (59, 'step-1', 'story-choice', '12 个贝壳平均分给 3 个小朋友，每人几个？', 1, 'math-grade3-division-001'),
       (60, 'step-1', 'story-choice', '长方形操场长 6 米、宽 4 米，周长是多少？', 1, 'math-grade3-perimeter-001'),
       (61, 'step-1', 'story-choice', '一张披萨平均分成 8 份，涂色 3 份，涂色部分有几份？', 1, 'math-grade3-fraction-001'),
       (62, 'step-1', 'story-choice', '每个书架 3 层，每层 8 本，2 个书架一共有多少本？', 1, 'math-grade3-wordproblem-001'),
       (63, 'step-1', 'sentence-read', '按顺序读完这三句段落短文', 1, 'chinese-grade3-paragraph-001'),
       (64, 'step-1', 'tap-choice', '找到和“热闹”意思相反的词语', 1, 'chinese-grade3-antonym-001'),
       (65, 'step-1', 'tap-choice', '哪一句用了“像”来打比方？', 1, 'chinese-grade3-rhetoric-001'),
       (66, 'step-1', 'sentence-read', '按顺序读完雨后观察短文', 1, 'chinese-grade3-expression-001'),
       (67, 'step-1', 'tap-choice', '找到 I like apples. 的否定句', 1, 'english-grade3-transform-001'),
       (68, 'step-1', 'drag-match', '把 look at、get up、go home 和意思连起来', 1, 'english-grade3-phrase-001'),
       (69, 'step-1', 'sentence-read', '按顺序读完 Ben 的周末短文', 1, 'english-grade3-reading-001'),
       (70, 'step-1', 'sentence-read', '按顺序读完 My day 主题表达', 1, 'english-grade3-topic-001'),
       (71, 'step-1', 'tap-choice', '10 格里涂了 7 格，写成小数是多少？', 1, 'math-grade4-decimal-001'),
       (72, 'step-1', 'tap-choice', '找到像书本打开后形成的锐角', 1, 'math-grade4-angle-001'),
       (73, 'step-1', 'story-choice', '算式 6 × 4 + 8 的结果是多少？', 1, 'math-grade4-operation-001'),
       (74, 'step-1', 'story-choice', '1 张成人票和 3 张儿童票一共多少钱？', 1, 'math-grade4-strategy-001'),
       (75, 'step-1', 'sentence-read', '按顺序读完篇章片段', 1, 'chinese-grade4-passage-001'),
       (76, 'step-1', 'sentence-read', '按顺序读完写作观察句', 1, 'chinese-grade4-writing-001'),
       (77, 'step-1', 'sentence-read', '按顺序读完这三句古诗积累', 1, 'chinese-grade4-poem-001'),
       (78, 'step-1', 'tap-choice', '找到标点使用更规范的句子', 1, 'chinese-grade4-grammar-001'),
       (79, 'step-1', 'tap-choice', '找到表示昨天踢足球的句子', 1, 'english-grade4-tense-001'),
       (80, 'step-1', 'sentence-read', '按顺序读完 Lucy 的周末短文', 1, 'english-grade4-passage-001'),
       (81, 'step-1', 'sentence-read', '按顺序读完季节话题表达', 1, 'english-grade4-topic-001'),
       (82, 'step-1', 'listen-choice', '听一句综合练习，选出听到的关键词', 1, 'english-grade4-review-001'),
       (83, 'step-1', 'tap-choice', '找到像太阳一样圆圆的图形', 1, 'math-shapes-001'),
       (84, 'step-1', 'story-choice', '小猫在桌子上面，小狗在哪里？', 1, 'math-position-001'),
       (85, 'step-1', 'tap-choice', '从左往右数，小兔排第几？', 1, 'math-ordinal-001'),
       (86, 'step-1', 'tap-choice', '找到带木字旁的字', 1, 'chinese-radicals-001'),
       (87, 'step-1', 'listen-choice', '听一听，选出第三声的小山坡', 1, 'chinese-pinyin-tone-001'),
       (88, 'step-1', 'stroke-order', '按顺序点出横、竖、撇、捺', 1, 'chinese-strokes-004'),
       (89, 'step-1', 'drag-match', '把 A、B、C 和小写字母连起来', 1, 'english-case-001'),
       (90, 'step-1', 'drag-match', '把 family、mom、dad 和图片连起来', 1, 'english-family-001'),
       (91, 'step-1', 'sentence-read', '按顺序读完公园小绘本', 1, 'english-story-004');

insert into level_steps (id, step_code, step_type, prompt, display_order, level_code)
values (92, 'step-1', 'tap-choice', '百格图上点亮了 37，选出这个数。', 1, 'math-grade1-hundredchart-001'),
       (93, 'step-1', 'tap-choice', '从 12 往前跳 5 格，会到哪个数？', 1, 'math-grade1-numberline-001'),
       (94, 'step-1', 'tap-choice', '4 行花，每行 5 朵，一共有几朵？', 1, 'math-grade2-array-001'),
       (95, 'step-1', 'story-choice', '红气球 18 个，蓝气球比红气球多 7 个，蓝气球有几个？', 1, 'math-grade2-bar-model-001'),
       (96, 'step-1', 'story-choice', '12 × 4 可以看成 10×4 和 2×4，一共是多少？', 1, 'math-grade3-area-model-001'),
       (97, 'step-1', 'story-choice', '同样分成 8 份，5 份和 3 份，哪一个更大？', 1, 'math-grade3-fractionbar-001');

insert into level_steps (id, step_code, step_type, prompt, display_order, level_code)
values (98, 'step-1', 'tap-choice', '100 格里涂了 32 格，写成小数是多少？', 1, 'math-grade4-hundredths-001'),
       (99, 'step-1', 'tap-choice', '135° 的角属于哪一类？', 1, 'math-grade4-angle-classify-001'),
       (100, 'step-1', 'story-choice', '12 × 6 可以拆成 10×6 和 2×6，一共是多少？', 1, 'math-grade4-distributive-001'),
       (101, 'step-1', 'story-choice', '小船每小时行 8 千米，3 小时行多少千米？', 1, 'math-grade4-distance-001');

insert into level_steps (id, step_code, step_type, prompt, display_order, level_code)
values (102, 'step-1', 'pattern-choice', '观察彩珠规律，下一颗是什么颜色？', 1, 'olympiad-g1-pattern-001'),
       (103, 'step-1', 'tap-choice', '7 + 8 可以先凑成 10，再算出多少？', 1, 'olympiad-g1-clever-calc-001'),
       (104, 'step-1', 'tap-choice', '2 件上衣和 3 顶帽子，一共有几种搭配？', 1, 'olympiad-g2-enumeration-001'),
       (105, 'step-1', 'tap-choice', '正方形切一刀最多能变成几个图形？', 1, 'olympiad-g2-shape-split-001'),
       (106, 'step-1', 'story-choice', '红彩带是蓝彩带的 2 倍，红彩带比蓝彩带多 6 米，蓝彩带多长？', 1, 'olympiad-g3-sum-diff-001'),
       (107, 'step-1', 'tap-choice', '红黄蓝每 3 个一循环，第 10 个是什么颜色？', 1, 'olympiad-g3-period-001'),
       (108, 'step-1', 'story-choice', '鸡兔同笼有 8 个头、22 只脚，兔有几只？', 1, 'olympiad-g4-chicken-rabbit-001'),
       (109, 'step-1', 'story-choice', '一个数先加 5 再乘 2 得 26，原来是多少？', 1, 'olympiad-g4-reverse-001'),
       (110, 'step-1', 'story-choice', '甲乙两车相向而行，合速度 90 千米/时，2 小时相遇，距离是多少？', 1, 'olympiad-g5-travel-001'),
       (111, 'step-1', 'tap-choice', '24 的因数中，哪个既是 3 的倍数又是 4 的倍数？', 1, 'olympiad-g5-number-theory-001'),
       (112, 'step-1', 'story-choice', '甲队 6 天完成，乙队 3 天完成，合作 1 天完成几分之几？', 1, 'olympiad-g6-work-001'),
       (113, 'step-1', 'tap-choice', '三个人中只有一人说真话，根据线索谁拿了钥匙？', 1, 'olympiad-g6-logic-001');

insert into level_steps (id, step_code, step_type, prompt, display_order, level_code)
values (114, 'step-1', 'follow-read', '跟读 A、B、C 的字母名和字母音', 1, 'english-letter-sounds-001'),
       (115, 'step-1', 'listen-choice', '听老师读 apple，选出正确单词', 1, 'english-word-sounds-001'),
       (116, 'step-1', 'sentence-read', '按顺序跟读三句日常短句', 1, 'english-daily-sentences-001');

insert into level_steps (id, step_code, step_type, prompt, display_order, level_code)
values (117, 'step-1', 'follow-read', '跟读 D、E、F 的字母音和例词', 1, 'english-letter-sounds-002'),
       (118, 'step-1', 'listen-choice', '听老师读 milk，选出正确单词', 1, 'english-word-sounds-002'),
       (119, 'step-1', 'sentence-read', '跟读三句问候小对话', 1, 'english-dialogue-001');

update level_steps
set knowledge_point_code = 'math.g1.number-shape.hundred-chart',
    knowledge_point_title = '数形结合：百格图认数',
    variant_count = 8
where level_code = 'math-grade1-hundredchart-001' and step_code = 'step-1';

update level_steps
set knowledge_point_code = 'math.g1.number-shape.number-line',
    knowledge_point_title = '数形结合：数轴加减',
    variant_count = 8
where level_code = 'math-grade1-numberline-001' and step_code = 'step-1';

update level_steps
set knowledge_point_code = 'math.g2.number-shape.array',
    knowledge_point_title = '数形结合：乘法数组',
    variant_count = 10
where level_code = 'math-grade2-array-001' and step_code = 'step-1';

update level_steps
set knowledge_point_code = 'math.g2.number-shape.bar-model',
    knowledge_point_title = '数形结合：线段图分析',
    variant_count = 10
where level_code = 'math-grade2-bar-model-001' and step_code = 'step-1';

update level_steps
set knowledge_point_code = 'math.g3.number-shape.area-model',
    knowledge_point_title = '数形结合：面积模型',
    variant_count = 10
where level_code = 'math-grade3-area-model-001' and step_code = 'step-1';

update level_steps
set knowledge_point_code = 'math.g3.number-shape.fraction-bar',
    knowledge_point_title = '数形结合：分数条比较',
    variant_count = 10
where level_code = 'math-grade3-fractionbar-001' and step_code = 'step-1';

update level_steps
set knowledge_point_code = 'math.g4.decimal.hundredths-grid',
    knowledge_point_title = '数形结合：百分位小数',
    variant_count = 8
where level_code = 'math-grade4-hundredths-001' and step_code = 'step-1';

update level_steps
set knowledge_point_code = 'math.g4.geometry.angle-classification',
    knowledge_point_title = '图形认识：角的分类',
    variant_count = 8
where level_code = 'math-grade4-angle-classify-001' and step_code = 'step-1';

update level_steps
set knowledge_point_code = 'math.g4.operations.distributive-area-model',
    knowledge_point_title = '运算律：乘法分配律',
    variant_count = 10
where level_code = 'math-grade4-distributive-001' and step_code = 'step-1';

update level_steps
set knowledge_point_code = 'math.g4.relation.speed-time-distance',
    knowledge_point_title = '数量关系：速度时间路程',
    variant_count = 10
where level_code = 'math-grade4-distance-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"number-choice","assetTheme":"小数灯塔","audioQuality":"高质量儿童 TTS","variantCount":6,"instruction":"10 格里涂了 7 格，写成小数是多少？","choices":[0.7,7,0.07],"correctChoice":0.7,"optionLabelPrefix":"小数卡","successFeedback":"太棒了，7 个十分之一就是 0.7。","failureFeedback":"先数涂色格子，再想一想十分之几怎么写成小数。"}',
    knowledge_point_code = 'math.g4.decimal.tenths',
    knowledge_point_title = '小数初步：十分位',
    variant_count = 6
where level_code = 'math-grade4-decimal-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"sentence-read","assetTheme":"古诗竹亭","audioQuality":"高质量拟人 TTS","variantCount":5,"instruction":"一句一句跟读古诗，注意停顿和节奏。","sentences":[{"text":"小时不识月，","emoji":"🌙","scene":"小朋友抬头看月亮"},{"text":"呼作白玉盘。","emoji":"⚪","scene":"把月亮想成白玉盘"},{"text":"又疑瑶台镜，飞在青云端。","emoji":"☁️","scene":"月亮像镜子飞在云端"}],"successFeedback":"读得很有节奏，古诗画面慢慢出来了。"}',
    knowledge_point_code = 'chinese.g4.poem.rhythm',
    knowledge_point_title = '古诗积累：节奏朗读',
    variant_count = 5
where level_code = 'chinese-grade4-poem-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"listen-choice","assetTheme":"时态罗盘","audioQuality":"高质量儿童 TTS","variantCount":6,"instruction":"听老师读句子，选出表示昨天踢足球的一句。","audioPrompt":"播放 yesterday 句子","audioText":"I played football yesterday.","lang":"en-US","playButtonLabel":"播放时态句子","choiceAriaLabelPrefix":"英语句子","choices":["I played football yesterday.","I play football today.","I will play football tomorrow."],"correctChoice":"I played football yesterday.","successFeedback":"找对了，yesterday 和 played 都提示过去发生。","failureFeedback":"先找到 yesterday，再看动作是不是过去式。"}',
    knowledge_point_code = 'english.g4.tense.past-simple',
    knowledge_point_title = '英语时态：一般过去时',
    variant_count = 6
where level_code = 'english-grade4-tense-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"pattern-choice","assetTheme":"奥数彩珠桥","audioQuality":"高质量儿童 TTS","variantCount":8,"instruction":"看彩珠的重复规律，下一颗应该是什么？","sequence":[{"label":"红珠","emoji":"🔴"},{"label":"黄珠","emoji":"🟡"},{"label":"蓝珠","emoji":"🔵"},{"label":"红珠","emoji":"🔴"},{"label":"黄珠","emoji":"🟡"}],"choices":[{"label":"蓝珠","emoji":"🔵"},{"label":"绿珠","emoji":"🟢"},{"label":"红珠","emoji":"🔴"}],"correctChoice":"蓝珠","successFeedback":"答对了，红黄蓝是一组，下一颗回到蓝珠。","failureFeedback":"先把前三颗看成一组，再接着往后排。"}',
    knowledge_point_code = 'olympiad.g1.pattern',
    knowledge_point_title = '一年级奥数：找规律',
    variant_count = 8
where level_code = 'olympiad-g1-pattern-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"number-choice","assetTheme":"凑十魔法糖","audioQuality":"高质量儿童 TTS","variantCount":8,"instruction":"7 + 8 可以把 8 拆成 3 和 5，先凑 10，再算答案。","choices":[14,15,16],"correctChoice":15,"optionLabelPrefix":"巧算答案","successFeedback":"真棒，7 + 3 = 10，再加 5 等于 15。","failureFeedback":"先帮 7 找到 3 凑成 10，再加剩下的 5。","pictureGroups":[{"label":"先拿 7 颗糖","emoji":"🍬","count":7,"tone":"normal"},{"label":"从 8 里借 3 颗凑十","emoji":"🍭","count":3,"tone":"add"},{"label":"还剩 5 颗","emoji":"🍬","count":5,"tone":"result"}]}',
    knowledge_point_code = 'olympiad.g1.clever-calc.make-ten',
    knowledge_point_title = '一年级奥数：凑十巧算',
    variant_count = 8
where level_code = 'olympiad-g1-clever-calc-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"number-choice","assetTheme":"衣帽搭配站","audioQuality":"高质量儿童 TTS","variantCount":8,"instruction":"2 件上衣分别可以配 3 顶帽子，一共有几种不同搭配？","choices":[5,6,8],"correctChoice":6,"optionLabelPrefix":"搭配方案","successFeedback":"答对了，2 × 3 = 6 种搭配。","failureFeedback":"可以先数第一件上衣有 3 种，再数第二件上衣也有 3 种。","pictureGroups":[{"label":"上衣选择","emoji":"👕","count":2,"tone":"normal"},{"label":"帽子选择","emoji":"🧢","count":3,"tone":"add"}]}',
    knowledge_point_code = 'olympiad.g2.enumeration.combination',
    knowledge_point_title = '二年级奥数：有序枚举',
    variant_count = 8
where level_code = 'olympiad-g2-enumeration-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"number-choice","assetTheme":"披萨切切看","audioQuality":"高质量儿童 TTS","variantCount":6,"instruction":"一个正方形只切一刀，最多可以分成几个小图形？","choices":[2,3,4],"correctChoice":2,"optionLabelPrefix":"图形数量","successFeedback":"答对了，一刀只有一条切线，最多切成 2 块。","failureFeedback":"想象一把小刀直直切过去，会把一个图形分成几块？"}',
    knowledge_point_code = 'olympiad.g2.geometry.shape-split',
    knowledge_point_title = '二年级奥数：图形分割',
    variant_count = 6
where level_code = 'olympiad-g2-shape-split-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"story-choice","assetTheme":"彩带线段图","audioQuality":"高质量儿童 TTS","variantCount":8,"instruction":"看线段图想一想：红彩带是蓝彩带的 2 倍，红比蓝多 6 米，蓝彩带多长？","emoji":"📏","characterLabel":"彩带线段图","detailLines":["蓝彩带看成 1 段。","红彩带是 2 段。","多出来的 1 段正好是 6 米。"],"choices":[3,6,12],"correctChoice":6,"successFeedback":"答对了，多出来的一段就是蓝彩带，所以蓝彩带 6 米。","failureFeedback":"先找出多出来的那一段代表多少米。","mathModel":{"kind":"bar-model","title":"和差倍线段图","caption":"红色比蓝色多出的 1 段是 6 米","segments":[{"label":"蓝 1 段","value":6,"tone":"known"},{"label":"红多 1 段","value":6,"tone":"extra"}]}}',
    knowledge_point_code = 'olympiad.g3.sum-diff-multiple',
    knowledge_point_title = '三年级奥数：和差倍模型',
    variant_count = 8
where level_code = 'olympiad-g3-sum-diff-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"number-choice","assetTheme":"灯笼循环街","audioQuality":"高质量儿童 TTS","variantCount":8,"instruction":"红、黄、蓝 3 个一组循环，第 10 个灯笼对应第几个位置？","choices":[1,2,3],"correctChoice":1,"optionLabelPrefix":"循环位置","successFeedback":"答对了，10 ÷ 3 余 1，所以第 10 个回到第 1 个位置。","failureFeedback":"先找循环节长度 3，再看 10 除以 3 的余数。","mathModel":{"kind":"number-line","title":"周期余数线","caption":"每 3 个一组，第 10 个余 1","start":1,"end":10,"points":[{"value":1,"label":"红","tone":"start"},{"value":4,"label":"红","tone":"mid"},{"value":7,"label":"红","tone":"mid"},{"value":10,"label":"红","tone":"end"}],"jumpLabel":"每 3 个跳一次"}}',
    knowledge_point_code = 'olympiad.g3.period.remainder',
    knowledge_point_title = '三年级奥数：周期问题',
    variant_count = 8
where level_code = 'olympiad-g3-period-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"story-choice","assetTheme":"农场脚印谜题","audioQuality":"高质量儿童 TTS","variantCount":8,"instruction":"鸡兔同笼有 8 个头、22 只脚，兔有几只？","emoji":"🐰","characterLabel":"农场脚印","detailLines":["假设 8 只全是鸡，会有 16 只脚。","现在多出 22 - 16 = 6 只脚。","每把一只鸡换成兔，会多 2 只脚。"],"choices":[2,3,5],"correctChoice":3,"successFeedback":"答对了，多出的 6 只脚每 2 只对应 1 只兔，所以兔有 3 只。","failureFeedback":"先假设全是鸡，再看多出的脚能换成几只兔。","pictureGroups":[{"label":"8 个头","emoji":"🐔","count":8,"tone":"normal"},{"label":"多出的脚差","emoji":"🐾","count":6,"tone":"extra"},{"label":"兔子数量","emoji":"🐰","count":3,"tone":"result"}]}',
    knowledge_point_code = 'olympiad.g4.chicken-rabbit',
    knowledge_point_title = '四年级奥数：鸡兔同笼',
    variant_count = 8
where level_code = 'olympiad-g4-chicken-rabbit-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"story-choice","assetTheme":"魔法盒倒推","audioQuality":"高质量儿童 TTS","variantCount":8,"instruction":"一个数先加 5，再乘 2，最后得到 26。原来的数是多少？","emoji":"🎁","characterLabel":"魔法盒倒推","detailLines":["正着做：先 +5，再 ×2。","倒着想：先 26 ÷ 2 = 13。","再 13 - 5 = 8。"],"choices":[8,9,10],"correctChoice":8,"successFeedback":"答对了，倒推时要把每一步反过来做。","failureFeedback":"从最后的 26 开始，先除以 2，再减去 5。"}',
    knowledge_point_code = 'olympiad.g4.reverse-thinking',
    knowledge_point_title = '四年级奥数：还原问题',
    variant_count = 8
where level_code = 'olympiad-g4-reverse-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"story-choice","assetTheme":"双车相遇线","audioQuality":"高质量儿童 TTS","variantCount":8,"instruction":"两车相向而行，合速度 90 千米/时，2 小时相遇。两地相距多少千米？","emoji":"🚗","characterLabel":"双车相遇线","detailLines":["相向而行时，可以先看合速度。","每小时一共靠近 90 千米。","2 小时靠近 90 × 2 千米。"],"choices":[90,180,200],"correctChoice":180,"successFeedback":"答对了，90 × 2 = 180 千米。","failureFeedback":"相遇问题先把两辆车的速度合在一起。","mathModel":{"kind":"bar-model","title":"行程线段图","caption":"合速度 × 时间 = 总路程","segments":[{"label":"第 1 小时 90 千米","value":90,"tone":"known"},{"label":"第 2 小时 90 千米","value":90,"tone":"result"}]}}',
    knowledge_point_code = 'olympiad.g5.travel.meeting',
    knowledge_point_title = '五年级奥数：相遇问题',
    variant_count = 8
where level_code = 'olympiad-g5-travel-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"number-choice","assetTheme":"倍数星门","audioQuality":"高质量儿童 TTS","variantCount":8,"instruction":"24 的因数中，哪个既是 3 的倍数又是 4 的倍数？","choices":[6,8,12],"correctChoice":12,"optionLabelPrefix":"数论卡","successFeedback":"答对了，12 能被 3 整除，也能被 4 整除。","failureFeedback":"分别试一试这个数能不能被 3 和 4 整除。"}',
    knowledge_point_code = 'olympiad.g5.number-theory.factor-multiple',
    knowledge_point_title = '五年级奥数：因数倍数',
    variant_count = 8
where level_code = 'olympiad-g5-number-theory-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"story-choice","assetTheme":"修桥协作队","audioQuality":"高质量儿童 TTS","variantCount":8,"instruction":"甲队 6 天完成，乙队 3 天完成，合作 1 天完成工程的几分之几？","emoji":"🛠️","characterLabel":"修桥协作队","detailLines":["把整个工程看成 1。","甲 1 天做 1/6。","乙 1 天做 1/3，也就是 2/6。"],"choices":[2,3,4],"correctChoice":3,"successFeedback":"答对了，1/6 + 1/3 = 3/6，也就是一半。这里选 3 表示 3 个六分之一。","failureFeedback":"先把 1/3 变成 2/6，再和 1/6 合起来。","mathModel":{"kind":"fraction-bars","title":"工程效率条","caption":"同分母后再相加","bars":[{"label":"甲队 1 天","totalParts":6,"filledParts":1,"tone":"primary"},{"label":"乙队 1 天","totalParts":6,"filledParts":2,"tone":"secondary"}]}}',
    knowledge_point_code = 'olympiad.g6.work.efficiency',
    knowledge_point_title = '六年级奥数：工程问题',
    variant_count = 8
where level_code = 'olympiad-g6-work-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"character-choice","assetTheme":"侦探线索墙","audioQuality":"高质量儿童 TTS","variantCount":8,"instruction":"三个人中只有一人说真话。甲说“乙拿了钥匙”，乙说“不是我”，丙说“甲说错了”。谁拿了钥匙？","choices":[{"label":"甲","hint":"如果甲拿钥匙，三句话真假会怎样？"},{"label":"乙","hint":"如果乙拿钥匙，甲和丙的话会冲突。"},{"label":"丙","hint":"试试看只有乙说真话是否成立。"}],"correctChoice":"乙","successFeedback":"推理成功：如果乙拿钥匙，甲真、乙假、丙假，正好只有一人说真话。","detailLines":["关键方法：逐个假设谁拿钥匙。","检查三句话中真话数量是否正好为 1。","只有“乙拿钥匙”时，甲真、乙假、丙假。"],"failureFeedback":"别急，逐个假设，然后数一数真话有几句。"}',
    knowledge_point_code = 'olympiad.g6.logic.truth-table',
    knowledge_point_title = '六年级奥数：逻辑推理',
    variant_count = 8
where level_code = 'olympiad-g6-logic-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"follow-read","assetTheme":"字母发音小剧场","audioQuality":"高质量儿童 TTS","variantCount":6,"instruction":"字母名和字母音不一样，先听清楚，再跟着读。","letters":[{"label":"A","phonetic":"/a/","exampleWord":"apple","emoji":"🍎","audioText":"A, /a/, apple"},{"label":"B","phonetic":"/b/","exampleWord":"book","emoji":"📘","audioText":"B, /b/, book"},{"label":"C","phonetic":"/k/","exampleWord":"cat","emoji":"🐱","audioText":"C, /k/, cat"}]}',
    knowledge_point_code = 'english.letters.sound-shadowing',
    knowledge_point_title = '英语字母：字母音跟读',
    variant_count = 6
where level_code = 'english-letter-sounds-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"listen-choice","assetTheme":"单词读音小耳朵","audioQuality":"高质量儿童 TTS","variantCount":6,"instruction":"先按播放键听单词，再选择听到的单词卡。","audioPrompt":"apple","audioText":"apple","lang":"en-US","playButtonLabel":"播放单词读音","choiceAriaLabelPrefix":"单词卡片","choices":["apple","book","cat"],"correctChoice":"apple","successFeedback":"听对了，apple 是苹果，也是一口清楚的开头音","failureFeedback":"再听一遍，apple 的开头音像短短的 /a/"}',
    knowledge_point_code = 'english.words.daily-pronunciation',
    knowledge_point_title = '英语单词：日常单词读音',
    variant_count = 6
where level_code = 'english-word-sounds-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"sentence-read","assetTheme":"日常短句跟读亭","audioQuality":"高质量儿童 TTS","variantCount":6,"instruction":"点一句、听一句、跟一句，把日常表达读出来。","sentences":[{"text":"Good morning.","emoji":"🌞","scene":"早上见面说早安"},{"text":"I like apples.","emoji":"🍎","scene":"说出自己喜欢苹果"},{"text":"Thank you.","emoji":"🎁","scene":"收到帮助说谢谢"}],"successFeedback":"日常短句都读完啦，今天可以试着用一句"}',
    knowledge_point_code = 'english.speaking.daily-sentences',
    knowledge_point_title = '英语口语：日常短句跟读',
    variant_count = 6
where level_code = 'english-daily-sentences-001' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"follow-read","assetTheme":"字母音续航小剧场","audioQuality":"高质量儿童 TTS","variantCount":6,"instruction":"继续听 D、E、F 的字母音，把声音放进单词里。","letters":[{"label":"D","phonetic":"/d/","exampleWord":"dog","emoji":"🐶","audioText":"D, /d/, dog"},{"label":"E","phonetic":"/e/","exampleWord":"egg","emoji":"🥚","audioText":"E, /e/, egg"},{"label":"F","phonetic":"/f/","exampleWord":"fish","emoji":"🐟","audioText":"F, /f/, fish"}]}',
    knowledge_point_code = 'english.letters.d-f-sounds',
    knowledge_point_title = '英语字母：D 到 F 字母音',
    variant_count = 6
where level_code = 'english-letter-sounds-002' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"listen-choice","assetTheme":"生活物品听辨亭","audioQuality":"高质量儿童 TTS","variantCount":6,"instruction":"听生活里常见的单词，找出你听到的那一张卡。","audioPrompt":"milk","audioText":"milk","lang":"en-US","playButtonLabel":"播放生活单词","choiceAriaLabelPrefix":"单词卡片","choices":["milk","bag","sun"],"correctChoice":"milk","successFeedback":"听对了，milk 是牛奶，结尾轻轻收住","failureFeedback":"再听一遍，milk 里有短短的 i 音"}',
    knowledge_point_code = 'english.words.object-listening',
    knowledge_point_title = '英语单词：生活物品听辨',
    variant_count = 6
where level_code = 'english-word-sounds-002' and step_code = 'step-1';

update level_steps
set activity_config_json = '{"kind":"sentence-read","assetTheme":"问候对话小屋","audioQuality":"高质量儿童 TTS","variantCount":6,"instruction":"像两位小朋友打招呼一样，按顺序跟读问候句。","sentences":[{"text":"Hello!","emoji":"👋","scene":"见面先说 hello"},{"text":"How are you?","emoji":"🙂","scene":"问问对方今天怎么样"},{"text":"I am fine.","emoji":"🌟","scene":"开心回答我很好"}],"successFeedback":"问候对话读顺啦，下次见面可以试着说 Hello"}',
    knowledge_point_code = 'english.speaking.greeting-dialogue',
    knowledge_point_title = '英语口语：问候对话',
    variant_count = 6
where level_code = 'english-dialogue-001' and step_code = 'step-1';

insert into parent_today_summaries (child_profile_id, completed_levels, study_minutes, earned_stars)
values (1, 3, 18, 5),
       (2, 2, 14, 4),
       (3, 1, 7, 2);

insert into parent_settings (child_profile_id, leaderboard_enabled, daily_study_minutes, reminder_enabled)
values (1, true, 20, false),
       (2, true, 18, false),
       (3, true, 15, false);

insert into subject_progress (id, progress_percent, display_order, child_profile_id, subject_code)
values (1, 78, 1, 1, 'math'),
       (2, 64, 2, 1, 'chinese'),
       (3, 59, 3, 1, 'english');

insert into weekly_trend_points (id, day_label, minutes, display_order, child_profile_id)
values (1, '周一', 12, 1, 1),
       (2, '周二', 16, 2, 1),
       (3, '周三', 18, 3, 1),
       (4, '周四', 15, 4, 1),
       (5, '周五', 20, 5, 1),
       (6, '周六', 24, 6, 1),
       (7, '周日', 18, 7, 1);

insert into weak_points (id, title, suggestion, display_order, child_profile_id)
values (1, '20 以内减法需要多练习', '建议继续完成糖果加减和图像列式关卡。', 1, 1),
       (2, '英语单词跟读不稳定', '建议每天做 5 分钟单词跟读。', 2, 1);

insert into leaderboard_boards (board_type, privacy_tip)
values ('weekly_star', '排行榜默认匿名展示，家长可随时关闭参与。'),
       ('streak_master', '连续学习榜只展示坚持天数，不展示作答内容。'),
       ('challenge_hero', '挑战达人榜鼓励多尝试，不强调一次全对。');

insert into leaderboard_entries (id, bucket_type, rank_number, nickname, stars, trend_label, display_order, board_type)
values (1, 'TOP', 1, '小海豚', 228, '保持领先', 1, 'weekly_star'),
       (2, 'TOP', 2, '小火箭', 215, '本周上升 1 名', 2, 'weekly_star'),
       (3, 'TOP', 3, '小鲸鱼', 204, '稳定发挥', 3, 'weekly_star'),
       (4, 'SELF', 6, '小星星', 126, '本周上升 2 名', 4, 'weekly_star'),
       (5, 'NEARBY', 5, '小松果', 191, '就在你前面', 5, 'weekly_star'),
       (6, 'NEARBY', 6, '小星星', 126, '继续加油', 6, 'weekly_star'),
       (7, 'NEARBY', 7, '小月亮', 180, '和你很接近', 7, 'weekly_star'),
       (8, 'TOP', 1, '小火箭', 21, '连续 21 天', 1, 'streak_master'),
       (9, 'TOP', 2, '小海豚', 18, '连续 18 天', 2, 'streak_master'),
       (10, 'SELF', 3, '小星星', 14, '已经连续学习 14 天', 3, 'streak_master'),
       (11, 'NEARBY', 2, '小海豚', 18, '就在你前面', 4, 'streak_master'),
       (12, 'NEARBY', 3, '小星星', 14, '继续坚持', 5, 'streak_master'),
       (13, 'NEARBY', 4, '小松果', 12, '和你很接近', 6, 'streak_master'),
       (14, 'TOP', 1, '小鲸鱼', 15, '挑战节奏很稳', 1, 'challenge_hero'),
       (15, 'TOP', 2, '小火箭', 12, '保持冲劲', 2, 'challenge_hero'),
       (16, 'SELF', 4, '小星星', 9, '本周完成 9 次挑战', 3, 'challenge_hero'),
       (17, 'NEARBY', 3, '小月亮', 10, '刚好领先你 1 次', 4, 'challenge_hero'),
       (18, 'NEARBY', 4, '小星星', 9, '再来 1 次就进前三', 5, 'challenge_hero'),
       (19, 'NEARBY', 5, '小松果', 8, '继续加油', 6, 'challenge_hero');

insert into level_completions (id, child_profile_id, level_code, correct_count, wrong_count, duration_seconds, result_message, completed_at)
values (1, 1, 'math-numbers-001', 2, 0, 420, 'perfect', dateadd('hour', -2, current_timestamp())),
       (2, 1, 'english-letters-001', 1, 0, 360, 'perfect', dateadd('hour', -3, current_timestamp())),
       (3, 1, 'chinese-pinyin-001', 1, 0, 300, 'perfect', dateadd('hour', -1, current_timestamp())),
       (4, 1, 'math-numbers-002', 1, 1, 330, 'completed', dateadd('day', -1, dateadd('hour', -4, current_timestamp()))),
       (5, 1, 'english-story-001', 1, 0, 420, 'perfect', dateadd('day', -2, dateadd('hour', -5, current_timestamp()))),
       (6, 2, 'math-numbers-001', 2, 0, 360, 'perfect', dateadd('day', -1, current_timestamp())),
       (7, 2, 'math-numbers-002', 1, 0, 320, 'perfect', dateadd('day', -2, current_timestamp())),
       (8, 2, 'english-letters-001', 1, 0, 280, 'perfect', dateadd('day', -1, dateadd('hour', -2, current_timestamp()))),
       (9, 2, 'english-letters-002', 1, 0, 300, 'perfect', dateadd('day', -3, current_timestamp())),
       (10, 2, 'chinese-characters-001', 1, 0, 240, 'perfect', dateadd('day', -4, current_timestamp())),
       (11, 2, 'english-phonics-001', 1, 0, 310, 'perfect', dateadd('day', -5, current_timestamp())),
       (12, 2, 'english-story-001', 1, 0, 360, 'perfect', dateadd('day', -6, current_timestamp())),
       (13, 3, 'math-numbers-001', 2, 0, 300, 'perfect', dateadd('day', -1, current_timestamp())),
       (14, 3, 'math-addition-001', 1, 0, 280, 'perfect', dateadd('day', -2, current_timestamp())),
       (15, 3, 'chinese-pinyin-001', 1, 0, 260, 'perfect', dateadd('day', -3, current_timestamp())),
       (16, 3, 'chinese-strokes-001', 1, 0, 260, 'perfect', dateadd('day', -4, current_timestamp())),
       (17, 3, 'english-letters-001', 1, 0, 240, 'perfect', dateadd('day', -5, current_timestamp())),
       (18, 3, 'english-words-001', 1, 0, 260, 'perfect', dateadd('day', -6, current_timestamp()));
