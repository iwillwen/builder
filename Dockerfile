FROM node:6.10.3-alpine
MAINTAINER nighca "nighca@live.cn"

WORKDIR /fec

# install yarn (https://yarnpkg.com/en/docs/install#linux-tab)
RUN apt-get update && apt-get install -y apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

RUN cd /fec

# copy config files & install dependencies
COPY ./package.json ./
COPY ./yarn.lock ./
# RUN yarn config set registry https://registry.npm.taobao.org
RUN yarn install

# expose port
EXPOSE 80

# copy other files
COPY ./lib ./lib
COPY ./preset-configs ./preset-configs
COPY ./cmd.sh ./cmd.sh

# run script
CMD ["/fec/cmd.sh"]
