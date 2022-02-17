const CoursesController = require('../Controllers/CoursesController');
const upload = require('../../common');

module.exports = (app) =>{
   app.post('/course', CoursesController.post);
   app.put('/course/:id', CoursesController.put);
   app.delete('/course/:id', CoursesController.delete);
   app.get('/courses', CoursesController.get);
   app.get('/course/:id', CoursesController.getById);
   app.post('/courses/upload/:id', upload.single('video'), CoursesController.videoUpload);
};