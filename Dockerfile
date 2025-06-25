FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml .
RUN pnpm install

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules/
COPY . .
RUN pnpm build

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD ["pnpm", "start"]
