import fitmatch from "./../../api/Fitmatch.js";
import { tokenRequired } from "../../api/utils/Validate.js";
import express from "express";
import { DataTypes, STRING } from "sequelize";

const router = express.Router();

const instance = new Fitmatch();
const sequelize = instance.getSQL();

//DEFINICION DEL MODELO
const Users = sequelize.define(
    'Users',
    {
        name: DataTypes.STRING,
        lastname: DataTypes.INTEGER,
        email: DataTypes.STRING,
        phone: DataTypes.INTEGER,
        description: DataTypes.STRING,
        proficiency: DataTypes,STRING,
        trainingPreferences: DataTypes.STRING,
        location: DataTypes.STRING,
        isSetup: DataTypes.BOOLEAN,
        tableVersion: DataTypes.INTEGER
    },
    { tableName: 'users', timestamps: false }
);

// GET lista de todos los Userss
// vinculamos la ruta /api/Userss a la función declarada
// si todo ok devolveremos un objeto tipo:
//     {ok: true, data: [lista_de_objetos_Users...]}
// si se produce un error:
//     {ok: false, error: mensaje_de_error}

router.get('/', function (req, res, next) {

    Users.findAll()
        .then(Userss => res.json(Userss))
        .catch(error => res.json({
            ok: false,
            error: error
        }))

});

// GET de un solo Users
router.get('/:id', function (req, res, next) {
    Users.findOne({ where: { id: req.params.id } })
        .then(Users => res.json({
            ok: true,
            data: Users
        }))
        .catch(error => res.json({
            ok: false,
            error: error
        }))
});



// POST, creació d'un nou Users
router.post('/create', function (req, res, next) {
    console.log(req.body)
    Users.create(req.body)
        .then((item) => item.save())
        .then((item) => res.json({ ok: true, data: item }))
        .catch((error) => res.json({ ok: false, error }))

});


// put modificació d'un Users
router.put('/edit/:id', function (req, res, next) {
    Users.findOne({ where: { id: req.params.id } })
        .then((al) =>
            al.update(req.body)
        )
        .then((ret) => res.json({
            ok: true,
            msg: "Record updated",
            data: ret
        }))
        .catch(error => res.json({
            ok: false,
            error: error
        }));

});



// DELETE elimina l'Users id
router.delete('/:id', function (req, res, next) {

    Users.destroy({ where: { id: req.params.id } })
        .then((data) => res.json({ ok: true, data }))
        .catch((error) => res.json({ ok: false, error }))

});


// GET Users that user not joined
router.get('/notjoined/:userId'), function (req, res, next) {
    Users.findAll({where: { userId: req.params.userId }})
    .then((data) => res.json({ ok: true, data }))
    .catch((error) => res.json({ ok: false, error }))
}

export default router;