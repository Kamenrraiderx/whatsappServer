function getLastDayOfMonth() {
    const today = new Date(); // Fecha actual
    const year = today.getFullYear(); // Año actual
    const month = today.getMonth(); // Mes actual (0-11)

    // Crear una fecha con el próximo mes y día 0 (que equivale al último día del mes actual)
    const lastDay = new Date(year, month + 1, 0);

    // Retornar solo el día del mes
    return lastDay.getDate();
}

module.exports = getLastDayOfMonth