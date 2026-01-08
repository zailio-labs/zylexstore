FROM node:lts-buster
RUN git clone https://github.com/zailio-labd/zylexstore /beta
WORKDIR /beta
RUN npm run build
