export function sanitizeDataReceivedForSingleObject(data) {
    if (!Array.isArray(data)) return data;
    let sanitized = data;
    while (Array.isArray(sanitized)) {
        sanitized = sanitized[0];
    }
    return sanitized;
}
export function sanitizeDataReceivedForArrayOfObjects(data, commonNotUndefinedField) {
    let sanitized = data;
    if (!Array.isArray(data) || !data.length) return [];
    while (true) {
        if (Array.isArray(sanitized[0]) && !sanitized[0].length) return [];
        else if (!Array.isArray(sanitized)) return [];
        else if (sanitized[0][commonNotUndefinedField]) break;
    }
    return sanitized;
}