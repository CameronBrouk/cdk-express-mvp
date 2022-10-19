# Stage 1
FROM node:16.17.0-alpine as stage_one

# Cache or Install node_modules
COPY package*json ./
RUN npm ci

# Copy required folders
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

# Build Application using dev dependencies
RUN npm run build

#  ======================================================
# Stage 2
FROM node:16.17.0-alpine

# Set node_env to production. https://www.dynatrace.com/news/blog/the-drastic-effects-of-omitting-node-env-in-your-express-js-applications/
ENV NODE_ENV="production"
ENV PORT="80"

# Set workdir because it makes debugging easier
WORKDIR /server

# Cache and Install non-dev dependencies from stage_1
COPY --from=stage_one package*.json ./
RUN npm ci

# Grab dist folder from stage_1
COPY --from=stage_one dist ./dist
# Grab scripts folder from stage_1
COPY --from=stage_one scripts ./scripts

CMD ["npm", "start"]
