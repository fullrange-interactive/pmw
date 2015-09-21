/*global $, M*/

// Fake localStorage implementation. 
// Mimics localStorage, including events. 
// It will work just like localStorage, except for the persistant storage part. 
var fakeLocalStorage = function() {
  var fakeLocalStorage = {};
  var storage; 
  
  // If Storage exists we modify it to write to our fakeLocalStorage object instead. 
  // If Storage does not exist we create an empty object. 
  if (window.Storage && window.localStorage) {
    storage = window.Storage.prototype; 
  } else {
    // We don't bother implementing a fake Storage object
    window.localStorage = {}; 
    storage = window.localStorage; 
  }
  
  // For older IE
  if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
  }
 
  var dispatchStorageEvent = function(key, newValue) {
    var oldValue = (key == null) ? null : storage.getItem(key); // `==` to match both null and undefined
    var url = location.href.substr(location.origin.length);
    var storageEvent = document.createEvent('StorageEvent'); // For IE, http://stackoverflow.com/a/25514935/1214183
 
    storageEvent.initStorageEvent('storage', false, false, key, oldValue, newValue, url, null);
    window.dispatchEvent(storageEvent);
  };
 
  storage.key = function(i) {
    var key = Object.keys(fakeLocalStorage)[i];
    return typeof key === 'string' ? key : null;
  };
 
  storage.getItem = function(key) {
    return typeof fakeLocalStorage[key] === 'string' ? fakeLocalStorage[key] : null;
  };
 
  storage.setItem = function(key, value) {
    dispatchStorageEvent(key, value);
    fakeLocalStorage[key] = String(value);
  };
 
  storage.removeItem = function(key) {
    dispatchStorageEvent(key, null);
    delete fakeLocalStorage[key];
  };
 
  storage.clear = function() {
    dispatchStorageEvent(null, null);
    fakeLocalStorage = {};
  };
};
 
// Example of how to use it
if (typeof window.localStorage === 'object') {
  // Safari will throw a fit if we try to use localStorage.setItem in private browsing mode. 
  try {
    localStorage.setItem('localStorageTest', 1);
    localStorage.removeItem('localStorageTest');
  } catch (e) {
    fakeLocalStorage();
  }
} else {
  // Use fake localStorage for any browser that does not support it.
  fakeLocalStorage();
}

var backRoute;

(function(global) {
    'use strict';

    global.pmw = M.Application.extend().create(global.pmw.mconfig);

    $(document).ready(function() {
		global.pmw.selectedWindowGroup = localStorage.getItem("selectedWindowGroup");
        global.pmw.start({
            routing: {
                routes: {
                    //'': 'drawLiveController',
                    '': 'postPhotoController',
                    //'': 'drawphotoController',
                    // 'vjing': 'vjingController',
                    // 'chooseFeature': 'chooseFeatureController'
                },
                postPhotoController: global.pmw.Controllers.PostPhotoController.create(),
                // drawLiveController: global.pmw.Controllers.DrawLiveController.create(),
                // fireworksController: global.pmw.Controllers.FireworksController.create(),
                // menuController: global.pmw.Controllers.MenuController.create(),
                 // drawController: global.pmw.Controllers.DrawController.create(),
                // drawphotoController: global.pmw.Controllers.DrawphotoController.create(),
                // vjingController: global.pmw.Controllers.VJingController.create(),
                // chooseFeatureController: global.pmw.Controllers.ChooseFeatureController.create()
                // m:controllers
            }
        }); 
    });
})(this);