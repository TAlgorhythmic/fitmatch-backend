import express from "express";
import { Sequelize } from "sequelize";
const server = express();

const sql = new Sequelize(); // TODO

export function init() {

}

class Gymder {
    constructor() {}

    /**
     * Alerta! Això només funciona en localhost, per fer la demo funcionarà, pero si ho volem colocar a un servidor normal això s'haurà de canviar!
     * @returns random generated UUID.
     */
    genUUID() {
        return crypto.randomUUID();
    }

    getServer() {
        return server;
    }

    getSql() {
        return sql;
    }
}