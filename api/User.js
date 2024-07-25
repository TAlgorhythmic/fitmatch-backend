import { genUUID } from "./Gymder";

export default class User {
    /**
     * Inicialitzar usuari desde zero, usuari encara no existent a la base de dades.
     * @param {*} id 
     * @param {*} number 
     * @param {*} email 
     */
    constructor(number, email, password) {
        // Generar salt per seguretat extra.
        this.salt = genUUID();
    }
}