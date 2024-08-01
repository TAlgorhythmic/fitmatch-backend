import express from 'express';
import { DataTypes } from "sequelize";
import fitmatch from "./../api/Fitmatch.js";
import { tokenRequired } from "./../api/utils/Validate.js";

const sequelize = fitmatch.getSql();
const sqlManager = fitmatch.getSqlManager();

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

const Friends = sequelize.define(
    'Friends',
    {
        userId1: DataTypes.INTEGER,
        userId2: DataTypes.INTEGER,
    },
    { tableName: 'friends', timestamps: false }
);



const router = express.Router();

// GET lista de todos los Activitiess
// vinculamos la ruta /api/Activitiess a la función declarada
// si todo ok devolveremos un objeto tipo:
//     {ok: true, data: [lista_de_objetos_Activities...]}
// si se produce un error:
//     {ok: false, error: mensaje_de_error}

router.get('/', tokenRequired, async function (req, res, next) {
    const listToReturn = sqlManager.getAllActivitiesWhitUserInfo()
        .then(activities => res.json(
            {
                ok: true,
                data: activities[0]
            }
        ))
        .catch(error => res.json(
            {
                ok: false,
                error: error
            }
        ));
});


// GET lista de todos los Activitiess de amigos de un usuario
router.get('/foruser', tokenRequired, async function (req, res, next) {
    try {
        const userId = req.token.id;

        // Obtener los IDs de los amigos del usuario
        const friends = await Friends.findAll({
            where: {
                userId1: userId
            }
        });

        const friends2 = await Friends.findAll({
            where: {
                userId2: userId
            }
        });


        const friendIds = friends.map(friend => friend.friendId);
        friendIds.push(friends2.map(friend => friend.userId1));

        // Buscar las actividades de los amigos
        const activities = await Activities.findAll({
            where: {
                userId: {
                    [Op.in]: friendIds
                }
            }
        });

        res.json({
            ok: true,
            data: activities
        });
    } catch (error) {
        res.json({
            ok: false,
            error: error
        });
    }
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
    Activities.create(req.body)
        .then((item) => item.save())
        .then((item) => res.json({ ok: true, data: item }))
        .catch((error) => res.json({ ok: false, error }))

});


// put modificació d'un Activities
router.put('/edit', tokenRequired, function (req, res, next) {
    Activities.findOne({ where: { id: req.token.id } })
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

export default router;