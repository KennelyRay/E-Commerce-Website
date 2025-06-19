const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function deployToGitHubPages() {
  try {
    console.log('🚀 Starting GitHub Pages deployment...');
    
    // Make sure we have the build
    if (!fs.existsSync('out')) {
      console.log('📦 Building for production...');
      execSync('npm run deploy', { stdio: 'inherit' });
    }
    
    // Create a temporary directory for gh-pages
    const tempDir = path.join(__dirname, 'temp-gh-pages');
    
    // Remove temp directory if it exists
    if (fs.existsSync(tempDir)) {
      execSync(`rmdir /s /q "${tempDir}"`, { stdio: 'inherit' });
    }
    
    // Create temp directory and copy out contents
    fs.mkdirSync(tempDir, { recursive: true });
    execSync(`xcopy "out\\*" "${tempDir}\\" /E /I /Y`, { stdio: 'inherit' });
    
    // Initialize git in temp directory
    process.chdir(tempDir);
    execSync('git init', { stdio: 'inherit' });
    execSync('git checkout -b gh-pages', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
    
    // Get the remote URL from the main repository
    process.chdir('..');
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    
    // Push to gh-pages branch
    process.chdir(tempDir);
    execSync(`git remote add origin "${remoteUrl}"`, { stdio: 'inherit' });
    execSync('git push -f origin gh-pages', { stdio: 'inherit' });
    
    // Clean up
    process.chdir('..');
    execSync(`rmdir /s /q "${tempDir}"`, { stdio: 'inherit' });
    
    console.log('✅ Successfully deployed to GitHub Pages!');
    console.log('🌐 Your site will be available at: https://yourusername.github.io/E-Commerce-Website/');
    console.log('⏰ It may take a few minutes for changes to appear.');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deployToGitHubPages(); 