# nodeJS-training

## HW 1

- init node application
- create model classes and config

## HW 2

- read directory for new file and emit event
- react on event and read file data async and sync

## HW 3

- create console application with action parameters:
    reverse
    transform
    outputFile
    convertFromFile
    convertToFile
    cssBundle
- work with file streams - implements all above actions

## HW 4

- create simple text, echo and html/json servers:
- create express app structure for future use

## HW 5

- User login with token generation
- Token verification
- User authentication

## HW 6

- create postgres container and start DB
docker network create --driver bridge postgres-network
docker run --name postgres-app --network postgres-network -e POSTGRES_PASSWORD=postgres -d postgres
docker run -it --rm --network postgres-network postgres /bin/bash
docker run -it --rm --network postgres-network postgres psql -h postgres-app -U postgres

