insert into child_profiles (id, nickname, streak_days, total_stars, title)
values (1, '小星星', 7, 126, '晨光冒险家');

insert into subjects (code, title, subtitle, accent_color, display_order)
values ('math', '数学岛', '数感和规律正在闪闪发亮', '#ff8a5b', 1),
       ('chinese', '语文岛', '字形和拼音一起发芽', '#f2c14e', 2),
       ('english', '英语岛', '字母和单词在海风里唱歌', '#39b7a5', 3);

insert into chapters (code, title, subtitle, display_order, subject_code)
values ('math-numbers', '数字启蒙站', '从看见数量到会认数字，完成第一段数学冒险。', 1, 'math'),
       ('chinese-characters', '汉字花园', '跟着笔画和图像认识生活里的常见字。', 1, 'chinese'),
       ('english-letters', '字母海湾', '在轻快节奏里认识字母和单词的声音。', 1, 'english');

insert into levels (code, summary_title, detail_title, status, description, reward_stars, reward_badge_name, display_order, chapter_code)
values ('math-numbers-001', '认识 0-10', '数字小探险', 'recommended', '拖一拖、选一选，把数字和数量变成好朋友。', 3, '数字小达人', 1, 'math-numbers'),
       ('math-addition-001', '10 以内加法', '糖果加加看', 'available', '看着糖果数量变化，学会简单加法。', 2, '加法闪光星', 2, 'math-numbers'),
       ('math-thinking-001', '规律小火车', '规律小火车', 'available', '找一找颜色和图形的规律，让小火车继续往前开。', 2, '规律观察家', 3, 'math-numbers'),
       ('math-subtraction-001', '水果减减看', '水果减减看', 'available', '点一点拿走水果，再想想还剩多少。', 2, '减法小能手', 4, 'math-numbers'),
       ('math-compare-001', '谁更多挑战', '谁更多挑战', 'available', '看一看两边的数量，选出更多的一组。', 2, '数感小雷达', 5, 'math-numbers'),
       ('math-equation-001', '图像列式屋', '图像列式屋', 'available', '看着图片把加法算式列出来。', 2, '列式小侦探', 6, 'math-numbers'),
       ('math-wordproblem-001', '故事应用题', '故事应用题', 'available', '听故事、看图画，再算出最后的答案。', 2, '应用题小勇士', 7, 'math-numbers'),
       ('chinese-characters-001', '太阳和月亮', '汉字日月冒险', 'recommended', '从图像和笔画开始认识两个常见汉字。', 1, '识字小种子', 1, 'chinese-characters'),
       ('chinese-pinyin-001', '拼音泡泡', '拼音泡泡大作战', 'available', '听一听、认一认，把声母和韵母连起来。', 1, '拼音小耳朵', 2, 'chinese-characters'),
       ('chinese-strokes-001', '笔顺小画家', '笔顺小画家', 'available', '按顺序点一点，把汉字的笔画排整齐。', 2, '笔顺小画家', 3, 'chinese-characters'),
       ('english-letters-001', '字母 A 到 F', '字母小船出发', 'recommended', '跟着发音和形状，认识第一组字母朋友。', 1, '字母小船长', 1, 'english-letters'),
       ('english-words-001', '日常单词配对', '单词海风配对赛', 'available', '把常见生活单词和图像轻松对应起来。', 1, '单词小海星', 2, 'english-letters'),
       ('english-story-001', '海湾小绘本', '海湾小绘本', 'available', '跟着图片读一读简单句子，把小故事完整读下来。', 2, '绘本小海鸥', 3, 'english-letters');

insert into level_steps (id, step_code, step_type, prompt, display_order, level_code)
values (1, 'step-1', 'drag-match', '把 5 个苹果拖进篮子', 1, 'math-numbers-001'),
       (2, 'step-2', 'tap-choice', '找到写着 5 的数字石牌', 2, 'math-numbers-001'),
       (3, 'step-1', 'tap-choice', '2 颗糖果加 3 颗，一共有几颗？', 1, 'math-addition-001'),
       (4, 'step-1', 'pattern-choice', '看看规律，选出下一节车厢', 1, 'math-thinking-001'),
       (5, 'step-1', 'take-away', '从 8 个草莓里拿走 3 个', 1, 'math-subtraction-001'),
       (6, 'step-2', 'tap-choice', '还剩几个草莓？', 2, 'math-subtraction-001'),
       (7, 'step-1', 'comparison-choice', '哪一边的小鱼更多？', 1, 'math-compare-001'),
       (8, 'step-1', 'equation-choice', '看图片，选出正确的算式', 1, 'math-equation-001'),
       (9, 'step-1', 'story-choice', '小兔子有 4 根胡萝卜，又收到 2 根，一共有几根？', 1, 'math-wordproblem-001'),
       (10, 'step-1', 'tap-choice', '找到像太阳的字', 1, 'chinese-characters-001'),
       (11, 'step-1', 'listen-choice', '听一听，选出读音正确的拼音泡泡', 1, 'chinese-pinyin-001'),
       (12, 'step-1', 'stroke-order', '按笔顺点出“口”的三笔', 1, 'chinese-strokes-001'),
       (13, 'step-1', 'follow-read', '跟读 A、B、C、D、E、F', 1, 'english-letters-001'),
       (14, 'step-1', 'drag-match', '把 apple、book、cat 和图片连起来', 1, 'english-words-001'),
       (15, 'step-1', 'sentence-read', '按顺序读完这三句小绘本', 1, 'english-story-001');

insert into parent_today_summaries (child_profile_id, completed_levels, study_minutes, earned_stars)
values (1, 3, 18, 8);

insert into parent_settings (child_profile_id, leaderboard_enabled, daily_study_minutes)
values (1, true, 20);

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
values ('weekly_star', '排行榜默认匿名展示，家长可随时关闭参与。');

insert into leaderboard_entries (id, bucket_type, rank_number, nickname, stars, trend_label, display_order, board_type)
values (1, 'TOP', 1, '小海豚', 228, '保持领先', 1, 'weekly_star'),
       (2, 'TOP', 2, '小火箭', 215, '本周上升 1 名', 2, 'weekly_star'),
       (3, 'TOP', 3, '小鲸鱼', 204, '稳定发挥', 3, 'weekly_star'),
       (4, 'SELF', 6, '小星星', 126, '本周上升 2 名', 4, 'weekly_star'),
       (5, 'NEARBY', 5, '小松果', 191, '就在你前面', 5, 'weekly_star'),
       (6, 'NEARBY', 6, '小星星', 126, '继续加油', 6, 'weekly_star'),
       (7, 'NEARBY', 7, '小月亮', 180, '和你很接近', 7, 'weekly_star');
