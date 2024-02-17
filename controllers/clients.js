const Client = require("../models/Client");

const getAllClients = async (req, res) => {
  try {
    const pageSize = 10;
    const currentPage = parseInt(req.query.page, 10) || 1;

    // sorting by last name
    const sortByLastName = req.query.sort === "lastName";
    const sortOptions = sortByLastName ? { lastName: 1 } : {};

    // calculating the amount to skip based on the current page and page size
    const skip = (currentPage - 1) * pageSize;
    const totalCount = await Client.countDocuments({ createdBy: req.user._id });

    // calculating total number of pages
    const totalPages = Math.ceil(totalCount / pageSize);

    const clients = await Client.find({ createdBy: req.user._id })
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    res.render("clients", { clients, currentPage, totalPages, sortByLastName });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error retrieving clients");
    res.status(500).send("Error retrieving clients");
  }
};

const addClient = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, sale } = req.body;

    const clientAddress = {
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    };

    const newClient = new Client({
      firstName,
      lastName,
      email,
      phone,
      address: clientAddress,
      sale,
      createdBy: req.user._id,
    });

    await newClient.save();
    res.redirect("/clients");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error adding client");
    res.status(500).send("Error adding a client");
  }
};

const showAddNewClientForm = (req, res) => {
  res.render("clientForm", { client: null });
};

const showEditClientForm = async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).send("Client not found");
    }

    if (client.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("You don't have permission");
    }

    res.render("clientFormEdit", { client });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error rendering edit form");
    res.status(500).send("Error retrieving client for editing");
  }
};

const updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const { firstName, lastName, email, phone, address, sale } = req.body;
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).send("Client not found");
    }

    if (client.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("You do not have permission");
    }

    client.firstName = firstName;
    client.lastName = lastName;
    client.email = email;
    client.phone = phone;
    client.sale = sale;

    client.address.street = address.street;
    client.address.city = address.city;
    client.address.state = address.state;
    client.address.zipCode = address.zipCode;
    client.address.country = address.country;

    await client.save();
    res.redirect("/clients");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error updating client");
    res.status(500).send("Error updating client");
  }
};

const deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).send("Client not found");
    }

    if (client.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("You do not have permission");
    }

    await Client.deleteOne({ _id: clientId });
    res.redirect("/clients");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error deleting client");
    res.status(500).send("Error deleting the client");
  }
};

module.exports = {
  getAllClients,
  addClient,
  showAddNewClientForm,
  showEditClientForm,
  updateClient,
  deleteClient,
};
