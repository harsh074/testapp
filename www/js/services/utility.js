'use strict';
askmonkApp.service('utility', ['$q','$http','$state', function utility($q, $http, $state) {
  var service = {
    'authenticated': null,
    request: function(args) {
      // Let's retrieve the token from the cookie, if available
      if(localStorage.getItem('token')){
        $http.defaults.headers.common.Authorization = 'Basic ' + localStorage.getItem('token');
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
    register: function(args){
      return this.request({
        'method': "POST",
        'url': "/users/",
        'data': args
      });
    },
    login: function(args){
      return this.request({
       'method': "POST",
       'url': "/users/login/",
       'data':args
      }).then(function(data){
       if(!utility.use_session){
          $http.defaults.headers.common.Authorization = 'Basic ' + data.id;
          localStorage.setItem('token',data.id);
          localStorage.setItem('userId',data.userId);
       }
      });
    },
    logout:function(){
      return this.request({
        'method':"POST",
        'url':"/users/logout",
        'params': {"access_token":localStorage.getItem('token')},
      }).then(function(data){
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem("profileData");
        localStorage.removeItem("name");
        delete $http.defaults.headers.common.Authorization;
        $state.go('login');
      });
    },
    getAllQuestion: function(){
      return this.request({
        'method': "GET",
        'url': '/questions/tagQuestions'
      });
    },
    getUserQuestions:function(){
      return this.request({
        'method': "GET",
        'url': "/questions/getQuestions/"+localStorage.getItem('userId')
      });
    },
    getSingleQuestions:function(id){
      return this.request({
        'method':"GET",
        'url':"/questions/"+id
      });
    },
    getUserProfile: function(){
      return this.request({
        'method':"GET",
        'url':'/users/findUser/'+localStorage.getItem('userId')
      });
    },
    updateUserProfile:function(args){
      return this.request({
        'method':"PUT",
        'url':"/users/"+localStorage.getItem('userId'),
        'data':args,
        'params': {"access_token":localStorage.getItem('token')}
      });
    },
    askQuestion:function(args){
      return this.request({
        'method':"POST",
        'url':"/questions/askQuestion",
        'data':args
      });
    },
    getPacks:function(){
      return this.request({
        'method':"GET",
        'url':"/payments/packs"
      });
    },
    getAllMonks:function(){
      return this.request({
        'method':"GET",
        'url':"/monks"
      })
    },
    getSingleMonk:function(id){
      return this.request({
        'method':"GET",
        'url':"/monks/getMonkDetails/"+id
      });
    },
    ratingQuestion:function(args){
      return this.request({
        'method':"POST",
        'url':"/users/rateAnswerByUser",
        'data':args
      });
    },
    monkLogin:function(args){
       return this.request({
       'method': "POST",
       'url': "/monks/login/",
       'data':args
      }).then(function(data){
       if(!utility.use_session){
          $http.defaults.headers.common.Authorization = 'Basic ' + data.id;
          localStorage.setItem('token',data.id);
          localStorage.setItem('userId',data.userId);
       }
      });
    },
    getMonkProfile:function(){
      return this.request({
        'method':"GET",
        'url':'/monks/getMonkDetails/'+localStorage.getItem('userId')
      });
    },
    initialize: function(url, sessions, scope, rootScope){
      this.API_URL = url;
      this.use_session = sessions;
      if(scope){
        scope.authenticated = null;
        if(this.authenticated == null){
          if(localStorage.getItem('token')){
            utility.authenticated = true;
            scope.authenticated = true;
            rootScope.token = localStorage.getItem('token');
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