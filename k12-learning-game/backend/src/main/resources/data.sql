insert into parent_accounts (id, display_name, phone, password, default_child_profile_id)
values (1, '星星妈妈', '13800000001', 'demo1234', 1);

insert into child_profiles (id, nickname, streak_days, total_stars, title, stage_label, avatar_color, parent_account_id)
values (1, '小星星', 7, 126, '晨光冒险家', '幼小衔接', '#ffcf70', 1),
       (2, '小火箭', 12, 188, '银河探险家', '幼小衔接', '#8ad1ff', 1),
       (3, '小海豚', 10, 172, '海湾领航员', '幼小衔接', '#8ee1b5', 1);

insert into subjects (code, title, subtitle, accent_color, display_order)
values ('math', '数学岛', '数感和规律正在闪闪发亮', '#ff8a5b', 1),
       ('chinese', '语文岛', '字形和拼音一起发芽', '#f2c14e', 2),
       ('english', '英语岛', '字母和单词在海风里唱歌', '#39b7a5', 3);

insert into chapters (code, title, subtitle, display_order, subject_code)
values ('math-numbers', '数字启蒙站', '从看见数量到会认数字，完成第一段数学冒险。', 1, 'math'),
       ('chinese-characters', '汉字花园', '跟着图像和生活场景认识常见字。', 1, 'chinese'),
       ('chinese-pinyin', '拼音乐园', '听声音、认拼读，把拼音读得更稳。', 2, 'chinese'),
       ('chinese-writing', '笔画写字屋', '跟着笔顺把字写整齐，越写越有信心。', 3, 'chinese'),
       ('english-letters', '字母海湾', '把 26 个字母分段点亮，读出熟悉的节奏。', 1, 'english'),
       ('english-phonics', '拼读码头', '听字母和开头音，把声音和单词连起来。', 2, 'english'),
       ('english-words', '单词沙滩', '把生活常见单词和图片配成一对。', 3, 'english'),
       ('english-story', '绘本港湾', '跟着图画和句子，把简单绘本一页页读下来。', 4, 'english');

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
       ('chinese-characters-001', '太阳和月亮', '汉字日月冒险', 'recommended', '从图像和笔画开始认识两个常见汉字。', 1, '识字小种子', 1, 'chinese-characters'),
       ('chinese-characters-002', '生活常见字', '生活常见字', 'available', '把身体和生活里的常见字认出来。', 2, '生活识字员', 2, 'chinese-characters'),
       ('chinese-characters-003', '身体小伙伴', '身体小伙伴', 'available', '把耳朵、眼睛和小手这些身体常见字认出来。', 2, '身体识字员', 3, 'chinese-characters'),
       ('chinese-pinyin-001', '拼音泡泡', '拼音泡泡大作战', 'available', '听一听、认一认，把声母和韵母连起来。', 1, '拼音小耳朵', 1, 'chinese-pinyin'),
       ('chinese-pinyin-002', '拼读小火车', '拼读小火车', 'available', '把拼读的声音和拼音火车连起来。', 2, '拼读小火车长', 2, 'chinese-pinyin'),
       ('chinese-pinyin-003', '声母找朋友', '声母找朋友', 'available', '听一听声母的声音，把一样的发音找出来。', 2, '声母小侦探', 3, 'chinese-pinyin'),
       ('chinese-strokes-001', '笔顺小画家', '笔顺小画家', 'available', '按顺序点一点，把汉字的笔画排整齐。', 2, '笔顺小画家', 1, 'chinese-writing'),
       ('chinese-strokes-002', '日字描描乐', '日字描描乐', 'available', '继续按顺序点一点，把“日”字写完整。', 2, '小小写字家', 2, 'chinese-writing'),
       ('chinese-strokes-003', '人字起步', '人字起步', 'available', '从简单的两笔开始，把“人”字写稳写好。', 2, '起步写字星', 3, 'chinese-writing'),
       ('english-letters-001', '字母 A 到 F', '字母小船出发', 'recommended', '跟着发音和形状，认识第一组字母朋友。', 1, '字母小船长', 1, 'english-letters'),
       ('english-letters-002', '字母 G 到 L', '字母 G 到 L', 'available', '继续认识第二组字母朋友。', 1, '字母快帆手', 2, 'english-letters'),
       ('english-letters-003', '字母 M 到 R', '字母 M 到 R', 'available', '把第三组字母也读熟。', 1, '字母领航员', 3, 'english-letters'),
       ('english-letters-004', '字母 S 到 Z', '字母 S 到 Z', 'available', '完成 26 个字母的最后一程。', 2, '全字母船长', 4, 'english-letters'),
       ('english-phonics-001', '字母藏在单词里', '字母藏在单词里', 'available', '听字母声音，再找出发音一样的单词。', 2, '拼读小船员', 1, 'english-phonics'),
       ('english-phonics-002', '开头声音侦探', '开头声音侦探', 'available', '听一听单词开头的声音，再找出发音一样的单词。', 2, '声音侦探员', 2, 'english-phonics'),
       ('english-words-001', '日常单词配对', '单词海风配对赛', 'available', '把常见生活单词和图像轻松对应起来。', 1, '单词小海星', 1, 'english-words'),
       ('english-words-002', '生活单词跟读', '生活单词跟读', 'available', '边配对边跟读，把常见生活单词读出来。', 2, '单词跟读手', 2, 'english-words'),
       ('english-words-003', '颜色单词沙堡', '颜色单词沙堡', 'available', '把颜色单词和对应的彩色旗子配成一对。', 2, '颜色小沙堡师', 3, 'english-words'),
       ('english-story-001', '海湾小绘本', '海湾小绘本', 'available', '跟着图片读一读简单句子，把小故事完整读下来。', 2, '绘本小海鸥', 1, 'english-story'),
       ('english-story-002', '晨光小绘本', '晨光小绘本', 'available', '继续跟着图片读一读简单句子。', 2, '晨光朗读员', 2, 'english-story'),
       ('english-story-003', '晚安小绘本', '晚安小绘本', 'available', '跟着夜晚场景读句子，把晚安小绘本完整读下来。', 2, '晚安朗读星', 3, 'english-story');

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
       (34, 'step-1', 'sentence-read', '按顺序读完晚安小绘本', 1, 'english-story-003');

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
