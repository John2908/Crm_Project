// Define la URL base para la A
const API_URL_CLIENTES = 'http://localhost:3000/clientes';
const API_URL_VEHICULOS = 'http://localhost:3000/vehiculo';


document.addEventListener('DOMContentLoaded',()=>{
    obtenerClientes();
    obtenervehiculos();
    

    const form = document.getElementById('cliente-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const nombre = document.getElementById('nombre-input').value;
      const email = document.getElementById('email-input').value;
      const telefono = document.getElementById('telefono-input').value;
  
      await agregarCliente(nombre, email, telefono);
      form.reset();
      obtenerClientes();
  });

    // Formulario de vehículos
    const formVehiculos = document.getElementById('vehiculos-form');
    formVehiculos.addEventListener('submit', async (event) => {
        event.preventDefault();
        const clienteId = document.getElementById('cliente-id-input').value; 
        const marca = document.getElementById('marca-input').value;
        const modelo = document.getElementById('modelo-input').value;
        const placa = document.getElementById('placa-input').value;

        await agregarVehiculos(clienteId, marca, modelo, placa);
        formVehiculos.reset();
        obtenervehiculos();
  });
});

//Obtener Clientes 
async function obtenerClientes() {
  const listaCliente= document.getElementById("clientes-list");
  listaCliente.innerHTML='';
  try {
    const response = await fetch(`${API_URL_CLIENTES}`);
    const clientes = await response.json();
    clientes.forEach(cliente => {
      const item = document.createElement("tr");
        item.innerHTML = `
          <td><input type="text" value="${cliente.nombre}" /></td>
          <td> <input type="text" value= "${cliente.email}"></td>
          <td> <input type="text" value= "${cliente.telefono}"></td>
          <td>
            <button class="btn-guardar">💾</button>
            <button class="btn-eliminar">🚮</button>
          </td>`;
           
        const [nombreInput, emailInput, telefonoInput] = item.querySelectorAll('input');
        item.querySelector('.btn-guardar').onclick = async () => {
          await actualizarCliente(cliente.id_cliente, nombreInput.value, emailInput.value, telefonoInput.value);
          obtenerClientes();
        };
        item.querySelector('.btn-eliminar').onclick = async () =>{
          await eliminarCliente(cliente.id_cliente);
          obtenerClientes();
        }

        listaCliente.appendChild(item);
      });
  } catch (error) {
    console.error("Error con el cliente", error);
  }
}

//Agregar un cliente
async function agregarCliente(nombre, email, telefono){
  try{
    const response = await fetch(API_URL_CLIENTES, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({nombre, email, telefono})
    });
    if (!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }catch(error) {
    console.error('Error al agregar cliente',error);
  }
}


//Actualizar un cliente
async function actualizarCliente(id, nombre, email, telefono) {
  alert(id+nombre+email+telefono);
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, telefono }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

//Eliminar Cliente
async function eliminarCliente(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar cliente", error);
  }
}

// Obtener Vehículos
async function obtenervehiculos() {
  const listaVehiculos = document.getElementById("vehiculos-list");
  listaVehiculos.innerHTML = '';
  try {
      const response = await fetch(API_URL_VEHICULOS);
      const vehiculos = await response.json();
      vehiculos.forEach(vehiculo => {
          const item = document.createElement("tr");
          item.innerHTML = `
              <td><input type="text" value="${vehiculo.id_cliente}" /></td>
              <td><input type="text" value="${vehiculo.marca}" /></td>
              <td><input type="text" value="${vehiculo.modelo}" /></td>
              <td><input type="text" value="${vehiculo.placa}" /></td>
              <td>
                  <button class="btn-guardar">💾</button>
                  <button class="btn-eliminar">🚮</button>
              </td>`;
          
          const [idClienteInput, marcaInput, modeloInput, placaInput] = item.querySelectorAll('input');
          item.querySelector('.btn-guardar').onclick = async () => {
            await actualizarVehiculos(vehiculo.id_vehiculo, marcaInput.value, modeloInput.value, placaInput.value);
              obtenerVehiculos();
          };
          item.querySelector('.btn-eliminar').onclick = async () => {
            await eliminarVehiculos(vehiculo.id_vehiculo);
              obtenerVehiculos();
          };

          listaVehiculos.appendChild(item);
      });
  } catch (error) {
      console.error("Error al obtener vehículos", error);
  }
}

// Agregar un vehículo
async function agregarVehiculos(clienteId, marca, modelo, placa) {
  try {
      const response = await fetch(API_URL_VEHICULOS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({id_vehiculo, marca, modelo, placa })
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Error al agregar vehículo', error);
  }
}

// Actualizar un vehículo
async function actualizarVehiculos(id_cliente, marca, modelo, placa) {
  try {
      const response = await fetch(`${API_URL_VEHICULOS}/${id_vehiculo}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_cliente, marca, modelo, placa }),
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error("Error al actualizar vehículo", error);
  }
}

// Eliminar un vehículo
async function eliminarVehiculos(id) {
  try {
      const response = await fetch(`${API_URL_VEHICULOS}/${id}`, {
          method: "DELETE",
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error("Error al eliminar vehículo", error);
  }
}