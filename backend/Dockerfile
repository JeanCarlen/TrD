FROM node:20-alpine

WORKDIR /app

RUN mkdir -p /uploads
COPY ./default.png ./uploads/default.png

#Entry Point
COPY ./package.json ./

COPY . .

#Rebuild bcrypt After bpm insatll
RUN apk add --no-cache make gcc g++ python3 && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python3

EXPOSE 3001  

CMD ["npm","start"]