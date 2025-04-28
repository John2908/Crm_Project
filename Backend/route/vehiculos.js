const express = require('express');
const router = express.Router();
const pool = require('../db')

//crear cliente
router.post('/', async (req, res) => {
    try {
        const { id_vehiculo, Placa, Marca, Modelo } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO vehiculo (id_clientes, Placa, Marca, Modelo) VALUES (?, ?, ?, ?)',
            [id_clientes, Placa, Marca, Modelo] 
        );
        res.status(201).json({Id: result.insertId, id_vehiculo, Placa, Marca, Modelo});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el vehículo' });
    }
});

//obtener todos los vehiculos
router.get('/', async (req, res) => {
    try{
        const [rows] = await pool.execute('SELECT * FROM vehiculo');
        res.json(rows);
    } catch (error) {
        console.error(rows)
        res.status(500).send(error);
    }
});

//obtener vehiculo por id 
router.get('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const [ rows ] = await pool.execute ('SELECT * FROM vehiculo where Id_vehiculos = ?',[id]);
        if(rows.length > 0){
            res.json(rows[0]);
        } else {
            res.status(404).json({ message:' Vehiculo no encontrado'})
        }
    } catch (error){
        console.error(error);
        res.status(500).send(error);
    }
});

//actualizar vehiculo
router.put('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const { Placa, Marca, Modelo } = req.body;
        const [ result ] = await pool.execute(
            'UPDATE vehiculo SET Placa = ?, Marca = ?, Modelo = ? WHERE Id_vehiculo = ?',
            [Placa, Marca, Modelo, id]
        );
        if(result.affectedRows > 0){
            res.json ({ message:'Vehiculo actualizado'});
        } else { 
            res.status(404).json({message: 'Vehiculo no encotrado'})
        }
    } catch (error){
        console.error(error);
        res.status(500).send(error);
    }
})

//Eliminar Vehiculo
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('ID recibido para eliminar:', id);
      const [result] = await pool.execute(
        'DELETE FROM vehiculo WHERE Id_vehiculo = ?',
        [id]
      );
      if (result.affectedRows > 0) {
        res.json({ message: 'Vehículo eliminado correctamente' });
      } else {
        res.status(404).json({ message: 'Vehículo no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar vehículo:',error);
      res.status(500).send(error);
    }
});

module.exports = router;