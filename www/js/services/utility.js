'use strict';
askmonkApp.service('utility', ['$q','$http','$state','ipCookie', function utility($q, $http, $state, ipCookie) {
  var service = {
    'authenticated': null,
    'request': function(args) {
      // Let's retrieve the token from the cookie, if available
      if(ipCookie('token')){
        $http.defaults.headers.common.Authorization = 'Token ' + ipCookie('token');
      }

      params = args.params || {}
      args = args || {};
      var deferred = $q.defer(),
        url = this.API_URL + args.url,
        method = args.method || "GET",
        params = params,
        data = args.data || {};

      $http({
        url: url,
        withCredentials: this.use_session,
        method: method.toUpperCase(),
        headers: {'X-CSRFToken': ipCookie('token')},
        params: params,
        data: data
      })
      .success(angular.bind(this,function(data, status, headers, config) {
        deferred.resolve(data, status);
      }))
      .error(angular.bind(this,function(data, status, headers, config) {
        deferred.reject(data, status);
      }));
      return deferred.promise;
    },
    'register': function(args, rootScope){
      return this.request({
        'method': "POST",
        'url': "/register/",
        'data': args
      }).then(function(data){
        if(!utility.use_session){
          $http.defaults.headers.common.Authorization = 'Token ' + data.token;
          // ipCookie('token',data.token, {expires: 4, expirationUnit: 'hours'});
        }
      });
    },
    'login': function(args,rootScope){
      return this.request({
       'method': "POST",
       'url': "/users/login/",
       'data':{
         'email':args.email,
         'password':args.password
       }
      }).then(function(data){
       if(!utility.use_session){
          $http.defaults.headers.common.Authorization = 'Token ' + data.id;
          ipCookie('token',data.id, {expires: 4, expirationUnit: 'days'});
          ipCookie('userId', data.userId, {expires: 4, expirationUnit: 'days'});
       }
      });
      return deferred.promise;
    },
    'getQuestion': function(url){
      return this.request({
        'method': "GET",
        'url': url
      }); 
    },
    'initialize': function(url, sessions, scope, rootScope){
      this.API_URL = url;
      this.use_session = sessions;
      if(scope){
        scope.authenticated = null;
        if(this.authenticated == null){
          if(ipCookie('token')){
            utility.authenticated = true;
            scope.authenticated = true;
          }
          else{
            utility.authenticated = false;
            scope.authenticated = false;
          }
        }else{
          scope.authenticated = this.authenticated;
        }
        scope.setAuth = function(auth){
          scope.authenticated = auth;
        }
      }
    }
  }
  return service;
}]);