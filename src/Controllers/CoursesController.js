const fs = require ('fs');
const db = require('../../db');
// operação post: criar cursos
exports.post = (req, res) => { // req, res, next são atributos basicos de toda requisição
  const { body } = req;
    db('courses').insert(body).then((data) => {
      console.log(data)
    res.status(201).send({
      ...body,
      id: data,
    });
  });
};

// operação put: altera um cursos
exports.put = async (req, res) => {
  const { id } = req.params;
  await db('courses').update(req.body).where({ id });
  const updatedCourse = await db('courses').where({ id });
  return res.status(200).json(...updatedCourse);
};

// operação delete: deletar cursos
exports.delete = (req, res) => {
    const { id } = req.params;
    db('courses').del().where({ id }).then(() => res.status(200).json({ message: 'Deleted' }))
};

// operação get: retorna informação do cursos
exports.get = (req, res) => {
  db.select().table('courses').then((data) => {
    res.status(200).send(data);
  });
};
// operação getByID: criar curso by id
exports.getById = (req, res) => {
  const { id } = req.params;
  db.select().table('courses').where({
      id,
  }).then((data) => {
      if (data.length == 0) {
          return res.status(400).json({ error: 'course does exist' });
        }
        res.status(200).send(data);
  })
};

exports.getLesson = (req, res) => {
  const { courseId, lessonNumber } = req.params
  db('videos').where({ courseId, number: lessonNumber }).first().then((data) => {
    if (data.length === 0) {
      return res.status(400).json({ error: 'course does not exist'});
    }
    return res.status(200).send(data);
  });
};

exports.getLessonList = (req, res) => {
  const { courseId } = req.params;
  db('videos').where({ courseId }).then((data) => {
    if (data.length === 0) {
      return res.status(400).json({ error: 'course does not exist or is empty'});
    }
    const sortedData = data.sort((a,b) => (
      a.number > b.number ? 1 : -1
    ));
    return res.status(200).send(sortedData);
  });
};

exports.createVideoLesson = async (req, res) => {
  const { body } = req;
  db('videos').insert({ ...body, id: `${body.courseId}-${body.number}` }).then((data) => {
    console.log(data);
    res.status(201).send({
      ...body,
      id: `${body.courseId}-${body.number}`,
    });
  });
};

exports.videoUpload = async (req, res) => {
  const { courseId, lessonNumber } = req.params;
  await db('videos').where({ courseId, number: lessonNumber }).first().update({ videoPath: req.file.path });
  res.send('uploaded successfully');
};

exports.getVideo = async (req, res) => {
  const { courseId, lessonNumber } = req.params;
  const movieFile = await db('videos').where({ courseId, number: lessonNumber }).first(); //onde está salvo o video
  if (!movieFile || !movieFile.videoPath) { return res.status(404).end('<h1>Movie Not Found</h1>')}
  fs.stat(movieFile.videoPath, (err, stats) => {
    if (err) {
      console.log(err);
      return res.status(404).end('<h1>Movie Not Found</h1>');
    }
    // variaveis necessarias para montar o chunk header corretamente
    const { range } = req.headers;
    const { size } = stats;
    const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
    const end = size - 1;
    const chunkSize = (end - start) + 1;
    // definindo headers de chunk
    res.set({
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-type': 'video/mp4',
    });
    // é importante usar status 206 - Partial Content para o streaming funcionar 
    res.status(206);
    //utilizando ReadStream no Node.js
    //Ele vai ler um arquivo e envia-lo em partes via stream.pipe()
    const stream = fs.createReadStream(movieFile.videoPath, { start, end});
    stream.on('open', () => stream.pipe(res));
    stream.on('error', (streamErr) => res.end(streamErr));
    return null;
  });
  return null;
};

exports.checkProgress = (req, res) => {
  const { courseId, userId } = req.params;
  db('progress').where({ courseId, userId }).first().then((data) => {
    if (!data) {
      return res.status(200).send({ lastSeen: 0 });
    }
    return res.status(200).send({ lastSeen: data.lastSeen || 0 });
  });
};

exports.updateProgress = async (req, res) => {
  const { courseId, userId } = req.params;
  const { body } = req;
  const data = await db('progress').where({ courseId, userId }).first();
  if (!data) {
    console.log('criado');
    await db('progress').insert({
      courseId, userId, lastSeen: body.lastSeen, id: `${userId}-${courseId}`,
    });
  } else {
    await db('progress').where({ courseId, userId }).first().update({ lastSeen: body.lastSeen });
  }
  return res.status(200).send('progress updated');
};