import * as path from 'path';
import * as serveStatic from 'serve-static';
import { yorker } from 'yorker';
import { Express } from 'express';

function setCustomCacheControl(res: any, path: any) {
  if ((serveStatic.mime as any).lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'public, max-age=0')
  }
}

export async function startStatic(app: Express) {
  const say = yorker.see(`🚕 serving static`);
  const www = path.join(__dirname, '../../www');
  app.use(serveStatic(www, {
    maxAge: '1d',
    setHeaders: setCustomCacheControl
  }));
  say(`serving static files from ${www}.`);
  return app;
}
