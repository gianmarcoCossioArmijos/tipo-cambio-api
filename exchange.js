import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import mysql from 'mysql2/promise';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;

const dbConfig = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

async function saveExchangeRates(exchangeData) {
  if (!exchangeData || typeof exchangeData !== 'object') {
    throw new Error('Datos de intercambio inválidos');
  }

  const {
    base_code,
    time_last_update_unix,
    time_next_update_unix,
    time_last_update_utc,
    time_next_update_utc,
    conversion_rates
  } = exchangeData;

  const currencyCode = base_code || 'USD';
  const ratesJson = JSON.stringify(conversion_rates || {});

  const insertQuery = `
    INSERT INTO exchange_rates
    (currency_code, base_code, rates, time_last_update_unix,
    time_next_update_unix, time_last_update_utc, time_next_update_utc)
    VALUES
    (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    currencyCode,
    base_code || 'USD',
    ratesJson,
    time_last_update_unix || null,
    time_next_update_unix || null,
    time_last_update_utc ? new Date(time_last_update_utc) : null,
    time_next_update_utc ? new Date(time_next_update_utc) : null
  ];

  const [result] = await pool.query(insertQuery, values);
  return result.insertId;
}

app.use(express.static('public'));

// Endpoint: obtener tipo de cambio
app.get('/api/tipo-cambio', async (req,res) => {
  try {
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
    const response = await axios.get(url);
    const data = response.data;

    if (response.data.result === "success") {
      try {
        const insertedId = await saveExchangeRates(data);
        res.json({ data, savedId: insertedId });
      } catch (dbError) {
        res.status(500).json({ error: "Error guardando los datos en la base de datos", detalle: dbError.message });
      }
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

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});