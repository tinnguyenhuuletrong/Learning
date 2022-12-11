from node:16

RUN apt update && apt install -y python3 python3-dev libblas-dev liblapack-dev libatlas-base-dev gfortran
RUN apt-get install python3-pip -y
RUN pip3 install -U scikit-learn scipy matplotlib

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .