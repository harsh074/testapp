var askmonkApp = angular.module('askmonkApp', ['ionic','ionMdInput','ionic-datepicker','ionic.rating','tabSlideBox','monospaced.elastic','ion-google-place','ionic-timepicker','ionic-native-transitions','ion-datetime-picker','templates']); // ,'templates'

askmonkApp.run(['$ionicPlatform','$state','$stateParams','CONSTANT','$timeout', function($ionicPlatform,$state,$stateParams,CONSTANT,$timeout){
  if(!localStorage.getItem('token')){
    $state.go('login');
  }else if(!localStorage.profile){
    $state.go('app.profile');
  }
  else if(localStorage.getItem('questionStatus') == 'underObservation'){
    $stateParams.id = localStorage.getItem('questionId');
    $state.go('app.singlequestion',$stateParams);
  }else{
    $state.go('app.profile');
  }
  $ionicPlatform.ready(function(){
    if(window.MobileAccessibility){
      window.MobileAccessibility.usePreferredTextZoom(false);
    }
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // window.StatusBar.styleDefault();
      window.StatusBar.overlaysWebView(true);
      window.StatusBar.backgroundColorByHexString('#000');  //#2B5D80
    }
    $timeout(function(){
      if (navigator && navigator.splashscreen) {
        navigator.splashscreen.hide();
      }
      if (window.navigator && window.navigator.splashscreen) {
        window.navigator.splashscreen.hide();
      }
    },3000);

    CONSTANT.isDevice = ionic.Platform.device().available;
    // ionic.Platform.isFullScreen = false;
    
  });
  
  if(CONSTANT.PRODUCTION_MODE) {
    if(window.console && window.console.log){
      window.console.log = function() {};
    }
    if(window.alert){
      window.alert = function() {};
    }
  }
}]);

askmonkApp.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider','$ionicNativeTransitionsProvider','$logProvider', function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicNativeTransitionsProvider,$logProvider) {
  $ionicConfigProvider.views.transition('none');
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $logProvider.debugEnabled(false);

  $ionicNativeTransitionsProvider.setDefaultOptions({
    duration: 170,
    androiddelay: -1,
    fixedPixelsTop: 0,
    fixedPixelsBottom: 0,
    triggerTransitionEvent: '$ionicView.afterEnter',
    backInOppositeDirection: true
  });
  $ionicNativeTransitionsProvider.setDefaultBackTransition({
      type: 'fade',
      duration: 600
  });

  $stateProvider

  .state('login', {
    url: '/login',
    // cache: false,
    templateUrl: "views/login.html",
    controller: 'loginCtrl'
  })

  .state('app', {
    url: "/app",
    abstract: true,
    cache: false,
    templateUrl: "views/sidemenu.html",
    controller: 'appCtrl'
  })

  .state('app.profile', {
    url: "/profile",
    nativeTransitions: {
      "type": "fade",
      "duration": "400"
    },
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "views/profile.html",
        controller: 'profileCtrl'
      }
    }
  })
  .state('app.yprofiles', {
    url: "/yogi-profiles",
    nativeTransitions: {
      "type": "fade",
      "duration": "400"
    },
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "views/yogi-profiles-tile.html",
        controller: 'yProfilesCtrl'
      }
    }
  })
  .state('app.yprofile', {
    url: "/yogi-profile/{id}",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "views/yogi-profile.html",
        controller: 'yProfileCtrl'
      }
    }
  })
  .state('app.directQuestion', {
    url: "/direct-question",
    nativeTransitions: {
      "type": "fade",
      "duration": "400"
    },
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "views/directQuestion.html",
        controller: 'directQuestionCtrl'
      }
    }
  })
  .state('app.openQuestion', {
    url: "/open-question",
    nativeTransitions: {
      "type": "fade",
      "duration": "400"
    },
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "views/openQuestion.html",
        controller: 'openQuestionCtrl'
      }
    }
  })
  .state('app.draftQuestion', {
    url: "/draft-question",
    nativeTransitions: {
      "type": "fade",
      "duration": "400"
    },
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "views/draftQuestion.html",
        controller: 'draftQuestionCtrl'
      }
    }
  })
  .state('app.wallet',{
    url:"/wallet",
    nativeTransitions: {
      "type": "fade",
      "duration": "400"
    },
    cache: false,
    views:{
      'menuContent':{
        templateUrl:"views/wallet.html",
        controller:"walletCtrl"
      }
    }
  })
  .state('app.setting',{
    url:"/setting",
    // cache: false,
    nativeTransitions: {
      "type": "fade",
      "duration": "400"
    },
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
    nativeTransitions: {
      "type": "fade",
      "duration": "570"
    },
    cache: false,
    views:{
      'menuContent':{
        templateUrl:"views/dashboard.html",
        controller:"dashboardCtrl"
      }
    }
  })
  .state('app.singlequestion',{
    url:"/singlequestion/{id}",
    cache: false,
    views:{
      'menuContent':{
        templateUrl:"views/singleQuestion.html",
        controller:"singleQuestionCtrl"
      }
    }
  })
  .state('app.broadcastquestion',{
    url:"/broadcastquestion/{id}",
    cache: false,
    views:{
      'menuContent':{
        templateUrl:"views/broadcastQuestion.html",
        controller:"broadcastQuestionCtrl"
      }
    }
  })
  .state('app.horoscope',{
    url:"/dailyHoroscope",
    nativeTransitions: {
      "type": "fade",
      "duration": "400"
    },
    // cache: false,
    views:{
      'menuContent':{
        templateUrl:"views/allHoroscope.html",
        controller:"horoscopeCtrl"
      }
    }
  })
  .state('app.packages',{
    url:"/fullPackages",
    nativeTransitions: {
      "type": "fade",
      "duration": "400"
    },
    cache: false,
    views:{
      'menuContent':{
        templateUrl:"views/fullPackages.html",
        controller:"fullPackagesCtrl"
      }
    }
  })
  ;
  
  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/welcome');
}]);
