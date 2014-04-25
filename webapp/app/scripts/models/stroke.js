/*global pmw*/

pmw.Models = pmw.Models || {};

(function () {
    'use strict';

    pmw.Models.StrokeModel = M.Model.extend({
        store: M.LocalStorageStore.create(),
        entity: 'storkes'
    });
})();