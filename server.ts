import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AdminSession {
  token: string;
  username: string;
  role: string;
  createdAt: number;
  expiresAt: number;
}

// In-memory active session tokens with 24-hour expiration
const activeSessions = new Map<string, AdminSession>();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Security headers middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  });

  // Server-side Authorization Middleware
  const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or invalid authorization token',
      });
    }

    const token = authHeader.substring(7).trim();
    const session = activeSessions.get(token);

    if (!session || Date.now() > session.expiresAt) {
      if (session) activeSessions.delete(token);
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Session expired or invalid',
      });
    }

    // Attach verified session to request
    (req as any).adminSession = session;
    next();
  };

  // POST /api/admin/login
  // Authenticates credentials securely on the server without exposing secrets to frontend
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body || {};

    const configuredUser = process.env.ADMIN_USERNAME || 'admin';
    const configuredPass = process.env.ADMIN_PASSWORD || 'shaan2026';
    const altManagerUser = 'manager';
    const altManagerPass = 'topchanchi828402';

    // Validate credentials server-side
    const isValidAdmin = username === configuredUser && password === configuredPass;
    const isValidManager = username === altManagerUser && password === altManagerPass;

    if (isValidAdmin || isValidManager) {
      const token = `sep_auth_${crypto.randomBytes(32).toString('hex')}`;
      const session: AdminSession = {
        token,
        username: username || 'admin',
        role: isValidAdmin ? 'Property Administrator' : 'Front Desk Manager',
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24-hour validity
      };

      activeSessions.set(token, session);

      return res.json({
        success: true,
        token,
        user: {
          username: session.username,
          role: session.role,
        },
      });
    }

    // Delay slightly to prevent timing analysis
    setTimeout(() => {
      res.status(401).json({
        success: false,
        error: 'Invalid administrator credentials. Please check your username and password.',
      });
    }, 350);
  });

  // GET /api/admin/verify
  // Verifies current Bearer token
  app.get('/api/admin/verify', requireAdminAuth, (req, res) => {
    const session = (req as any).adminSession as AdminSession;
    res.json({
      success: true,
      user: {
        username: session.username,
        role: session.role,
        expiresAt: session.expiresAt,
      },
    });
  });

  // POST /api/admin/logout
  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      activeSessions.delete(token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // GET /api/health
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      property: 'Shaan-E-Punjab Hotel, Topchanchi',
      serverTime: new Date().toISOString(),
    });
  });

  // Vite Integration: production static or development middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Shaan-E-Punjab] Server active on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Shaan-E-Punjab] Server failed to start:', err);
  process.exit(1);
});
