
# Production image, copy all the files and run next
FROM docker.io/library/node:14.18.1-bullseye AS runner


#ENV NODE_ENV production
RUN apt-get update -y
RUN apt-get install dumb-init -y

RUN groupadd --gid 1001 keystonejs \
&& useradd --uid 1001 --gid 1001 keystonejs

WORKDIR /home/keystonejs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
#COPY --from=builder /app/ ./
COPY  --chown=keystonejs:keystonejs ./ ./
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/package.json ./package.json

USER keystonejs

RUN yarn

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

HEALTHCHECK CMD ls -alt

CMD ["/usr/bin/dumb-init", "--rewrite", "2:3", "--", "yarn", "launch"]
