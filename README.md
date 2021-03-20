# Chatcord

Chatcord is an implementation of [Brad Traversy's](https://github.com/bradtraversy) application [Chatcord](https://github.com/bradtraversy/chatcord) with some added features:
1. Authentication.
2. Users can create their own rooms.
3. Messages and rooms are stored.
4. Users can search room messages.
5. Room messages are indexed to make search queries efficient.

## Installation

Use node package manager to install required node modules

```bash
npm i
```

## Key Dependencies

- [Express](https://expressjs.com/)  Express is a minimal and flexible Node.js web application framework.

- [Sequelize](https://sequelize.org/) Sequelize is a promise-based Node.js ORM that we'll use to handle the Postgresql database.

- [Passport](http://www.passportjs.org/) Passport is an authentication middleware for Node.js that we'll use to handle user authentication.

## Database Setup

Use your own database credentials in config/database.js

## Usage

To run the server, execute:

```bash
npm start
```

Or, to run the server in development mode using nodemon, execute:

```bash
npm run dev
```




