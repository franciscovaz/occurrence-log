const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "registo-ocorrencias",
  password: "mastervaz",
  port: 5432,
});

// HASH PASWWORD
const bcrypt = require("bcrypt");
const saltRounds = 10;

// --------------------  FREGUESIAS  ---------------------------- //

const getFreguesias = (request, response) => {
  pool.query(
    "SELECT * FROM freguesias ORDER BY id_freguesia",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getFreguesiaById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT * FROM freguesias WHERE id_freguesia = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createFreguesia = (request, response) => {
  const { nome_freguesia } = request.body;

  pool.query(
    "INSERT INTO freguesias (nome_freguesia) VALUES ($1)",
    [nome_freguesia],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Freguesia adicionada com sucesso!`);
    }
  );
};

const updateFreguesia = (request, response) => {
  const id = parseInt(request.params.id);
  const { nome_freguesia } = request.body;

  pool.query(
    "UPDATE freguesias SET nome_freguesia = $1 WHERE id_freguesia = $2",
    [nome_freguesia, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Freguesia modificada com o ID: ${id}`);
    }
  );
};

const deleteFreguesia = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "DELETE FROM freguesias WHERE id_freguesia = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Freguesia eliminada com o ID: ${id}`);
    }
  );
};

// --------------------    ---------------------------- //

// --------------------  UTILIZADORES  ---------------------------- //

const getUtilizadores = (request, response) => {
  pool.query(
    "SELECT * FROM utilizador ORDER BY id_utilizador",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getUtilizadorById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM utilizador WHERE id_utilizador = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
const createUtilizador = (request, response) => {
  const {
    nome_utilizador,
    email_utilizador,
    telemovel_utilizador,
    password_utilizador,
    fk_tipo_utilizador,
  } = request.body;

  bcrypt.hash(password_utilizador, saltRounds, function (err, hash) {
    // Store hash in your password DB
    pool.query(
      "INSERT INTO utilizador (nome_utilizador, email_utilizador, telemovel_utilizador, password_utilizador, fk_tipo_utilizador) VALUES ($1,$2,$3,$4,$5)",
      [
        nome_utilizador,
        email_utilizador,
        telemovel_utilizador,
        hash,
        fk_tipo_utilizador,
      ],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json("Inserido com sucesso!");
      }
    );
  });
};

const updateUtilizador = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    nome_utilizador,
    email_utilizador,
    telemovel_utilizador,
  } = request.body;

  pool.query(
    "UPDATE utilizador SET nome_utilizador = $1, email_utilizador = $2, telemovel_utilizador = $3 WHERE id_utilizador = $4",
    [nome_utilizador, email_utilizador, telemovel_utilizador, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json("Utilizador atualizado com sucesso");
    }
  );
};

const deleteUtilizador = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "DELETE FROM utilizador WHERE id_utilizador = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send("Utilizador removido com sucesso!");
    }
  );
};

const getUtilizadorByEmail = (request, response) => {
  const email_utilizador = request.params.email;

  pool.query(
    "SELECT * FROM utilizador WHERE lower (email_utilizador) = lower($1)",
    [email_utilizador],
    (error, results) => {
      if (error) {
        console.log("EMAIL não existe na BD!");
      }
      response.status(200).json(results.rows);
    }
  );
};

const getUtilizadorByEmailAndPassword = (request, response) => {
  const email_utilizador = request.params.email;
  const password_utilizador = request.params.password;
  const { hash } = request.body;

  bcrypt.compare(password_utilizador, hash, function (err, res) {
    if (res) {
      response.status(200).json(res);
      console.log("Password correta!");
    } else {
      response.status(200).json(res);
      console.log("Password incorreta!");
    }
    /* pool.query(
            'SELECT * FROM utilizador WHERE lower (email_utilizador) = lower($1) AND lower(password_utilizador) = lower($2)',
            [email_utilizador, password_utilizador],
            (error, results) => {
                if(error) {
                    console.log('Password não corresponde!');
                }
                response.status(200).json(results.rows);
            }
        ) */
  });
};

// --------------------    ---------------------------- //

// --------------------  OCORRENCIAS  ---------------------------- //

const getOcorrencias = (request, response) => {
  pool.query(
    "SELECT id_ocorrencia, titulo_ocorrencia, descricao_ocorrencia, data_ocorrencia, latitude_ocorrencia, longitude_ocorrencia, rua_ocorrencia, url_fotografia, nome_utilizador, email_utilizador, telemovel_utilizador, descricao_estado, comentario_ocorrencia, data_ultima_atualizacao_ocorrencia  FROM ocorrencias, fotografias, utilizador, estado_ocorrencia WHERE ocorrencias.fk_fotografia = fotografias.id_fotografia AND estado_ocorrencia.id_estado_ocorrencia = ocorrencias.fk_estado AND ocorrencias.fk_utilizador = utilizador.id_utilizador ORDER BY id_ocorrencia DESC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getOcorrenciasByState = (request, response) => {
  const id = parseInt(request.params.id);
  const estado = request.query.estado;

  pool.query(
    "SELECT id_ocorrencia, titulo_ocorrencia, descricao_ocorrencia, data_ocorrencia, latitude_ocorrencia, longitude_ocorrencia, rua_ocorrencia, url_fotografia, nome_utilizador, email_utilizador, telemovel_utilizador, descricao_estado, comentario_ocorrencia, data_ultima_atualizacao_ocorrencia  FROM ocorrencias, fotografias, utilizador, estado_ocorrencia WHERE ocorrencias.fk_fotografia = fotografias.id_fotografia AND estado_ocorrencia.id_estado_ocorrencia = ocorrencias.fk_estado AND ocorrencias.fk_utilizador = utilizador.id_utilizador AND estado_ocorrencia.descricao_estado = $1 AND ocorrencias.fk_utilizador = $2 ORDER BY id_ocorrencia DESC",
    [estado, id],
    (error, results) => {
      if (error) {
        response.status(200).json("Sem resultados!");
      }
      response.status(200).json(results.rows);
    }
  );
};

const getOcorrenciaById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT id_ocorrencia, titulo_ocorrencia, descricao_ocorrencia, data_ocorrencia, latitude_ocorrencia, longitude_ocorrencia, rua_ocorrencia, url_fotografia, nome_utilizador, email_utilizador, telemovel_utilizador, descricao_estado, comentario_ocorrencia, data_ultima_atualizacao_ocorrencia FROM ocorrencias, estado_ocorrencia, utilizador, fotografias WHERE id_ocorrencia = $1 AND ocorrencias.fk_fotografia = fotografias.id_fotografia AND ocorrencias.fk_utilizador = utilizador.id_utilizador AND estado_ocorrencia.id_estado_ocorrencia = ocorrencias.fk_estado ORDER BY id_ocorrencia DESC",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getOcorrenciaByUser = (request, response) => {
  const id_user = parseInt(request.params.id_user);

  pool.query(
    "SELECT id_ocorrencia, titulo_ocorrencia, descricao_ocorrencia, data_ocorrencia, latitude_ocorrencia, longitude_ocorrencia, rua_ocorrencia, url_fotografia, nome_utilizador, email_utilizador, telemovel_utilizador, descricao_estado, comentario_ocorrencia, data_ultima_atualizacao_ocorrencia FROM ocorrencias, fotografias, utilizador, estado_ocorrencia WHERE fk_utilizador = $1 AND ocorrencias.fk_fotografia = fotografias.id_fotografia AND ocorrencias.fk_utilizador = utilizador.id_utilizador AND estado_ocorrencia.id_estado_ocorrencia = ocorrencias.fk_estado ORDER BY id_ocorrencia DESC",
    [id_user],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createOcorrencia = (request, response) => {
  console.log("Request Body ID: ", request.body.fk_utilizador);
  const {
    titulo_ocorrencia,
    descricao_ocorrencia,
    data_ocorrencia,
    latitude_ocorrencia,
    longitude_ocorrencia,
    rua_ocorrencia,
    fk_fotografia,
    fk_freguesia,
    fk_distrito,
    fk_estado,
    fk_utilizador,
  } = request.body;

  pool.query(
    "INSERT INTO ocorrencias ( titulo_ocorrencia, descricao_ocorrencia, data_ocorrencia, latitude_ocorrencia, longitude_ocorrencia, rua_ocorrencia, fk_fotografia, fk_freguesia,fk_distrito,fk_estado, fk_utilizador) VALUES ($1, $2, $3, $4,  $5, $6, $7, $8, $9, $10, $11) RETURNING *",
    [
      titulo_ocorrencia,
      descricao_ocorrencia,
      data_ocorrencia,
      latitude_ocorrencia,
      longitude_ocorrencia,
      rua_ocorrencia,
      fk_fotografia,
      fk_freguesia,
      fk_distrito,
      fk_estado,
      fk_utilizador,
    ],
    (error, results) => {
      if (error) {
        throw error;
      } else response.status(200).json(results.rows[0].id_ocorrencia);
    }
  );
};

const updateOcorrencia = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    comentario_ocorrencia,
    data_ultima_atualizacao_ocorrencia,
    fk_estado,
  } = request.body;
  pool.query(
    "UPDATE ocorrencias SET comentario_ocorrencia = $1, data_ultima_atualizacao_ocorrencia = $2, fk_estado = $3 WHERE id_ocorrencia = $4",
    [comentario_ocorrencia, data_ultima_atualizacao_ocorrencia, fk_estado, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(results);
    }
  );
};

const deleteOcorrencia = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    "DELETE FROM ocorrencias WHERE id_ocorrencia = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send("Ocorrencia eliminada com sucesso");
    }
  );
};

// --------------------    ---------------------------- //

// --------------------  FOTOGRAFIAS  ---------------------------- //

const getFotografias = (request, response) => {
  pool.query(
    "SELECT * FROM fotografias ORDER BY id_fotografia",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getFotografiaById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT * FROM fotografias WHERE id_fotografia = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createFotografia = (request, response) => {
  const { url_fotografia } = request.body;
  pool.query(
    "INSERT INTO fotografias (url_fotografia) VALUES ($1) RETURNING *",
    [url_fotografia],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows[0].id_fotografia);
    }
  );
};

// --------------------    ---------------------------- //

module.exports = {
  getFreguesias,
  getFreguesiaById,
  createFreguesia,
  updateFreguesia,
  deleteFreguesia,
  createUtilizador,
  getUtilizadores,
  getUtilizadorById,
  updateUtilizador,
  deleteUtilizador,
  getOcorrencias,
  getOcorrenciasByState,
  getOcorrenciaById,
  getOcorrenciaByUser,
  createOcorrencia,
  updateOcorrencia,
  deleteOcorrencia,
  getFotografias,
  getFotografiaById,
  createFotografia,
  getUtilizadorByEmail,
  getUtilizadorByEmailAndPassword,
};
