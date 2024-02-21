FROM node:18 as build-deps

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i -g pnpm

ENV PATH="/pnpm:$PATH"
ENV PNPM_HOME="/pnpm"

RUN pnpm install

RUN pnpm i -g serve

COPY . .

ARG ARG_VITE_URL_API
ENV VITE_URL_API=$ARG_VITE_URL_API
ARG ARG_VITE_WS_API
ENV VITE_WS_API=$ARG_VITE_WS_API

RUN pnpm build

EXPOSE 80

CMD [ "serve", "-s", "dist/", "-l", "80"]
