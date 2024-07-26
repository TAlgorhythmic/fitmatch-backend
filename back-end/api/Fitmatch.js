import express from "express";
import config from "../config/configServer.json";
import { Sequelize } from "sequelize";

class Fitmatch {
    constructor() {
        this.sql = new Sequelize(
            config.database,
            config.username,
            config.password,
            {
                host: config.host,
                dialect: config.dialect,
                dialectOptions: {
                    multipleStatements: true
                }
            }
        ); // TODO
        this.server = express();
        this.server.use(express.json());
    }

    /**
     * Alerta! Això només funciona en localhost, per fer la demo funcionarà, pero si ho volem colocar a un servidor normal haurem d'implementar certificat SSL!
     * @returns una UUID generada aleatoriament.
     */
    genUUID() {
        return crypto.randomUUID();
    }

    /**
     * @returns la instancia d'express.
     */
    getServer() {
        return this.server;
    }

    /**
     * @returns la instancia de sequelize.
     */
    getSql() {
        return this.sql;
    }
}

export default Fitmatch;