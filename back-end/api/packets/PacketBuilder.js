/**
 * Aquest és per evitar haver d'importar molts arxius.
 */

import { NO_PERMISSION, INVALID, INTERNAL_ERROR, OK, NO_DATA, NO_VERIFIED } from "./StatusCodes.js"

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
    constructor(token, isSetup) {
        this.status = OK,
        this.token = token;
        this.isSetup = isSetup;
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

class PacketNoDataFound {
    constructor() {
        this.status = NO_DATA;
        this.error = "No data found.";
    }
}

class PacketNoVerified {
    constructor() {
        this.status = NO_VERIFIED;
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

export function buildTokenPacket(token, isSetup) {
    return new PacketToken(token, isSetup);
}

export function buildSimpleOkPacket() {
    return new PacketSimpleOk();
}

export function buildSendDataPacket(data) {
    return new PacketSendData(data);
}

export function buildNoDataFoundPacket() {
    return new PacketNoDataFound();
}

export function buildNoVerifiedPacket() {
    return new PacketNoVerified();
}