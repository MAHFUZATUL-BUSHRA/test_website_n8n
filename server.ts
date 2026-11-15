import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';
const PORTFOLIO_WEBHOOK_URL =
  'https://judiciary-tripod-handful.ngrok-free.dev/webhook-test/portfolio';

interface ChatInputMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  company: string;
  message: string;
  receivedAt: string;
}

const recentSubmissions: ContactSubmission[] = [];

async function persistContactSubmission(entry: ContactSubmission): Promise<void> {
  recentSubmissions.unshift(entry);
  if (recentSubmissions.length > 100) {
    recentSubmissions.pop();
  }
  try {
    const filePath = path.join(__dirname, '.contact-submissions.json');
    await fs.writeFile(filePath, JSON.stringify(recentSubmissions, null, 2), 'utf8');
  } catch {
    // Non-fatal in read-only environments; submission remains tracked in memory.
  }
}

interface WebhookDeliveryResult {
  delivered: boolean;
  status: number | null;
  replyText?: string;
  error?: string;
}

function extractWebhookReplyText(rawBody: string): string {
  const trimmed = rawBody.trim();
  if (!trimmed) return '';

  try {
    const parsed: unknown = JSON.parse(trimmed);
    const extractFromValue = (val: unknown): string => {
      if (typeof val === 'string') return val.trim();
      if (typeof val === 'number' || typeof val === 'boolean') return String(val);
      if (Array.isArray(val)) {
        for (const item of val) {
          const found = extractFromValue(item);
          if (found) return found;
        }
        return '';
      }
      if (val && typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        const priorityKeys = [
          'reply',
          'output',
          'response',
          'answer',
          'text',
          'content',
          'result',
          'message',
          'data',
          'body',
        ];
        for (const key of priorityKeys) {
          if (key in obj) {
            const found = extractFromValue(obj[key]);
            if (found) return found;
          }
        }
        for (const value of Object.values(obj)) {
          const found = extractFromValue(value);
          if (found) return found;
        }
      }
      return '';
    };

    const extracted = extractFromValue(parsed);
    return extracted || trimmed;
  } catch {
    return trimmed;
  }
}

async function forwardToWebhook(
  payload: Record<string, unknown>,
  timeoutMs = 15000
): Promise<WebhookDeliveryResult> {
  const webhookUrl =
    process.env.PORTFOLIO_WEBHOOK_URL ||
    process.env.CONTACT_WEBHOOK_URL ||
    PORTFOLIO_WEBHOOK_URL;

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    const rawText = await webhookResponse.text();

    if (!webhookResponse.ok) {
      const ngrokCode = webhookResponse.headers.get('ngrok-error-code');
      const error =
        ngrokCode === 'ERR_NGROK_3200'
          ? 'The ngrok webhook tunnel is currently offline (ERR_NGROK_3200). Start ngrok and your webhook listener to receive replies.'
          : `Webhook responded with HTTP ${webhookResponse.status} (${webhookResponse.statusText}).`;
      console.warn(`Webhook delivery error (${String(payload.source || 'unknown')}): ${error}`);
      return { delivered: false, status: webhookResponse.status, error };
    }

    return {
      delivered: true,
      status: webhookResponse.status,
      replyText: extractWebhookReplyText(rawText),
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unable to reach webhook endpoint.';
    console.warn(`Webhook request failed (${String(payload.source || 'unknown')}):`, error);
    return { delivered: false, status: null, error };
  }
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/contact', async (req, res) => {
    const body = req.body ?? {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const inquiryType = typeof body.inquiryType === 'string' ? body.inquiryType.trim() : 'General Inquiry';
    const company = typeof body.company === 'string' ? body.company.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (name.length < 1 || name.length > 120) {
      res.status(400).json({ error: 'Please provide your name.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 180) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    if (message.length < 1 || message.length > 4000) {
      res.status(400).json({ error: 'Please enter a message before sending.' });
      return;
    }

    const entry: ContactSubmission = {
      id: `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      email,
      inquiryType: inquiryType || 'General Inquiry',
      company,
      message,
      receivedAt: new Date().toISOString(),
    };

    await persistContactSubmission(entry);

    const webhookResult = await forwardToWebhook({
      ...entry,
      source: 'portfolio-contact-form',
    });

    res.status(201).json({
      ok: true,
      submissionId: entry.id,
      receivedAt: entry.receivedAt,
      webhookDelivered: webhookResult.delivered,
      webhookStatus: webhookResult.status,
      webhookError: webhookResult.error,
    });
  });

  app.post('/api/chat', async (req, res) => {
    const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const messages: ChatInputMessage[] = rawMessages
      .filter(
        (m: unknown): m is ChatInputMessage =>
          typeof m === 'object' &&
          m !== null &&
          ((m as ChatInputMessage).role === 'user' || (m as ChatInputMessage).role === 'assistant') &&
          typeof (m as ChatInputMessage).text === 'string' &&
          (m as ChatInputMessage).text.trim().length > 0
      )
      .slice(-16);

    if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
      res.status(400).json({ error: 'Please send a non-empty user message.' });
      return;
    }

    const userQuestion = messages[messages.length - 1].text.trim();
    const chatEventId = `chat_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const askedAt = new Date().toISOString();

    const webhookResult = await forwardToWebhook(
      {
        id: chatEventId,
        source: 'portfolio-chatbot',
        question: userQuestion,
        message: userQuestion,
        chatInput: userQuestion,
        conversationLength: messages.length,
        conversation: messages,
        receivedAt: askedAt,
      },
      30000
    );

    if (!webhookResult.delivered) {
      res.status(webhookResult.status || 502).json({
        error:
          webhookResult.error ||
          'Unable to get a reply from the webhook endpoint.',
      });
      return;
    }

    if (!webhookResult.replyText) {
      res.status(502).json({
        error:
          'Webhook responded with HTTP 200, but no reply text was returned in the response body.',
      });
      return;
    }

    res.json({ reply: webhookResult.replyText });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
