Backend
=======

Prerequisites
-------------

#### Node

Requires [NodeJS](https://nodejs.org/en/) and
[Yarn](https://classic.yarnpkg.com/).

Install dependencies by invoking:

```bash
yarn
```

(this project is based on the [TypeScript Node
Starter](https://github.com/Microsoft/TypeScript-Node-Starter))

#### Database

The backend connects to a MongoDB database. You can either [install it
locally](https://github.com/Microsoft/TypeScript-Node-Starter#getting-started),
and start it using something like `mongod --dbpath $PWD/data --bind_ip_all`,
or if you have docker installed, you can start it in a container by invoking:

```bash
docker-compose up -d
```

Testing
-------

Make sure that the database is up:

```bash
docker-compose up -d
```

Then invoke:

```bash
yarn test
```

Running
-------

First build the server:

```bash
yarn build
```

Ensure that the database is up:

```bash
docker-compose up -d
```

Start the server:

```bash
yarn start
```

Or run it in debug mode:

```bash
yarn debug
```

API
---

Exposes two REST endpoints:

`GET /infected-randoms`: returns a JSON object containing a list of randoms that
are known to be infected. Example:

```json
{
  "randoms": [
    "<random1>",
    "<random2>",
    "<random3>"
  ]
}
```

`POST /infected-randoms/submit`: submits new infected randoms. Body should
contain a JSON array of randoms. Example:

```json
[
  "<random1>",
  "<random2>",
  "<random3>"
]
```
