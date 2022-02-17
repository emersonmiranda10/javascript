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
  console.log (req.file)
  const { id } = req.params;
  await db('courses').where({ id }).first().update({ videoPath: req.file.path });
  res.send('uploaded successfully');
};