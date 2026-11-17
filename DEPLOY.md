# Putting the site online (test site for the client)

The website and dashboard run on **Vercel**. The database and photos stay on **Neon**
(already set up). Vercel publishes the `main` branch from GitHub: every push to `main`
updates the site automatically.

```
Visitor / client ──► Vercel (website + dashboard) ──► Neon Postgres  (database)
                                                  └─► Neon Storage   (photos, bucket "site-media")
```

---

## 1. Create the Vercel project (once)

1. Go to <https://vercel.com> and sign up **with your GitHub account**.
2. **Add New… → Project** → import the repo `SadouMhamed/ensp`.
3. Framework: **Next.js** (detected automatically). Leave the build settings as they are.
4. Before clicking Deploy, open **Environment Variables** and add the list below.
5. Click **Deploy**. After 1–3 minutes you get an address like `https://ensp-xxxx.vercel.app`.

> Plan: the free "Hobby" plan is for personal, non-commercial projects.
> For a client project, Vercel's "Pro" plan is the correct one.

## 2. Environment variables

Copy the values from your local `.env` unless the table says otherwise.
Never put these values in GitHub, in chat or in an email.

| Name | Value |
|---|---|
| `DATABASE_URL` | Same as `.env` (Neon, **pooled**) |
| `DATABASE_URL_UNPOOLED` | Same as `.env` (Neon, direct) |
| `AWS_ACCESS_KEY_ID` | Same as `.env` (Neon Storage) |
| `AWS_SECRET_ACCESS_KEY` | Same as `.env` |
| `AWS_ENDPOINT_URL_S3` | Same as `.env` |
| `AWS_REGION` | Same as `.env` |
| `BETTER_AUTH_SECRET` | **A new one**: run `openssl rand -base64 32` and paste the result |
| `BETTER_AUTH_URL` | The site's address, e.g. `https://ensp-xxxx.vercel.app` (no `/` at the end) |
| `NEXT_PUBLIC_APP_URL` | Same address as `BETTER_AUTH_URL` |

Not needed on Vercel: `SEED_ADMIN_*`, `R2_*` (old storage), `NEON_BRANCH*`, `NEON_FUNCTION_HOST_SUFFIX`.
Do **not** add `ALLOW_INDEXING` yet (see step 5).

**First deploy trick:** you only know the exact address after the first deploy.
Deploy once, copy the address, update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`,
then **Deployments → ⋯ → Redeploy**. Changing a variable always needs a redeploy.

## 3. Check it works

- Open the address: the home page shows with its photos.
- Open `/login` and sign in with your admin account.
- Dashboard → Media: upload a test photo, then delete it.

Login only works on the address written in `BETTER_AUTH_URL`.
The extra "preview" links Vercel creates for each push won't accept logins: that's expected.

## 4. Give the client access

Dashboard → **Users → Add user**: create their account (Admin, or Editor with the
right permissions), then send them the link and their login **separately**
(for example, the link by email and the password by phone).

## 5. Later: the real launch

1. Vercel → Settings → **Domains**: add the client's domain (e.g. `www.ensp.dz`) and
   follow the DNS instructions.
2. Change `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the real domain.
3. Add `ALLOW_INDEXING` = `true` so Google can list the site.
4. Redeploy.

Until step 3, every page carries a `noindex` tag and `robots.txt` blocks all search
engines, so the test site stays out of search results.

---

## Important: shared data

Your computer (`npm run dev`) and the online site use the **same Neon branch** (`production`).
Anything you change locally also changes what the client sees.
Once the client starts testing, create a separate Neon branch for your own work
(e.g. `dev`) and point your local `.env` at it.

Database changes (new tables or columns): run `npm run db:migrate` against the
`production` branch **before** pushing code that needs them.
