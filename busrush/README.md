## How to Run

#### To create the jar run

mvn clean install -Dmaven.test.skip=true

#### Inside this directory, you need to run the following commands to download the data regarding portuguese maps

chmod +x init_osrm.sh && ./init_osrm.sh

#### Then to initialize the container

docker compose up

#### This will initialize all the images to run the API
