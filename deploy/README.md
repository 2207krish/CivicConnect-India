# Free SSL for CivicConnect India (Let's Encrypt)

Hosts and AdSense require HTTPS. This stack uses **Caddy**, which requests a free Let's Encrypt certificate and renews it automatically.

## You need

1. A domain name (for example `civicconnect.example.in`)
2. An A record pointing that domain to your server's public IP
3. Ports **80** and **443** open
4. [Docker](https://docs.docker.com/get-docker/) on the server

Local `http://localhost:3000` cannot use a public Let's Encrypt certificate. Use HTTPS only after the domain points at the host.

## Enable SSL on a VPS

From the repo root:

```bash
cp .env.example .env
```

Edit `.env`:

```
SITE_DOMAIN=your-domain.in
LETSENCRYPT_EMAIL=your.email@gmail.com
```

Keep SMTP settings in `frontend/.env.local`, and set:

```
APP_URL=https://your-domain.in
FORCE_HTTPS=true
```

Then:

```bash
docker compose up -d --build
```

Caddy will:

- Serve HTTP on port 80 (needed for the Let's Encrypt challenge)
- Redirect visitors to HTTPS
- Store the certificate in the `caddy-data` volume
- Renew the certificate before it expires

Visit `https://your-domain.in`. The browser should show a valid Let's Encrypt certificate.

## Easier option: Vercel

Import https://github.com/2207krish/CivicConnect-India on [Vercel](https://vercel.com). Set the Root Directory to `frontend`, add your domain, and Vercel issues a free SSL certificate automatically. Set `APP_URL` to `https://your-domain`.
