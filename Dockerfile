FROM node:18-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN yarn install

FROM node:18-alpine AS builder

WORKDIR /app


COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn run build

FROM node:18-alpine AS runner

WORKDIR /app


ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./


RUN mkdir .next
RUN chown nextjs:nodejs .next


COPY --from=builder  /app/.next/standalone ./
COPY --from=builder  /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]

