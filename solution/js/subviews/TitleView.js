/**
 * Created by liam.dickson on 5/21/15.
 */

var _ = require('underscore');
var $ = require('jquery')
var Backbone = require('backbone-base-and-form-view');

module.exports = Backbone.BaseView.extend({
    template: _.template($('#title-template').html()),
    templateVars: function () {
        return this.model.toJSON();
    }
});