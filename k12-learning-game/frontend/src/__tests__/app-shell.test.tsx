import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';
import type { SessionChildProfile } from '../api';

describe('App shell', () => {
  beforeEach(() => {
    let scopedChildren: SessionChildProfile[] = [
      { id: 1, nickname: '小星星', streakDays: 7, totalStars: 126, title: '晨光冒险家' },
      { id: 2, nickname: '小火箭', streakDays: 9, totalStars: 188, title: '银河探险家' },
      { id: 3, nickname: '小海豚', streakDays: 10, totalStars: 172, title: '海湾领航员' }
    ];
    let loginDefaultChildId = 1;
    let nextChildId = 4;
    let registeredParent:
      | {
          parentAccountId: number;
          parentDisplayName: string;
          phone: string;
          password: string;
        }
      | null = null;
    let registeredChildren: SessionChildProfile[] = [];
    let registeredDefaultChildId = 0;

    window.localStorage.setItem(
      'k12-learning-game-session',
      JSON.stringify({
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: 2,
        childNickname: '小火箭',
        children: scopedChildren
      })
    );

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        if (url.endsWith('/api/auth/register') && init?.method === 'POST') {
          const payload = JSON.parse(String(init.body)) as {
            displayName: string;
            phone: string;
            password: string;
          };
          registeredParent = {
            parentAccountId: 2,
            parentDisplayName: payload.displayName,
            phone: payload.phone,
            password: payload.password
          };
          const currentRegisteredParent = registeredParent;
          registeredChildren = [];
          registeredDefaultChildId = 0;

          return {
            ok: true,
            json: async () => ({
              parentAccountId: currentRegisteredParent.parentAccountId,
              parentDisplayName: currentRegisteredParent.parentDisplayName,
              defaultChildId: registeredDefaultChildId,
              children: registeredChildren
            })
          } as Response;
        }

        if (url.endsWith('/api/auth/login') && init?.method === 'POST') {
          const payload = JSON.parse(String(init.body)) as {
            phone: string;
            password: string;
          };

          if (
            registeredParent
            && payload.phone === registeredParent.phone
            && payload.password === registeredParent.password
          ) {
            const currentRegisteredParent = registeredParent;
            return {
              ok: true,
              json: async () => ({
                parentAccountId: currentRegisteredParent.parentAccountId,
                parentDisplayName: currentRegisteredParent.parentDisplayName,
                defaultChildId: registeredDefaultChildId,
                children: registeredChildren
              })
            } as Response;
          }

          return {
            ok: true,
            json: async () => ({
              parentAccountId: 1,
              parentDisplayName: '星星妈妈',
              defaultChildId: loginDefaultChildId,
              children: scopedChildren
            })
          } as Response;
        }

        if (url.endsWith('/api/parent/children') && init?.method === 'POST') {
          const headers = new Headers(init?.headers);
          const parentAccountId = Number(headers.get('X-Parent-Account-Id'));
          const payload = JSON.parse(String(init.body)) as {
            nickname: string;
            title: string;
            stageLabel: string;
            avatarColor: string;
          };
          const createdChild = {
            id: nextChildId,
            nickname: payload.nickname,
            streakDays: 0,
            totalStars: 0,
            title: payload.title,
            stageLabel: payload.stageLabel,
            avatarColor: payload.avatarColor
          };
          nextChildId += 1;

          if (parentAccountId === 2) {
            registeredChildren = [...registeredChildren, createdChild];
            if (registeredDefaultChildId === 0) {
              registeredDefaultChildId = createdChild.id;
            }
          } else {
            scopedChildren = [...scopedChildren, createdChild];
          }

          return {
            ok: true,
            json: async () => createdChild
          } as Response;
        }

        if (url.endsWith('/api/parent/children/2') && init?.method === 'PATCH') {
          const payload = JSON.parse(String(init.body)) as {
            nickname: string;
            title: string;
            stageLabel: string;
            avatarColor: string;
          };
          scopedChildren = scopedChildren.map((child) => (
            child.id === 2
              ? {
                  ...child,
                  nickname: payload.nickname,
                  title: payload.title,
                  stageLabel: payload.stageLabel,
                  avatarColor: payload.avatarColor
                }
              : child
          ));

          return {
            ok: true,
            json: async () => scopedChildren.find((child) => child.id === 2)
          } as Response;
        }

        if (url.endsWith('/api/parent/active-child') && init?.method === 'PATCH') {
          const headers = new Headers(init?.headers);
          const parentAccountId = Number(headers.get('X-Parent-Account-Id'));
          const payload = JSON.parse(String(init.body)) as { childProfileId: number };

          if (parentAccountId === 2 && registeredParent) {
            const currentRegisteredParent = registeredParent;
            registeredDefaultChildId = payload.childProfileId;

            return {
              ok: true,
              json: async () => ({
                parentAccountId: currentRegisteredParent.parentAccountId,
                parentDisplayName: currentRegisteredParent.parentDisplayName,
                defaultChildId: registeredDefaultChildId,
                children: registeredChildren
              })
            } as Response;
          }

          loginDefaultChildId = payload.childProfileId;

          return {
            ok: true,
            json: async () => ({
              parentAccountId: 1,
              parentDisplayName: '星星妈妈',
              defaultChildId: loginDefaultChildId,
              children: scopedChildren
            })
          } as Response;
        }

        if (url.endsWith('/api/home/overview')) {
          const headers = new Headers(init?.headers);
          const childProfileId = headers.get('X-Child-Profile-Id');

          if (childProfileId === '4') {
            return {
              ok: true,
              json: async () => ({
                child: {
                  id: 4,
                  nickname: '小月亮',
                  streakDays: 0,
                  totalStars: 0,
                  title: '森林观察员'
                },
                subjects: [
                  { code: 'math', title: '数学岛', subtitle: '数字火花开始跳舞', accentColor: '#ff8a5b' },
                  { code: 'chinese', title: '语文岛', subtitle: '拼音种子正在发芽', accentColor: '#f2c14e' },
                  { code: 'english', title: '英语岛', subtitle: '单词海风轻轻吹', accentColor: '#39b7a5' }
                ],
                achievementPreview: {
                  unlockedCount: 0,
                  totalCount: 8,
                  nextBadgeName: '数字小达人'
                },
                featuredWorld: '启航岛',
                todayTask: '从数字启蒙站开始今天的第一段冒险。',
                nextLevelCode: 'math-numbers-001',
                nextLevelTitle: '认识 0-10'
              })
            } as Response;
          }

          if (childProfileId === '3') {
            return {
              ok: true,
              json: async () => ({
                child: {
                  id: 3,
                  nickname: '小海豚',
                  streakDays: 10,
                  totalStars: 172,
                  title: '海湾领航员'
                },
                subjects: [
                  { code: 'math', title: '数学岛', subtitle: '数字火花开始跳舞', accentColor: '#ff8a5b' },
                  { code: 'chinese', title: '语文岛', subtitle: '拼音种子正在发芽', accentColor: '#f2c14e' },
                  { code: 'english', title: '英语岛', subtitle: '单词海风轻轻吹', accentColor: '#39b7a5' }
                ],
                achievementPreview: {
                  unlockedCount: 6,
                  totalCount: 8,
                  nextBadgeName: '本周小冠军'
                },
                featuredWorld: '启航岛',
                todayTask: '去英语岛继续点亮单词沙滩。',
                nextLevelCode: 'english-words-001',
                nextLevelTitle: '日常单词配对'
              })
            } as Response;
          }

          if (childProfileId === '2') {
            const activeChild = scopedChildren.find((child) => child.id === 2)!;
            const isYearOne = activeChild.stageLabel === '一年级';

            return {
              ok: true,
              json: async () => ({
                child: {
                  id: 2,
                  nickname: activeChild.nickname,
                  streakDays: activeChild.streakDays,
                  totalStars: activeChild.totalStars,
                  title: activeChild.title
                },
                subjects: [
                  { code: 'math', title: '数学岛', subtitle: '数字火花开始跳舞', accentColor: '#ff8a5b' },
                  { code: 'chinese', title: '语文岛', subtitle: '拼音种子正在发芽', accentColor: '#f2c14e' },
                  { code: 'english', title: '英语岛', subtitle: '单词海风轻轻吹', accentColor: '#39b7a5' }
                ],
                achievementPreview: {
                  unlockedCount: 5,
                  totalCount: 8,
                  nextBadgeName: '小小坚持家'
                },
                featuredWorld: isYearOne ? '一年级星球' : '启航岛',
                todayTask: isYearOne ? '继续挑战一年级应用题，把新年级任务点亮。' : '继续挑战 10 以内加法，把今天的学习星轨再点亮一格。',
                nextLevelCode: isYearOne ? 'math-grade1-wordproblem-001' : 'math-addition-001',
                nextLevelTitle: isYearOne ? '一年级应用题' : '10 以内加法'
              })
            } as Response;
          }

          return {
            ok: true,
            json: async () => ({
              child: {
                id: 2,
                nickname: '小火箭',
                streakDays: 9,
                totalStars: 188,
                title: '银河探险家'
              },
              subjects: [
                { code: 'math', title: '数学岛', subtitle: '数字火花开始跳舞', accentColor: '#ff8a5b' },
                { code: 'chinese', title: '语文岛', subtitle: '拼音种子正在发芽', accentColor: '#f2c14e' },
                { code: 'english', title: '英语岛', subtitle: '单词海风轻轻吹', accentColor: '#39b7a5' }
              ],
              achievementPreview: {
                unlockedCount: 5,
                totalCount: 8,
                nextBadgeName: '小小坚持家'
              },
              featuredWorld: '启航岛',
              todayTask: '继续挑战 10 以内加法，把今天的学习星轨再点亮一格。',
              nextLevelCode: 'math-addition-001',
              nextLevelTitle: '10 以内加法'
            })
          } as Response;
        }

        if (url.endsWith('/api/subjects/math/map')) {
          return {
            ok: true,
            json: async () => ({
              subject: { code: 'math', title: '数学岛' },
              chapters: [
                {
                  code: 'math-numbers',
                  title: '数字启蒙站',
                  subtitle: '新的数字旅程',
                  levels: [
                    { code: 'math-numbers-001', title: '认识 0-10', status: 'recommended' },
                    { code: 'math-numbers-002', title: '认识 11-20', status: 'available' },
                    { code: 'math-addition-001', title: '10 以内加法', status: 'available' },
                    { code: 'math-addition-002', title: '20 以内加法', status: 'available' },
                    { code: 'math-thinking-001', title: '规律小火车', status: 'available' },
                    { code: 'math-thinking-002', title: '图形规律屋', status: 'available' },
                    { code: 'math-subtraction-001', title: '水果减减看', status: 'available' },
                    { code: 'math-subtraction-002', title: '20 以内减法', status: 'available' },
                    { code: 'math-compare-001', title: '谁更多挑战', status: 'available' },
                    { code: 'math-equation-001', title: '图像列式屋', status: 'available' },
                    { code: 'math-wordproblem-001', title: '故事应用题', status: 'available' }
                  ]
                }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/subjects/chinese/map')) {
          return {
            ok: true,
            json: async () => ({
              subject: { code: 'chinese', title: '语文岛' },
              chapters: [
                {
                  code: 'chinese-characters',
                  title: '汉字花园',
                  subtitle: '会读、会认、会观察字形',
                  levels: [
                    { code: 'chinese-characters-001', title: '太阳和月亮', status: 'recommended' },
                    { code: 'chinese-characters-002', title: '生活常见字', status: 'available' },
                    { code: 'chinese-characters-003', title: '身体小伙伴', status: 'available' }
                  ]
                },
                {
                  code: 'chinese-pinyin',
                  title: '拼音乐园',
                  subtitle: '听声音、认拼读，把拼音读得更稳',
                  levels: [
                    { code: 'chinese-pinyin-001', title: '拼音泡泡', status: 'available' },
                    { code: 'chinese-pinyin-002', title: '拼读小火车', status: 'available' },
                    { code: 'chinese-pinyin-003', title: '声母找朋友', status: 'available' }
                  ]
                },
                {
                  code: 'chinese-writing',
                  title: '笔画写字屋',
                  subtitle: '跟着笔顺把汉字一点点写出来',
                  levels: [
                    { code: 'chinese-strokes-001', title: '笔顺小画家', status: 'available' },
                    { code: 'chinese-strokes-002', title: '日字描描乐', status: 'available' },
                    { code: 'chinese-strokes-003', title: '人字起步', status: 'available' }
                  ]
                }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/subjects/english/map')) {
          return {
            ok: true,
            json: async () => ({
              subject: { code: 'english', title: '英语岛' },
              chapters: [
                {
                  code: 'english-letters',
                  title: '字母海湾',
                  subtitle: '把字母、拼读和小绘本连起来',
                  levels: [
                    { code: 'english-letters-001', title: '字母 A 到 F', status: 'recommended' },
                    { code: 'english-letters-002', title: '字母 G 到 L', status: 'available' },
                    { code: 'english-letters-003', title: '字母 M 到 R', status: 'available' },
                    { code: 'english-letters-004', title: '字母 S 到 Z', status: 'available' }
                  ]
                },
                {
                  code: 'english-phonics',
                  title: '拼读码头',
                  subtitle: '听字母声音，再找到发音一样的单词',
                  levels: [
                    { code: 'english-phonics-001', title: '字母藏在单词里', status: 'available' },
                    { code: 'english-phonics-002', title: '开头声音侦探', status: 'available' }
                  ]
                },
                {
                  code: 'english-words',
                  title: '单词沙滩',
                  subtitle: '把生活里的常见单词和图片配成一对',
                  levels: [
                    { code: 'english-words-001', title: '日常单词配对', status: 'available' },
                    { code: 'english-words-002', title: '生活单词跟读', status: 'available' },
                    { code: 'english-words-003', title: '颜色单词沙堡', status: 'available' }
                  ]
                },
                {
                  code: 'english-story',
                  title: '绘本港湾',
                  subtitle: '跟着场景和句子，一页页把小绘本读完',
                  levels: [
                    { code: 'english-story-001', title: '海湾小绘本', status: 'available' },
                    { code: 'english-story-002', title: '晨光小绘本', status: 'available' },
                    { code: 'english-story-003', title: '晚安小绘本', status: 'available' }
                  ]
                }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/levels/math-numbers-001')) {
          return {
            ok: true,
            json: async () => ({
              code: 'math-numbers-001',
              title: '数字小探险',
              subjectTitle: '数学岛',
              description: '真的从接口里取到了这一关。',
              steps: [
                { id: 'step-1', type: 'drag-match', prompt: '把 5 个苹果拖进篮子' },
                { id: 'step-2', type: 'tap-choice', prompt: '找到写着 5 的数字石牌' }
              ],
              reward: {
                stars: 3,
                badgeName: '数字小达人'
              }
            })
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

  test('redirects guests to login and lets them enter the learning world', async () => {
    const user = userEvent.setup();
    window.localStorage.removeItem('k12-learning-game-session');

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('欢迎回到学习小岛')).toBeInTheDocument();
    expect(screen.getByLabelText('家长手机号')).toBeInTheDocument();
    expect(screen.getByLabelText('登录密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登录查看孩子档案' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('家长手机号'), '13800000001');
    await user.type(screen.getByLabelText('登录密码'), 'demo1234');
    await user.click(screen.getByRole('button', { name: '登录查看孩子档案' }));

    expect(await screen.findByText('星星妈妈，你好')).toBeInTheDocument();
    expect(screen.getByText('选择今天要出发的小朋友')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '选择小火箭' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '进入学习世界' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '选择小火箭' }));
    await user.click(screen.getByRole('button', { name: '进入学习世界' }));

    expect(await screen.findByText('银河探险家')).toBeInTheDocument();
    expect(window.localStorage.getItem('k12-learning-game-session')).toBe(
      JSON.stringify({
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: 2,
        childNickname: '小火箭',
        children: [
          { id: 1, nickname: '小星星', streakDays: 7, totalStars: 126, title: '晨光冒险家' },
          { id: 2, nickname: '小火箭', streakDays: 9, totalStars: 188, title: '银河探险家' },
          { id: 3, nickname: '小海豚', streakDays: 10, totalStars: 172, title: '海湾领航员' }
        ]
      })
    );
  });

  test('registers a parent account, creates the first child profile, and enters the learning world', async () => {
    const user = userEvent.setup();
    window.localStorage.removeItem('k12-learning-game-session');

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: '创建家长账号' }));
    await user.type(screen.getByLabelText('家长称呼'), '月亮妈妈');
    await user.type(screen.getByLabelText('家长手机号'), '13800000009');
    await user.type(screen.getByLabelText('设置密码'), 'moon1234');
    await user.click(screen.getByRole('button', { name: '立即创建账号' }));

    expect(await screen.findByText('月亮妈妈，你好')).toBeInTheDocument();
    expect(screen.getByText('先创建第一个孩子档案，马上开始今天的学习冒险。')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '新增孩子档案' }));
    await user.type(screen.getByLabelText('孩子昵称'), '小月亮');
    await user.type(screen.getByLabelText('成长称号'), '森林观察员');
    await user.click(screen.getByRole('button', { name: '保存孩子档案' }));
    await user.click(screen.getByRole('button', { name: '进入学习世界' }));

    expect(await screen.findByText('森林观察员')).toBeInTheDocument();

    const registerCall = vi.mocked(global.fetch).mock.calls.find((call) => String(call[0]).endsWith('/api/auth/register'));
    expect(registerCall).toBeTruthy();

    const activeChildCall = vi.mocked(global.fetch).mock.calls.find((call) => String(call[0]).endsWith('/api/parent/active-child'));
    expect(activeChildCall).toBeTruthy();
    expect(window.localStorage.getItem('k12-learning-game-session')).toBe(
      JSON.stringify({
        parentAccountId: 2,
        parentDisplayName: '月亮妈妈',
        childProfileId: 4,
        childNickname: '小月亮',
        children: [
          {
            id: 4,
            nickname: '小月亮',
            streakDays: 0,
            totalStars: 0,
            title: '森林观察员',
            stageLabel: '幼小衔接',
            avatarColor: '#8ecae6'
          }
        ]
      })
    );
  });

  test('creates a child profile from the login flow and enters the world with the new child', async () => {
    const user = userEvent.setup();
    window.localStorage.removeItem('k12-learning-game-session');

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('家长手机号'), '13800000001');
    await user.type(screen.getByLabelText('登录密码'), 'demo1234');
    await user.click(screen.getByRole('button', { name: '登录查看孩子档案' }));

    expect(await screen.findByText('星星妈妈，你好')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '新增孩子档案' }));
    await user.type(screen.getByLabelText('孩子昵称'), '小月亮');
    await user.type(screen.getByLabelText('成长称号'), '森林观察员');
    await user.selectOptions(screen.getByLabelText('学习阶段'), '幼小衔接');
    await user.click(screen.getByRole('button', { name: '保存孩子档案' }));

    expect(await screen.findByRole('button', { name: '选择小月亮' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '进入学习世界' }));

    expect(await screen.findByText('森林观察员')).toBeInTheDocument();
    expect(window.localStorage.getItem('k12-learning-game-session')).toBe(
      JSON.stringify({
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: 4,
        childNickname: '小月亮',
        children: [
          { id: 1, nickname: '小星星', streakDays: 7, totalStars: 126, title: '晨光冒险家' },
          { id: 2, nickname: '小火箭', streakDays: 9, totalStars: 188, title: '银河探险家' },
          { id: 3, nickname: '小海豚', streakDays: 10, totalStars: 172, title: '海湾领航员' },
          {
            id: 4,
            nickname: '小月亮',
            streakDays: 0,
            totalStars: 0,
            title: '森林观察员',
            stageLabel: '幼小衔接',
            avatarColor: '#8ecae6'
          }
        ]
      })
    );
  });

  test('persists the selected child when entering the learning world and reuses it on the next login', async () => {
    const user = userEvent.setup();
    window.localStorage.removeItem('k12-learning-game-session');

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('家长手机号'), '13800000001');
    await user.type(screen.getByLabelText('登录密码'), 'demo1234');
    await user.click(screen.getByRole('button', { name: '登录查看孩子档案' }));
    await user.click(await screen.findByRole('button', { name: '选择小海豚' }));
    await user.click(screen.getByRole('button', { name: '进入学习世界' }));

    expect(await screen.findByRole('heading', { name: '小海豚，准备再次出发吧' })).toBeInTheDocument();

    const activeChildCall = vi.mocked(global.fetch).mock.calls.find((call) => String(call[0]).endsWith('/api/parent/active-child'));
    expect(activeChildCall).toBeTruthy();

    await user.click(screen.getByRole('button', { name: '退出登录' }));
    await user.type(screen.getByLabelText('家长手机号'), '13800000001');
    await user.type(screen.getByLabelText('登录密码'), 'demo1234');
    await user.click(screen.getByRole('button', { name: '登录查看孩子档案' }));
    await user.click(screen.getByRole('button', { name: '进入学习世界' }));

    expect(await screen.findByRole('heading', { name: '小海豚，准备再次出发吧' })).toBeInTheDocument();
  });

  test('renders the home world with subject islands and task card', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('银河探险家')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '小火箭，准备再次出发吧' })).toBeInTheDocument();
    expect(screen.getByText('数学岛')).toBeInTheDocument();
    expect(screen.getByText('语文岛')).toBeInTheDocument();
    expect(screen.getByText('英语岛')).toBeInTheDocument();
    expect(screen.getByText('今日任务')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '继续挑战 10 以内加法' })).toHaveAttribute('href', '/levels/math-addition-001');
    const homeOverviewCall = vi.mocked(global.fetch).mock.calls.find((call) => call[0] === '/api/home/overview');
    expect(homeOverviewCall).toBeTruthy();
    const headers = homeOverviewCall?.[1]?.headers as Headers;
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('X-Child-Profile-Id')).toBe('2');
  });

  test('lets parents switch the active child grade from the top bar and refreshes the home task', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: '小火箭，准备再次出发吧' })).toBeInTheDocument();
    expect(screen.getByLabelText('年级选择')).toHaveValue('幼小衔接');

    await user.selectOptions(screen.getByLabelText('年级选择'), '一年级');

    expect(await screen.findByRole('link', { name: '继续挑战 一年级应用题' })).toHaveAttribute('href', '/levels/math-grade1-wordproblem-001');
    expect(screen.getByText('当前阶段：一年级')).toBeInTheDocument();

    const gradeUpdateCall = vi.mocked(global.fetch).mock.calls.find((call) => String(call[0]).endsWith('/api/parent/children/2') && call[1]?.method === 'PATCH');
    expect(gradeUpdateCall).toBeTruthy();
    expect(JSON.parse(String(gradeUpdateCall?.[1]?.body))).toEqual({
      nickname: '小火箭',
      title: '银河探险家',
      stageLabel: '一年级',
      avatarColor: '#8ecae6'
    });
  });

  test('shows home shortcuts for parent dashboard and leaderboard', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('银河探险家')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '家长中心' })).toHaveAttribute('href', '/parent');
    expect(screen.getByRole('link', { name: '排行榜' })).toHaveAttribute('href', '/leaderboard');
    expect(screen.getByRole('link', { name: '成就墙' })).toHaveAttribute('href', '/achievements');
    expect(screen.getByText(/已点亮/)).toHaveTextContent('再点亮 1 枚徽章，就能获得“小小坚持家”');
  });

  test('switches active child from the top bar and refreshes the home overview', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: '小火箭，准备再次出发吧' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '切换孩子' }));
    expect(await screen.findByText('选择要切换的小朋友')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '切换到小海豚' }));

    expect(await screen.findByRole('heading', { name: '小海豚，准备再次出发吧' })).toBeInTheDocument();
    expect(screen.getByText('海湾领航员')).toBeInTheDocument();
    expect(window.localStorage.getItem('k12-learning-game-session')).toBe(
      JSON.stringify({
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: 3,
        childNickname: '小海豚',
        children: [
          { id: 1, nickname: '小星星', streakDays: 7, totalStars: 126, title: '晨光冒险家' },
          { id: 2, nickname: '小火箭', streakDays: 9, totalStars: 188, title: '银河探险家' },
          { id: 3, nickname: '小海豚', streakDays: 10, totalStars: 172, title: '海湾领航员' }
        ]
      })
    );
  });

  test('persists the switched child from the top bar and uses it as the default on the next login', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: '小火箭，准备再次出发吧' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '切换孩子' }));
    await user.click(await screen.findByRole('button', { name: '切换到小海豚' }));

    expect(await screen.findByRole('heading', { name: '小海豚，准备再次出发吧' })).toBeInTheDocument();

    const activeChildCalls = vi.mocked(global.fetch).mock.calls.filter((call) => String(call[0]).endsWith('/api/parent/active-child'));
    expect(activeChildCalls.length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: '退出登录' }));
    await user.type(screen.getByLabelText('家长手机号'), '13800000001');
    await user.type(screen.getByLabelText('登录密码'), 'demo1234');
    await user.click(screen.getByRole('button', { name: '登录查看孩子档案' }));
    await user.click(screen.getByRole('button', { name: '进入学习世界' }));

    expect(await screen.findByRole('heading', { name: '小海豚，准备再次出发吧' })).toBeInTheDocument();
  });

  test('creates a child profile from the top bar switcher and refreshes the home overview', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: '小火箭，准备再次出发吧' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '切换孩子' }));
    await user.click(screen.getByRole('button', { name: '新增孩子档案' }));
    await user.type(screen.getByLabelText('孩子昵称'), '小月亮');
    await user.type(screen.getByLabelText('成长称号'), '森林观察员');
    await user.selectOptions(screen.getByLabelText('学习阶段'), '幼小衔接');
    await user.click(screen.getByRole('button', { name: '保存孩子档案' }));

    expect(await screen.findByRole('heading', { name: '小月亮，准备再次出发吧' })).toBeInTheDocument();
    expect(screen.getByText('森林观察员')).toBeInTheDocument();
  });

  test('edits the current child profile from the top bar switcher and refreshes session details', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: '小火箭，准备再次出发吧' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '切换孩子' }));
    await user.click(screen.getByRole('button', { name: '编辑当前档案' }));
    await user.clear(screen.getByLabelText('孩子昵称'));
    await user.type(screen.getByLabelText('孩子昵称'), '小宇宙');
    await user.clear(screen.getByLabelText('成长称号'));
    await user.type(screen.getByLabelText('成长称号'), '云朵旅行家');
    await user.selectOptions(screen.getByLabelText('学习阶段'), '一年级');
    await user.selectOptions(screen.getByLabelText('头像主题色'), '#ffcf70');
    await user.click(screen.getByRole('button', { name: '保存档案修改' }));

    expect(await screen.findByRole('heading', { name: '小宇宙，准备再次出发吧' })).toBeInTheDocument();
    expect(screen.getByText('云朵旅行家')).toBeInTheDocument();
    expect(screen.getByText('当前小朋友：小宇宙')).toBeInTheDocument();
    expect(window.localStorage.getItem('k12-learning-game-session')).toBe(
      JSON.stringify({
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: 2,
        childNickname: '小宇宙',
        children: [
          { id: 1, nickname: '小星星', streakDays: 7, totalStars: 126, title: '晨光冒险家' },
          {
            id: 2,
            nickname: '小宇宙',
            streakDays: 9,
            totalStars: 188,
            title: '云朵旅行家',
            stageLabel: '一年级',
            avatarColor: '#ffcf70'
          },
          { id: 3, nickname: '小海豚', streakDays: 10, totalStars: 172, title: '海湾领航员' }
        ]
      })
    );
  });

  test('lets learners log out from the home world', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('银河探险家')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '退出登录' }));

    expect(screen.getByText('欢迎回到学习小岛')).toBeInTheDocument();
    expect(window.localStorage.getItem('k12-learning-game-session')).toBeNull();
  });

  test('falls back when home overview omits achievement preview', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.endsWith('/api/session/children')) {
          return {
            ok: true,
            json: async () => ({
              defaultChildId: 1,
              children: [
                { id: 1, nickname: '小星星', streakDays: 7, totalStars: 126, title: '晨光冒险家' },
                { id: 2, nickname: '小火箭', streakDays: 9, totalStars: 188, title: '银河探险家' }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/home/overview')) {
          return {
            ok: true,
            json: async () => ({
              child: {
                id: 1,
                nickname: '小火箭',
                streakDays: 9,
                totalStars: 188,
                title: '银河探险家'
              },
              subjects: [
                { code: 'math', title: '数学岛', subtitle: '数字火花开始跳舞', accentColor: '#ff8a5b' },
                { code: 'chinese', title: '语文岛', subtitle: '拼音种子正在发芽', accentColor: '#f2c14e' },
                { code: 'english', title: '英语岛', subtitle: '单词海风轻轻吹', accentColor: '#39b7a5' }
              ]
            })
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('银河探险家')).toBeInTheDocument();
    expect(screen.getByText(/已点亮/)).toHaveTextContent('再点亮 1 枚徽章，就能获得“继续加油章”');
  });

  test('renders subject map nodes from route data', async () => {
    render(
      <MemoryRouter initialEntries={['/subjects/math']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('数字启蒙站')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
    expect(screen.getByText('认识 0-10')).toBeInTheDocument();
    expect(screen.getByText('认识 11-20')).toBeInTheDocument();
    expect(screen.getByText('10 以内加法')).toBeInTheDocument();
    expect(screen.getByText('20 以内加法')).toBeInTheDocument();
    expect(screen.getByText('规律小火车')).toBeInTheDocument();
    expect(screen.getByText('图形规律屋')).toBeInTheDocument();
    expect(screen.getByText('水果减减看')).toBeInTheDocument();
    expect(screen.getByText('20 以内减法')).toBeInTheDocument();
    expect(screen.getByText('谁更多挑战')).toBeInTheDocument();
    expect(screen.getByText('图像列式屋')).toBeInTheDocument();
    expect(screen.getByText('故事应用题')).toBeInTheDocument();
    const subjectMapCall = vi.mocked(global.fetch).mock.calls.find((call) => call[0] === '/api/subjects/math/map');
    expect(subjectMapCall).toBeTruthy();
    expect((subjectMapCall?.[1]?.headers as Headers).get('Content-Type')).toBe('application/json');
  });

  test('renders expanded chinese and english subject maps', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/subjects/chinese']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('汉字花园')).toBeInTheDocument();
    expect(screen.getByText('身体小伙伴')).toBeInTheDocument();
    expect(screen.getByText('拼音乐园')).toBeInTheDocument();
    expect(screen.getByText('拼读小火车')).toBeInTheDocument();
    expect(screen.getByText('笔画写字屋')).toBeInTheDocument();
    expect(screen.getByText('人字起步')).toBeInTheDocument();

    unmount();

    render(
      <MemoryRouter initialEntries={['/subjects/english']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('字母海湾')).toBeInTheDocument();
    expect(screen.getByText('字母 G 到 L')).toBeInTheDocument();
    expect(screen.getByText('拼读码头')).toBeInTheDocument();
    expect(screen.getByText('开头声音侦探')).toBeInTheDocument();
    expect(screen.getByText('单词沙滩')).toBeInTheDocument();
    expect(screen.getByText('颜色单词沙堡')).toBeInTheDocument();
    expect(screen.getByText('绘本港湾')).toBeInTheDocument();
    expect(screen.getByText('晚安小绘本')).toBeInTheDocument();
  });

  test('renders level player summary and step prompts', async () => {
    render(
      <MemoryRouter initialEntries={['/levels/math-numbers-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('数字小探险')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回数学岛' })).toHaveAttribute('href', '/subjects/math');
    expect(screen.getByText('把 5 个苹果拖进篮子')).toBeInTheDocument();
    expect(screen.getByText('第 1 / 2 步')).toBeInTheDocument();
    expect(screen.getByText('真的从接口里取到了这一关。')).toBeInTheDocument();
    const levelCall = vi.mocked(global.fetch).mock.calls.find((call) => call[0] === '/api/levels/math-numbers-001');
    expect(levelCall).toBeTruthy();
    expect((levelCall?.[1]?.headers as Headers).get('Content-Type')).toBe('application/json');
  });
});
