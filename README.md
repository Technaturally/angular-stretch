# angular-stretch
Directive for stretching elements based on window size.

### Installation
```
bower install angular-stretch --save
```

### Usage
#### Basic Usage
Add the `ng-stretch` attribute to the element you would like to stretch.
```
<div ng-stretch></div>
```
* `ng-stretch` adjusts the element's css `height` property so that the bottom edge touches the bottom of the window.

#### With Bottom Element
If there are elements below the element, in some cases you may need to assign an id to the bottom element and use that id as the value for the `ng-stretch` attribute.
```
<div ng-stretch="footer"></div>
<div id="footer"></div>
```
* `ng-stretch` adjusts the element's css `height` property so that the bottom edge touches the footer or the bottom of the window if footer is scrolled out of view.

#### With Top Element
Set the `ng-stretch-top` attribute to the id of an element to stretch the top to.
```
<div id="header"></div>
<div ng-stretch="footer" ng-stretch-top="header"></div>
<div id="footer"></div>
```
* With `position: fixed;` the element's top will stay within the window.
* With `position: absolute;` the element's top will scroll out of the window.
* With no position set, the element's top will scroll out of the window.
