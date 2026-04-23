import { render, screen } from '@testing-library/react';
import { PictureMathBoard } from '../components/PictureMathBoard';

describe('PictureMathBoard', () => {
  test('renders picture groups with accessible count tokens', () => {
    render(
      <PictureMathBoard
        groups={[
          { label: '原来 4 只小猫', emoji: '🐱', count: 4, tone: 'normal' },
          { label: '又来 3 只小猫', emoji: '🐈', count: 3, tone: 'add' },
          { label: '一共 7 只小猫', emoji: '🐱', count: 7, tone: 'result' }
        ]}
      />
    );

    expect(screen.getByLabelText('图片算式')).toBeInTheDocument();
    expect(screen.getByText('原来 4 只小猫')).toBeInTheDocument();
    expect(screen.getByText('7 个')).toBeInTheDocument();
    expect(screen.getByLabelText('又来 3 只小猫 图片 3')).toBeInTheDocument();
    expect(screen.getByLabelText('一共 7 只小猫 图片 7')).toBeInTheDocument();
  });
});
