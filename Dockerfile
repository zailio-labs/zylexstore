FROM node:lts-buster
RUN git clone https://github.com/zailio-labs/zylexstore /beta
WORKDIR /beta
RUN npm run build
