const fs = require('fs');
const CoursesController = require('../Controllers/CoursesController');
const upload = require('../../common');

module.exports = (app) =>{
   app.get('/', (req, res) => {
      fs.readFile('./index.html', (err, html) => res.end(html));
   });
   app.post('/course', CoursesController.post);
   app.put('/course/:id', CoursesController.put);
   app.delete('/course/:id', CoursesController.delete);
   app.get('/courses', CoursesController.get);
   app.get('/course/:id', CoursesController.getById);
   app.post('/courses/upload/:id', upload.single('video'), CoursesController.videoUpload);
   app.get('/courses/:id', CoursesController.getVideo);
};