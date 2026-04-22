import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Responsive scale foundation', () => {
  const srcRoot = resolve(__dirname, '..');
  const styles = readFileSync(resolve(__dirname, '../styles.css'), 'utf-8');

  const collectSourceFiles = (directory: string): string[] => readdirSync(directory)
    .flatMap((entry) => {
      const path = resolve(directory, entry);

      if (entry === '__tests__') {
        return [];
      }

      if (statSync(path).isDirectory()) {
        return collectSourceFiles(path);
      }

      return /\.(css|tsx?|jsx?)$/.test(entry) ? [path] : [];
    });

  it('uses a 10px rem baseline and a 1440px content shell', () => {
    expect(styles).toContain('html {\n  font-size: 62.5%;\n}');
    expect(styles).toContain('max-width: 144rem;');
  });

  it('keeps app styles on rem-based sizing instead of fixed px units', () => {
    expect(styles).not.toMatch(/\b\d*\.?\d+px\b/);
  });

  it('keeps application source free of pixel-based inline sizing', () => {
    const filesWithPixels = collectSourceFiles(srcRoot).filter((file) => {
      const source = readFileSync(file, 'utf-8');
      return /\b\d*\.?\d+px\b/.test(source);
    });

    expect(filesWithPixels).toEqual([]);
  });

  it('provides print styles for exporting the parent weekly report', () => {
    expect(styles).toContain('@media print');
    expect(styles).toContain('.weekly-report-sheet');
    expect(styles).toContain('.weekly-report-print');
    expect(styles).toContain('print-color-adjust: exact;');
  });
});
