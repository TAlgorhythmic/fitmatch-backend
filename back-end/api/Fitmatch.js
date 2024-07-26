import express from "express";
import { Sequelize } from "sequelize";
import fs from "fs";

const defaultConfig = {
    username: "root",
    password: "1234",
    database: "fitmatch",
    host: "127.0.0.1",
    dialect: "mysql"
}

class Fitmatch {
    constructor() {
        // Create config file if doesn't exist.
        if (!fs.existsSync("./config.json")) {
            fs.writeFileSync("./config.json", JSON.stringify(defaultConfig))
            console.log("Config created with default values, you may want to edit it!");
        };
        const config = JSON.parse(fs.readFileSync("./config.json"));
        this.sql = new Sequelize(
            config.database,
            config.username,
            config.password,
            {
                host: config.host,
                dialect: config.dialect,
            }
        );
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

const instance = new Fitmatch();
export default instance;