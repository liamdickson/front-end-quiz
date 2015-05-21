/**
 * Created by liam.dickson on 5/21/15.
 */

module.exports = {
    entry: "./runpage.js",
    output: {
        path: __dirname,
        filename: "runpage-comp.js"
    },
    externals: [
        {
            'jquery': "var window.jQuery"
        }
    ]
};