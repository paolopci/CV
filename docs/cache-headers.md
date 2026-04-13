# Cache headers per produzione

## GitHub Pages

GitHub Pages non applica file `.htaccess` e non consente di configurare header HTTP custom dal repository. Per questo progetto la strategia primaria e il cache busting sugli asset generati dal build:

- `dist/css/index.min.css?v=<hash>`
- `dist/js/app.min.js?v=<hash>`

Quando cambia il contenuto minificato, `npm run build` aggiorna il valore hash nella query string di `dist/index.html`.

## Apache

Se il sito viene pubblicato su Apache, usare una policy simile in `.htaccess`:

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/pdf "access plus 30 days"
    ExpiresByType text/html "access plus 5 minutes"
</IfModule>

<IfModule mod_headers.c>
    <FilesMatch "\.(css|js|webp|png|jpg|jpeg|svg|ico)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    <FilesMatch "\.(html|json)$">
        Header set Cache-Control "public, max-age=300, must-revalidate"
    </FilesMatch>
</IfModule>
```

## Netlify o Cloudflare Pages

Per hosting statici che supportano un file `_headers`, usare una base simile:

```text
/*
  Cache-Control: public, max-age=300, must-revalidate

/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/*.pdf
  Cache-Control: public, max-age=2592000
```

Aggiornare questi esempi solo se cambia la strategia di deploy o se gli asset smettono di usare cache busting/fingerprint.
