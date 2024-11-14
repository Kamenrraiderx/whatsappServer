import cors from 'cors';

// Configuración de opciones de CORS
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  }, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization','Access-Control-Allow-Headers', 'Origin', 'X-Requested-With' , 'Accept'],
};

const configCors = cors(corsOptions);

export default configCors;