# Valore sociale della visualizzazione di open data di Regione Lombardia

Servizio che permette di visualizzare, per un certo insieme di infografiche, la loro qualità percepita, lungo le dimensioni di bellezza, informatività, intuitività e chiarezza, sulla base delle percezioni raccolte in uno studio multi-utente condotto all'interno delle attività di ricerca del progetto "Il Valore Sociale degli Open Data" promosso da Regione Lombardia. Per ulteriori informazioni (anche di natura metodologica) è possibile contattare il coordinatore del progetto, il Dott. Ing. Federico Cabitza (cabitza @ disco.unimib.it)

## Installation
If you want to run your instance of hdil locally on your machine, be sure you have the following requirements installed.

### Requirements

- [git](http://git-scm.com/book/en/Getting-Started-Installing-Git)
- [Bower](http://bower.io/#installing-bower)
- [Node](https://nodejs.org/en/)

### Instructions

Clone hdil from the command line:

``` sh
$ git clone https://github.com/calibro/hdil.git
```

browse to hdil root folder:

``` sh
$ cd hdil
```

install dependencies:

``` sh
$ npm install
```

``` sh
$ bower install
```

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Application structure

The project is developed with a Javascript [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) framework called [AngularJS](https://angularjs.org/) maintained by Google

All the application is contained in the `app/` folder.

* `images/` folder contains all the images used.
* `libs/` folder contains the code of the timeline [reusable chart](https://bost.ocks.org/mike/chart/) used in the evolution view mode.
* `scripts/` folder contains the software logic.
  * `controllers/` folder contains the 2 pages controllers.
    * `explore.js` [loads](https://github.com/calibro/hdil/blob/master/app/scripts/controllers/explore.js#L131) data from the opendata portal and manages interface filters inputs.
    * `home.js` contains title and description.
  * `directives/` folder contains the timeline directive.
    * `evolutionaxis.js` manages the rendering of the year axis in the table header
    * `timeline.js` manages the rendering and the update of the evolution timelines inside the table.
  * `filters/` folder contains the code of some custom data filters used in the `explore` view.
  * `services/` folder contains the software logic.
    * `apiservices.js` manages the AJAX call to the API endpoints
    * `crossfilter.js` manages the Odabes calculation, the data update and filtering see [crossfilter](http://crossfilter.github.io/crossfilter/)
  * `app.js` contains the routing logic and general app configuration.
* `styles/` folder contains the `css` file.
* `views/` folder contains the HTML structure of the 2 main pages: [homepage](http://calib.ro/hdil/#!/home) and [explore](http://calib.ro/hdil/#!/explore).
