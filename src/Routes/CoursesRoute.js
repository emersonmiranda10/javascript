const fs = require('fs');
const CoursesController = require('../Controllers/CoursesController');
const upload = require('../../common');

module.exports = (app) => {
   app.get('/', (req, res) => {
      fs.readFile('./index.html', (err, html) => res.end(html));
   });
   app.post('/course', CoursesController.post);
   app.post('/course/video', CoursesController.createVideoLesson);
   app.put('/course/:id', CoursesController.put);
   app.delete('/course/:id', CoursesController.delete);
   app.get('/courses', CoursesController.get);
   app.get('/course/:id', CoursesController.getById);
   app.get('/courses/list/:courseId', CoursesController.getLessonList);
   app.get('/courses/video/:courseId/:lessonNumber', CoursesController.getLesson);
   app.post('/courses/upload/:courseId/:lessonNumber', upload.single('video'), CoursesController.videoUpload);
   app.get('/courses/progress/:courseId/:userId', CoursesController.checkProgress);
   app.post('/courses/progress/:courseId/:userId', CoursesController.updateProgress);
   app.get('/courses/:courseId/:lessonNumber', CoursesController.getVideo);
};