from node:12-slim
WORKDIR /usr
COPY ["./package.json", "./package-lock.json", "./"]
RUN npm install --production
COPY ["./", "./"]

CMD [ "npm", "start" ]