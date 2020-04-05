const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express()
const port = 3000;
const db = require('./queries')
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');


app.use(cors({ origin: "*" }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
// ALLOW CORS para conseguir receber resposta no Frontend
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    next()
  })

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API'})
})


// secret for json web token
let secret = 'secret to jwt';

// ALLOW PATH WITHOU TOKEN AUTHENTICATION
/*app.use(expressJwt({ secret: secret})
 .unless(function(req) {
    return (
      req.originalUrl === '/token/sign' && req.method === 'GET' ||
      req.originalUrl === '/utilizador-login' && req.method === 'GET'
    );
  })); */



app.get('/freguesias', db.getFreguesias);
app.get('/freguesias/:id', db.getFreguesiaById);
app.post('/freguesia', isLoggedIn, db.createFreguesia);
app.put('/freguesias-update/:id', isLoggedIn, db.updateFreguesia);
app.delete('/freguesias-delete/:id', isLoggedIn, db.deleteFreguesia);
//UTILIZADORES
app.get('/utilizadores', db.getUtilizadores);
app.get('/utilizadorID/:id', isLoggedIn, db.getUtilizadorById);
app.get('/utilizador-login/:email', db.getUtilizadorByEmail);
app.post('/utilizador-check/:email/:password', db.getUtilizadorByEmailAndPassword);
app.post('/utilizador', db.createUtilizador);
app.put('/utilizador-update/:id', isLoggedIn, db.updateUtilizador);
app.delete('/utilizador-delete/:id', isLoggedIn, db.deleteUtilizador);
//OCORRENCIAS
app.get('/ocorrencias', db.getOcorrencias);
app.get('/ocorrencias-estado/:id', isLoggedIn, db.getOcorrenciasByState);
app.get('/ocorrencia/:id', db.getOcorrenciaById);
app.get('/ocorrencia-user/:id_user', isLoggedIn, db.getOcorrenciaByUser);
app.post('/ocorrencia', isLoggedIn, db.createOcorrencia);
app.put('/ocorrencia-update/:id', db.updateOcorrencia);
app.delete('/ocorrencia/:id', isLoggedIn, db.deleteOcorrencia); 
//FOTOGRAFIAS
app.get('/fotografias', db.getFotografias);
app.get('/fotografia/:id', db.getFotografiaById);
app.post('/fotografia', db.createFotografia);

// ENVIAR EMAIL

app.post('/sendmail', (req, res) => {
    console.log("request came");
    let user = req.body;
    sendMail(user, info => {
        console.log('Email foi enviado!');
        res.send(info);
    });
});

// ENVIAR EMAIL UPDATE

app.post('/sendmail-update', (req, res) => {
    let ocorrencia = req.body;
    sendMailUpdate(ocorrencia, info => {
        console.log('Email foi enviado!');
        res.send(info);
    });
});

async function sendMail(data, callback) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'registodeocorrencias@gmail.com',
            pass: 'Olaola123'
        }
    });

    let mailOptions = {
        from: 'registodeocorrencias@gmail.com',
        to: 'ftomasvaz@gmail.com',
        subject: "[Registada Ocorrência]",
        html: `<h2>Olá ${data.name}</h2>
        <p>Obrigado por ter efetuado o registo de uma ocorrência! Iremos analisar e assim que possível receberá informação sobre o estado da mesma!</p>
        <h3>Informações sobre a ocorrência:</h3>
        <p><b>Titulo:</b> ${data.titulo}</p>
        <p><b>Descricao:</b> ${data.descricao}</p>
        <p><b>Data de registo:</b> ${data.data}</p><br>

        <h3>Será informado via email ou telemóvel caso exista alguma dúvida</h3>
        <h3>Pode verificar o estado da ocorrência no separador  <a href="http://localhost:4200/op/lista"> 'ocorrências'</a> na aplicação</h3>`
    };

    // send email with defined transport object
    let info = transporter.sendMail(mailOptions);
    callback(info);
}

async function sendMailUpdate(ocorrencia, callback) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'registodeocorrencias@gmail.com',
            pass: 'Olaola123'
        }
    });

    if(ocorrencia.estado === '1'){
        ocorrencia.estado = 'Por tratar'
    } else if(ocorrencia.estado === '2'){
        ocorrencia.estado = 'Em análise'
    }else if(ocorrencia.estado === '3'){
        ocorrencia.estado = 'Em progresso'
    }else if(ocorrencia.estado === '4'){
        ocorrencia.estado = 'Finalizado'
    }else if(ocorrencia.estado === '5'){
        ocorrencia.estado = 'Cancelado'
    }

    let mailOptions = {
        from: 'registodeocorrencias@gmail.com',
        to: 'ftomasvaz@gmail.com',
        subject: "[ATUALIZAÇÃO Ocorrência]",
        html: `<h2>Olá ${ocorrencia.name}!</h2><br>
        <p>Foi alterado o estado da sua ocorrência. Neste momento a ocorrência encontra-se no estado <b>${ocorrencia.estado}</b>.</p>
        <p>Comentário efetuado à ocorrência: ${ocorrencia.comentario}</p>
        <p>Podes verificar o estado da ocorrência no separador <a href="http://localhost:4200/op/lista"> 'ocorrências'</a> na aplicação web.</p>
        <p>Obrigado por usar a aplicação de registo de ocorrências :D </p>`
    };

    // send email with defined transport object
    let info = transporter.sendMail(mailOptions);
    callback(info);
}




// CREATE TOKEN FOR USE
app.get('/token/sign/:email/:id_utilizador', (req, res) => {
    const id = parseInt(req.params.id_utilizador);
    const email_utilizador = req.params.email;
    console.log('ID -> ', id);
    console.log('EMAIL -> ', email_utilizador);
    var userData = {
        "email_utilizador": email_utilizador,
        "id_utilizador": id
    }
    let token = jwt.sign(userData, secret, { expiresIn: '1d'})
    res.status(200).json({"token": token});
})




function isLoggedIn(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers.authorization;
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: 'Sign in to continue.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(401).send({
            success: false,
            message: 'Sign in to continue.'
        });
    }
}






app.listen(port, () => {
    console.log(`App a correr na porta ${port}`)
})