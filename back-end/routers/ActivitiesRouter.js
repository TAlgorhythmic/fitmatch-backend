import express from 'express';
import { DataTypes } from "sequelize";
import fitmatch from "../../api/Fitmatch.js";
import {tokenRequired} from "../../api/utils/Validate.js";

const sequelize = fitmatch.getSql();

//DEFINICION DEL MODELO
const Activities = sequelize.define(
    'Activities',
    {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        postDate: DataTypes.DATE,
        expires: DataTypes.DATE,
        userId: DataTypes.INTEGER,
        tableVersion: DataTypes.INTEGER
    },
    { tableName: 'activities', timestamps: false }
);


const router = express.Router();

// GET lista de todos los Activitiess
// vinculamos la ruta /api/Activitiess a la función declarada
// si todo ok devolveremos un objeto tipo:
//     {ok: true, data: [lista_de_objetos_Activities...]}
// si se produce un error:
//     {ok: false, error: mensaje_de_error}

router.get('/', tokenRequired, function (req, res, next) {
    Activities.findAll()
        .then(Activitiess => res.json(Activitiess))
        .catch(error => res.json({
            ok: false,
            error: error
        }))

});

// GET de un solo Activities
router.get('/:id', tokenRequired, function (req, res, next) {
    Activities.findOne({ where: { id: req.params.id } })
        .then(Activities => res.json({
            ok: true,
            data: Activities
        }))
        .catch(error => res.json({
            ok: false,
            error: error
        }))
});



// POST, creació d'un nou Activities
router.post('/create', tokenRequired, function (req, res, next) {
    console.log(req.body)
    Activities.create(req.body)
        .then((item) => item.save())
        .then((item) => res.json({ ok: true, data: item }))
        .catch((error) => res.json({ ok: false, error }))

});


// put modificació d'un Activities
router.put('/edit/:id', tokenRequired, function (req, res, next) {
    Activities.findOne({ where: { id: req.params.id } })
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



// DELETE elimina l'Activities id
router.delete('/:id', tokenRequired, function (req, res, next) {

    Activities.destroy({ where: { id: req.params.id } })
        .then((data) => res.json({ ok: true, data }))
        .catch((error) => res.json({ ok: false, error }))

});


// GET activities that user not joined
router.get('/notjoined/:userId'), tokenRequired, function (req, res, next) {
    Activities.findAll({ where: { userId: req.params.userId } })
        .then((data) => res.json({ ok: true, data }))
        .catch((error) => res.json({ ok: false, error }))
}


export default router;