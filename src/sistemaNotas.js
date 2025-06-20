const usuarios = [];

function registrarUsuario(nombre, email, contra) {

  // Test 1: Revisa si el mail ya está registrado, de ser así devuelve error
  if (usuarios.find(u => u.email === email)) {
    return { success: false, mensaje: "Email ya registrado" };
  } 
    const nuevoUsuario = {
    nombre,
    email,
    contraseña: contra,
    notas: []
  };

  // Test 2: Valida que los campos obligatorios no estén vacíos
  if (!nombre || !email || !password) {
    return { success: false, mensaje: "Faltan datos obligatorios" };
  }

  usuarios.push(nuevoUsuario);
  return { success: true, usuario: nuevoUsuario };
}

function login(email, password) {
  // Test 3: Valida campos obligatorios
  if (!email || !password) {
    return { success: false, mensaje: "Faltan datos para iniciar sesión" };
  }

  // Test 4: Busca usuario que coincida con email y password
  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (!usuario) {
    return { success: false, mensaje: "Credenciales incorrectas" };
  }

  return { success: true, usuario };
}

function agregarNota(email, materia, nota) {
  // Validar datos obligatorios
  if (!email || !materia || typeof nota !== "number") {
    return { success: false, mensaje: "Datos inválidos para agregar nota" };
  }

  // Validar rango de nota
  if (nota < 0 || nota > 10) {
    return { success: false, mensaje: "La nota debe estar entre 0 y 10" };
  }

  // Buscar usuario por email
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return { success: false, mensaje: "Usuario no encontrado" };
  }

  // Agregar la nota al usuario
  usuario.notas.push({ materia, nota });
  return { success: true };
}

function obtenerNotas(email) {
  // Buscar usuario por email
  const usuario = usuarios.find(u => u.email === email);
  
  if (!usuario) {
    // Si no existe usuario, devolver lista vacía
    return [];
  }

  // Devolver array de notas del usuario
  return usuario.notas;
}

function calcularPromedio(email) {
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario || usuario.notas.length === 0) {
    return null; // No hay notas o usuario no existe
  }

  const suma = usuario.notas.reduce((acc, nota) => acc + nota.nota, 0);
  return suma / usuario.notas.length;
}

function estaAprobado(email) {
  const promedio = calcularPromedio(email);
  if (promedio === null) {
    return false; // Si no tiene notas o usuario no existe, no está aprobado
  }
  return promedio >= 6; // Aprueba si el promedio es 6 o más
}

module.exports = {
  registrarUsuario,
  login,
  agregarNota,
  obtenerNotas,
  calcularPromedio,
  estaAprobado
};
