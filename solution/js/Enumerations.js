/**
 * Created by liam.dickson on 5/21/15.
 */

var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    urlRoot: '../enums.json',
    parse: function(response) {
        return response.itemEnums;
    }
});
