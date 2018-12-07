FROM node:8

WORKDIR /build
COPY . $PWD
RUN true \
 && npm install --progress=false --loglevel=warn \
 && npm run build $BUILD_ENV \
 && true

FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/
COPY --from=0 /build/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
