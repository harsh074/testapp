angular.module('ion-google-place', [])
	.directive('ionGooglePlace', ['$ionicTemplateLoader','$ionicBackdrop','$ionicPlatform','$q','$timeout','$rootScope','$document','$ionicPopup','$ionicLoading', function($ionicTemplateLoader, $ionicBackdrop, $ionicPlatform, $q, $timeout, $rootScope, $document, $ionicPopup,$ionicLoading){
			return{
				require: '?ngModel',
				restrict: 'E',
				template: '<input type="text" readonly="readonly" class="ion-google-place md-input">',
				replace: true,
				scope: {
					ngModel: '=?',
					geocodeOptions: '=',
					currentLocation: '@'
				},
				link: function(scope, element, attrs, ngModel) {
					var unbindBackButtonAction;

					scope.locations = [];
					scope.showCustomBtn = false;
					var geocoder = new google.maps.Geocoder();
					var searchEventTimeout = undefined;

					var options = {
						types:['(regions)'],
						componentRestrictions: {country: 'in'}
					};
					var service = new google.maps.places.AutocompleteService();

					scope.displayCurrentLocation = false;
					scope.currentLocation = scope.currentLocation === "true"? true:false;
					
					if(!!navigator.geolocation && scope.currentLocation){
						scope.displayCurrentLocation = true;
					}
					var POPUP_TPL = [
						'<div class="ion-google-place-container modal">',
							'<ion-header-bar class="bar-assertive-900 bar bar-header disable-user-behavior" align-title="left">',
								'<div class="buttons buttons-left header-item"><span class="left-buttons">',
								  '<button class="customMenuBtn is-active"><span></span></button>',
								'</span></div>',
								'<div class="title title-left header-item" style="left: 54px; right: 54px;"><i class="logoSideMenu"></i></div>',
							'</ion-header-bar>',
							'<div class="bar has-header item-input-inset">',
								'<label class="item-input-wrapper">',
									'<i class="icon ion-android-search"></i>',
									'<input id="autocomplete" class="google-place-search" type="search" ng-model="searchQuery" placeholder="' + (attrs.searchPlaceholder || 'Enter an address, place or ZIP code') + '">',
								'</label>',
								'<!--button class="button button-clear">Cancel</button-->',
							'</div>',
							'<ion-content class="has-header has-header ionic-google-places">',
								'<ion-list ng-if="!showCustomBtn">',
									'<ion-item class="currentLocation" type="item-text-wrap" ng-click="setCurrentLocation()" ng-if="displayCurrentLocation"><i class="icon ion-android-locate"></i>',
										'Use current location',
									'</ion-item>',
									'<ion-item ng-repeat="location in locations" type="item-text-wrap" ng-click="selectLocation(location)">',
										'{{location.description}}',
									'</ion-item>',
								'</ion-list>',
								'<div class="customBtn"><button class="button button-custom" ng-if="showCustomBtn" ng-click="selectCustomLocation(searchQuery)">Save Custom Address</button></div>',
							'</ion-content>',
						'</div>'
					].join('');

					var popupPromise = $ionicTemplateLoader.compile({
						template: POPUP_TPL,
						scope: scope,
						appendTo: $document[0].body
					});

					popupPromise.then(function(el){
						var searchInputElement = angular.element(el.element.find('input'));

						scope.selectLocation = function(location){
							ngModel.$setViewValue(location.description);
							ngModel.$render();
							el.element.css('display', 'none');
							$ionicBackdrop.release();

							if (unbindBackButtonAction) {
								unbindBackButtonAction();
								unbindBackButtonAction = null;
							}
							scope.$emit('ionGooglePlaceSetLocation',location);
						};
						scope.selectCustomLocation = function(location){
							ngModel.$setViewValue(location);
							ngModel.$render();
							el.element.css('display', 'none');
							$ionicBackdrop.release();
						}

						scope.setCurrentLocation = function(){
							$ionicLoading.show({
					      animation: 'fade-in',
					      showBackdrop: false,
					      template:'<ion-spinner icon="ripple" class="spinner-askmonk"></ion-spinner>'
					    });
							getLocation()
								.then(reverseGeocoding)
								.then(function(location){
									$ionicLoading.hide();
									ngModel.$setViewValue(location.formatted_address);
									element.attr('value', location.formatted_address);
									ngModel.$render();
									el.element.css('display', 'none');
									$ionicBackdrop.release();
								})
								.catch(function(error){
									$ionicLoading.hide();
									console.log('erreur catch',error);
                  ngModel.$render();
                  el.element.css('display', 'none');
                  $ionicBackdrop.release();
									var confirmPopup = $ionicPopup.alert({
							      cssClass:"ios",
							      title: 'Turn on Location Services to allow Askmonk to determine your location.',
							      buttons: [
							        {text: 'Ok',type:'button-ios button-clear',
							          onTap: function(e) {
							            return true;
							          }
							        }
							      ]
							    });
							    confirmPopup.then(function(res) {
						        console.log('You are sure',res);
							    });
								});
						};

						/*scope.$watch('searchQuery', function(query){
							if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
							searchEventTimeout = $timeout(function() {
								if(!query) return;
								if(query.length < 3);

								var req = scope.geocodeOptions || {};
								req.address = query;
								geocoder.geocode(req, function(results, status) {
									if (status == google.maps.GeocoderStatus.OK) {
										scope.$apply(function(){
											scope.locations = results;
										});
									} else {
										// @TODO: Figure out what to do when the geocoding fails
									}
								});
							}, 350); // we're throttling the input by 350ms to be nice to google's API
						});*/

						scope.$watch('searchQuery', function(query){
							if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
							searchEventTimeout = $timeout(function() {
								if(!query) return;
								var req = options || {};
								req.input = query;
								service.getPlacePredictions(req, function(results, status) {
									if (status != google.maps.places.PlacesServiceStatus.OK) {
									  console.log(status);
									  scope.$apply(function(){
									  	scope.showCustomBtn = true;
									  });
									  return;
									}
									scope.$apply(function(){
										scope.showCustomBtn = false;
										scope.locations = results;
									});
								});
							}, 350);
						});
						
						var onClick = function(e){
							e.preventDefault();
							e.stopPropagation();

							$ionicBackdrop.retain();
							unbindBackButtonAction = $ionicPlatform.registerBackButtonAction(closeOnBackButton, 250);

							el.element.css('display', 'block');
							searchInputElement[0].focus();
							setTimeout(function(){
								searchInputElement[0].focus();
							},0);
						};

						var onCancel = function(e){
							scope.searchQuery = '';
							$ionicBackdrop.release();
							el.element.css('display', 'none');

							if (unbindBackButtonAction){
								unbindBackButtonAction();
								unbindBackButtonAction = null;
							}
						};

						closeOnBackButton = function(e){
							e.preventDefault();

							el.element.css('display', 'none');
							$ionicBackdrop.release();

							if (unbindBackButtonAction){
								unbindBackButtonAction();
								unbindBackButtonAction = null;
							}
						}

						element.bind('click', onClick);
						element.bind('touchend', onClick);

						el.element.find('button').bind('click', onCancel);
					});

					if(attrs.placeholder){
						element.attr('placeholder', attrs.placeholder);
					}


					ngModel.$formatters.unshift(function (modelValue) {
						if (!modelValue) return '';
						return modelValue;
					});

					ngModel.$parsers.unshift(function (viewValue) {
						return viewValue;
					});

					ngModel.$render = function(){
						// console.log(ngModel);
						if(!ngModel.$viewValue){
							element.val('');
						} else {
							// element.val(ngModel.$viewValue.formatted_address ?ngModel.$viewValue.formatted_address:ngModel.$viewValue || '');
							element.val(ngModel.$viewValue);
						}
					};

					scope.$on("$destroy", function(){
						if (unbindBackButtonAction){
							unbindBackButtonAction();
							unbindBackButtonAction = null;
						}
					});

					function getLocation() {
						var geo_options = {
							enableHighAccuracy: true,
							timeout: 10000,
							maximumAge: 0
						}
						return $q(function (resolve, reject) {
							navigator.geolocation.getCurrentPosition(function (position) {
								resolve(position);
							}, function (error) {
								error.from = 'getLocation';
								reject(error);
							},geo_options);
						});
					}

					function reverseGeocoding(location) {
						return $q(function (resolve, reject) {
							var latlng = {
								lat: location.coords.latitude,
								lng: location.coords.longitude
							};
							geocoder.geocode({'location': latlng}, function (results, status) {
								if (status == google.maps.GeocoderStatus.OK) {
									if (results[1]) {
										resolve(results[1]);
									} else {
										resolve(results[0])
									}
								} else {
									var error = {
										status: status,
										from: 'reverseGeocoding'
									};
									reject(error);
								}
							})
						});
					}
				}
			};
		}
	]);
