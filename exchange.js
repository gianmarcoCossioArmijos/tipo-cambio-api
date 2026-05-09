import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;

// Endpoint: obtener tipo de cambio
app.get('/api/tipo-cambio', async (req,res) => {
  try {
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
    const response = await axios.get(url);
    const data = response.data;

    if (response.data.result === "success") {
      res.json({data});
    } else {
      res.status(500).json({error: "Error en la API Exchange Rate"});
    }
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener datos",
      detalle: error.message
    });
  }
});

// Endpoint: ERROR 500
app.get('/api/tipo-cambio/error-500', async (req,res) => {
  res.status(500).json({
    error: "Error test 500",
    detalle: "Se obtuvo error tipo 500 en la aplicacion, INTERNAL SERVER ERROR"
  });
});

// Endpoint: ERROR 404
app.get('/api/tipo-cambio/error-404', async (req,res) => {
  res.status(404).json({
    error: "Error test 404",
    detalle: "Se obtuvo error tipo 404 en la aplicacion, NOT FOUND"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});