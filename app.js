const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 3001;

const pgClient = new Pool({
  user: "shernandezv@uc.cl",
  host: "langosta.ing.puc.cl",
  database: "shernandezv@uc.cl",
  password: 18642403,
  port: 5432 
});

// pgClient.on('error', (err, client) => {
//   console.error('Unexpected error on idle client', err)
//   process.exit(-1)
// })
// pgClient.connect((err, client1, done) => {
//   if (err) throw err
//   client1.query('CREATE TABLE IF NOT EXISTS orders (id VARCHAR(255), cliente VARCHAR(255), sku VARCHAR(255), fechaEntrega TIMESTAMP, cantidad INT, urlNotificacion VARCHAR(255), estado VARCHAR(255) )', (err, res) => {
//     done()
//     if (err) {
//       console.log(err.stack)
//     } else {
//       console.log("Tabla funcionando")
//     }
//   })
// })
const body = {
  "url": "https://tarea-3-ti-g920.onrender.com/"
}

axios.post('https://us-central1-taller-integracion-310700.cloudfunctions.net/tarea-3-2023-1/subscriptions/18642403', body)
  .then(response => {
  })
  .catch(error => {

  });

app.get("/", (req, res) => res.type('html').send(html));

app.post("/", (req, res) => {
  try {
    console.log(req)
    res.status(200).send({ message: 'Message recieved' });
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