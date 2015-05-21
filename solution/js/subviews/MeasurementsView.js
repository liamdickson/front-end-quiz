/**
 * Created by liam.dickson on 5/21/15.
 */

var _ = require('underscore');
var $ = require('jquery')
var Backbone = require('backbone-base-and-form-view');

module.exports = Backbone.BaseView.extend({
    template: _.template($('#measurements-template').html()),
    templateVars: function () {
        return {itemEnums: this.enumerationModel.toJSON(), item: this.itemModel.toJSON()};
    },
    initialize: function (options) {
        this.itemModel = options.itemModel;
        this.enumerationModel = options.enumerationModel;
    },
    events: {
        'change input[type=radio]': 'changedRadio'
    },
    changedRadio: function () {
        this.$('.input-group-addon').text(this.$('input[name=measurement-unit]:checked').val()+'.');
        if(this.$('input[name=measurement-shape]:checked').val() === 'Circular'){
            this.$('.measurement-input').attr('disabled','');
            this.$('#inputDiameter').removeAttr('disabled');
        }
        if(this.$('input[name=measurement-shape]:checked').val() === 'Rectangular'){
            this.$('.measurement-input').removeAttr('disabled');
            this.$('#inputDiameter').attr('disabled','');
        }
    }
});