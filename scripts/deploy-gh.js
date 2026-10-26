import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 [GitHub Deploy] Building production bundle...');
execSync('npm run build', { stdio: 'inherit' });

const distPath = path.resolve('dist');

// Copy index.html to 404.html for SPA routing fallback on GitHub Pages
fs.copyFileSync(path.join(distPath, 'index.html'), path.join(distPath, '404.html'));

// Create .nojekyll to disable Jekyll processing
fs.writeFileSync(path.join(distPath, '.nojekyll'), '');

console.log('📦 [GitHub Deploy] Pushing dist to gh-pages branch...');
try {
  execSync('git --work-tree=dist checkout --orphan gh-pages-temp', { stdio: 'inherit' });
  execSync('git --work-tree=dist add --all', { stdio: 'inherit' });
  execSync('git --work-tree=dist commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
  execSync('git push origin HEAD:gh-pages --force', { stdio: 'inherit' });
  execSync('git checkout -f main', { stdio: 'inherit' });
  execSync('git branch -D gh-pages-temp', { stdio: 'inherit' });
  console.log('✅ [GitHub Deploy] Successfully deployed to GitHub Pages!');
} catch (e) {
  console.log('Note: To push via standalone git in dist, use git init in dist.');
}
