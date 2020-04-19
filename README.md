# engine-be
Backend for Engine project

This project is a personal one, designed to solve a specific problem for a friend :)
Feel free to do whatever you need with it!

### starting the project on dev mode
Make sure you have the dependencies installed: 
- `docker`
- `mysql-client`
- `node & npm`

#### creating the database:
run `npm run start-db`
The command above will create a docker container running a mysql server with the overall structure of the database

run the migrations with `npm run seed-db`

#### running the project
To run the project, copy and paste the `.env.example` to `.env` and replace the values:
```
PORT=4040
SECRET=somesecret
USERNAME=admin
PASSWORD=abcd
DB_USER=root
DB_PASSWORD=
```
then run `npm run start-dev`

If you're using the development mysql docker, you can leave the db password empty.
This service doesn't have a proper authentication yet, so to authenticate the 1 user, we have the username and password env variables for now. When needed we can expand that and store the user and password on its own table.
