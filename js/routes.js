/*
  Configure routes used with ngRoute. We chose not to use $locationProvider.html5Mode(true);
  because using HTML5 pushstate requires that server routes are setup to mirror the routes
  in this file. Since this isn't a node course we're going to skip it. For all intensive
  purposes, html5 mode and url hash mode perform the same when within an angular app.
*/
angular.module('MyBank').config(['$routeProvider', function($routeProvider) {
  $routeProvider
    // .when('/', {
    //   // redirect to the notes index
    //   //redirectTo: '/index.html'
    //   //templateUrl: 'index.html',
    // })
    
    .when('/', {
      templateUrl: 'templates/pages/index.html',
      controller: 'countryController'
    })
    .when('/login', {
      templateUrl: 'templates/pages/login.html'
    })
	  .when('/sender-info', {
      templateUrl: 'templates/pages/sender-info.html',
      controller: 'senderController'
    })
    .when('/receiver-info', {
      templateUrl: 'templates/pages/receiver-info.html',
      controller: 'receiverController'
    })
    .otherwise({redirectTo: '/'});
}]);
