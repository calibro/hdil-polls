# Valore sociale della visualizzazione di open data di Regione Lombardia

Servizio che permette di visualizzare, per un certo insieme di infografiche, la loro qualità percepita, lungo le dimensioni di bellezza, informatività, intuitività e chiarezza, sulla base delle percezioni raccolte in uno studio multi-utente condotto all'interno delle attività di ricerca del progetto "Il Valore Sociale degli Open Data" promosso da Regione Lombardia. Per ulteriori informazioni (anche di natura metodologica) è possibile contattare il coordinatore del progetto, il Dott. Ing. Federico Cabitza (cabitza@disco.unimib.it)

## Installation
If you want to run your instance of hdil-polls locally on your machine, be sure you have the following requirements installed.

### Requirements

- [git](http://git-scm.com/book/en/Getting-Started-Installing-Git)
- [Bower](http://bower.io/#installing-bower)
- [Node](https://nodejs.org/en/)

### Instructions

Clone hdil-polls from the command line:

``` sh
$ git clone https://github.com/calibro/hdil-polls.git
```

browse to hdil-polls root folder:

``` sh
$ cd hdil-polls
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
* `libs/` folder contains the code of the matrix and the violin plot [reusable chart](https://bost.ocks.org/mike/chart/) used in the visualizations.
* `scripts/` folder contains the software logic.
  * `controllers/` folder contains the 2 pages controllers.
    * `explore.js` [loads](https://github.com/calibro/hdil-polls/blob/master/app/scripts/controllers/explore.js#L197) data from the Google spreadsheet and manages interface filters inputs.
    * `home.js` contains title and description.
  * `directives/` folder contains the timeline directive.
    * `matrix.js` manages the rendering and the update of the matrix visualization and R2 coefficient
    * `violinplot.js` manages the rendering and the update of the violin plot.
  * `services/` folder contains the software logic.
    * `apiservices.js` manages the AJAX call to the Google spreadsheet API endpoints
    * `crossfilter.js` manages all the calculation, the data update and filtering see [crossfilter](http://crossfilter.github.io/crossfilter/)
  * `app.js` contains the routing logic and general app configuration.
* `styles/` folder contains the `css` file.
* `views/` folder contains the HTML structure of the 2 main pages: [homepage](http://calib.ro/hdil-polls/#!/home) and [explore](http://calib.ro/hdil-polls/#!/explore).

## Google spreadsheet Instructions

The spreadsheet contains 2 sheets:
* `DATA` contains the data coming from the polls.
* `VIZ` contains the information of the visualizations.

The `headers` of both sheets **MUST NOT** be changed.
