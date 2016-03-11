angular.module('angular-stretch', [])
.directive('ngStretch', ['$window', '$timeout', function($window, $timeout){
	return {
		restrict: 'EA',
		link: function(scope, element, attr){
			var windowElement = angular.element($window);
			var bottomElement, topElement;
			var minHeight, minAction;
			var maxHeight, maxAction;

			var origCss = {
				top: element[0].style.top,
				height: element[0].style.height
			};
			var enabled;
			var stretchListener;

			attr.$observe('ngStretch', setBottom);
			attr.$observe('ngStretchTop', setTop);
			attr.$observe('ngStretchMin', setMin);
			attr.$observe('ngStretchMinAction', setMinAction);
			attr.$observe('ngStretchMax', setMax);
			attr.$observe('ngStretchMaxAction', setMaxAction);
			attr.$observe('ngStretchEnabled', setEnabled);
			setEnabled(attr['ngStretchEnabled']);

			element.on('$destroy', function(){
				setEnabled(false);
			});

			function resetCSS(){
				for(var prop in origCss){
					element.css(prop, origCss[prop]);
				}
			}

			function setMin(stretchMin){
				minHeight = parseFloat(stretchMin);
				checkSize();
			}
			function setMinAction(stretchMinAction){
				if(angular.isDefined(stretchMinAction)){
					stretchMinAction = scope.$eval(stretchMinAction);
				}
				minAction = stretchMinAction;
			}
			function setMax(stretchMax){
				maxHeight = parseFloat(stretchMax);
				checkSize();
			}
			function setMaxAction(stretchMaxAction){
				if(angular.isDefined(stretchMaxAction)){
					stretchMaxAction = scope.$eval(stretchMaxAction);
				}
				maxAction = stretchMaxAction;
			}

			function setEnabled(stretchEnabled){
				if(angular.isDefined(stretchEnabled)){
					if(stretchEnabled !== true && stretchEnabled !== false){
						stretchEnabled = scope.$eval(stretchEnabled);
					}
				}
				else{
					stretchEnabled = true;
				}
				if(enabled != stretchEnabled){
					enabled = stretchEnabled;
					if(!enabled){
						windowElement.off('resize', checkSize);
						windowElement.off('scroll', checkSize);
						if(angular.isFunction(stretchListener)){
							stretchListener();
							stretchListener = undefined;
						}
						resetCSS();
					}
					else{
						windowElement.on('resize', checkSize);
						windowElement.on('scroll', checkSize);
						if(angular.isUndefined(stretchListener)){
							stretchListener = scope.$on('stretchShouldApply', checkSize);
						}
						element.ready(checkSize);
						$timeout(checkSize);
					}
				}
			}

			// getElement functions provided to avoid dependency on jquery
			function getElementByClassName(className){
				var elems = document.getElementsByTagName('*');
				for(var i=0; i < elems.length; i++){
					if((' ' + elems[i].className + ' ').indexOf(' ' + className + ' ') != -1) {
						return elems[i];
					}
				}
			}
			function getElement(query){
				if(query.charAt(0) == '.'){
					return getElementByClassName(query.substr(1));
				}
				else if(query.charAt(0) == '#'){
					return document.getElementById(query.substr(1));
				}
				else{
					return document.getElementById(query);
				}
			}

			function setBottom(query){
				if(query){
					var getBottom = getElement(query);
					if(getBottom){
						bottomElement = angular.element(getBottom);
					}
				}
				else{
					bottomElement = undefined;
				}
			}
			function setTop(query){
				if(query){
					var getTop = getElement(query);
					if(getTop){
						topElement = angular.element(getTop);
					}
				}
				else{
					topElement = undefined;
				}
			}

			function isFixed(check){
				var style = $window.getComputedStyle( check.length ? check[0] : check );
				return (style && style.position == 'fixed');
			}

			function checkSize(){
				if(!enabled){
					return;
				}
				$timeout(function(){
					if(!enabled){
						return;
					}
					var elemBounds = element[0].getBoundingClientRect();

					if(topElement){
						var topElemBounds = topElement[0].getBoundingClientRect();
						if(topElemBounds.bottom < 0 && isFixed(element)){
							element.css('top', '0px');
							elemBounds = element[0].getBoundingClientRect();
						}
						else{
							var topDiff = topElemBounds.bottom - elemBounds.top;
							if(topDiff){
								element.css('top', (element[0].offsetTop + topDiff)+'px');
								elemBounds = element[0].getBoundingClientRect();
							}
						}
					}

					var windowHeight = windowElement[0].innerHeight;
					var heightDiff = windowHeight - elemBounds.bottom;

					if(bottomElement){
						var bottomElemBounds = bottomElement[0].getBoundingClientRect();
						if(bottomElemBounds.top < windowHeight){
							heightDiff = bottomElemBounds.top - elemBounds.bottom;
						}
					}

					// calculate newHeight
					var newHeight = element[0].clientHeight + heightDiff;

					// check min-stretch bounds
					if(angular.isDefined(minHeight) && !isNaN(minHeight) && newHeight <= minHeight){
						newHeight = minHeight;
						if(element[0].clientHeight != minHeight){
							element.addClass('stretch-min');
							if(angular.isDefined(minAction) && angular.isFunction(minAction)){
								minAction(true, minHeight);
							}
						}
					}
					else if(element.hasClass('stretch-min')){
						element.removeClass('stretch-min');
						if(angular.isDefined(minAction) && angular.isFunction(minAction)){
							minAction(false, minHeight);
						}
					}
					
					// check max-stretch bounds
					if(angular.isDefined(maxHeight) && !isNaN(maxHeight) && newHeight >= maxHeight){
						newHeight = maxHeight;
						if(element[0].clientHeight != maxHeight){
							element.addClass('stretch-max');
							if(angular.isDefined(maxAction) && angular.isFunction(maxAction)){
								maxAction(true, maxHeight);
							}
						}
					}
					else if(element.hasClass('stretch-max')){
						element.removeClass('stretch-max');
						if(angular.isDefined(maxAction) && angular.isFunction(maxAction)){
							maxAction(false, maxHeight);
						}
					}

					// update element's height if different from newHeight
					if(element[0].clientHeight != newHeight){
						element.css('height', newHeight+'px');
					}
				});
			}
		}
	};
}]);