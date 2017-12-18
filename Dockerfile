FROM node:latest as builder

WORKDIR /tmp

COPY . .

RUN yarn \
  && yarn build

FROM nginx:latest

COPY --from=builder /tmp/dist/ /usr/share/nginx/html/
