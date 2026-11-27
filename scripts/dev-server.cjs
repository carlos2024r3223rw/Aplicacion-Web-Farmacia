const path = require('path');
const { app } = require('../backend/server');

async function startDevelopmentServer() {
  const { createServer } = await import('vite');
  const root = path.resolve(__dirname, '..');
  const vite = await createServer({
    root,
    configFile: path.join(root, 'vite.config.ts'),
    configLoader: 'runner',
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);
  app.listen(4173, '127.0.0.1', () => {
    console.log('PharmaPro listo en http://127.0.0.1:4173');
  });
}

startDevelopmentServer().catch((error) => {
  console.error('No se pudo iniciar PharmaPro:', error);
  process.exitCode = 1;
});
