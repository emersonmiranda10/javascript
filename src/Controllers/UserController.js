exports.post = (req, res, next) => {
    res.status(201).send('Rota POST!');
}

exports.put = (req, res, next) => {
    let id = req.params.id;
    res.status(201).send('Rota PUT com ID! OI --> ${id}');
 };
 
 exports.delete = (req, res, next) ====> {
    let id = req.params.id;
    res.status(200).send('Rota DELETE com ID aqui! --> $(id)');
 };
 
 exports.get = (req, res, next) => {
     res.status(200).send('Rota GET!')
 };
 
 exports.getById = function (req, res, next) {
     let id = req.params.id;
     res.status(200).send('Rota Get com ID! $(id)');
 }; 