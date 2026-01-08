FROM node:lts-buster
RUN git clone https://github.com/I-N-R-L/react /beta
WORKDIR /beta
RUN npm run build
