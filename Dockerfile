FROM node:8

WORKDIR /build
COPY . $PWD
RUN true \
 && npm install --progress=false --loglevel=warn \
 && npm run build config/default.env.js \
 && true

FROM nginx:latest
COPY default.conf /etc/nginx/conf.d/
COPY --from=0 /build/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
