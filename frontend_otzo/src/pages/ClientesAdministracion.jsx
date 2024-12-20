/*

Pagina Principal para el Modulo de Clientes (Version Administrativa)
Creado por: JOVEN JIMENEZ ANGEL CRISTIAN

Temas Especiales de Programacion 2 | 1061

*/

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
//Si quieres tener la funcionalidad de poder obtener los datos del usuario que ha iniciado sesion, importa esto:
import { ObtenerTipoUsuario } from "../context/obtenerUsuarioTipo";

export function ClientesAdministracion() {
  const { clienteActual, idCliente, administradorActual, idEmpleado } = ObtenerTipoUsuario(); // Aqui mandamos a llamar a las variables que contienen la info del que inicio sesion.
  const [listaClientes, setListaClientes] = useState([]);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);
  const [clienteParaAñadir, setClienteParaAñadir] = useState(null);
  const [mostrarMensajeModalAutorizacion, setmostrarMensajeModalAutorizacion] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [puntos, setPuntos] = useState([]);
  const [rangos, setRangos] = useState([]);

  useEffect(() => {
    //Para obtener la lista de todos los clientes
    axios.get('http://localhost:5000/api/clientes/clientes')
      .then(respuesta => {
        if (Array.isArray(respuesta.data)) {
          setListaClientes(respuesta.data);
        } else {
          console.error("Error en la respuesta del servidor para la lista de clientes:", respuesta.data);
        }
      })
      .catch(error => {
        console.error("Error al obtener la lista de todos los clientes:", error);
      });

    //Para obtener los puntos y los rangos
    axios.get('http://localhost:5000/api/fidelizacion/obtenerpuntos')
      .then(response => {
        setPuntos(response.data.Puntos);
      })
      .catch(error => {
        console.error("Error al obtener los puntos:", error);
      });

    axios.get('http://localhost:5000/api/fidelizacion/obtenerrango')
      .then(response => {
        setRangos(response.data.Rangos);
      })
      .catch(error => {
        console.error("Error al obtener los rangos:", error);
      });

  }, [idCliente]);

  const verificarPermisosCliente = () => {
    const estadosRestringidos = ['Suspendido', 'Inactivo', 'Baneado'];
    const areasPermitidas = ['Clientes', 'Administracion', 'DBA'];
  
    if (administradorActual && estadosRestringidos.includes(administradorActual.estado_cuenta)) {
      setModalMessage(
        `No puede usar este boton porque su cuenta tiene el estado: "${administradorActual.estado_cuenta}".\n
        Por favor, contacte al DBA o a algun otro Administrador para poder resolver este problema.`
      );
      setmostrarMensajeModalAutorizacion(true);
      return false;
    }
  
    if (!administradorActual || !areasPermitidas.includes(administradorActual.area_Trabajo)) {
      setModalMessage(
        `No puede usar este boton debido a que no tiene el area de trabajo necesario para poder usar estos botones.\n
        Solo los usuarios con las areas de trabajo: ${areasPermitidas.join(', ')} tienen acceso.\n
        Su area de trabajo actual es: ${administradorActual ? administradorActual.area_Trabajo : 'Desconocida'}.`
      );
      setmostrarMensajeModalAutorizacion(true);
      return false;
    }
  
    return true;
  };

  const validarCliente = (cliente) => {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      genero,
      direccion_calle,
      direccion_colonia,
      direccion_codigopostal,
      direccion_estado,
      direccion_municipio,
      contacto_correo,
      contraseña,
      contacto_telefono,
    } = cliente;

    if (!nombre || !apellido_paterno || !apellido_materno) {
      return "Por favor, complete los campos: Nombre, Apellido Paterno y Apellido Materno.";
    }

    if (fecha_nacimiento && !/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento)) {
      return "La fecha de nacimiento debe tener el formato AAAA-MM-DD.";
    }

    if (!fecha_nacimiento) {
      return "Ingrese una fecha de nacimiento.";
    }

    if (genero !== "Masculino" && genero !== "Femenino") {
      return "El genero debe ser 'Masculino' o 'Femenino'.";
    }

    if (!direccion_calle || !direccion_colonia || !direccion_codigopostal || !direccion_estado || !direccion_municipio) {
      return "Por favor, complete los campos: Calle, Colonia, Codigo Postal, Estado y Municipio.";
    }

    if (direccion_codigopostal && (!/^\d{5,8}$/.test(direccion_codigopostal) || direccion_codigopostal.length > 10)) {
      return "El codigo postal debe tener entre 5 y 8 digitos.";
    }

    if (!contacto_correo) {
      return "Ingrese un correo electronico";
    }

    if (contacto_correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto_correo)) {
      return "Ingrese un correo electronico valido.";
    }

    if (!contraseña) {
      return "Ingrese una contraseña";
    }

    if (contraseña && (contraseña.length > 255 || contraseña.length < 6)) {
      return "La contraseña debe tener entre 6 y 255 caracteres.";
    }

    if (!contacto_telefono) {
      return "Ingrese un numero telefonico";
    }

    if (contacto_telefono && !/^\d{8,15}$/.test(contacto_telefono)) {
      return "El telefono debe ser un numero valido de entre 8 y 15 digitos.";
    }

    return null;
  };

  const manejarConfirmarCambios = () => {
    const error = validarCliente(clienteParaEditar);
    if (error) {
      alert(error);
      return;
    }

    const datosActualizados = { ...clienteParaEditar };

    axios.put(`http://localhost:5000/api/clientes/modificarcliente/${clienteParaEditar.idCliente}`, datosActualizados)
      .then(() => {
        alert("Cambios realizados exitosamente.");
        setClienteParaEditar(null);
        window.location.reload();
      })
      .catch(error => {
        console.error("Error al modificar el cliente:", error);
        alert("Error al modificar el cliente.");
      });
  };

  const manejarConfirmarAñadir = () => {
    const error = validarCliente(clienteParaAñadir);
    if (error) {
      alert(error);
      return;
    }

    axios.post("http://localhost:5000/api/clientes/crearcliente", clienteParaAñadir)
      .then(() => {
        alert("Cliente añadido exitosamente.");
        setClienteParaAñadir(null);
        window.location.reload();
      })
      .catch(error => {
        console.error("Error al añadir el cliente:", error);
        alert("Error al añadir el cliente.");
      });
  };

  const manejarCambioEntrada = (e) => {
    const { name, value } = e.target;
    if (clienteParaEditar) {
      setClienteParaEditar({ ...clienteParaEditar, [name]: value });
    } else {
      setClienteParaAñadir({ ...clienteParaAñadir, [name]: value });
    }
  };

  const manejarClickModificar = (cliente) => {
    if (!verificarPermisosCliente()) return;
    setClienteParaEditar(cliente);
  };

  const manejarClickAñadirCliente = () => {
    if (!verificarPermisosCliente()) return;
    setClienteParaAñadir({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      fecha_nacimiento: "",
      genero: "",
      direccion_calle: "",
      direccion_colonia: "",
      direccion_codigopostal: "",
      direccion_estado: "",
      direccion_municipio: "",
      contacto_correo: "",
      contraseña: "",
      contacto_telefono: "",
    });
  };

  const manejarDarDeAlta = (idCliente) => {
    if (!verificarPermisosCliente()) return;
    axios.post(`http://localhost:5000/api/clientes/daraltacliente/${idCliente}`)
      .then(respuesta => {
        alert(respuesta.data.mensaje);
        window.location.reload();
      })
    .catch(error => {
      console.error("Error al dar de alta al cliente:", error);
      alert("Error al dar de alta al cliente.");
    });
  }

  const manejarSuspender = (idCliente) => {
    if (!verificarPermisosCliente()) return;
    axios.post(`http://localhost:5000/api/clientes/suspendercliente/${idCliente}`)
      .then(respuesta => {
        alert(respuesta.data.mensaje);
        window.location.reload();
      })
    .catch(error => {
      console.error("Error al suspender al cliente:", error);
      alert("Error al suspender al cliente.");
    });
  }

  const manejarDarDeBaja = (idCliente) => {
    if (!verificarPermisosCliente()) return;
    axios.post(`http://localhost:5000/api/clientes/darbajacliente/${idCliente}`)
      .then(() => {
        alert("Cliente dado de baja exitosamente.");
        window.location.reload();
      })
      .catch(error => {
        console.error("Error al dar de baja al cliente:", error);
        alert("Error al dar de baja al cliente.");
      });
  };

  return (
    <div className='bg-gradient-to-r from-yellow-400 to-yellow-500 w-full min-h-screen z-0 relative'>
      <motion.h1 initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.5 } }} className='text-center text-white text-4xl md:text-6xl font-bold p-4'>Clientes</motion.h1>

      <div className="flex flex-col gap-4 p-4 md:p-8">
        {/* Recuadro - Cliente actual */}
        {/*<div className="w-full flex justify-center">
          <motion.div
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { delay: 0.8 } }}
            className="w-full md:w-2/3 bg-white rounded-lg p-4 shadow-lg overflow-x-auto"
          >
            <div className="shadow-lg rounded-lg p-4 bg-gray-900">
              <center>
                <h2 className="font-bold text-white">
                  <i className="align-middle fi fi-sr-user"></i> Cliente Actual
                </h2>
              </center>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-center">ID</th>
                    <th className="py-2 px-4 border-b text-center">Nombre</th>
                    <th className="py-2 px-4 border-b text-center">Apellido Paterno</th>
                    <th className="py-2 px-4 border-b text-center">Apellido Materno</th>
                    <th className="py-2 px-4 border-b text-center">Correo Electrónico</th>
                    <th className="py-2 px-4 border-b text-center">Telefono</th>
                    <th className="py-2 px-4 border-b text-center">Total de Puntos</th>
                    <th className="py-2 px-4 border-b text-center">Rango Actual</th>
                    <th className="py-2 px-4 border-b text-center">Estado de la Cuenta</th>
                    <th className="py-2 px-4 border-b text-center">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {clienteActual ? (
                    <tr>
                      <td className="py-2 px-4 border-b text-center">{clienteActual.idCliente}</td>
                      <td className="py-2 px-4 border-b text-center">{clienteActual.nombre}</td>
                      <td className="py-2 px-4 border-b text-center">{clienteActual.apellido_paterno}</td>
                      <td className="py-2 px-4 border-b text-center">{clienteActual.apellido_materno}</td>
                      <td className="py-2 px-4 border-b text-center">{clienteActual.contacto_correo}</td>
                      <td className="py-2 px-4 border-b text-center">{clienteActual.contacto_telefono}</td>
                        Para poder mostrar el total de puntos y el rango del cliente actual
                      <td className="py-2 px-4 border-b text-center">
                        {(() => {
                          const puntosCliente = puntos.find(p => p.idclientes_puntos === clienteActual.idCliente);
                          return puntosCliente ? puntosCliente.total_puntos : "N/A";
                        })()}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {(() => {
                          const puntosCliente = puntos.find(p => p.idclientes_puntos === clienteActual.idCliente);
                          if (puntosCliente) {
                            const rangoCliente = rangos.find(r => r.idrango === puntosCliente.idrango);
                            return rangoCliente ? rangoCliente.nombre_rango : "N/A";
                          }
                          return "N/A";
                        })()}
                      </td>
                      <td className="py-2 px-4 border-b text-center">{clienteActual.estado_cuenta}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <button onClick={() => manejarClickModificar(clienteActual)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Modificar</button>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="10" className="py-2 px-4 border-b text-center">No se encontro informacion del cliente actual.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>*/}
        <div className="grid grid-cols-1 gap-4">
          {/* Recuadro - Lista de clientes */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { delay: 0.8 } }}
            className="w-full bg-white rounded-lg p-4 shadow-lg"
          >
            <div className="shadow-lg rounded-lg p-4 bg-gray-900">
              <center>
                <h2 className="font-bold text-white">
                  <i className="align-middle fi fi-sr-users"></i> Lista de Clientes
                </h2>
              </center>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={manejarClickAñadirCliente} className="bg-green-500 text-white px-4 py-2 rounded">Añadir Cliente</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-center">ID</th>
                    <th className="py-2 px-4 border-b text-center">Nombre</th>
                    <th className="py-2 px-4 border-b text-center">Apellido Paterno</th>
                    <th className="py-2 px-4 border-b text-center">Apellido Materno</th>
                    <th className="py-2 px-4 border-b text-center">Correo Electronico</th>
                    <th className="py-2 px-4 border-b text-center">Telefono</th>
                    <th className="py-2 px-4 border-b text-center">Total de Puntos</th>
                    <th className="py-2 px-4 border-b text-center">Rango Actual</th>
                    <th className="py-2 px-4 border-b text-center">Estado de la Cuenta</th>
                    <th className="py-2 px-4 border-b text-center">Fecha de Alta</th>
                    <th className="py-2 px-4 border-b text-center">Fecha de Ultimo Acceso</th>
                    <th className="py-2 px-4 border-b text-center">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {listaClientes.length > 0 ? (
                    listaClientes.map((cliente, index) => (
                      <tr key={cliente.idCliente} className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}>
                        <td className="py-2 px-4 border-b text-center">{cliente.idCliente}</td>
                        <td className="py-2 px-4 border-b text-center">{cliente.nombre}</td>
                        <td className="py-2 px-4 border-b text-center">{cliente.apellido_paterno}</td>
                        <td className="py-2 px-4 border-b text-center">{cliente.apellido_materno}</td>
                        <td className="py-2 px-4 border-b text-center">{cliente.contacto_correo}</td>
                        <td className="py-2 px-4 border-b text-center">{cliente.contacto_telefono}</td>
                        {/* Para poder mostrar el total de puntos y el rango del todos los clientes */}
                        <td className="py-2 px-4 border-b text-center">
                          {(() => {
                            const puntosCliente = puntos.find(p => p.idclientes_puntos === cliente.idCliente);
                            return puntosCliente ? puntosCliente.total_puntos : "N/A";
                          })()}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {(() => {
                            const puntosCliente = puntos.find(p => p.idclientes_puntos === cliente.idCliente);
                            if (puntosCliente) {
                              const rangoCliente = rangos.find(r => r.idrango === puntosCliente.idrango);
                              return rangoCliente ? rangoCliente.nombre_rango : "N/A";
                            }
                            return "N/A";
                          })()}
                        </td>
                        <td className="py-2 px-4 border-b text-center">{cliente.estado_cuenta}</td>
                        <td className="py-2 px-4 border-b text-center">{cliente.fechaDe_Alta}</td>
                        <td className="py-2 px-4 border-b text-center">{cliente.ultimo_acceso}</td>
                        <td className="py-2 px-4 border-b text-center">
                          <button onClick={() => manejarClickModificar(cliente)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Modificar</button>
                          <button onClick={() => manejarDarDeAlta(cliente.idCliente)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Dar de Alta</button>
                        <button onClick={() => manejarSuspender(cliente.idCliente)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Suspender</button>
                          <button onClick={() => manejarDarDeBaja(cliente.idCliente)} className="bg-red-500 text-white px-2 py-1 rounded">Dar de Baja</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="py-2 px-4 border-b text-center">No se encontraron clientes.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Formulario para poder modificar o añadir clientes */}
      {(clienteParaEditar || clienteParaAñadir) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">{clienteParaEditar ? "Modificar Cliente" : "Añadir Cliente"}</h2>
            <form>
              <div className="grid grid-cols-1 gap-4">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={clienteParaEditar ? clienteParaEditar.nombre : clienteParaAñadir.nombre}
                  onChange={manejarCambioEntrada}
                  placeholder="Nombre"
                  className="p-2 border rounded"
                />
                <label>Apellido Paterno</label>
                <input
                  type="text"
                  name="apellido_paterno"
                  value={clienteParaEditar ? clienteParaEditar.apellido_paterno : clienteParaAñadir.apellido_paterno}
                  onChange={manejarCambioEntrada}
                  placeholder="Apellido Paterno"
                  className="p-2 border rounded"
                />
                <label>Apellido Materno</label>
                <input
                  type="text"
                  name="apellido_materno"
                  value={clienteParaEditar ? clienteParaEditar.apellido_materno : clienteParaAñadir.apellido_materno}
                  onChange={manejarCambioEntrada}
                  placeholder="Apellido Materno"
                  className="p-2 border rounded"
                />
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={clienteParaEditar ? clienteParaEditar.fecha_nacimiento : clienteParaAñadir.fecha_nacimiento}
                  onChange={manejarCambioEntrada}
                  className="p-2 border rounded"
                />
                <label>Genero</label>
                <select
                  name="genero"
                  value={clienteParaEditar ? clienteParaEditar.genero : clienteParaAñadir.genero}
                  onChange={manejarCambioEntrada}
                  className="p-2 border rounded"
                >
                  <option value="">Seleccione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
                <label>Calle</label>
                <input
                  type="text"
                  name="direccion_calle"
                  value={clienteParaEditar ? clienteParaEditar.direccion_calle : clienteParaAñadir.direccion_calle}
                  onChange={manejarCambioEntrada}
                  placeholder="Calle"
                  className="p-2 border rounded"
                />
                <label>Colonia</label>
                <input
                  type="text"
                  name="direccion_colonia"
                  value={clienteParaEditar ? clienteParaEditar.direccion_colonia : clienteParaAñadir.direccion_colonia}
                  onChange={manejarCambioEntrada}
                  placeholder="Colonia"
                  className="p-2 border rounded"
                />
                <label>Codigo Postal</label>
                <input
                  type="text"
                  name="direccion_codigopostal"
                  value={clienteParaEditar ? clienteParaEditar.direccion_codigopostal : clienteParaAñadir.direccion_codigopostal}
                  onChange={manejarCambioEntrada}
                  placeholder="Codigo Postal"
                  className="p-2 border rounded"
                />
                <label>Estado</label>
                <input
                  type="text"
                  name="direccion_estado"
                  value={clienteParaEditar ? clienteParaEditar.direccion_estado : clienteParaAñadir.direccion_estado}
                  onChange={manejarCambioEntrada}
                  placeholder="Estado"
                  className="p-2 border rounded"
                />
                <label>Municipio</label>
                <input
                  type="text"
                  name="direccion_municipio"
                  value={clienteParaEditar ? clienteParaEditar.direccion_municipio : clienteParaAñadir.direccion_municipio}
                  onChange={manejarCambioEntrada}
                  placeholder="Municipio"
                  className="p-2 border rounded"
                />
                <label>Correo Electronico</label>
                <input
                  type="email"
                  name="contacto_correo"
                  value={clienteParaEditar ? clienteParaEditar.contacto_correo : clienteParaAñadir.contacto_correo}
                  onChange={manejarCambioEntrada}
                  placeholder="Correo Electronico"
                  className="p-2 border rounded"
                />
                <label>Contraseña</label>
                <input
                  type="password"
                  name="contraseña"
                  value={clienteParaEditar ? clienteParaEditar.contraseña : clienteParaAñadir.contraseña}
                  onChange={manejarCambioEntrada}
                  placeholder="Contraseña"
                  className="p-2 border rounded"
                />
                <label>Telefono</label>
                <input
                  type="text"
                  name="contacto_telefono"
                  value={clienteParaEditar ? clienteParaEditar.contacto_telefono : clienteParaAñadir.contacto_telefono}
                  onChange={manejarCambioEntrada}
                  placeholder="Telefono"
                  className="p-2 border rounded"
                />
              </div>
              <div className="flex justify-center mt-4">
                <button type="button" onClick={clienteParaEditar ? manejarConfirmarCambios : manejarConfirmarAñadir} className="bg-green-500 text-white px-4 py-2 rounded">
                  Confirmar {clienteParaEditar ? "Cambios" : ""}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClienteParaEditar(null);
                    setClienteParaAñadir(null);
                  }}
                  className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    {/* Modal - autorizacion */}
    {mostrarMensajeModalAutorizacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Acceso Denegado</h2>
            <p className="mb-4 text-center">
              {modalMessage.split("\n").map((line, index) => (
                <span key={index}>
                  {line.trim()}
                  <br />
                </span>
              ))}
            </p>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => setmostrarMensajeModalAutorizacion(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
