/**
 * Created by liam.dickson on 5/21/15.
 */

var $ = require('jquery')
var ParentView = require('./ParentView');
var Enumerations = require('./Enumerations');
var Item = require('./Item');

var Router = Backbone.Router.extend({
    routes: {
        '' : 'home'
    }
});

var enumerationModel = new Enumerations();
var itemModel = new Item();

var parentView = new ParentView({itemModel: itemModel, enumerationModel: enumerationModel});

var router = new Router();
router.on('route:home', function () {
    $.when(itemModel.fetch(), enumerationModel.fetch()).done(function () {
        parentView.render();
    });
});

Backbone.history.start();