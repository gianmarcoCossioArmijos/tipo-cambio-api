const output = document.getElementById('output');
const fetchRate = document.getElementById('fetch-rate');
const fetchDbHealth = document.getElementById('fetch-db-health');
const fetchError500 = document.getElementById('fetch-error-500');
const fetchError404 = document.getElementById('fetch-error-404');

const request = async (route) => {
  output.textContent = 'Cargando...';
  try {
    const response = await fetch(route);
    const payload = await response.json();
    output.textContent = JSON.stringify({ status: response.status, ok: response.ok, body: payload }, null, 2);
  } catch (error) {
    output.textContent = `Error de conexión:\n${error.message}`;
  }
};

fetchRate.addEventListener('click', () => request('/api/tipo-cambio'));
fetchError500.addEventListener('click', () => request('/api/tipo-cambio/error-500'));
fetchError404.addEventListener('click', () => request('/api/tipo-cambio/error-404'));
fetchDbHealth.addEventListener('click', () => request('/api/db-health'));