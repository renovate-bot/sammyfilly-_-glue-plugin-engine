import { addTrailingSlash } from "./add-trailing-slash";

export const startsWith = `
events {
  worker_connections 1024;
}

http {
  client_max_body_size 100M;
  sendfile on;`;

export const endsWith = `
}`;

export const setServer = (domain: string, locations: string[]): string => `
  server {
    listen 80;
    server_name ${domain};
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl;

    server_name ${domain};

    ssl_certificate     /etc/ssl/fullchain.pem;
    ssl_certificate_key /etc/ssl/privkey.pem;

    ssl_session_cache  builtin:1000  shared:SSL:10m;
    ssl_protocols  TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;
    ssl_prefer_server_ciphers on;

    gzip on;
    gzip_disable "msie6";

    gzip_comp_level 6;
    gzip_min_length 1100;
    gzip_buffers 16 8k;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml;
    ${locations.join('\n')}
  }
`;

export const createRewriteRule = (
  path: string, proxy_path: string
): string => {
  if (!path.startsWith('/backend')) {
    return `rewrite ^${addTrailingSlash(path)}(.*) ${addTrailingSlash(proxy_path)}$1 break;`
  }

  return '';
};

export const setLocation = (
  path: string,
  proxy_instance: string,
  proxy_path: string,
  host?: string,
  size_in_mb?: number,
): string => `
    location ${path} {
      ${createRewriteRule(path, proxy_path)}

      client_max_body_size ${size_in_mb || 1}M;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_cache_bypass $http_upgrade;

      proxy_set_header Host ${host || "$host"};
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      proxy_pass http://${proxy_instance};
    }`;
