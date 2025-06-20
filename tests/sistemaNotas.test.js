const {
  registrarUsuario,
  login,
  agregarNota,
  obtenerNotas,
  calcularPromedio,
  estaAprobado
} = require("../src/sistemaNotas");

test("Registrar usuario exitosamente", () => {
  const result = registrarUsuario("Paula", "paula@mail.com", "1234");
  expect(result.success).toBe(true);
});
