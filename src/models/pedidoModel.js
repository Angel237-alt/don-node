let pedidos = [];

function guardar(pedido) {
    pedidos.push(pedido);
}

function obtenerTodos() {
    return pedidos;
}

module.exports = { guardar, obtenerTodos };
