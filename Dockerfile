FROM node:16
LABEL author="esio" 
WORKDIR /
# COPY package.json /
# COPY src /src
# COPY .env /.env
# COPY images /images
# COPY tsconfig.json /tsconfig.json
COPY . /
RUN npm install
