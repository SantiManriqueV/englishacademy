// ===== CAlCULO DEL PRESUPUESTO =====

//Recuperamos los elementos que influyen en el cálculo 
const formulario = document.getElementById("formulario");
const producto = document.getElementById("producto");
const plazo = document.getElementById("plazo");
const total = document.getElementById("total");

//función para devolver el descuento según el mes
function obtenerDescuento(meses) {
    if (meses >= 12) return 0.15;
    if (meses >= 6) return 0.10;
    if (meses >= 3) return 0.05;
    return 0;
}

//Función para calcular el presupuesto
function calcularPrecio() { 
    //recuperamos el nivel elegido con su respectivo precio
    const opcion = producto.options[producto.selectedIndex];
    const precioMes = Number(opcion.dataset.precio);
    const modalidad = document.querySelector('input[name="modalidad"]:checked');
    const factor = Number(modalidad.dataset.factor);

    let meses = Number(plazo.value);
    if (meses < 1 || meses > 12 || isNaN(meses)) {
        meses = 0;
    }

    //sumar extras marcados
    let extras = 0;
    const marcados = document.querySelectorAll('input[name="extras"]:checked');
    marcados.forEach(function (extra) {
        extras += Number(extra.dataset.precio);
    });

    //aplicamos las formulas
    const subtotal = precioMes * factor * meses;
    const descuento = subtotal * obtenerDescuento(meses);
    const resultado = subtotal - descuento + extras;

    //mostar al usuario
    total.textContent = resultado.toFixed(2) + " €";
}

// "input" se dispara al escribir, "change" al elegir en el desplegable o marcar casillas.
formulario.addEventListener("input", calcularPrecio);
formulario.addEventListener("change", calcularPrecio);

//calcular desde que se inicia la página
calcularPrecio();

// ===== VALIDACIÓN DE LOS DATOS DE CONTACTO =====

//metemos los patrones en las constantes
const soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/;
const soloNumeros = /^[0-9]+$/;
const formatoEmail = /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

//recuperamos los datos
const campoNombre = document.getElementById("nombre");
const campoApellidos = document.getElementById("apellidos");
const campoTelefono = document.getElementById("telefono");
const campoEmail = document.getElementById("email");
const campoPrivacidad = document.getElementById("privacidad");

//Función para el error
function mostrarError(campo, mensaje) {
  document.getElementById("error-" + campo.id).textContent = mensaje;
  campo.classList.toggle("invalido", mensaje !== "");
}

// Cada función devuelve true si el campo es válido
function validarNombre() {
  const valor = campoNombre.value.trim();
  if (valor === "") {
    mostrarError(campoNombre, "El nombre esta vacío.");
    return false;
  }
  if (!soloLetras.test(valor)) {
    mostrarError(campoNombre, "El nombre solo puede contener letras.");
    return false;
  }
  if (valor.length > 15) {
    mostrarError(campoNombre, "El nombre no puede superar los 15 caracteres.");
    return false;
  }
  mostrarError(campoNombre, "");
  return true;
}

function validarApellidos() {
  const valor = campoApellidos.value.trim();
  if (valor === "") {
    mostrarError(campoApellidos, "Los apellidos estan vacios.");
    return false;
  }
  if (!soloLetras.test(valor)) {
    mostrarError(campoApellidos, "Los apellidos solo pueden contener letras.");
    return false;
  }
  if (valor.length > 40) {
    mostrarError(campoApellidos, "Los apellidos no pueden superar los 40 caracteres.");
    return false;
  }
  mostrarError(campoApellidos, "");
  return true;
}

function validarTelefono() {
  const valor = campoTelefono.value.trim();
  if (valor === "") {
    mostrarError(campoTelefono, "El teléfono esta vacío.");
    return false;
  }
  if (!soloNumeros.test(valor)) {
    mostrarError(campoTelefono, "El teléfono solo puede contener números.");
    return false;
  }
  if (valor.length > 9) {
    mostrarError(campoTelefono, "El teléfono no puede superar los 9 dígitos.");
    return false;
  }
  mostrarError(campoTelefono, "");
  return true;
}

function validarEmail() {
  const valor = campoEmail.value.trim();
  if (valor === "") {
    mostrarError(campoEmail, "El correo electrónico esta vacío");
    return false;
  }
  if (!formatoEmail.test(valor)) {
    mostrarError(campoEmail, "Escribe un correo válido, por ejemplo nombre@dominio.com.");
    return false;
  }
  mostrarError(campoEmail, "");
  return true;
}

// Validación , al salir de un campo ("blur") se comprueba
campoNombre.addEventListener("blur", validarNombre);
campoApellidos.addEventListener("blur", validarApellidos);
campoTelefono.addEventListener("blur", validarTelefono);
campoEmail.addEventListener("blur", validarEmail);

// ==== Envio del formulario ====

//Creamos un mensaje desde javascript
const mensajeEnvio = document.createElement("p");
mensajeEnvio.className = "Exito";
formulario.appendChild(mensajeEnvio);

// Validar casilla de terminos de privacidad
function validarPrivacidad () {
  if (!campoPrivacidad.checked) {
    mostrarError(campoPrivacidad, "Debes de aceptar la politica de privacidad.");
    return false;
  }
  mostrarError(campoPrivacidad, "");
  return true;
}

// validamos que se escogio el nivel
function validarProducto() {
  if(producto.value === "") {
    mostrarError(producto, "Escoge un nivel.")
    return false;
  }
  mostrarError(producto,"");
  return true;
}

//Usamos la función preventDefault por si algo no es valido al enviar
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  // Ejecutamos TODAS las validaciones (así se muestran todos los errores a la vez)
  const nombreOk = validarNombre();
  const apellidosOk = validarApellidos();
  const telefonoOk = validarTelefono();
  const emailOk = validarEmail();
  const productoOk = validarProducto();
  const privacidadOk = validarPrivacidad();

  if (nombreOk && apellidosOk && telefonoOk && emailOk && productoOk && privacidadOk) {
    // Guardamos el total ANTES de vaciar el formulario
    const presupuestoEnviado = total.textContent;

    // Devolvemos el formulario a su estado inicial (dispara el evento "reset")
    formulario.reset();

    // El reset borra el mensaje de envío, así que lo ponemos de nuevo
    mensajeEnvio.textContent = "¡Solicitud enviada! Te contactaremos pronto. Presupuesto: " + presupuestoEnviado;
  } else {
    mensajeEnvio.textContent = "";
  }
});

//Asignamos función al boton de reset
formulario.addEventListener("reset", function (){
  document.querySelectorAll(".error").forEach(function (span) {
    span.textContent = "";
  });

  document.querySelectorAll(".invalido").forEach(function (campo) {
    campo.classList.remove("invalido");
  });
  mensajeEnvio.textContent = "";

  //setTimeout necesario para la restauración de los valores de las casillas
  setTimeout(calcularPrecio, 0);
});

