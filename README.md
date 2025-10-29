# Cloudflare R2 Image Uploads

## Required Environment Variables

Add the following keys to your `.env` (and bindings when deploying to Cloudflare):

```bash
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_PUBLIC_BASE_URL=https://<r2-public-domain>/<optional-prefix>
```

`R2_PUBLIC_BASE_URL` should point to the public HTTP endpoint you expose for reading uploaded media (for example, via an R2 public bucket or Cloudflare Images).

## Bucket Configuration Checklist

1. Create an API token with **Object Read & Write** permissions for the target bucket.
2. Apply a CORS policy that allows the app’s origin to `PUT` and `GET` objects. A minimal policy looks like:

```json
[
  {
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": ["https://your-app-domain.com"],
    "AllowedHeaders": ["content-type"],
    "ExposeHeaders": ["etag"],
    "MaxAgeSeconds": 3600
  }
]
```

3. Enable public access (or a Cloudflare Worker proxy) so `R2_PUBLIC_BASE_URL` serves uploaded files.
4. Bind the same values in your Cloudflare Worker/Pages project (`wrangler.toml` or dashboard bindings) so server-side signing can pull credentials.

## Local Development

1. Install dependencies (includes AWS SDK presigner helpers):

   ```bash
   npm install
   ```

2. Run the app with `npm run dev` and ensure the `.env` variables above are present.
