const db = require('./../../db');
// operação post: criar usuario
exports.post = (req, res, next) => { // req, res, next são atributos basicos de toda requisição
  const body = req.body
    db("users").insert(body).then((data) => {
    res.status(201).send({
      ...body,
      id: data,
    });
  })
}


// operação put: altera um usuario
exports.put = async (req, res, next) => {
  let id = req.params.id;
  await db('users').update(req.body).where({ id: id });
  const updatedUser = await db('users').where({ id: id});
  return res.status(200).json(...updatedUser);
};

// operação delete: deletar usuario
exports.delete = (req, res, next) => {
    let id = req.params.id;
    db('users').where({ id: id }).del().then(() => {
        return res.status(200).json({ message: 'Deleted' });
    })
};

// operação get: retorna informação do usuario
exports.get = (req, res, next) => {
  db.select().table("users").then(data => {
    res.status(200).send(data)
  })
};
// operação getByID: criar user by id
exports.getById = (req, res, next) => {
  let id = req.params.id;
  db.select().table("users").where({
      id: id
  }).then((data) => {
      if(data.length == 0){
          return res.status(400).json({ error: "user does not exist"});
        } else {
              res.status(200).send(data[0]);
          }
  })
};