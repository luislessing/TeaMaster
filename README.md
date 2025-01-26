# TeeMaster

An Electron app for professional iced tea rating and evaluation.

## Features

- Rating system with weighted criteria:
  - Taste (35%)
  - Refreshment (25%)
  - Sweetness (15%)
  - Naturalness (15%)
  - Value for Money (10%)
- Local storage of ratings
- Clear overview of all ratings
- Ranking system

## Installation

```bash
git clone https://github.com/luislessing/TeaMaster.git
cd TeaMaster
npm install
```

## Development

```bash
npm run electron:dev
```

## Build

```bash
npm run electron:build
```

The AppImage will be created in the `release` folder.

## Converting TeaMaster to Web App

### Required Changes

1. Remove Electron dependencies:
```bash
npm uninstall electron electron-builder
```

2. Update package.json:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

3. Update vite.config.js:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './'
})
```

4. Install web dependencies:
```bash
npm install @vitejs/plugin-react
```

5. Build and deploy:
```bash
npm run build
# Upload dist folder contents to web server
```

6. Create .htaccess in web root:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### File Structure
```
webroot/
  ├── index.html
  ├── .htaccess
  └── assets/
```

## Technologies

- React
- Electron
- Vite
- TailwindCSS

## ToDO
- [x] customise look
- [x] implement Logo
- [x] implement export option
- [x] implement visual charts 
- [x] search function
- [x] deletable Entries
- [ ] User support
- [ ] Multilanguage support
- [ ] implement Tag System
- [ ] implement Darkmode

## License

MIT