FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml tsconfig.json .env ./

# Install pnpm globally in the container
RUN npm install -g pnpm@latest

# Install application dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of your application code to the container
COPY ./src  ./src
COPY ./tokens ./tokens

RUN pnpm build

# Define the command to run your application
CMD ["pnpm", "start"]