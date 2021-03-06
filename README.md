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
docker run --name postgres-app --network postgres-network -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
docker run -it --rm --network postgres-network postgres /bin/bash
docker run -it --rm --network postgres-network postgres psql -h postgres-app -U postgres
- create db models and migrate database
sequelize model:generate --name User --attributes uuid:string,email:string,password:string
sequelize db:migrate --url 'postgres://postgres:postgres@localhost/models'
- prepare quesries to DB for Product

## HW 7

- start mongoDB container
docker run --name mongo-app --restart=always -d -p 27017:27017 mongo mongod --auth
docker exec -i -t mongo-app /bin/bash
mongo
db.createUser({user:"admin",pwd:"admin",roles:[{role:"root",db:"admin"}]});
use mongodb
db.createCollection('cities');
db.adminCommand({listDatabases:1});
- create crud operation in mongodb for cities entity

## HW 8

- swagger docs
