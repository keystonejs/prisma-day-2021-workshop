# Install dependencies only when needed
FROM docker.io/library/node:14.18.1-bullseye AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./ ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM docker.io/library/node:14.18.1-bullseye AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn site:build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM docker.io/library/node:14.18.1-bullseye AS runner


ENV NODE_ENV production
RUN apt-get update -y
RUN apt-get install dumb-init -y
RUN groupadd --gid 1001 nextjs
RUN useradd --uid 1001 --gid 1001 nextjs

WORKDIR /home/nextjs
# You only need to copy next.config.js if you are NOT using the default configuration
#COPY --from=builder /app/next.config.js ./
#COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/ ./
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 8000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

HEALTHCHECK CMD ls -alt

CMD ["/usr/bin/dumb-init", "--rewrite", "2:3", "--", "yarn", "site:start"]
