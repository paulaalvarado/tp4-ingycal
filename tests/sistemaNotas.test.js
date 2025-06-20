const {
  registrarUsuario,
  login,
  agregarNota,
  obtenerNotas,
  calcularPromedio,
  estaAprobado
} = require("../src/sistemaNotas");

// Limpiar el estado antes de cada test para evitar interferencias
beforeEach(() => {
  // Como usuarios está en memoria, simplemente "reseteamos" recargando el módulo.
  jest.resetModules();
  // Nota: esto recarga el módulo, pero si necesitás más aislamiento, podés adaptar el modelo.
});

/** ================== registrarUsuario ================== */

// Registra un usuario nuevo correctamente
test("Registra un usuario nuevo correctamente", () => {
  const result = registrarUsuario("Paula", "paula@mail.com", "1234");
  expect(result.success).toBe(true);
  expect(result.usuario.email).toBe("paula@mail.com");
});

// No permite registrar dos usuarios con el mismo email
test("No permite registrar dos usuarios con el mismo email", () => {
  registrarUsuario("Paula", "paula@mail.com", "1234");
  const result = registrarUsuario("Otro", "paula@mail.com", "5678");
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/email ya registrado/i);
});

// No registra si falta el email
test("No registra si falta el email", () => {
  const result = registrarUsuario("Juan", "", "1234");
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/faltan datos/i);
});

// No registra si falta el nombre
test("No registra si falta el nombre", () => {
  const result = registrarUsuario("", "juan@mail.com", "1234");
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/faltan datos/i);
});

// No registra si falta el password
test("No registra si falta el password", () => {
  const result = registrarUsuario("Ana", "ana@mail.com", "");
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/faltan datos/i);
});

/** ================== login ================== */

// Inicia sesión correctamente con email y password correctos
test("Inicia sesión correctamente con email y password correctos", () => {
  registrarUsuario("Nico", "nico@mail.com", "pass");
  const result = login("nico@mail.com", "pass");
  expect(result.success).toBe(true);
  expect(result.usuario.nombre).toBe("Nico");
});

// Falla si el email no existe
test("Falla si el email no existe", () => {
  const result = login("inexistente@mail.com", "algo");
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/credenciales incorrectas/i);
});

// Falla si el password es incorrecto
test("Falla si el password es incorrecto", () => {
  registrarUsuario("Lau", "lau@mail.com", "clave");
  const result = login("lau@mail.com", "malaclav");
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/credenciales incorrectas/i);
});

// Falla si el email está vacío
test("Falla si el email está vacío", () => {
  const result = login("", "1234");
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/faltan datos/i);
});

/** ================== agregarNota ================== */

// Agrega nota correctamente a un usuario existente
test("Agrega nota correctamente a un usuario existente", () => {
  registrarUsuario("Mario", "mario@mail.com", "clave");
  const result = agregarNota("mario@mail.com", "Matemática", 8);
  expect(result.success).toBe(true);
});

// No agrega si el email no existe
test("No agrega si el email no existe", () => {
  const result = agregarNota("sinusuario@mail.com", "Física", 7);
  expect(result.success).toBe(false);
  expect(result.mensaje).toMatch(/usuario no encontrado/i);
});

// No agrega si la nota es menor que 0 o mayor que 10
test("No agrega si la nota es menor que 0 o mayor que 10", () => {
  registrarUsuario("Ari", "ari@mail.com", "pass");
  let res = agregarNota("ari@mail.com", "Química", -1);
  expect(res.success).toBe(false);
  res = agregarNota("ari@mail.com", "Química", 11);
  expect(res.success).toBe(false);
});

// No agrega si la nota no es un número
test("No agrega si la nota no es un número", () => {
  registrarUsuario("Eli", "eli@mail.com", "clave");
  const result = agregarNota("eli@mail.com", "Historia", "siete");
  expect(result.success).toBe(false);
});

/** ================== obtenerNotas ================== */

// Devuelve lista vacía si no hay notas
test("Devuelve lista vacía si no hay notas", () => {
  registrarUsuario("Sofi", "sofi@mail.com", "qwerty");
  const notas = obtenerNotas("sofi@mail.com");
  expect(Array.isArray(notas)).toBe(true);
  expect(notas.length).toBe(0);
});

// Devuelve notas cargadas por el usuario
test("Devuelve notas cargadas por el usuario", () => {
  registrarUsuario("Ro", "ro@mail.com", "abcd");
  agregarNota("ro@mail.com", "Física", 9);
  agregarNota("ro@mail.com", "Química", 8);
  const notas = obtenerNotas("ro@mail.com");
  expect(notas.length).toBe(2);
  expect(notas[0].materia).toBe("Física");
});

// Devuelve lista vacía si el usuario no existe
test("Devuelve lista vacía si el usuario no existe", () => {
  const notas = obtenerNotas("noexiste@mail.com");
  expect(Array.isArray(notas)).toBe(true);
  expect(notas.length).toBe(0);
});

/** ================== calcularPromedio ================== */

// Calcula correctamente el promedio con varias notas
test("Calcula correctamente el promedio con varias notas", () => {
  registrarUsuario("Santi", "santi@mail.com", "123");
  agregarNota("santi@mail.com", "Inglés", 7);
  agregarNota("santi@mail.com", "Francés", 5);
  const promedio = calcularPromedio("santi@mail.com");
  expect(promedio).toBe(6);
});

// Devuelve null si no hay notas cargadas
test("Devuelve null si no hay notas cargadas", () => {
  registrarUsuario("Lu", "lu@mail.com", "asdf");
  const promedio = calcularPromedio("lu@mail.com");
  expect(promedio).toBeNull();
});

/** ================== estaAprobado ================== */

// Devuelve true si el promedio es mayor o igual a 6
test("Devuelve true si el promedio es mayor o igual a 6", () => {
  registrarUsuario("Clara", "clara@mail.com", "zxcv");
  agregarNota("clara@mail.com", "Biología", 10);
  agregarNota("clara@mail.com", "Química", 2);
  agregarNota("clara@mail.com", "Física", 6);
  // Promedio: 6
  expect(estaAprobado("clara@mail.com")).toBe(true);
});

// Devuelve false si el promedio es menor a 6
test("Devuelve false si el promedio es menor a 6", () => {
  registrarUsuario("Tomi", "tomi@mail.com", "4567");
  agregarNota("tomi@mail.com", "Literatura", 4);
  agregarNota("tomi@mail.com", "Arte", 5);
  // Promedio: 4.5
  expect(estaAprobado("tomi@mail.com")).toBe(false);
});

// Devuelve false si el usuario no tiene notas
test("Devuelve false si el usuario no tiene notas", () => {
  registrarUsuario("Vale", "vale@mail.com", "miau");
  expect(estaAprobado("vale@mail.com")).toBe(false);
});
