/**
 * Aquest és per evitar haver d'importar molts arxius.
 */

import { NO_PERMISSION, INVALID, INTERNAL_ERROR, OK } from "./StatusCodes.js"

class PacketNoPermission {
    constructor(message) {
        this.status = NO_PERMISSION,
        this.error = message;
    }
}

class PacketInvalid {
    constructor(message) {
        this.status = INVALID;
        this.error = message;
    }
}

class PacketInternalError {
    constructor(message) {
        this.status = INTERNAL_ERROR,
        this.error = message;
    }
}

class PacketToken {
    constructor(token) {
        this.status = OK,
        this.token = token;
    }
}

class PacketSimpleOk {
    constructor() {
        this.status = OK;
    }
}

class PacketSendData {
    constructor(data) {
        this.status = OK;
        this.data = data;
    }
}

export function buildNoPermissionPacket(message) {
    return new PacketNoPermission(message);
}

export function buildInvalidPacket(message) {
    return new PacketInvalid(message);
}

export function buildInternalErrorPacket(message) {
    return new PacketInternalError(message);
}

export function buildTokenPacket(token) {
    return new PacketToken(token);
}

export function buildSimpleOkPacket() {
    return new PacketSimpleOk();
}

export function buildSendDataPacket(data) {
    return new PacketSendData(data);
}