// Importa las dependencias
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Crear un vehículo
router.post("/", async (req, res) => {
  try {
    const { id_cliente, placa, marca, modelo } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO vehiculo (id_cliente, placa, marca, modelo) VALUES (?, ?, ?, ?)",
      [id_cliente, placa, marca, modelo]
    );
    res.status(201).json({ id_cliente: result.insertId, placa, marca, modelo });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Obtener todos los vehículos
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM vehiculo");
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Obtener un solo vehículo por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      "SELECT * FROM vehiculo WHERE id_vehiculo = ?", 
      [id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Vehículo no encontrado" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Actualizar un vehículo
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id del URL:", id); 
    console.log("datos recibidos:", req.body); 

    const { id_cliente, placa, marca, modelo } = req.body;
    const [result] = await pool.execute(
      "UPDATE vehiculo SET id_cliente = ?, placa = ?, marca = ?, modelo = ? WHERE id_vehiculo = ?",
      [id_cliente, placa, marca, modelo, id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: "Vehículo actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Vehículo no encontrado" });
    }
  } catch (err) {
    console.error(err);  
    res.status(500).send(err);
  }
});

// Eliminar un vehículo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      "DELETE FROM vehiculo WHERE id_vehiculo = ?",
      [id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: "Vehículo eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Vehículo no encontrado" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router;

