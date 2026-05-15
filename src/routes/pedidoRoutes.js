const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidoController');

router.post('/', controller.registrarPedido);
router.get('/lista', controller.listarPedidos);

module.exports = router;
