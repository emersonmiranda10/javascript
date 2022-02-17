const UserRoute = require('./UserRoute')
const CoursesRoute = require('./CoursesRoute');
module.exports = (app) => {
    UserRoute(app)
    CoursesRoute(app);
};