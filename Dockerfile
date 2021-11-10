FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get -y install nodejs npm

WORKDIR /cmdbbt
COPY /app .

RUN npm install
RUN npm run build

ENTRYPOINT [ "nodejs", "/cmdbbt" ]
