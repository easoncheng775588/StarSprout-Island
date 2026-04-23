import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

describe('Content config editor', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'k12-learning-game-session',
      JSON.stringify({
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: 1,
        childNickname: '小星星',
        children: [
          {
            id: 1,
            nickname: '小星星',
            streakDays: 4,
            totalStars: 138,
            title: '晨光冒险家',
            stageLabel: '一年级',
            avatarColor: '#ffcf70'
          }
        ]
      })
    );
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

  test('opens config detail and saves edited JSON payload', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/api/content/configs') && !init?.method) {
        return {
          ok: true,
          json: async () => ({
            totalLevelCount: 1,
            configuredLevelCount: 1,
            healthyLevelCount: 1,
            warningLevelCount: 0,
            configCoveragePercent: 100,
            totalVariantCount: 6,
            items: [
              {
                levelCode: 'math-grade4-decimal-001',
                levelTitle: '小数点灯塔',
                subjectTitle: '数学岛',
                knowledgePointCode: 'math.g4.decimal.tenths',
                knowledgePointTitle: '小数初步：十分位',
                variantCount: 6,
                assetTheme: '小数灯塔',
                audioQuality: '高质量儿童 TTS',
                configSource: 'activityConfigJson+knowledge',
                healthStatus: 'healthy',
                healthNotes: ['配置完整']
              }
            ]
          })
        } as Response;
      }

      if (url.endsWith('/api/content/configs/math-grade4-decimal-001') && !init?.method) {
        return {
          ok: true,
          json: async () => ({
            levelCode: 'math-grade4-decimal-001',
            levelTitle: '小数点灯塔',
            subjectTitle: '数学岛',
            stepCode: 'step-1',
            stepPrompt: '认识 0.7 表示多少',
            knowledgePointCode: 'math.g4.decimal.tenths',
            knowledgePointTitle: '小数初步：十分位',
            variantCount: 6,
            activityConfigJson: '{"kind":"number-choice","assetTheme":"小数灯塔","audioQuality":"高质量儿童 TTS"}',
            assetTheme: '小数灯塔',
            audioQuality: '高质量儿童 TTS',
            configSource: 'activityConfigJson+knowledge',
            healthStatus: 'healthy',
            healthNotes: ['配置完整']
          })
        } as Response;
      }

      if (url.endsWith('/api/content/configs/math-grade4-decimal-001') && init?.method === 'PATCH') {
        return {
          ok: true,
          json: async () => ({
            levelCode: 'math-grade4-decimal-001',
            levelTitle: '小数点灯塔',
            subjectTitle: '数学岛',
            stepCode: 'step-1',
            stepPrompt: '认识 0.7 表示多少',
            knowledgePointCode: 'math.g4.decimal.updated',
            knowledgePointTitle: '小数初步：更新后的十分位',
            variantCount: 12,
            activityConfigJson: '{"kind":"number-choice","assetTheme":"海风小数站","audioQuality":"录音素材优先"}',
            assetTheme: '海风小数站',
            audioQuality: '录音素材优先',
            configSource: 'activityConfigJson+knowledge',
            healthStatus: 'healthy',
            healthNotes: ['配置完整']
          })
        } as Response;
      }

      throw new Error(`Unhandled fetch: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter initialEntries={['/content-configs']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: '题库配置中心' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: '打开小数点灯塔配置详情' }));

    expect(await screen.findByRole('heading', { name: '小数点灯塔 配置详情' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('小数初步：十分位')).toBeInTheDocument();

    await user.clear(screen.getByLabelText('知识点编码'));
    await user.type(screen.getByLabelText('知识点编码'), 'math.g4.decimal.updated');
    await user.clear(screen.getByLabelText('知识点标题'));
    await user.type(screen.getByLabelText('知识点标题'), '小数初步：更新后的十分位');
    await user.clear(screen.getByLabelText('题库变体数'));
    await user.type(screen.getByLabelText('题库变体数'), '12');
    fireEvent.change(screen.getByLabelText('活动配置 JSON'), {
      target: {
        value: '{"kind":"number-choice","assetTheme":"海风小数站","audioQuality":"录音素材优先"}'
      }
    });
    await user.click(screen.getByRole('button', { name: '保存配置' }));

    await waitFor(() => expect(screen.getByText('配置已保存，健康检查已刷新。')).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/content/configs/math-grade4-decimal-001',
      expect.objectContaining({
        method: 'PATCH',
        body: expect.stringContaining('"knowledgePointCode":"math.g4.decimal.updated"')
      })
    );
    expect(screen.getAllByText('素材主题：海风小数站').length).toBeGreaterThan(0);
    expect(screen.getAllByText('音频质量：录音素材优先').length).toBeGreaterThan(0);
  });
});
