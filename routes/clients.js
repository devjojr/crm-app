const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clients");

router.get("/", clientsController.getAllClients);
router.post("/", clientsController.addClient);
router.get("/edit/:id", clientsController.showEditClientForm);
router.get("/new", clientsController.showAddNewClientForm);
router.post("/update/:id", clientsController.updateClient);
router.post("/delete/:id", clientsController.deleteClient);

module.exports = router;
