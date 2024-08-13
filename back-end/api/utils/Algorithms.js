export function areCompatible(user1, user2) {
    let profComp;
    if (user1.proficiency && user2.proficiency) {
        profComp = areProficienciesCompatible(user1.proficiency, user2.proficiency);
    } else if (!user1.proficiency && !user2.proficiency) {
        profComp = 50;
    } else {
        profComp = 0;
    }
    
    let prefComp;
    if ((user1.trainingPreferences && user2.trainingPreferences) && (user1.trainingPreferences.length && user2.trainingPreferences.length)) {
        prefComp = haveCommonPreferences(user1.trainingPreferences, user2.trainingPreferences);
    } else if ((user1.trainingPreferences == null && !user2.trainingPreferences == null)) {
        prefComp = 50;
    } else {
        prefComp = 0;
    }
    
    const locComp = areLocationsCompatible(user1, user2, 10); // Umbral en km

    const timetablesComp = getScheduleCompatibility(user1, user2);

    // Calcular promedio de compatibilidad en porcentaje
    const totalCompatibility = ((profComp + prefComp + locComp + timetablesComp) * 100) / 400;

    return totalCompatibility; // Retornar compatibilidad
}

function getScheduleCompatibility(user1, user2) {
    const daysOfWeek = getCommonDaysOfAWeek(user1, user2);
    const multiplier = (daysOfWeek * 4) / 100;
    const timetable = getTimetableCompatibility(user1, user2) * multiplier;

    return (daysOfWeek + timetable) / 2;
}

function getTimetableCompatibility(user1, user2) {

    const user1Hour1 = Math.floor(user1.timetable1 / 60);
    const user1Hour2 = Math.floor(user1.timetable2 / 60);

    const user2Hour1 = Math.floor(user2.timetable1 / 60);
    const user2Hour2 = Math.floor(user2.timetable2 / 60);

    const rest1 = user1Hour2 - user1Hour1;
    const rest2 = user2Hour2 - user2Hour1

    const max = Math.max(rest1, rest2);

    let totalCompatibility = 0;

    if (rest1 < rest2) {
        for (let i = 0; i < rest1; i++) {
            const index = rest1 + i;
            if (index >= user2Hour1 && index <= user2Hour2) totalCompatibility += 1;
        }
    } else {
        for (let i = 0; i < rest2; i++) {
            const index = rest2 + i;
            if (index >= user1Hour1 && index <= user1Hour2) totalCompatibility += 1;
        }
    }

    if (totalCompatibility === 0) return totalCompatibility;
    return (25 * totalCompatibility) / max;
}

function getCommonDaysOfAWeek(user1, user2) {
    let daysCompatible = 0;

    if (user1.monday && user2.monday) daysCompatible += 100;
    else if (!user1.monday && !user2.monday) daysCompatible += 20;

    if (user1.tuesday && user2.tuesday) daysCompatible += 100;
    else if (!user1.tuesday && !user2.tuesday) daysCompatible += 20;

    if (user1.wednesday && user2.wednesday) daysCompatible += 100;
    else if (!user1.wednesday && !user2.wednesday) daysCompatible += 20;

    if (user1.thursday && user2.thursday) daysCompatible += 100;
    else if (!user1.thursday && !user2.thursday) daysCompatible += 20;

    if (user1.friday && user2.friday) daysCompatible += 100;
    else if (!user1.friday && !user2.friday) daysCompatible += 20;

    if (user1.saturday && user2.saturday) daysCompatible += 100;
    else if (!user1.saturday && !user2.saturday) daysCompatible += 20;

    if (user1.sunday && user2.sunday) daysCompatible += 100;
    else if (!user1.sunday && !user2.sunday) daysCompatible += 20;

    return daysCompatible / 7;
}

const p = {
    Principiante: 0,
    Intermedio: 1,
    Avanzado: 2
}

function areProficienciesCompatible(prof1, prof2) {

    // Verificar compatibilidad directa
    const points = 100 / ((Math.max(p[prof1], p[prof2]) - Math.min(p[prof1], p[prof2])) + 1);

    // Retornar un numero entre 0 y 100
    return points;
}

function haveCommonPreferences(preferences1, preferences2) {

    const set1 = new Set(preferences1);
    const set2 = new Set(preferences2);

    // Contador para coincidencias
    let coincidencias = 0;
    
    // Contar coincidencias
    set1.forEach(pref => {
        if (set2.has(pref)) {
            coincidencias++;
        }
    });

    const max = Math.max(set1.size, set2.size);

    // Calcular compatibilidad en porcentaje
    const compatibilidad = (coincidencias * 100) / max;

    return compatibilidad;
}

function areLocationsCompatible(user1, user2, thresholdKm) {
    try {
        if (!user1.latitude || !user1.longitude || !user2.latitude || !user2.longitude) {
            console.log('La ubicación no está bien definida.');
            return 0;
        }

        const lat1 = parseFloat(user1.latitude);
        const long1 = parseFloat(user1.longitude);

        const lat2 = parseFloat(user2.latitude);
        const long2 = parseFloat(user2.longitude);

        if (isNaN(lat1) || isNaN(long1) || isNaN(lat2) || isNaN(long2)) {
            console.error('Coordenadas no válidas:', loc1, loc2);
            return 0;
        }

        const distance = getDistanceFromLatLonInKm(user1.latitude, user1.longitude, user2.latitude, user2.longitude);
        const compatibilidad = distance <= thresholdKm ? 100 : (1 - (distance / thresholdKm)) * 100;

        return Math.max(0, compatibilidad);
    } catch (error) {
        console.error('Error al calcular la compatibilidad de ubicación: ', error);
        return 0;
    }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon1 - lon2); // corregir dirección de longitud
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
