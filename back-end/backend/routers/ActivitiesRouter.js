import express from 'express';
import { DataTypes } from "sequelize";
import Fitmatch from "./api/Fitmatch.js";

const instance = new Fitmatch();
const sequelize = instance.getSQL();

//DEFINICION DEL MODELO
const Alumne = sequelize.define(
    'Alumne',
    {
        nom: DataTypes.STRING,
        email: DataTypes.INTEGER
    },
    { tableName: 'alumnes', timestamps: false }
);



const router = express.Router();

// GET lista de todos los alumnes
// vinculamos la ruta /api/alumnes a la función declarada
// si todo ok devolveremos un objeto tipo:
//     {ok: true, data: [lista_de_objetos_alumne...]}
// si se produce un error:
//     {ok: false, error: mensaje_de_error}

router.get('/', function (req, res, next) {

    Alumne.findAll()
        .then(alumnes => res.json(alumnes))
        .catch(error => res.json({
            ok: false,
            error: error
        }))

});

// GET de un solo alumne
router.get('/:id', function (req, res, next) {
    Alumne.findOne({ where: { id: req.params.id } })
        .then(Alumne => res.json({
            ok: true,
            data: Alumne
        }))
        .catch(error => res.json({
            ok: false,
            error: error
        }))
});



// POST, creació d'un nou alumne
router.post('/', function (req, res, next) {
    console.log(req.body)
    Alumne.create(req.body)
        .then((item) => item.save())
        .then((item) => res.json({ ok: true, data: item }))
        .catch((error) => res.json({ ok: false, error }))

});


// put modificació d'un alumne
router.put('/:id', function (req, res, next) {
    Alumne.findOne({ where: { id: req.params.id } })
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



// DELETE elimina l'alumne id
router.delete('/:id', function (req, res, next) {

    Alumne.destroy({ where: { id: req.params.id } })
        .then((data) => res.json({ ok: true, data }))
        .catch((error) => res.json({ ok: false, error }))

});


export default router;