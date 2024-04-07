FROM node:lts

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally in the container
RUN npm install -g pnpm@latest

# Install application dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of your application code to the container
COPY . .

RUN pnpm build

# Define the command to run your application
CMD ["node", "."]