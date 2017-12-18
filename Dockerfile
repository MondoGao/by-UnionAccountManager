FROM node:latest as builder

WORKDIR /tmp

COPY . .

ARG PUBLIC_PATH
ARG API_PUBLIC_PATH

ENV PUBLIC_PATH=${PUBLIC_PATH:-/} \
  API_PUBLIC_PATH=${API_PUBLIC_PATH:-http://app/v1.0/}

RUN yarn \
  && yarn build

FROM nginx:latest

COPY --from=builder /tmp/dist/ /usr/share/nginx/html/
