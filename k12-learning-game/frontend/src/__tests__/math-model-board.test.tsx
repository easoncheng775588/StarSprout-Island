import { render, screen } from '@testing-library/react';
import { MathModelBoard } from '../components/MathModelBoard';

describe('MathModelBoard', () => {
  test('renders reusable number line, bar model and fraction bar visuals', () => {
    const { rerender } = render(
      <MathModelBoard
        model={{
          kind: 'number-line',
          title: '数轴跳跳桥',
          caption: '从 12 往前跳 5 格',
          start: 12,
          end: 17,
          jumpLabel: '+5',
          points: [
            { value: 12, label: '起点', tone: 'start' },
            { value: 17, label: '终点', tone: 'end' }
          ]
        }}
      />
    );

    expect(screen.getByLabelText('数形结合模型')).toBeInTheDocument();
    expect(screen.getByText('数轴跳跳桥')).toBeInTheDocument();
    expect(screen.getByLabelText('数轴点 12 起点')).toBeInTheDocument();

    rerender(
      <MathModelBoard
        model={{
          kind: 'bar-model',
          title: '线段图应用题',
          caption: '红气球和蓝气球的关系',
          segments: [
            { label: '红气球', value: 18, tone: 'known' },
            { label: '多出的', value: 7, tone: 'extra' }
          ]
        }}
      />
    );

    expect(screen.getByLabelText('线段 红气球 18')).toBeInTheDocument();
    expect(screen.getByLabelText('线段 多出的 7')).toBeInTheDocument();

    rerender(
      <MathModelBoard
        model={{
          kind: 'fraction-bars',
          title: '分数条比较',
          caption: '看 3/4 和 2/4 谁更多',
          bars: [
            { label: '3/4', totalParts: 4, filledParts: 3, tone: 'primary' },
            { label: '2/4', totalParts: 4, filledParts: 2, tone: 'secondary' }
          ]
        }}
      />
    );

    expect(screen.getByLabelText('3/4 分数条 3')).toBeInTheDocument();
    expect(screen.getByLabelText('2/4 分数条 2')).toBeInTheDocument();
  });
});
