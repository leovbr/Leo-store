# LEOOSTORE notification setup

## Email notifications (Resend)

The Worker sends:
- An order-created email to the admin when a Midtrans checkout is successfully created.
- A payment-success email to the admin and customer after a valid Midtrans webhook confirms settlement/capture.
- Webhook retries do not intentionally resend an already recorded event; delivery attempts and failures are recorded in D1 `email_notifications`.

Set these secrets/variables for the existing Cloudflare Worker `spring-surf-a6a7`:

```sh
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_FROM_EMAIL
npx wrangler secret put ADMIN_EMAIL
```

- `RESEND_API_KEY`: API key from Resend.
- `RESEND_FROM_EMAIL`: a sender address/domain verified in Resend.
- `ADMIN_EMAIL`: admin inbox. Use the existing LEOOSTORE admin email.

Then deploy the Worker from the repository root with `npm run deploy`. Never put the Resend API key in browser JavaScript or commit it to GitHub. If Resend settings are missing, order/payment processing still proceeds and the Worker logs that the email was skipped/failed.

The Worker creates `email_notifications` at runtime as well; `worker/schema.sql` also includes its schema for new database setup.

## Chat notifications

The existing live chat remains Supabase Realtime-based and should not be replaced. The admin page already supports browser notifications while the admin inbox is open. This is **not yet Web Push**: notifications delivered when the browser/page is closed require a service worker, push subscriptions, VAPID credentials, and a sender endpoint. Do not treat browser notifications as proof that background push is configured.


## Web Push (browser closed)

The repository now contains a service worker, opt-in button, D1 subscription storage, and Worker endpoints. Background push works only after the Cloudflare configuration below is complete and the Worker is deployed. Browsers/devices must support Web Push; on iOS, the site generally needs to be installed to the Home Screen before push is available.

### 1. Configure VAPID in Cloudflare

Generate a VAPID key pair on a trusted computer with Node.js and the repository dependency installed:

```sh
npm install
npx web-push generate-vapid-keys
```

In **Workers & Pages → spring-surf-a6a7 → Settings → Variables and Secrets**, set:
- Variable `VAPID_PUBLIC_KEY`: the generated public key.
- Secret `VAPID_PRIVATE_KEY`: the generated private key.
- Variable `VAPID_SUBJECT`: a contact URI, e.g. `mailto:admin@your-verified-domain.example` (replace with a real address).
- Secret `PUSH_EVENT_TOKEN`: a long random token used only by trusted Supabase database webhooks.

Do not commit the private key or event token. Keep the public key and private key from the same key pair. The Worker uses D1 binding `DB` to store subscriptions. The code creates the subscription table on first use; `worker/push-schema.sql` is also provided for reference.

### 2. Deploy

From the repository root, run `npm install` and `npm run deploy`. Confirm `https://spring-surf-a6a7.leovbriansyh791.workers.dev/api/push/public-key` returns `ok: true` and a public key. If the Worker URL changes, update `WORKER_URL` in `js/push-notifications.js`.

### 3. Subscribe a device

Open `https://leovbr.github.io/Leo-store/` on the target device and tap **Aktifkan Notifikasi**. Grant permission. Use the same checkout email when asked if you want that device to receive its own payment-success push. Keep the page open during initial opt-in; after subscription, push can arrive while the page is closed.

### 4. Transaction event

On a verified Midtrans webhook, the Worker attempts to notify subscriptions whose saved customer key matches the order's checkout email. This requires the customer to opt in and use that email when prompted. Existing payment/email processing is preserved.

### 5. Chat and promo event hooks

The Worker exposes `POST /api/push/event` for trusted server-side event sources only. It requires `Authorization: Bearer <PUSH_EVENT_TOKEN>`; never call this endpoint from public browser JavaScript and never expose the token.

Configure Supabase Database Webhooks (or an equivalent trusted server-side function) to call the Worker with that Authorization header:
- Chat: `store_chat_messages` on INSERT, using a generic event body such as `{"type":"chat","body":"Ada pesan chat baru di LEOOSTORE."}`.
- Promo: `store_promos` on INSERT/UPDATE when a promo is published, using `{"type":"promo","body":"Ada promo baru di LEOOSTORE."}`.

Webhook payload templates depend on the Supabase dashboard's webhook feature. The request must send the JSON above and the Authorization header. Avoid sending message contents or customer personal data in push payloads. These hooks must be configured in Supabase before chat/promo push is active.
