"use strict";
exports.__esModule = true;
exports.setLocation = exports.createRewriteRule = exports.setServer = exports.endsWith = exports.startsWith = void 0;
var add_trailing_slash_1 = require("./add-trailing-slash");
exports.startsWith = "\nevents {\n  worker_connections 1024;\n}\n\nhttp {\n  client_max_body_size 100M;\n  sendfile on;";
exports.endsWith = "\n}";
var setServer = function (domain, locations) { return "\n  server {\n    listen 80;\n    server_name ".concat(domain, ";\n    return 301 https://$host$request_uri;\n  }\n\n  server {\n    listen 443 ssl;\n\n    server_name ").concat(domain, ";\n\n    ssl_certificate     /etc/ssl/fullchain.pem;\n    ssl_certificate_key /etc/ssl/privkey.pem;\n\n    ssl_session_cache  builtin:1000  shared:SSL:10m;\n    ssl_protocols  TLSv1 TLSv1.1 TLSv1.2;\n    ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;\n    ssl_prefer_server_ciphers on;\n\n    gzip on;\n    gzip_disable \"msie6\";\n\n    gzip_comp_level 6;\n    gzip_min_length 1100;\n    gzip_buffers 16 8k;\n    gzip_proxied any;\n    gzip_types\n        text/plain\n        text/css\n        text/js\n        text/xml\n        text/javascript\n        application/javascript\n        application/json\n        application/xml\n        application/rss+xml\n        image/svg+xml;\n    ").concat(locations.join('\n'), "\n  }\n"); };
exports.setServer = setServer;
var createRewriteRule = function (path, proxy_path) {
    if (!path.startsWith('/backend')) {
        return "rewrite ^".concat((0, add_trailing_slash_1.addTrailingSlash)(path), "(.*) ").concat((0, add_trailing_slash_1.addTrailingSlash)(proxy_path), "$1 break;");
    }
    return '';
};
exports.createRewriteRule = createRewriteRule;
var setLocation = function (path, proxy_instance, proxy_path, host, size_in_mb) { return "\n    location ".concat(path, " {\n      ").concat((0, exports.createRewriteRule)(path, proxy_path), "\n\n      client_max_body_size ").concat(size_in_mb || 1, "M;\n\n      proxy_http_version 1.1;\n      proxy_set_header Upgrade $http_upgrade;\n      proxy_set_header Connection \"upgrade\";\n      proxy_cache_bypass $http_upgrade;\n\n      proxy_set_header Host ").concat(host || "$host", ";\n      proxy_set_header X-Real-IP $remote_addr;\n      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_set_header X-Forwarded-Proto $scheme;\n\n      proxy_pass http://").concat(proxy_instance, ";\n    }"); };
exports.setLocation = setLocation;
//# sourceMappingURL=nginx-literals.js.map