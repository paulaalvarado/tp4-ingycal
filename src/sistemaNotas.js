const usuarios = [];
function registrarUsuario(nombre, email, password) {

  if (usuarios.find(u => u.email === email)) {
    return { success: false, mensaje: "Email ya registrado" };
  } 
    const nuevoUsuario = {
    nombre,
    email,
    password,
    notas: []
  };

  if (!nombre || !email || !password) {
    return { success: false, mensaje: "Faltan datos obligatorios" }
  }

    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, mensaje: "Formato de email inválido" };
  }

  usuarios.push(nuevoUsuario);
  return { success: true, usuario: nuevoUsuario };
}

function login(email, password) {
  if (!email || !password) {
    return { success: false, mensaje: "Faltan datos para iniciar sesión" };
  }

  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (!usuario) {
    return { success: false, mensaje: "Credenciales incorrectas" };
  }

  return { success: true, usuario };
}

function agregarNota(email, materia, nota) {
  if (!email || !materia || typeof nota !== "number") {
    return { success: false, mensaje: "Datos inválidos para agregar nota" };
  }

  if (nota < 0 || nota > 10) {
    return { success: false, mensaje: "La nota debe estar entre 0 y 10" };
  }

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return { success: false, mensaje: "Usuario no encontrado" };
  }

  usuario.notas.push({ materia, nota });
  return { success: true };
}

function obtenerNotas(email) {

  const usuario = usuarios.find(u => u.email === email);
  
  if (!usuario) {
    return [];
  }

  return usuario.notas;
}

function calcularPromedio(email) {
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario || usuario.notas.length === 0) {
    return null;
  }

  const suma = usuario.notas.reduce((acc, nota) => acc + nota.nota, 0);
  return suma / usuario.notas.length;
}

function estaAprobado(email) {
  const promedio = calcularPromedio(email);
  if (promedio === null) {
    return false; 
  }
  return promedio >= 6; 
}

module.exports = {
  registrarUsuario,
  login,
  agregarNota,
  obtenerNotas,
  calcularPromedio,
  estaAprobado
};
