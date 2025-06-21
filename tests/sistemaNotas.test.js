const { 
  registrarUsuario,
  login,
  agregarNota,
  obtenerNotas,
  calcularPromedio,
  estaAprobado
} = require("../src/sistemaNotas");

// Limpia el estado antes de cada test para evitar interferencias
beforeEach(() => {
  jest.resetModules();
});

/**--------------Test relacionados con el registro--------------*/

// Test 1: Registra un usuario nuevo correctamente
test("Registra un usuario nuevo correctamente", () => {
  const result = registrarUsuario("Paula", "paula@mail.com", "1234");
  expect(result.success).toBe(true);
  expect(result.usuario.email).toBe("paula@mail.com")
});

// Test 2: No permite registrar dos usuarios con el mismo email
test("No permite registrar dos usuarios con el mismo email", () => {
  registrarUsuario("Paula", "paula@mail.com", "1234");
  const result = registrarUsuario("Otro", "paula@mail.com", "5678");
  console.log(result.mensaje);
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/email ya registrado/i);
});

//Test 3: No permite registrar un usuario si el mail no tiene formato válido
test("No permite registrar usuario si el email tiene formato inválido", () => {
  const result = registrarUsuario("Andrés", "no-es-mail", "pass123");
  console.log(result.mensaje);
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/formato de email inválido/i);
});

// Test 4: No registra si falta el email
test("No registra si falta el email", () => {
  const result = registrarUsuario("Juan", "", "1234");
  console.log(result.mensaje);
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/faltan datos/i);
});

// Test 5: No registra si falta el nombre
test("No registra si falta el nombre", () => {
  const result = registrarUsuario("", "juan@mail.com", "1234");
  console.log(result.mensaje);
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/faltan datos/i);
});

// Test 6: No registra si falta la contraseña
test("No registra si falta el password", () => {
  const result = registrarUsuario("Ana", "ana@mail.com", "");
  console.log(result.mensaje);
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/faltan datos/i);
});

/**--------------Test relacionados con el inicio de sesión--------------*/

// Test 7: Inicia sesión correctamente con email y contraseña correctos
test("Inicia sesión correctamente con email y password correctos", () => {
  registrarUsuario("Nico", "nico@mail.com", "pass");
  const result = login("nico@mail.com", "pass");
  expect(result.success).toBe(true);
  expect(result.usuario.nombre).toBe("Nico");
});

// Test 8: Falla si el email no existe
test("Falla si el email no existe", () => {
  const result = login("inexistente@mail.com", "algo");
  console.log(result.mensaje);
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/credenciales incorrectas/i);
});

// Test 9: Falla si el password es incorrecto
test("Falla si el password es incorrecto", () => {
  registrarUsuario("Lau", "lau@mail.com", "clave");
  const result = login("lau@mail.com", "malaclav");
  console.log(result.mensaje);
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/credenciales incorrectas/i);
});

// Test 10: Falla si el email está vacío
test("Falla si el email está vacío", () => {
  const result = login("", "1234");
  console.log(result.mensaje);
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/faltan datos/i);
});

/**--------------Test relacionados con añadir notas--------------*/

// Test 11: Agrega nota correctamente a un usuario existente
test("Agrega nota correctamente a un usuario existente", () => {
  registrarUsuario("Mario", "mario@mail.com", "clave");
  const result = agregarNota("mario@mail.com", "Matemática", 8);
  expect(result.success).toBe(true);
});

// Test 12: No agrega si el email no existe
test("No agrega si el email no existe", () => {
  const result = agregarNota("sinusuario@mail.com", "Física", 7);
  console.log(result.mensaje);
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/usuario no encontrado/i);
});

// Test 13: No agrega si la nota es menor que 0 o mayor que 10
test("No agrega si la nota es menor que 0 o mayor que 10", () => {
  registrarUsuario("Ari", "ari@mail.com", "pass");
  let res = agregarNota("ari@mail.com", "Química", -1);
  console.log(res.mensaje);
  expect(res.success).toBe(false);
  res = agregarNota("ari@mail.com", "Química", 11);
  expect(res.success).toBe(false);
});

// Test 14: No agrega si la nota no es un número
test("No agrega si la nota no es un número", () => {
  registrarUsuario("Eli", "eli@mail.com", "clave");
  const result = agregarNota("eli@mail.com", "Historia", "siete");
  console.log(result.mensaje);
  expect(result.success).toBe(false);
});

/**--------------Test relacionados con la consulta de notas--------------*/

// Test 15: Devuelve lista vacía si no hay notas
test("Devuelve lista vacía si no hay notas", () => {
  registrarUsuario("Sofi", "sofi@mail.com", "qwerty");
  const notas = obtenerNotas("sofi@mail.com");
  expect(Array.isArray(notas)).toBe(true);
  expect(notas.length).toBe(0);
});

// Test 16: Devuelve notas cargadas por el usuario
test("Devuelve notas cargadas por el usuario", () => {
  registrarUsuario("Ro", "ro@mail.com", "abcd");
  agregarNota("ro@mail.com", "Física", 9);
  agregarNota("ro@mail.com", "Química", 8);
  const notas = obtenerNotas("ro@mail.com");
  expect(notas.length).toBe(2);
  expect(notas[0].materia).toBe("Física");
});

// Test 17: Devuelve lista vacía si el usuario no existe
test("Devuelve lista vacía si el usuario no existe", () => {
  const notas = obtenerNotas("noexiste@mail.com");
  expect(Array.isArray(notas)).toBe(true);
  expect(notas.length).toBe(0);
});

/**--------------Test relacionados con cálculo de promedio--------------*/

// Test 18: Calcula correctamente el promedio con varias notas
test("Calcula correctamente el promedio con varias notas", () => {
  registrarUsuario("Santi", "santi@mail.com", "123");
  agregarNota("santi@mail.com", "Inglés", 7);
  agregarNota("santi@mail.com", "Francés", 5);
  const promedio = calcularPromedio("santi@mail.com");
  expect(promedio).toBe(6);
});

// Test 19: Devuelve null si no hay notas cargadas
test("Devuelve null si no hay notas cargadas", () => {
  registrarUsuario("Lu", "lu@mail.com", "asdf");
  const promedio = calcularPromedio("lu@mail.com");
  expect(promedio).toBeNull();
});

/**--------------Test relacionados con condición de cursado--------------*/

// Test 20: Devuelve true si el promedio es mayor o igual a 6
test("Devuelve true si el promedio es mayor o igual a 6", () => {
  registrarUsuario("Clara", "clara@mail.com", "zxcv");
  agregarNota("clara@mail.com", "Biología", 10);
  agregarNota("clara@mail.com", "Química", 2);
  agregarNota("clara@mail.com", "Física", 6);
  // Promedio: 6
  expect(estaAprobado("clara@mail.com")).toBe(true);
});

// Test 21: Devuelve false si el promedio es menor a 6
test("Devuelve false si el promedio es menor a 6", () => {
  registrarUsuario("Tomi", "tomi@mail.com", "4567");
  agregarNota("tomi@mail.com", "Literatura", 4);
  agregarNota("tomi@mail.com", "Arte", 5);
  // Promedio: 4.5
  expect(estaAprobado("tomi@mail.com")).toBe(false);
});

// Test 22: Devuelve false si el usuario no tiene notas
test("Devuelve false si el usuario no tiene notas", () => {
  registrarUsuario("Vale", "vale@mail.com", "miau");
  expect(estaAprobado("vale@mail.com")).toBe(false);
});
