FROM node:22.14.0
WORKDIR /ZYLEXSERVER
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
