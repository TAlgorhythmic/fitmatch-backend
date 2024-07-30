export async function areCompatible(user1, user2) {
    const profComp = areProficienciesCompatible(user1.proficiency, user2.proficiency);
    const prefComp = haveCommonPreferences(user1.trainingPreferences, user2.trainingPreferences);
    const locComp = await areLocationsCompatible(user1.location, user2.location, 10); // Umbral en km

    // Calcular promedio de compatibilidad
    const totalCompatibility = (profComp + prefComp + locComp) / 3;

    return totalCompatibility.toFixed(2); // Retornar compatibilidad como porcentaje con 2 decimales
}

function areProficienciesCompatible(proficiency1, proficiency2) {
    const compatibleProficiencies = {
        "Principiante": ["Principiante", "Intermedio"],
        "Intermedio": ["Principiante", "Intermedio", "Avanzado"],
        "Avanzado": ["Intermedio", "Avanzado"]
    };

    // Verificar compatibilidad directa
    const isCompatible = compatibleProficiencies[proficiency1].includes(proficiency2);

    // Retornar 100 si son compatibles, de lo contrario 0
    return isCompatible ? 100 : 0;
}

function haveCommonPreferences(preferences1, preferences2) {
    // Filtrar preferencias únicas de cada usuario
    const uniqueUser1Prefs = new Set(preferences1);
    const uniqueUser2Prefs = new Set(preferences2);

    // Contador para coincidencias
    let coincidencias = 0;

    // Contar coincidencias
    uniqueUser1Prefs.forEach(pref => {
        if (uniqueUser2Prefs.has(pref)) {
            coincidencias++;
        }
    });

    // Calcular compatibilidad en porcentaje
    const totalPrefs = uniqueUser1Prefs.size + uniqueUser2Prefs.size - coincidencias; // Evitar contar dos veces las coincidencias
    const compatibilidad = totalPrefs > 0 ? (coincidencias / totalPrefs) * 100 : 100;

    return compatibilidad;
}

async function areLocationsCompatible(location1, location2, thresholdKm) {
    try {
        if (!location1 || !location2) {
            console.error('Ubicación no válida:', location1, location2);
            return 0;
        }

        const loc1 = {
            lat: parseFloat(location1.lat),
            lng: parseFloat(location1.lng)
        };
        const loc2 = {
            lat: parseFloat(location2.lat),
            lng: parseFloat(location2.lng)
        };

        if (isNaN(loc1.lat) || isNaN(loc1.lng) || isNaN(loc2.lat) || isNaN(loc2.lng)) {
            console.error('Coordenadas no válidas:', loc1, loc2);
            return 0;
        }

        const distance = getDistanceFromLatLonInKm(loc1.lat, loc1.lng, loc2.lat, loc2.lng);
        const compatibilidad = distance <= thresholdKm ? 100 : (1 - (distance / thresholdKm)) * 100;

        return Math.max(0, compatibilidad);
    } catch (error) {
        console.error('Error al calcular la compatibilidad de ubicación:', error);
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

    export default areCompatible;
