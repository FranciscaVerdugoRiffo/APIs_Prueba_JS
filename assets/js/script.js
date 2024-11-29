// Buscando elementos del DOM
const montoInput = document.getElementById('monto'); // input para el monto
const monedaSelect = document.getElementById('moneda');//select para la moneda
const convertidorButton = document.getElementById('convertidor'); //Botón para la conversión
const resultadoP = document.getElementById('resultado'); //párrafo para el resultado
const graficaDiv = document.querySelector('.grafica'); //Div de la gráfica
const ctx = document.getElementById('myChart'); //Canvas para la gráfica
let chart; // Variable para almacenar la gráfica

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

        console.log('Datos de la API:', data); // Verificar si los datos son correctos

        const monedaMap = {
            usd: 'dolar',
            eur: 'euro',
        };

        const rate = data[monedaMap[moneda]]?.valor;
        if (!rate) throw new Error('La moneda ingresada no está disponible');

        const convertidoMonto = (monto / rate).toFixed(2);
        resultadoP.textContent = `Equivalente: ${convertidoMonto} ${moneda.toUpperCase()}`;

        // Crear un historial simulado de 10 días (de menor a mayor)
        const historialSimulado = [];
        for (let i = 9; i >= 0; i--) {  // Comienza desde el día 10 y va hasta el día 1
            historialSimulado.push({
                fecha: `2024-11-${(29 - i).toString().padStart(2, '0')}`, // Fecha simulada
                valor: rate + Math.random() * 10 - 5, // Valor simulado cerca del valor actual
            });
        }

        // Verificar si el historial simulado tiene datos
        if (historialSimulado.length > 0) {
            renderChart(historialSimulado, moneda); // Renderiza la gráfica con datos simulados
            graficaDiv.style.display = 'block'; // Hacer visible la gráfica
        } else {
            resultadoP.textContent += ' No hay suficientes datos históricos para graficar.';
            graficaDiv.style.display = 'none'; // Ocultar gráfico si no hay datos
        }
    } catch (error) {
        console.error(error);
        resultadoP.textContent = `Error: ${error.message}`;
        graficaDiv.style.display = 'none'; // Ocultar gráfico si hay un error
    }
});

// Función para renderizar la gráfica con los datos simulados
function renderChart(data, moneda) {
    const labels = data.map(item => item.fecha); // Fechas del historial
    const valores = data.map(item => item.valor); // Valores del historial

    // Si ya existe un gráfico, destruirlo antes de crear uno nuevo
    if (chart) {
        chart.destroy();
    }

    // Crear el gráfico
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Etiquetas de las fechas
            datasets: [{
                label: `Historial de ${moneda.toUpperCase()}`,
                data: valores, // Datos de la serie histórica simulada
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Fecha',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: `Valor (${moneda.toUpperCase()})`,
                    },
                }
            }
        }
    });
}
