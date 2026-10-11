# Stage 1: Build the Vite React application from web-iqooistant
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions from web-iqooistant
COPY web-iqooistant/package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy only web-iqooistant source files (ignoring other apps in repo)
COPY web-iqooistant/ ./

# Accept API key as build argument (or from environment)
ARG VITE_OPENROUTER_API_KEY
ENV VITE_OPENROUTER_API_KEY=$VITE_OPENROUTER_API_KEY

# Build production bundle into /app/dist
RUN npm run build

# Stage 2: Ultra-lightweight Nginx to serve only the web assistant
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration optimized for Cloud Run
COPY web-iqooistant/nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose Cloud Run default port
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
