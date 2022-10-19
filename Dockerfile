FROM node:16.17.0-alpine

# Cache or Install node_modules
ENV NODE_ENV="production"
ENV PORT="80"

COPY package*json ./
RUN npm ci

COPY injectBashEnvironment.js ./injectBashEnvironment.js
COPY src ./src

CMD ["npm", "start"]
