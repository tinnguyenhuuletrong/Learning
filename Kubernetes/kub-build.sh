export PROJECT_ID="$(gcloud config get-value project -q)"
docker build -t gcr.io/${PROJECT_ID}/hello-app .

gcloud docker -- push gcr.io/${PROJECT_ID}/hello-app

export IMAGE_DIGETS="$(docker inspect --format='{{index .RepoDigests 0}}' gcr.io/${PROJECT_ID}/hello-app)"

kubectl set image deployment/node-example-deployment node-example=${IMAGE_DIGETS}