// Importa las dependencias
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Crear un recordatorio
router.post("/", async (req, res) => {
  try {
    const { id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO recordatorio (id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado) VALUES (?, ?, ?, ?)",
      [id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado]
    );
    res.status(201).json({  
      id_recordatorio: result.insertId, 
      id_vehiculo, 
      tipo_recordatorio, 
      fecha_vencimiento, 
      estado 
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Obtener todos los recordatorios
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM recordatorio");
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Obtener un solo recordatorio por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      "SELECT * FROM recordatorio WHERE id_recordatorio = ?", 
      [id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Recordatorio no encontrado" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Actualizar un recordatorio
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID del URL:", id);
    console.log("Datos recibidos:", req.body);

    const { id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado } = req.body;
    const [result] = await pool.execute(
      "UPDATE recordatorio SET id_vehiculo = ?, tipo_recordatorio = ?, fecha_vencimiento = ?, estado = ? WHERE id_recordatorio = ?",
      [id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado, id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: "Recordatorio actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Recordatorio no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Eliminar un recordatorio
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      "DELETE FROM recordatorio WHERE id_recordatorio = ?",
      [id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: "Recordatorio eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Recordatorio no encontrado" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Exportar el router
module.exports = router;
