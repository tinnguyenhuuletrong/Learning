FROM python:3.9.16

WORKDIR /app

COPY requirements.txt requirements.txt
RUN python -m pip install --upgrade pip
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "sh", "docker_run.sh" ]
