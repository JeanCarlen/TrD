#!/bin/bash

if [ -z "$1" ]
  then
	echo "usage: ./deploy.sh <branch>"
	exit 1
fi

BRANCH=$1
REPO="git@github.com:JeanCarlen/TrD.git"

# Create a temporary directory to store the files
TMP_DIR="/tmp/deploy-$(date +%s)"
mkdir -p $TMP_DIR
cd $TMP_DIR

# Start by cloning the branch from Github
git clone -b $BRANCH $REPO --depth 1 TrD

# Remove all docker thingys
docker ps -aq | xargs docker stop | xargs docker rm
docker images -aq | xargs docker image rm

cd TrD/
mkdir -p data/db
mkdir -p data/frontend
mkdir -p data/certs
mkdir -p data/images
cp /env/back.env backend/.env
find ./ -type f -exec sed -i -e 's|http://localhost:8080|https://trd.laendrun.ch|g' {} \;
find ./ -type f -exec sed -i -e 's|http://localhost:3001|https://trd.laendrun.ch:3001|g' {} \;
docker compose up -d --build

# Laucnh script to add certificates inside nginx container
docker exec trd-nginx-1 /etc/cert.sh