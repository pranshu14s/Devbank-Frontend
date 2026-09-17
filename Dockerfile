# ---------- Stage 1: Build the React app ----------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# This lets CodeBuild pass in the backend's URL at image build time, e.g.:
#   docker build --build-arg REACT_APP_API_URL=http://backend-alb-dns.com -t frontend .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ---------- Stage 2: Serve the build with nginx ----------
FROM nginx:stable-alpine

# Serve React's build output as static files
COPY --from=build /app/build /usr/share/nginx/html

# Custom nginx config so client-side routing (React Router) works if added later
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
