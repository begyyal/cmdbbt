FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

ARG apts=""
RUN apt-get update
RUN apt-get -y install nodejs npm locales $apts

WORKDIR /cmdbbt
COPY /app .

RUN npm install
RUN npm run build
RUN locale-gen "en_US.UTF-8"
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

ENTRYPOINT nodejs -r source-map-support/register /cmdbbt
