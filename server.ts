import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("appprompt.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_subscriber INTEGER DEFAULT 0,
    pix_payment_id TEXT,
    trial_ends_at DATETIME,
    subscription_ends_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS community_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'prompt', -- 'prompt' or 'code'
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    ia_type TEXT,
    category TEXT,
    level TEXT,
    is_favorite INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

import JSZip from 'jszip';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Community
  app.get("/api/community", (req, res) => {
    const posts = db.prepare(`
      SELECT cp.*, u.name as author_name 
      FROM community_posts cp 
      JOIN users u ON cp.user_id = u.id 
      ORDER BY cp.created_at DESC
    `).all();
    res.json(posts);
  });

  app.post("/api/community", (req, res) => {
    const { userId, title, content, type } = req.body;
    const stmt = db.prepare("INSERT INTO community_posts (user_id, title, content, type) VALUES (?, ?, ?, ?)");
    const result = stmt.run(userId, title, content, type);
    res.json({ id: result.lastInsertRowid });
  });

  app.post("/api/community/like/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE community_posts SET likes = likes + 1 WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // ZIP Generation
  app.post("/api/generate-zip", async (req, res) => {
    const { files } = req.body; // Array of { name: string, content: string }
    const zip = new JSZip();
    
    files.forEach((file: any) => {
      zip.file(file.name, file.content);
    });

    const content = await zip.generateAsync({ type: "nodebuffer" });
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachment; filename=app-project.zip');
    res.send(content);
  });

  // Auth
  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password } = req.body;
    try {
      // Brazil Time (UTC-3)
      const now = new Date();
      const trialEndsAt = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 24 hours from now

      const stmt = db.prepare("INSERT INTO users (name, email, password, trial_ends_at) VALUES (?, ?, ?, ?)");
      const result = stmt.run(name, email, password, trialEndsAt.toISOString());
      res.json({ id: result.lastInsertRowid, name, email, trial_ends_at: trialEndsAt.toISOString() });
    } catch (error: any) {
      res.status(400).json({ error: "Email já cadastrado ou erro no servidor." });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      const now = new Date();
      
      const trialEnds = user.trial_ends_at ? new Date(user.trial_ends_at) : null;
      const isTrialActive = trialEnds ? trialEnds > now : false;

      const subEnds = user.subscription_ends_at ? new Date(user.subscription_ends_at) : null;
      const isSubActive = subEnds ? subEnds > now : false;

      res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        is_subscriber: isSubActive,
        is_trial_active: isTrialActive,
        trial_ends_at: user.trial_ends_at,
        subscription_ends_at: user.subscription_ends_at
      });
    } else {
      res.status(401).json({ error: "Credenciais inválidas." });
    }
  });

  app.get("/api/auth/status/:id", (req, res) => {
    const { id } = req.params;
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as any;
    if (user) {
      const now = new Date();
      
      const trialEnds = user.trial_ends_at ? new Date(user.trial_ends_at) : null;
      const isTrialActive = trialEnds ? trialEnds > now : false;

      const subEnds = user.subscription_ends_at ? new Date(user.subscription_ends_at) : null;
      const isSubActive = subEnds ? subEnds > now : false;

      res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        is_subscriber: isSubActive,
        is_trial_active: isTrialActive,
        trial_ends_at: user.trial_ends_at,
        subscription_ends_at: user.subscription_ends_at
      });
    } else {
      res.status(404).json({ error: "Usuário não encontrado." });
    }
  });

  // PixGo Integration
  app.post("/api/payment/create", async (req, res) => {
    const { userId, name, email, cpf } = req.body;
    const PIXGO_API_KEY = process.env.PIXGO_API_KEY || "pk_e905b55ca3042c0a77a8c12410601ecd4a475912391d9c8831d26ef29682eab2";

    try {
      const response = await fetch("https://pixgo.org/api/v1/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": PIXGO_API_KEY,
        },
        body: JSON.stringify({
          amount: 19.90,
          description: "Assinatura Mensal AppPrompt",
          customer_name: name,
          customer_email: email,
          customer_cpf: cpf,
          external_id: `user_${userId}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        db.prepare("UPDATE users SET pix_payment_id = ? WHERE id = ?").run(result.data.payment_id, userId);
        res.json(result.data);
      } else {
        res.status(400).json({ error: result.message || "Erro ao criar pagamento Pix." });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro interno ao processar pagamento." });
    }
  });

  app.get("/api/payment/status/:paymentId", async (req, res) => {
    const { paymentId } = req.params;
    const PIXGO_API_KEY = process.env.PIXGO_API_KEY || "pk_e905b55ca3042c0a77a8c12410601ecd4a475912391d9c8831d26ef29682eab2";

    try {
      const response = await fetch(`https://pixgo.org/api/v1/payment/${paymentId}/status`, {
        headers: { "X-API-Key": PIXGO_API_KEY },
      });
      const result = await response.json();
      
      if (result.success && result.data.status === "completed") {
        const subEndsAt = new Date();
        subEndsAt.setMonth(subEndsAt.getMonth() + 1); // 30 days
        db.prepare("UPDATE users SET is_subscriber = 1, subscription_ends_at = ? WHERE pix_payment_id = ?").run(subEndsAt.toISOString(), paymentId);
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Erro ao consultar status." });
    }
  });

  // Prompts
  app.get("/api/prompts/:userId", (req, res) => {
    const { userId } = req.params;
    const prompts = db.prepare("SELECT * FROM prompts WHERE user_id = ? ORDER BY created_at DESC").all(userId);
    res.json(prompts);
  });

  app.post("/api/prompts", (req, res) => {
    const { userId, title, content, iaType, category, level } = req.body;
    const stmt = db.prepare("INSERT INTO prompts (user_id, title, content, ia_type, category, level) VALUES (?, ?, ?, ?, ?, ?)");
    const result = stmt.run(userId, title, content, iaType, category, level);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/prompts/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM prompts WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.patch("/api/prompts/:id/favorite", (req, res) => {
    const { id } = req.params;
    const { isFavorite } = req.body;
    db.prepare("UPDATE prompts SET is_favorite = ? WHERE id = ?").run(isFavorite ? 1 : 0, id);
    res.json({ success: true });
  });

  app.patch("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      db.prepare("UPDATE users SET name = ?, email = ? WHERE id = ?").run(name, email, id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar perfil." });
    }
  });

  // Catch-all for API routes to prevent returning HTML
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
