const conexaoPostgres = require("../config/bancoDeDados");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaToken = require("../senhaToken");

const criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    let comando = "SELECT * FROM usuarios WHERE email = $1;";
    let valores = [email];
    let { rowCount: quantidadeUsuariosEncontradosComMesmoEmail } =
      await conexaoPostgres.query(comando, valores);
    if (quantidadeUsuariosEncontradosComMesmoEmail !== 0) {
      return res.status(400).json({ mensagem: "E-mail ou senha invalido(s)" });
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    comando =
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *;";
    valores = [nome, email, senhaCriptografada];
    const { rows: usuariosCadastros } = await conexaoPostgres.query(
      comando,
      valores
    );
    const usuarioCadastro = usuariosCadastros[0];
    delete usuarioCadastro.senha;
    return res.status(201).json(usuarioCadastro);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor!" });
  }
};

const logarUsuario = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }
  try {
    let comando = "SELECT * FROM usuarios WHERE email = $1;";
    let valores = [email];
    let { rowCount: quantidadeUsuariosCadastrados, rows: usuariosCadastrados } =
      await conexaoPostgres.query(comando, valores);
    if (quantidadeUsuariosCadastrados === 0) {
      return res.status(404).json({ mensagem: "Usuário não cadastrado" });
    }
    const usuarioCadastrado = usuariosCadastrados[0];
    const senhaConfere = await bcrypt.compare(senha, usuarioCadastrado.senha);
    if (!senhaConfere) {
      return res.status(400).json({ mensagem: "E-mail ou senha invalido(s)" });
    }
    const token = jwt.sign({ id: usuarioCadastrado.id }, senhaToken, {
      expiresIn: "1h",
    });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor!" });
  }
};

module.exports = {
  criarUsuario,
  logarUsuario,
};
