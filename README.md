## Quick Start

```bash
# create the .env
touch .env

# copy the env vars from example
cat .env.example > .env
```

Fill out the `.env` requirements. Ensure that PostgreSQL version 14.3 is installed and launch the database service.

```bash
# install all the dependencies
yarn install

# run all the necessary migrations
yarn db:migrate

# run the server in development mode
yarn start:dev
```

The server should start on the port of your choice or by default on `http://localhost:3000`
