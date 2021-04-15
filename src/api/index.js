const route  = require('./api')


module.exports = function(app,mysql){
    return route(app,mysql)
}