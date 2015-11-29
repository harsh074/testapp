var askmonkApp = angular.module('askmonkApp', ['ionic','ionMdInput','ionic-datepicker','ng-mfb']);

askmonkApp.run(['$ionicPlatform','$state', function($ionicPlatform,$state) {
  if(localStorage.getItem('token')){
    $state.go('app.profile');
  }else{
    $state.go('login');
  }
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    ionic.Platform.isFullScreen = true;
    ionic.Platform.showStatusBar(false);
  });
}]);

askmonkApp.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider', function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.views.transition('none');
  $ionicConfigProvider.views.swipeBackEnabled(false);

  $stateProvider

  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: "views/login.html",
    controller: 'loginCtrl'
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
  .state('app.editProfile',{
    url:"/editprofile",
    cache: false,
    views:{
      'menuContent':{
        templateUrl:"views/editProfile.html",
        controller:"editProfileCtrl"
      }
    }
  })
  .state('app.askQuestion',{
    url:"/askquestion",
    cache: false,
    views:{
      'menuContent':{
        templateUrl:"views/askQuestion.html",
        controller:"askQuestionCtrl"
      }
    }
  })
  .state('app.dashboard',{
    url:"/dashboard",
    cache: false,
    views:{
      'menuContent':{
        templateUrl:"views/dashboard.html",
        controller:"dashboardCtrl"
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/welcome');
}]);
