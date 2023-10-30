const express = require("express");
const { criarUsuario, logarUsuario } = require("./controladores/usuarios");
const validarCorpoCadastro = require("./intermediarios/validarCorpoCadastro");
const rotas = express();

rotas.post("/usuarios", validarCorpoCadastro, criarUsuario);
rotas.post("/login", logarUsuario);

module.exports = rotas;
