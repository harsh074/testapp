var askmonkApp = angular.module('askmonkApp', ['ionic','ionMdInput','ionic-datepicker','ionic.rating']);

askmonkApp.run(['$ionicPlatform','$state','$stateParams', function($ionicPlatform,$state,$stateParams){
  if(!localStorage.getItem('token')){
    $state.go('login');
    // $scope.transitionAnimation('left',180);
  }else if(localStorage.getItem('questionStatus') == 'underObservation'){
    $stateParams.id = localStorage.getItem('questionId');
    $state.go('app.singlequestion',$stateParams);
    // $scope.transitionAnimation('left',180);
  }else{
    $state.go('app.profile');
    // $scope.transitionAnimation('left',180);
  }
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      window.StatusBar.styleDefault();
      // window.StatusBar.overlaysWebView(true);
      window.StatusBar.backgroundColorByHexString('#00BCD2');
    }
    // ionic.Platform.isFullScreen = false;
    // ionic.Platform.showStatusBar(true);
    // then override any default you want
    window.plugins.nativepagetransitions.globalOptions.duration = 150;
    window.plugins.nativepagetransitions.globalOptions.androiddelay = 0;
    // window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
    // these are used for slide left/right only currently
    window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
    window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;
    
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
  .state('app.yprofiles', {
    url: "/yogi-profiles",
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

  .state('app.wallet',{
    url:"/wallet",
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
  ;

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/welcome');
}]);
