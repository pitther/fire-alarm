FROM node:alpine
WORKDIR /app
COPY /fire-alarm/package.json ./
COPY /fire-alarm/package-lock.json ./
COPY ./fire-alarm/ ./
RUN npm i
CMD ["npm", "run", "start"]