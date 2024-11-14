function convertToCronFormat(dateString) {
    // Crear un objeto Date a partir de la cadena de fecha
    const date = new Date(dateString);

    // Extraer el minuto, hora, día, mes
    const minute = date.getMinutes();
    const hour = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript empiezan desde 0
    const dayOfWeek = '*'; // No se especifica el día de la semana en node-cron

    // Formatear la cadena cron
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

module.exports = convertToCronFormat