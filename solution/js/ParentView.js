/**
 * Created by liam.dickson on 5/21/15.
 */

var _ = require('underscore');
var $ = require('jquery')
var Backbone = require('backbone-base-and-form-view');
var ButtonView = require('./subviews/ButtonView');
var ConditionView = require('./subviews/ConditionView');
var DescriptionView = require('./subviews/DescriptionView');
var MaterialsView = require('./subviews/MaterialsView');
var MeasurementsView = require('./subviews/MeasurementsView');
var NotesView = require('./subviews/NotesView');
var TitleView = require('./subviews/TitleView');

module.exports = Backbone.BaseView.extend({
    el: '#form',
    template: _.template($('#parent-template').html()),
    subViewConfig: {
        titleView: {
            construct: TitleView,
            location: '#title',
            singleton: true
        },
        descriptionView: {
            construct: DescriptionView,
            location: '#description',
            singleton: true
        },
        notesView: {
            construct: NotesView,
            location: '#notes',
            singleton: true
        },
        materialsView: {
            construct: MaterialsView,
            location: '#materials',
            singleton: true
        },
        measurementsView: {
            construct: MeasurementsView,
            location: '#measurements',
            singleton: true
        },
        conditionView: {
            construct: ConditionView,
            location: '#condition',
            singleton: true
        },
        buttonView: {
            construct: ButtonView,
            location: '#button',
            singleton: true
        }
    },
    initialize: function (options) {
        this.itemModel = options.itemModel;
        this.enumerationModel = options.enumerationModel;
        this.subs.add({
            'titleView': {model: this.itemModel},
            'descriptionView': {model: this.itemModel},
            'notesView': {model: this.itemModel},
            'materialsView': {
                itemModel: this.itemModel,
                enumerationModel: this.enumerationModel
            },
            'measurementsView' : {
                itemModel: this.itemModel,
                enumerationModel: this.enumerationModel
            },
            'conditionView' : {
                itemModel: this.itemModel,
                enumerationModel: this.enumerationModel
            },
            'buttonView' : {}
        });
    },
    save: function () {
        var shape = this.subs.get('measurementsView').$('input[name="measurement-shape"]:checked').val();
        this.itemModel.set({
            'id': this.subs.get('titleView').$('#id').val(),
            'title': this.subs.get('titleView').$('#inputTitle').val(),
            'description': this.subs.get('descriptionView').$('#inputDescription').val(),
            'dealerInternalNotes': this.subs.get('notesView').$('#inputNotes').val(),
            'material': {
                'description': this.subs.get('materialsView').$('#selectMaterials').val(),
                'restricted': this.subs.get('materialsView').$('input[name="material-restricted"]:checked').val() ? 'Y' : 'N'
            },
            'measurement': {
                'unit': this.subs.get('measurementsView').$('input[name="measurement-unit"]:checked').val(),
                'shape': shape
            },
            'condition': {
                'description': this.subs.get('conditionView').$('input[name="condition-description"]:checked').val()
            }
        });
        if(shape === 'Rectangular') {
            this.itemModel.get('measurement').length = this.subs.get('measurementsView').$('#inputLength').val();
            this.itemModel.get('measurement').depth = this.subs.get('measurementsView').$('#inputDepth').val();
            this.itemModel.get('measurement').height = this.subs.get('measurementsView').$('#inputHeight').val();
            delete this.itemModel.get('measurement')['diameter'];
        }
        if(shape === 'Circular'){
            this.itemModel.get('measurement').diameter = this.subs.get('measurementsView').$('#inputDiameter').val();
            delete this.itemModel.get('measurement')['length'];
            delete this.itemModel.get('measurement')['depth'];
            delete this.itemModel.get('measurement')['height'];
        }
        console.log(this.itemModel.toJSON());
    }
});