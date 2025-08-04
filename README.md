# CoachTracker

CoachTracker est une app de mise en relation entre des coachSs et des sportifs. L'applicattion est construiteavec docker et utilise React pour le front-end, Laravel pour le back-end, et MySQL et PHPMyADMIN pour la base de donnée, l'application est contruite avec les technologies suivantes : 

- [docker](https://docs.docker.com/engine/install/) Pour conteuneuriser l'app

- [React](https://reactjs.org/) Pour le front end

- [Laravel](https://laravel.com/docs/11.x/installation) pour le back end

- [MySQL](https://dev.mysql.com/downloads/installer/) pour la base de donnée

- [PHPMyAdmin](https://docs.phpmyadmin.net/fr/latest/setup.html) pour visualiser la base de donnée

## Prerequisites


- [docker](https://docs.docker.com/engine/install/)  


## Installation & Usage

```bash
git clone git@github.com:SelimOu/Projet-final.git
cd projet-final/
``` 

start the server and the client with

```bash
sudo docker-compose up --build
```

go to [http://localhost:3000/](http://localhost:3000/) dans votre navigateur pour le frontend.
go to [http://localhost:9200/](http://localhost:9200/) dans votre navigateur pour le backend.
go to [http://localhost:8081/](http://localhost:8081/) dans votre navigateur pour la base de donnée.  