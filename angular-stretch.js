angular.module('angular-stretch', [])
.directive('ngStretch', ['$window', function($window){
	return {
		restrict: 'EA',
		link: function(scope, elem, attr){
			var winElem = angular.element($window);

			winElem.on('resize', function(){
				checkSize(elem, winElem);
			});
			checkSize(elem, winElem);

			function checkSize(element, window){
				var elemBounds = element[0].getBoundingClientRect();
				var winHeight = window[0].innerHeight;

				var heightDiff = winHeight - elemBounds.bottom;
				if(heightDiff){
					element.css('height', (element[0].clientHeight + heightDiff)+'px');
				}
			}
		}
	};
}]);