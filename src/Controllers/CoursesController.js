const db = require('../../db');
// operação post: criar cursos
exports.post = (req, res, next) => { // req, res, next são atributos basicos de toda requisição
  const body = req.body
    db("courses").insert(body).then((data) => {
    res.status(201).send({
      ...body,
      id: data,
    });
  })
}


// operação put: altera um cursos
exports.put = async (req, res, next) => {
  let id = req.params.id;
  await db('courses').update(req.body).where({ id: id });
  const updatedCourse = await db('courses').where({ id: id});
  return res.status(200).json(...updatedCourse);
};

// operação delete: deletar cursos
exports.delete = (req, res, next) => {
    let id = req.params.id;
    db('courses').where({ id: id }).del().then(() => {
        return res.status(200).json({ message: 'Deleted' });
    })
};

// operação get: retorna informação do cursos
exports.get = (req, res, next) => {
  db.select().table("courses").then(data => {
    res.status(200).send(data)
  })
};
// operação getByID: criar curso by id
exports.getById = (req, res, next) => {
  let id = req.params.id;
  db.select().table("courses").where({
      id: id
  }).then((data) => {
      if(data.length == 0){
          return res.status(400).json({ error: "couse does not exist"});
        } else {
              res.status(200).send(data[0]);
          }
  })
};