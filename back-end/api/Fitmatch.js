import express from "express";
import { Sequelize } from "sequelize";
import userManager from "./management/UserManager.js";
import queryManager from "./management/SQLManager.js";
import fs from "fs";
import cors from "cors";
import { removeGarbage } from "../routers/ActivitiesRouter.js";

const defaultConfig = {
    username: "root",
    password: "1234",
    database: "fitmatch",
    host: "127.0.0.1",
    dialect: "mysql",
    tokenSecretKey: "secret-key"
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
        this.config = config;
        this.server = express();
        this.server.use(express.json());
        this.server.use(cors());
        this.server.use(express.urlencoded({ extended: true }));
        this.server.use('/uploads', express.static("uploads"));
        this.sqlManager = queryManager;
        this.userManager = userManager;
        removeGarbage(60000);
    }

    /**
     * Alerta! Això només funciona en localhost, per fer la demo funcionarà, pero si ho volem colocar a un servidor normal haurem d'implementar certificat SSL!
     * @returns una UUID generada aleatoriament.
     */
    genUUID() {
        return crypto.randomUUID();
    }

    getSqlManager() {
        return this.sqlManager;
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

    /**
     * @returns la instancia json de config.
     */
    getConfig() {
        return this.config;
    }

    /**
     * @returns la instancia de UserManager.
     */
    getUserManager() {
        return this.userManager;
    }

    decodeToken(token) {
        
    }
}

const instance = new Fitmatch();
export default instance;