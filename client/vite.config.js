// vite.config.js for production

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import fs from 'fs';
// import path from 'path';

// export default defineConfig(({ mode }) => {
//   const isDevelopment = mode === 'development';

//   return {
//     server: {
//       host: 'localhost',
//       port: 5173,
//       https: isDevelopment ? {
//         key: fs.readFileSync(path.resolve(__dirname, '../server/certs/localhost-key.pem')),
//         cert: fs.readFileSync(path.resolve(__dirname, '../server/certs/localhost.pem')),
//       } : false,
//       proxy: {
//         '/api': {
//           target: isDevelopment ? 'https://localhost:5000' : 'https://yourbusinessdomain.com',
//           changeOrigin: true,
//           secure: false,
//           ws: true,
//         },
//       },
//     },
//     plugins: [react()],
//     build: {
//       outDir: path.resolve(__dirname, '../server/client/dist'),
//       emptyOutDir: true,
//     },
//   };
// });

// // viteconfig.js for development

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import fs from 'fs';
// import path from 'path';

// export default defineConfig({
//   server: {
//     host: 'localhost',
//     port: 5173,
//     https: {
//       key: fs.readFileSync(path.resolve(__dirname, '../server/certs/localhost-key.pem')),
//       cert: fs.readFileSync(path.resolve(__dirname, '../server/certs/localhost.pem')),
//     },
//     proxy: {
//       '/api': {
//         target: 'https://localhost:5000',
//         changeOrigin: true,
//         secure: false,
//         ws: true,
//       },
//     },
//   },
//   build: {
//     outDir: path.resolve(__dirname, '../server/client/dist'), // Ensures the outDir is correct
//     emptyOutDir: true, // This will empty the outDir before each build
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           // You can customize how chunks are split here
//           if (id.includes('node_modules')) {
//             return 'vendor';
//           }
//           // Split larger components or specific libraries into separate chunks if needed
//           if (id.includes('react')) {
//             return 'react';
//           }
//         },
//       },
//     },
//     chunkSizeWarningLimit: 1000, // Increase chunk size warning limit if needed
//   },
//   plugins: [react()],
//   define: {
//     'process.env': process.env,
//   },
//   configureServer(server) {
//     server.middlewares.use((req, res, next) => {
//       if (req.url.endsWith('.jsx')) {
//         res.setHeader('Content-Type', 'text/jsx');
//       }
//       next();
//     });
//   },
// });

// vite.config.js for production and development

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    server: {
      host: 'localhost',
      port: 5173,
      https: isDevelopment ? {
        key: fs.readFileSync(path.resolve(__dirname, '../server/certs/localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, '../server/certs/localhost.pem')),
      } : false,
      proxy: {
        '/api': {
          target: isDevelopment ? 'https://localhost:5000' : 'https://yourbusinessdomain.com',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    plugins: [react()],
    build: {
      outDir: path.resolve(__dirname, '../server/client/dist'),
      emptyOutDir: true,
    },
  };
});
