# frontend/Dockerfile

# --- Stage 1: Build the React App ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production-ready static files
# VITE_API_BASE_URL will be configured in Azure, not here.
RUN npm run build


# --- Stage 2: Serve the static files with Nginx ---
FROM nginx:1.25-alpine

# Copy the built files from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html
~
# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]