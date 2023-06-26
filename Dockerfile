FROM node:20.2-alpine

WORKDIR /app

# COPY package.json package-lock.json tsconfig.json $PROJECT_ROOTDIR

# RUN npm install

COPY . $PROJECT_ROOTDIR

EXPOSE 4000