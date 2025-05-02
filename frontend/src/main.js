// Define la URL base para la A
const API_URL_CLIENTES = 'http://localhost:3000/clientes';
const API_URL_VEHICULO = 'http://localhost:3000/vehiculo';
const API_URL_RECORDATORIO = "http://localhost:3000/recordatorio";

// Cuando el contenido del DOM esté completamente cargado, se ejecutan las siguientes funciones
document.addEventListener('DOMContentLoaded',()=>{

    obtenerClientes();
    obtenerVehiculos();
    obtenerRecordatorios();

    // Manejo del formulario de clientes
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

    // Manejo del formulario de vehículos
    const formv = document.getElementById('vehiculo-form');
    formv.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id_cliente = document.getElementById('cliente-id-input').value;
    const placa = document.getElementById('placa-input').value;
    const marca = document.getElementById('marca-input').value;
    const modelo = document.getElementById('modelo-input').value;

    await agregarVehiculo(id_cliente, placa, marca, modelo);
    formv.reset();
    obtenerVehiculos();
  }); 
    
    // Manejo del formulario de recordatorios
    const formRecordatorio = document.getElementById('recordatorio-form');
    formRecordatorio.addEventListener('submit', async function (event) {
    event.preventDefault();
    const id_vehiculo = document.getElementById('vehiculo-id-input').value;
    const tipo_recordatorio = document.getElementById('tipo-recordatorio-input').value;
    const fecha_vencimiento = document.getElementById('fecha-vencimiento-input').value;
    const estado = document.getElementById('estado-input').value;

    await agregarRecordatorio(id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado);
    this.reset();
    obtenerRecordatorios();
  });

    // Navegación entre secciones del menú sin necesidad de otra pestaña
    document.getElementById('clientes-menu').addEventListener('click', function (event) {
      event.preventDefault();
      history.pushState(null, '', '/clientes');
      document.getElementById('clientes-section').classList.add('active');
      document.getElementById('vehiculo-section').classList.remove('active');
      document.getElementById('recordatorio-section').classList.remove('active');
  });

    document.getElementById('vehiculo-menu').addEventListener('click', function (event) {
      event.preventDefault();
      history.pushState(null, '', '/vehiculos');
      document.getElementById('clientes-section').classList.remove('active');
      document.getElementById('vehiculo-section').classList.add('active');
      document.getElementById('recordatorio-section').classList.remove('active');
    });

    document.getElementById('recordatorio-menu').addEventListener('click', function (event) {
      event.preventDefault();
      history.pushState(null, '', '/recordatorios');
      document.getElementById('clientes-section').classList.remove('active');
      document.getElementById('vehiculo-section').classList.remove('active');
      document.getElementById('recordatorio-section').classList.add('active');
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
    const response = await fetch(`${API_URL_CLIENTES}/${id}`, {
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
    const response = await fetch(`${API_URL_CLIENTES}/${id}`, {
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

//Obtener Vehiculos
async function obtenerVehiculos() {
  const listaVehiculo = document.getElementById("vehiculos-list");
  listaVehiculo.innerHTML='';
  try {
    const response = await fetch(`${API_URL_VEHICULO}`);
    const vehiculos = await response.json();
    vehiculos.forEach(vehiculo => {
      const item = document.createElement("tr");
        item.innerHTML = `
          <td><input type="number" value="${vehiculo.id_cliente}" /></td>  
          <td><input type="text" value="${vehiculo.placa}" /></td>  
          <td><input type="text" value="${vehiculo.marca}" /></td>  
          <td><input type="text" value="${vehiculo.modelo}" /></td> 
          <td>
            <button class="btn-guardar">💾</button>
            <button class="btn-eliminar">🚮</button>
          </td>`;
        
        const [clienteIdInput, placaInput, marcaInput, modeloInput] = item.querySelectorAll('input');
        item.querySelector('.btn-guardar').onclick = async () => {
          await actualizarVehiculo(vehiculo.id_vehiculo, clienteIdInput.value, placaInput.value, marcaInput.value, modeloInput.value);
          obtenerVehiculos();
        };
        item.querySelector('.btn-eliminar').onclick = async () => {
          await eliminarVehiculo(vehiculo.id_vehiculo);
          obtenerVehiculos();
        }

        listaVehiculo.appendChild(item);
      });
  } catch (error) {
    console.error("Error con el vehiculo", error);
  }
}

//Agregar un Vehiculo
async function agregarVehiculo(id_cliente, placa, marca, modelo) {
  try {
    const response = await fetch(API_URL_VEHICULO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_cliente, placa, marca, modelo })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al agregar vehiculo', error);
  }
}

//Actualizar un Vehiculo
async function actualizarVehiculo(id, id_cliente, placa, marca, modelo) {
  alert(id + " " + id_cliente + " " + placa + " " + marca + " " + modelo);
  try {
    const response = await fetch(`${API_URL_VEHICULO}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cliente, placa, marca, modelo }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();  // Aquí puedes ver lo que devuelve el backend
    console.log(data);
    
  } catch (error) {
    console.error("Error", error);
  }
}

//Eliminar Vehiculo
async function eliminarVehiculo(id) {
  try {
    const response = await fetch(`${API_URL_VEHICULO}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar vehiculo", error);
  }
}

// Obtener Recordatorios
async function obtenerRecordatorios() {
  const listaRecordatorio = document.getElementById("recordatorio-list");
  listaRecordatorio.innerHTML = '';
  try {
    const response = await fetch(`${API_URL_RECORDATORIO}`);
    const recordatorios = await response.json();
    recordatorios.forEach(recordatorio => {
      const item = document.createElement("tr");
      item.innerHTML = `
        <td><input type="number" value="${recordatorio.id_vehiculo}" /></td>
        <td><input type="text" value="${recordatorio.tipo_recordatorio}" /></td>
        <td><input type="text" value="${recordatorio.fecha_vencimiento.substring(0,10)}" /></td>
        <td><input type="text" value="${recordatorio.estado}" /></td>
        <td>
          <button class="btn-guardar">💾</button>
          <button class="btn-eliminar">🚮</button>
        </td>`;

      const [vehiculoInput, tipoInput, fechaInput, estadoInput] = item.querySelectorAll('input');
      
      item.querySelector('.btn-guardar').onclick = async () => {
        await actualizarRecordatorio(recordatorio.id_recordatorio, vehiculoInput.value, tipoInput.value, fechaInput.value, estadoInput.value);
        obtenerRecordatorios();
      };

      item.querySelector('.btn-eliminar').onclick = async () => {
        await eliminarRecordatorio(recordatorio.id_recordatorio);
        obtenerRecordatorios();
      };

      listaRecordatorio.appendChild(item);
    });
  } catch (error) {
    console.error("Error al obtener recordatorios:", error);
  }
}

// Agregar Recordatorio
async function agregarRecordatorio(id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado) {
  try {
    const response = await fetch(API_URL_RECORDATORIO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al agregar recordatorio:', error);
  }
}

// Actualizar Recordatorio
async function actualizarRecordatorio(id, id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado) {
  try {
    const response = await fetch(`${API_URL_RECORDATORIO}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error al actualizar recordatorio:", error);
  }
}

// Eliminar Recordatorio
async function eliminarRecordatorio(id) {
  try {
    const response = await fetch(`${API_URL_RECORDATORIO}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar recordatorio:", error);
  }
}