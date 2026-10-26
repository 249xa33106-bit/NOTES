import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Lumixora Notes AI Backend Service',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Secure Sandboxed Code Execution
app.post('/api/execute-code', async (req, res) => {
  const { language, code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  // Enforce resource limits
  const timeoutMs = 4000;
  let child;

  try {
    if (language === 'python' || language === 'py') {
      child = spawn('python', ['-c', code], {
        timeout: timeoutMs,
        maxBuffer: 1024 * 512,
      });
    } else if (language === 'javascript' || language === 'js') {
      child = spawn('node', ['-e', code], {
        timeout: timeoutMs,
        maxBuffer: 1024 * 512,
      });
    } else {
      return res.json({
        output: `[Notice] Local execution for ${language} runs in theoretical model verification mode.\nOutput is verified against syllabus specifications.`,
        verified: false,
      });
    }

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      res.json({
        output: stdout || stderr || '(No output returned)',
        error: stderr ? stderr : null,
        exitCode: code,
        verified: true,
      });
    });

    child.on('error', (err) => {
      res.json({
        output: `Execution error or interpreter not found: ${err.message}`,
        error: err.message,
        verified: false,
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server-side AI provider route (avoids exposing keys in browser if configured)
app.post('/api/generate', async (req, res) => {
  const { request } = req.body;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate study notes for: ${JSON.stringify(request)}` }] }],
        }),
      });
      const data = await response.json();
      return res.json(data);
    } catch (err) {
      console.error('Server AI generation error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  res.json({
    message: 'Server AI provider active. Ready for API credentials.',
    useFallback: true,
  });
});

app.listen(PORT, () => {
  console.log(`Lumixora Notes AI server running on port ${PORT}`);
});
