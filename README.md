# Twilio Sender

Standalone SMS & WhatsApp campaign sender using Twilio Messaging Templates.  
No database, no framework — just Node.js + a browser.

---

## Features

- Send **SMS** and **WhatsApp** messages via Twilio Content Templates
- **Multi-language** templates: 🇫🇷 French · 🇬🇧 English · 🇸🇦 Arabic ...
- **Paste any text** — phone numbers are extracted automatically
- **Template variables** (`{{1}}`, `{{2}}`…) with `[phone]` substitution
- Live preview before sending
- Real-time send log with per-number status

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure credentials

Edit the `.env` file at the root of the project:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_FROM=+1XXXXXXXXXX
PORT=3333
```

| Variable             | Where to find it                                            |
| -------------------- | ----------------------------------------------------------- |
| `TWILIO_ACCOUNT_SID` | [Twilio Console](https://console.twilio.com) → Account Info |
| `TWILIO_AUTH_TOKEN`  | Twilio Console → Account Info                               |
| `TWILIO_FROM`        | Your Twilio phone number (e.g. `+1....`)                    |
| `PORT`               | Port for the local server (default: `3333`)                 |

### 3. Start the server

```bash
npm start
```

Then open your browser at:

```
http://localhost:3333
```

> For auto-reload during development: `npm run dev` (uses nodemon)

---

## Templates

The three Twilio Content Templates are pre-configured in `public/index.html`:

| Language   | Template name | SID |
| ---------- | ------------- | --- |
| 🇫🇷 French  | ``            | ``  |
| 🇬🇧 English | ``            | ``  |
| 🇸🇦 Arabic  | ``            | ``  |

To add or change templates, edit the `TEMPLATES` object in `public/index.html`.

---

## How to send

1. **Choose the channel** — SMS or WhatsApp
2. **Select the language** — FR / EN / AR
3. **Paste your contact list** — any format, phone numbers are extracted automatically
4. **Set template variables** — map `{{1}}`, `{{2}}`… to values (use `[phone]` to insert the recipient's number)
5. **Click Send** — messages are sent one by one with a 500 ms delay

---

## API

The server exposes two endpoints (used by the frontend):

| Method | Path        | Description                          |
| ------ | ----------- | ------------------------------------ |
| `POST` | `/api/send` | Send one message                     |
| `GET`  | `/api/from` | Returns the configured sender number |

### POST `/api/send` — body

```json
{
  "to": "+1...",
  "channel": "whatsapp",
  "templateSid": "",
  "contentVariables": {
    "1": "Jean Dupont",
    "2": "Paris"
  }
}
```

### Response

```json
{ "success": true, "sid": "SMxxxxxxxx", "status": "queued" }
```

---

## Project structure

```
partage/
├── .env              ← credentials (never commit this)
├── package.json
├── server.js         ← Express server + Twilio API calls
└── public/
    └── index.html    ← full UI (vanilla JS, no build step)
```

---

## Notes

- WhatsApp messages require the recipient to have opted in, or the conversation to be within a 24-hour window.
- For WhatsApp, `To` and `From` are automatically prefixed with `whatsapp:` by the server.
- The `.env` file contains sensitive credentials — do not commit it to version control.
