FROM node:20.2-alpine

WORKDIR /app

COPY package.json package-lock.json $PROJECT_ROOTDIR

RUN npm install

COPY . $PROJECT_ROOTDIR

EXPOSE 4000

CMD ["npx", "nodemon", "./index.js"]