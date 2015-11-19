var askmonkApp = angular.module('askmonkApp', ['ionic','ionic-material','ionMdInput']);

askmonkApp.run(function($ionicPlatform,$state) {
  $state.go('welcome');
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

askmonkApp.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.views.transition('none');
  $ionicConfigProvider.views.swipeBackEnabled(false);

  $stateProvider

  .state('welcome', {
    url: '/welcome',
    cache: false,
    templateUrl: "views/welcome.html",
    controller: 'welcomeCtrl'
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/sidemenu.html",
    controller: 'appCtrl'
  })

  .state('app.profile', {
    url: "/profile",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "views/profile.html",
        controller: 'profileCtrl'
      }
    }
  })
  .state('app.yprofile', {
    url: "/yogi-profile",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "views/yogi-profile.html",
        controller: 'yProfileCtrl'
      }
    }
  })

  .state('app.offers',{
    url:"/offers",
    cache: false,
    views:{
      'menuContent':{
        templateUrl:"views/offers.html",
        controller:"offersCtrl"
      }
    }
  })
  .state('app.setting',{
    url:"/setting",
    cache: false,
    views:{
      'menuContent':{
        templateUrl:"views/setting.html",
        controller:"settingCtrl"
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/welcome');
});
