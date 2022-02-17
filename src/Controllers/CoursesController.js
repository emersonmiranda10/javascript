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
          return res.status(400).json({ error: 'couse does exist' });
        }
        res.status(200).send(data);
  })
};

exports.videoUpload = async (req, res) => {
  const { id } = req.params;
  await db('courses').where({ id }).first().update({ videoPath: req.file.path });
  res.send('uploaded successfully');
};

exports.getVideo = async (req, res) => {
  const { id } = req.params;
  const movieFile = await db('courses').where({ id }).first(); //onde está salvo o video
  console.log(movieFile.videoPath);
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
};