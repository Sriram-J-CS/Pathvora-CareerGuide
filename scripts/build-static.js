const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appApiDir = path.join(__dirname, '../src/app/api');
const tempApiDir = path.join(__dirname, '../src/api_temp');

let apiMoved = false;
if (fs.existsSync(appApiDir)) {
  fs.renameSync(appApiDir, tempApiDir);
  apiMoved = true;
  console.log('✓ Successfully moved API routes out of src/app directory to prevent static compilation errors.');
}

try {
  console.log('Running Next.js production build...');
  execSync('next build', { stdio: 'inherit' });
  console.log('✓ Build completed successfully.');
} catch (error) {
  console.error('✗ Build failed:', error);
  process.exitCode = 1;
} finally {
  if (apiMoved && fs.existsSync(tempApiDir)) {
    fs.renameSync(tempApiDir, appApiDir);
    console.log('✓ Restored API routes back to src/app directory.');
  }
}
