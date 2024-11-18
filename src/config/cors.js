const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3001',
  'https://ena-trasportes.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Si el origen está en la lista de permitidos o es undefined (por ejemplo, en Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Permitir acceso
    } else {
      callback(new Error('Origen no permitido por CORS')); // Rechazar acceso
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200, // Para navegadores antiguos
};

const configCors = cors(corsOptions);

module.exports = configCors;
