export type PictureMathGroup = {
  label: string;
  emoji: string;
  count: number;
  tone?: 'normal' | 'add' | 'remove' | 'result';
};

interface PictureMathBoardProps {
  groups?: PictureMathGroup[];
}

export function PictureMathBoard({ groups }: PictureMathBoardProps) {
  if (!groups?.length) {
    return null;
  }

  return (
    <div aria-label="图片算式" className="picture-math-board">
      {groups.map((group) => (
        <div className={`picture-math-group picture-math-group-${group.tone ?? 'normal'}`} key={group.label}>
          <div className="picture-math-group-header">
            <strong>{group.label}</strong>
            <span>{group.count} 个</span>
          </div>
          <div className="picture-math-token-row">
            {Array.from({ length: group.count }, (_, itemIndex) => (
              <span
                aria-label={`${group.label} 图片 ${itemIndex + 1}`}
                className="picture-math-token"
                key={`${group.label}-${itemIndex + 1}`}
              >
                {group.emoji}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
