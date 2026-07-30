import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildBundle } from './build-plugin-bundle.mjs';

const DNA = '# Prompt Principles — RE:PROMPT 템플릿 DNA (v9.9)\n\n원칙 본문.\n';

/** 볼트 원본과 플러그인 대상 디렉토리를 임시로 만든다. */
function fixture({ templates = ['alpha', 'beta'], dna = DNA, stale = [] } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'bundle-'));
  const vaultDir = join(root, 'vault');
  const pluginDir = join(root, 'plugin');

  mkdirSync(join(vaultDir, '00-principles'), { recursive: true });
  mkdirSync(join(vaultDir, '50-library'), { recursive: true });
  writeFileSync(join(vaultDir, '00-principles/prompt-principles.md'), dna);
  writeFileSync(join(vaultDir, '50-library/_categories.md'), '카테고리 정의\n');
  for (const slug of templates) {
    writeFileSync(join(vaultDir, '50-library', `${slug}.md`), `# ${slug}\n본문 ${slug}\n`);
  }

  // 대상에 미리 남아 있는 잔존물 — 삭제 전파 검증용
  mkdirSync(join(pluginDir, 'library'), { recursive: true });
  mkdirSync(join(pluginDir, 'dna'), { recursive: true });
  for (const name of stale) {
    writeFileSync(join(pluginDir, 'library', name), '이전 라운드 잔존물\n');
  }

  return { root, vaultDir, pluginDir };
}

const libFiles = (pluginDir) => readdirSync(join(pluginDir, 'library')).sort();

test('DNA와 라이브러리를 바이트 일치로 복사한다', () => {
  const { vaultDir, pluginDir } = fixture({ templates: ['alpha', 'beta'] });

  buildBundle({ vaultDir, pluginDir });

  assert.equal(
    readFileSync(join(pluginDir, 'dna/prompt-principles.md'), 'utf8'),
    readFileSync(join(vaultDir, '00-principles/prompt-principles.md'), 'utf8')
  );
  for (const slug of ['alpha', 'beta']) {
    assert.equal(
      readFileSync(join(pluginDir, 'library', `${slug}.md`), 'utf8'),
      readFileSync(join(vaultDir, '50-library', `${slug}.md`), 'utf8')
    );
  }
});

test('_categories.md도 복사한다', () => {
  const { vaultDir, pluginDir } = fixture();
  buildBundle({ vaultDir, pluginDir });
  assert.ok(existsSync(join(pluginDir, 'library/_categories.md')));
});

test('볼트에서 삭제된 파일은 번들에서도 사라진다 (복사만으로는 통과 불가)', () => {
  const { vaultDir, pluginDir } = fixture({
    templates: ['alpha'],
    stale: ['removed-last-round.md', 'another-stale.md'],
  });

  buildBundle({ vaultDir, pluginDir });

  assert.deepStrictEqual(libFiles(pluginDir), ['_categories.md', 'alpha.md']);
});

test('두 번 실행해도 결과가 같다 (멱등)', () => {
  const { vaultDir, pluginDir } = fixture({ templates: ['alpha', 'beta'] });

  const first = buildBundle({ vaultDir, pluginDir });
  const snapshot = libFiles(pluginDir).map((f) =>
    readFileSync(join(pluginDir, 'library', f), 'utf8')
  );

  const second = buildBundle({ vaultDir, pluginDir });

  assert.deepStrictEqual(second, first);
  assert.deepStrictEqual(
    libFiles(pluginDir).map((f) => readFileSync(join(pluginDir, 'library', f), 'utf8')),
    snapshot
  );
});

test('볼트 원본을 변경하지 않는다', () => {
  const { vaultDir, pluginDir } = fixture({ templates: ['alpha'] });
  const before = readdirSync(join(vaultDir, '50-library'))
    .sort()
    .map((f) => [f, readFileSync(join(vaultDir, '50-library', f), 'utf8')]);

  buildBundle({ vaultDir, pluginDir });

  const after = readdirSync(join(vaultDir, '50-library'))
    .sort()
    .map((f) => [f, readFileSync(join(vaultDir, '50-library', f), 'utf8')]);
  assert.deepStrictEqual(after, before);
});

test('DNA 버전과 템플릿 수를 반환한다', () => {
  const { vaultDir, pluginDir } = fixture({ templates: ['alpha', 'beta', 'gamma'] });

  const result = buildBundle({ vaultDir, pluginDir });

  // _categories.md 는 템플릿이 아니므로 세지 않는다
  assert.deepStrictEqual(result, { dnaVersion: 'v9.9', templateCount: 3 });
});

test('대상 디렉토리가 없으면 만든다', () => {
  const root = mkdtempSync(join(tmpdir(), 'bundle-'));
  const vaultDir = join(root, 'vault');
  const pluginDir = join(root, 'plugin'); // 존재하지 않음
  mkdirSync(join(vaultDir, '00-principles'), { recursive: true });
  mkdirSync(join(vaultDir, '50-library'), { recursive: true });
  writeFileSync(join(vaultDir, '00-principles/prompt-principles.md'), DNA);
  writeFileSync(join(vaultDir, '50-library/_categories.md'), '카테고리\n');
  writeFileSync(join(vaultDir, '50-library/solo.md'), '# solo\n');

  buildBundle({ vaultDir, pluginDir });

  assert.deepStrictEqual(libFiles(pluginDir), ['_categories.md', 'solo.md']);
});

test('마크다운이 아닌 잔존 파일도 정리한다', () => {
  const { vaultDir, pluginDir } = fixture({ templates: ['alpha'], stale: ['stale.txt'] });
  buildBundle({ vaultDir, pluginDir });
  assert.deepStrictEqual(libFiles(pluginDir), ['_categories.md', 'alpha.md']);
});
