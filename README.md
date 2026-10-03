# Date invite

```bash
npm install
npm run dev
```

Edit `data/config.ts` (restaurants, menu highlights). Put photos in `public/restaurants/`.

## Getting her answer

Every answer is logged on the server (Vercel → Logs, search `date-choice`). To get it on your phone, set one or both of these in Vercel → Settings → Environment Variables, then redeploy.

**Telegram (recommended)**

1. In Telegram, message **@BotFather**, send `/newbot`, and follow the steps. Copy the token it gives you → `TELEGRAM_BOT_TOKEN`.
2. Open your new bot and press **Start** (send it any message).
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and find `"chat":{"id":123456789` → `TELEGRAM_CHAT_ID`.

**ntfy (optional backup)**

`NOTIFY_URL=https://ntfy.sh/<some-random-topic>`, then subscribe to that topic in the ntfy app.
