import {cp, mkdir, rm, writeFile} from 'node:fs/promises';

// GitHub Pages serves the checked-in docs folder on the academic-pages branch.
await rm('docs', {recursive: true, force: true});
await cp('dist', 'docs', {recursive: true});
await rm('docs/_headers', {force: true});
await rm('docs/_redirects', {force: true});
await writeFile('docs/.nojekyll', '');
await mkdir('docs/research', {recursive: true});
await writeFile('docs/research/index.html', `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0; url=../">
  <title>David D. Yuan</title>
</head>
<body><p><a href="../">Continue to David D. Yuan’s academic homepage.</a></p></body>
</html>
`);
console.log('Prepared docs/ for GitHub Pages, including the legacy research redirect.');
