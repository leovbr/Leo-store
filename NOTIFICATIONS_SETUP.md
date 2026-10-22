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
