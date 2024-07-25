import { genUUID } from "./Fitmatch.js";

export default class User {
    /**
     * Inicialitzar usuari desde zero, usuari encara no existent a la base de dades.
     * @param {*} id 
     * @param {*} number 
     * @param {*} email 
     */
    constructor(email) {
        // Generar salt per seguretat extra.
        this.email = email;

    }
}