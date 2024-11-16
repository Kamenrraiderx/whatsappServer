const  cors =  require('cors') ;

// Configuración de opciones de CORS
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization','Access-Control-Allow-Headers', 'Origin', 'X-Requested-With' , 'Accept'],
};

const configCors = cors(corsOptions);

module.exports = configCors;