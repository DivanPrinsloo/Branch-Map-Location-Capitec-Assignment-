# ---- Stage 1: Build the Vite React app ----
FROM node:20-alpine as builder

# Create app directory
WORKDIR /app

# Copy package info and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build the production-ready site (files output to /dist)
RUN npm run build



# ---- Stage 2: Serve using a lightweight web server ----
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy Vite build output to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a security-enhanced nginx config (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]