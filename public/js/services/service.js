angular.module('appService', [])

// super simple service
// each function returns a promise object
.factory('Users', ['$http',function($http) {
	return {
		get : function() {
			return $http.get('/api/users');
		},
		updatePeerID : function(username) {
			return $http.delete('/api/todos/' + id );
		}
	}
}]);
