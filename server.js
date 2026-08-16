import 'dotenv/config';
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import twilio from 'twilio';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app       = express();
const client    = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// GET /api/config  — sends all non-secret config to the UI
app.get('/api/config', (_req, res) => {
  res.json({
    from: process.env.TWILIO_FROM || '',
    templates: {
      fr: {
        flag:  '🇫🇷',
        label: 'Français',
        name:  process.env.TEMPLATE_NAME_FR || '',
        sid:   process.env.TEMPLATE_SID_FR  || '',
      },
      en: {
        flag:  '🇬🇧',
        label: 'English',
        name:  process.env.TEMPLATE_NAME_EN || '',
        sid:   process.env.TEMPLATE_SID_EN  || '',
      },
      ar: {
        flag:  '🇸🇦',
        label: 'العربية',
        name:  process.env.TEMPLATE_NAME_AR || '',
        sid:   process.env.TEMPLATE_SID_AR  || '',
        rtl:   true,
      },
    },
  });
});

// POST /api/send  — send one message via Twilio
app.post('/api/send', async (req, res) => {
  const { to, channel = 'sms', templateSid, contentVariables = {} } = req.body;

  if (!to || !templateSid)
    return res.status(400).json({ error: 'to and templateSid are required' });

  const prefix = channel === 'whatsapp' ? 'whatsapp:' : '';

  try {
    const msg = await client.messages.create({
      to:               `${prefix}${to}`,
      from:             `${prefix}${process.env.TWILIO_FROM}`,
      contentSid:       templateSid,
      contentVariables: JSON.stringify(contentVariables),
    });
    res.json({ success: true, sid: msg.sid, status: msg.status });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () =>
  console.log(`\n  Twilio Sender  →  http://localhost:${PORT}\n`)
);
