import express from "express";
import { Sequelize } from "sequelize";

let instance;

export function init() {
    instance = new Fitmatch();
}

class Fitmatch {
    constructor() {
        this.sql = new Sequelize(); // TODO
        this.server = express(); 
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

export default instance;