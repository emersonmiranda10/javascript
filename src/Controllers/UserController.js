const db = require('./../../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { text } = require('body-parser');

const transporter = nodemailer.createTransport({ // Configura os parametros de conexão com servidor
  host: "smtp.mailtrap.io",
  port:2525,
  auth: {
    user: "1d26da31b6ee2c",
    pass: "9cd8d108c9d033"
  }
});

const mailOptions ={ // Define informações pertinentes ao email que será enviado
  from: 'exemplo@exemplo.com',
  to: 'emerson.siilvaa10@gmail.com',
  subject: 'Aula de Java Script',
  text: 'Ola mundo!'
}

transporter.sendMail(mailOptions, (err, info) => { //função que envia email
  if (err) {
    return console.log(err)
  }

})

//operçação para login
exports.login = async (req, res, next) => {
  const { email, senha } = req.body;

  if (!email ||  !senha) return res.status(400).send({msg: 'Campo invalido'});

  const user = await db('users')
  .select('senha')
  .where('email', email)
  .first();

  if (!user) return res.status(404).send({ error: 'User not found!' });

  if (!await bcrypt.compareSync(senha, user.senha) ){
    return res.status(401).send({ error: 'Invalid Password' })
  }

  const loggedUser = await db('users')
      .select('*')
      .where('email', email)
      .first();

  delete loggedUser.senha

  const token = jwt.sign(
    { user: loggedUser.id },
    process.env.JWT_SECRET,
     
    {
      expiresIn: 300
    });

    return res.status(200).send({ user: {...loggedUser}, token});
}


// operação post: criar usuario
exports.post = async (req, res, next) => { // req, res, next são atributos basicos de toda requisição
  const { body } = req;
  const hash = await bcrypt.hashSync(body.senha, 10)
  const userData = {
      nome: body.nome,
      sobrenome: body.sobrenome,
      email: body.email,
      telefone: body.telefone,
      cpf: body.cpf,
      senha: hash,
    }
    // const result = await bcrypt.compareSync(body.senha, hash) - comando para checar se a senha é igual ao hash
    // const resultFalse = await bcrypt.compareSync("dsajlk", hash)

    db("users").insert(userData).then((data) => {
    res.status(201).send({
      ...userData,
      id: data[0],
    });
  })
}


// operação put: altera um usuario
exports.put = async (req, res, next) => {
  const id = req.params.id;
  let userData = {
    ...req.body
  }
  if (! await db("users").where("id", id).first()){
    return  res.status(400).json({ error: "user does not exist"});
  }
  if (req.body.senha) {
    const hash = await bcrypt.hashSync(req.body.senha, 10)
    userData.senha = hash;
  }

  await db('users').update(req.body).where({ id: id });
  const updatedUser = await db('users').where({ id: id});
  return res.status(200).json(...updatedUser);
};

// operação delete: deletar usuario
exports.delete = (req, res, next) => {
    const id = req.params.id;
    db('users').where({ id: id }).del().then(() => 
    {
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
  const id = req.params.id;
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