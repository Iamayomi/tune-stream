# Use official Node image
FROM node:18

WORKDIR /app

# Copy only dependency files first to cache install
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build app
RUN yarn build

# Start app
CMD ["node", "dist/main.js"]
