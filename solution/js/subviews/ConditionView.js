/**
 * Created by liam.dickson on 5/21/15.
 */

var _ = require('underscore');
var $ = require('jquery')
var Backbone = require('backbone-base-and-form-view');

module.exports = Backbone.BaseView.extend({
    template: _.template($('#condition-template').html()),
    templateVars: function () {
        return {itemEnums: this.enumerationModel.toJSON(), item: this.itemModel.toJSON()};
    },
    initialize: function (options) {
        this.itemModel = options.itemModel;
        this.enumerationModel = options.enumerationModel;
    }
});