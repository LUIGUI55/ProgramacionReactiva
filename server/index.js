const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());

// BASE DE DATOS SIMULADA
let sensores = [
    { id: 1, nombre: 'Sensor Sala', tipo: 'Temperatura', valor: 24 },
    { id: 2, nombre: 'Sensor Cocina', tipo: 'Humedad', valor: 60 },
    { id: 3, nombre: 'Sensor Jardín', tipo: 'Luz', valor: 85 }
];

// Router for API routes
const router = express.Router();

// ENDPOINTS
// Obtener todos los sensores
router.get('/sensores', (req, res) => {
    res.json(sensores);
});

// Crear un nuevo sensor
router.post('/sensores', (req, res) => {
    const nuevoSensor = {
        id: Date.now(),
        nombre: req.body.nombre,
        tipo: req.body.tipo,
        valor: Number(req.body.valor)
    };
    sensores.push(nuevoSensor);
    res.status(201).json(nuevoSensor);
});

// Eliminar un sensor por ID
router.delete('/sensores/:id', (req, res) => {
    const id = parseInt(req.params.id);
    sensores = sensores.filter(sensor => sensor.id !== id);
    res.json({ mensaje: 'Sensor eliminado correctamente', id: id });
});

// Filtrar por tipo (BONUS)
router.get('/sensores/tipo/:tipo', (req, res) => {
    const tipo = req.params.tipo;
    const filtrados = sensores.filter(s => s.tipo === tipo);
    res.json(filtrados);
});

// Mount router at /api so it matches both local and Netlify paths if configured correctly
// On Netlify, we'll redirect /api/* to this function.
// The function path usually strips the function name, but we want to be careful.
// Standard Express pattern:
app.use('/api', router);

// For local development
if (!process.env.NETLIFY) {
    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`Servidor API corriendo en http://localhost:${PORT}`);
    });
}

// Export for Netlify
module.exports.handler = serverless(app);
