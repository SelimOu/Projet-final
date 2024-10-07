# proto-carbon

This is a prototype for a carbon accounting web application. The application is built with docker and uses a React front-end,a Node.js back-end a SQLite databalse to serve the data. The application is built with the following technologies:

- [docker](https://docs.docker.com/engine/install/) to dockerize the app

- [React](https://reactjs.org/) for the front end

- [Node.js](https://nodejs.org/en/) for the back end

- [SQLite](https://www.sqlite.org/) for the data base

- [fastapi](https://fastapi.tiangolo.com/) for the back end (not plugged in yet)

For confidentiality reasons, the clients documents are not included in this repository. 

## Prerequisites

- [Node.js](https://nodejs.org/en/) works smoothly on my machine with version 20.12.2, might work with other versions.
- [npm](https://www.npmjs.com/) works smoothly on my machine with version 10.5.0, might work with other versions.
- [docker](https://docs.docker.com/engine/install/)  works smoothly on my machine with version 26.1.3, might work with other versions.


## Installation & Usage

```bash
git clone --branch stage git@github.com:471-FR/proto-carbon.git
cd proto-carbon/
``` 

start the server and the client with

```bash
sudo docker-compose up --build
```

go to [http://localhost](http://localhost) in your browser.