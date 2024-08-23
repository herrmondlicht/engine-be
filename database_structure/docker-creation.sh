#!/bin/bash

processor=$(uname -p)

if [[ $processor == "arm" || $processor == "arm64" ]]; then
   docker network create engine-network
   docker run --platform linux/amd64 -d -p 3307:3306 --name engine-mysql --network engine-network -e MYSQL_ALLOW_EMPTY_PASSWORD=true -v $(pwd)/database_structure/db_structure.sql:/docker-entrypoint-initdb.d/01.sql mysql:5.7

else
   docker network create engine-network
   docker run -d -p 3307:3306 --name engine-mysql  --network engine-network -e MYSQL_ALLOW_EMPTY_PASSWORD=true -v $(pwd)/database_structure/db_structure.sql:/docker-entrypoint-initdb.d/01.sql mysql:5.7
fi