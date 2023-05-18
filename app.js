
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 3001;
const pgClient = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT 
});

pgClient.on('error', (err, client) => {
  console.log(err)
  console.log(client)
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pgClient.connect((err, client1, done) => {

  if (err) throw err
  client1.query('CREATE TABLE IF NOT EXISTS transactions (messageId VARCHAR(255), data VARCHAR(255), publishTime TIMESTAMP )', (err, res) => {
    console.log(res)
    done()
    if (err) {
      console.log(err.stack)
    } else {
      console.log("Tabla funcionando")
    }
  })


})
const body = {
  "url": "https://tarea-3-ti-g920.onrender.com/"
}

// axios.post('https://us-central1-taller-integracion-310700.cloudfunctions.net/tarea-3-2023-1/subscriptions/18642403', body)
//   .then(response => {
//     console.log(response.data)
//   })
//   .catch(error => {
//     console.log(error.response.data)
//   });

app.get("/", (req, res) => res.type('html').send(html));

app.post("/", (req, res) => {
  try {
    console.log("Mensaje",req.body);
    const message = req.body.message;
    // Decodificar la cadena base64 a buffer
    const buffer = Buffer.from(message.data, 'base64');
    
    // Convertir el buffer a cadena
    const decodedString = buffer.toString('utf8');

    // Insertar en la tabla

    pgClient.connect((err, client, done) => {
      console.log("Insertando el mensaje")
        if (err) throw err
        client.query('SELECT * FROM transactions WHERE messageId = $1', [message.messageId], (err1, res1) => {
          console.log("La transacción no existe, se puede crear")
          if (res1.rowCount == 0) {
            if (err) throw err
            client.query('INSERT INTO transactions(messageId, data, publishTime) VALUES ($1, $2, $3) RETURNING *', [message.messageId, decodedString, new Date(message.publishTime)], (err2, res2) => {
              done()
                if (err1) {
                  console.log(err1.stack)
                } else {
                  console.log("Transacción creada")
                  return;
                }
              })
          } else {
            console.log("La transacción ya existe")
            return;
          }
        })
      })

    res.status(200);
  } catch (error) {
    console.error('Failed to recieve message:', error.response.data);
    res.status(500).send({ error: 'Failed to recieve message' });
  }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`