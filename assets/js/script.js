// Buscando elementos del DOM
const montoInput = document.getElementById('monto'); // input para el monto
const monedaSelect = document.getElementById('moneda');//select para la moneda
const convertidorButton = document.getElementById('convertidor'); //Botón para la conversión
const resultadoP = document.getElementById('resultado'); //párrafo para el resultado
const graficaDiv = document.querySelector('.grafica'); //Div de la gráfica
const ctx = document.getElementById('myChart'); //Canvas para la gráfica
let chart;// Variable para almacenar la gráfica



convertidorButton.addEventListener('click', async () => {
    const monto = parseFloat(montoInput.value); // obtiene y convierte el monto
    const moneda = monedaSelect.value; // obtiene la moneda seleccionada

    if (isNaN(monto) || monto <= 0) {
        resultadoP.textContent = 'Ingrese un monto válido';
        return; // detiene el flujo si el monto no es válido
    }

    try {
        console.log('Consultando API...');
        const res = await fetch('https://mindicador.cl/api/'); // consultando la API
        if (!res.ok) throw new Error('Error al obtener los datos de la API');
        const data = await res.json(); // convierte a JSON la respuesta

        console.log('Datos recibidos:', data); // Verificar si se reciben los datos correctamente

        const monedaMap = {
            usd: 'dolar',
            eur: 'euro',
        };

        const rate = data[monedaMap[moneda]]?.valor;
        if (!rate) throw new Error('La moneda ingresada no está disponible');

        const convertidoMonto = (monto / rate).toFixed(2);
        resultadoP.textContent = `Equivalente: ${convertidoMonto} ${moneda.toUpperCase()}`;

        const historial = data[monedaMap[moneda]]?.serie;

        // Verificar si hay datos históricos disponibles
        if (historial && Array.isArray(historial)) {
            console.log('Historial de datos:', historial); // Verificar los datos históricos
            const last10Dias = historial.slice(0, 10).reverse();
            if (last10Dias.length > 0) {
                renderChart(last10Dias, moneda); // Renderiza la gráfica con datos
                graficaDiv.style.display = 'block'; // Asegurarse de que el gráfico se haga visible
            } else {
                resultadoP.textContent += ' No hay suficientes datos históricos para graficar.';
                graficaDiv.style.display = 'none'; // Ocultar gráfico si no hay datos
            }
        } else {
            resultadoP.textContent += ' No hay datos históricos disponibles para graficar.';
            graficaDiv.style.display = 'none'; // Ocultar gráfico si no hay datos históricos
        }
    } catch (error) {
        console.error(error);
        resultadoP.textContent = `Error: ${error.message}`;
        graficaDiv.style.display = 'none'; // Ocultar gráfico si hay un error
    }
});

