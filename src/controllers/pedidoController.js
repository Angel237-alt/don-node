const PedidoModel = require('../models/pedidoModel');

const PRECIOS = {
    chica:   { base: 3990, extra: 500 },
    mediana: { base: 5990, extra: 800 },
    grande:  { base: 8490, extra: 1200 }
};

function registrarPedido(req, res) {
    const { nombre, tamanio, cantidad } = req.body;
    let ingredientes = req.body.ingredientes || [];
    if (!Array.isArray(ingredientes)) ingredientes = [ingredientes];

    const cantNum = parseInt(cantidad);
    const extras = Math.max(0, ingredientes.length - 3);
    const precioUnitario = PRECIOS[tamanio].base + (extras * PRECIOS[tamanio].extra);
    const total = precioUnitario * cantNum;

    PedidoModel.guardar({ nombre, tamanio, ingredientes, precioUnitario, cantidad: cantNum, total });
    res.redirect('/pedidos/lista');
}

function listarPedidos(req, res) {
    const pedidos = PedidoModel.obtenerTodos();
    const totalAcumulado = pedidos.reduce((acc, p) => acc + p.total, 0);

    const filas = pedidos.map(p => `
        <tr>
            <td>${p.nombre}</td>
            <td>${p.tamanio.charAt(0).toUpperCase() + p.tamanio.slice(1)}</td>
            <td>${p.ingredientes.join(', ')}</td>
            <td>$${p.precioUnitario.toLocaleString('es-CL')}</td>
            <td>${p.cantidad}</td>
            <td>$${p.total.toLocaleString('es-CL')}</td>
        </tr>
    `).join('');

    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Pedidos - Don Node</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="container">
        <h1>🍕 Lista de Pedidos</h1>
        ${pedidos.length === 0 ? '<p class="vacio">No hay pedidos aún.</p>' : `
        <table>
            <thead>
                <tr>
                    <th>Cliente</th><th>Tamaño</th><th>Ingredientes</th>
                    <th>Precio unitario</th><th>Cantidad</th><th>Total</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
            <tfoot>
                <tr>
                    <td colspan="5"><strong>Total acumulado</strong></td>
                    <td><strong>$${totalAcumulado.toLocaleString('es-CL')}</strong></td>
                </tr>
            </tfoot>
        </table>`}
        <a href="/" class="link">← Volver al formulario</a>
    </div>
</body>
</html>`);
}

module.exports = { registrarPedido, listarPedidos };
