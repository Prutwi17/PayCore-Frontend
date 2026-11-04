# PAYCORE FRONTEND — CI/CD & DEVOPS SPECIFICATION

## 1. Automated Pipeline Architecture
The frontend repository uses GitHub Actions for continuous integration, validating TypeScript types, running linters, and building the production SPA bundle.

---

## 2. GitHub Actions Workflow: Frontend Pipeline

File: `.github/workflows/frontend-ci.yml`

```yaml
name: PayCore Frontend CI

on:
  push:
    branches: [ main, 'feature/**' ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-lint:
    name: Lint, Typecheck & Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run TypeScript Type Check
        run: npm run typecheck

      - name: Run Linter
        run: npm run lint

      - name: Build Production Bundle
        run: npm run build
        env:
          VITE_API_BASE_URL: https://api.paycore.internal
```

---

## 3. Production Dockerfile (Multi-Stage with Nginx)

File: `Dockerfile`

```dockerfile
# Stage 1: Build Vite bundle
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx Alpine
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

---

## 4. Nginx SPA Routing Configuration

File: `nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy backend API calls in local/docker environments
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
