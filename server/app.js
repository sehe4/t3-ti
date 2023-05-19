
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
  // console.log(client)
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pgClient.connect((err, client1, done) => {

  if (err) throw err
  client1.query('CREATE TABLE IF NOT EXISTS messages (message_id VARCHAR(255), data VARCHAR(255), publish_time TIMESTAMP )', (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log("Tabla mensajes funcionando")
    }
  })
  client1.query('CREATE TABLE IF NOT EXISTS transactions (type INT, message_id INT, origin_bank INT, origin_account INT, destination_bank INT, destination_account INT, amount INT, publish_time TIMESTAMP )', (err, res) => {
    done()
    if (err) {
      console.log(err.stack)
    } else {
      console.log("Tabla transacciones funcionando")
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
app.get("/banks", (req, res) => {
  var query = 'SELECT DISTINCT origin_bank AS bank FROM transactions UNION SELECT DISTINCT destination_bank AS bank FROM transactions';
  try {
    pgClient.connect((err, client, done) => {
      if (err) throw err
      client.query(query, (err, res1) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          var banks = ['Todos'];
          res1.rows.forEach((row) => {
            banks.push(row.bank);
          });
          res.status(200).send({ banks: banks });
        }
      })
    })
  } catch (error) {
    console.error('Failed to recieve message:', error.response.data);
    res.status(500).send({ error: 'Failed to recieve message' });
  }
});






app.get("/desglose", (req, res) => {
  try {
    // console.log("Desglose")
    const originBank = req.query.origin_bank;
    const destinationBank = req.query.destination_bank;
    const date = req.query.date;
    var query = 'SELECT type, COUNT(*) AS cantidad, SUM(amount) AS monto_total FROM transactions';
    var query1 = ' GROUP BY type';
    // console.log(req.query)
    var params = [];
    if (originBank && originBank !== null && originBank !== 'Todos') {
      query = query + ' WHERE origin_bank = $1';
      params.push(originBank);
    }
    if (destinationBank && destinationBank !== null && destinationBank !== 'Todos') {
      if (originBank !== null && originBank !== 'Todos') {
        query = query + ' AND destination_bank = $2';
      } else {
        query = query + ' WHERE destination_bank = $1';
      }
      params.push(destinationBank);
    }
    if (date && date !== null) {
      if (originBank !== null && originBank !== 'Todos' && destinationBank !== null && destinationBank !== 'Todos') {
        query = query + ' AND publish_time::date = $3::date';
      } else if ((originBank !== null && originBank !== 'Todos') || (destinationBank !== null && destinationBank !== 'Todos')) {
        query = query + ' AND publish_time::date = $2::date';
      } else {
        query = query + ' WHERE publish_time::date = $1::date';
      }
      params.push(date);
    }
    query = query + query1;
    // console.log(query);
    // console.log(params);
    pgClient.connect((err, client, done) => {
      if (err) throw err
      client.query(query, params, (err, res1) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          var total = 0;
          res1.rows.forEach((row) => {
            total = total + parseInt(row.cantidad)
          });
          // console.log({Total: total, operationData: res1.rows})
          res.status(200).send({Total: total, operationData: res1.rows});
        }
      })
    })
  } catch (error) {
    console.error('Failed to recieve message:', error.response.data);
    res.status(500).send({ error: 'Failed to recieve message' });
  }
});

app.get("/ultimas", (req, res) => {
  try {
    // console.log("Ultimas")
    const originBank = req.query.origin_bank;
    const destinationBank = req.query.destination_bank;
    const date = req.query.date;
    var query = 'SELECT * FROM transactions';
    // console.log(req.query)
    var params = [];
    if (originBank && originBank !== null && originBank !== 'Todos') {
      query = query + ' WHERE origin_bank = $1';
      params.push(originBank);
    }
    if (destinationBank && destinationBank !== null && destinationBank !== 'Todos') {
      if (originBank !== null && originBank !== 'Todos') {
        query = query + ' AND destination_bank = $2';
      } else {
        query = query + ' WHERE destination_bank = $1';
      }
      params.push(destinationBank);
    }
    if (date && date !== null) {
      if (originBank !== null && originBank !== 'Todos' && destinationBank !== null && destinationBank !== 'Todos') {
        query = query + ' AND publish_time::date = $3::date';
      } else if ((originBank !== null && originBank !== 'Todos') || (destinationBank !== null && destinationBank !== 'Todos')) {
        query = query + ' AND publish_time::date = $2::date';
      } else {
        query = query + ' WHERE publish_time::date = $1::date';
      }
      params.push(date);
    }
    query = query + ' ORDER BY publish_time DESC LIMIT 100';
    // console.log(query);
    // console.log(params);
    pgClient.connect((err, client, done) => {
      if (err) throw err
      client.query(query, params, (err, res1) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          // console.log(res1.rows)
          res.status(200).send(res1.rows);
        }
      })
    })
  } catch (error) {
    console.error('Failed to recieve message:', error.response.data);
    res.status(500).send({ error: 'Failed to recieve message' });
  }
});
app.get("/histograma", (req, res) => {
  try {
    // console.log("Ultimas")
    const originBank = req.query.origin_bank;
    const destinationBank = req.query.destination_bank;
    const date = req.query.date;
    var query = 'SELECT * FROM transactions';
    // console.log(req.query)
    var params = [];
    if (originBank && originBank !== null && originBank !== 'Todos') {
      query = query + ' WHERE origin_bank = $1';
      params.push(originBank);
    }
    if (destinationBank && destinationBank !== null && destinationBank !== 'Todos') {
      if (originBank !== null && originBank !== 'Todos') {
        query = query + ' AND destination_bank = $2';
      } else {
        query = query + ' WHERE destination_bank = $1';
      }
      params.push(destinationBank);
    }
    if (date && date !== null) {
      if (originBank !== null && originBank !== 'Todos' && destinationBank !== null && destinationBank !== 'Todos') {
        query = query + ' AND publish_time::date = $3::date';
      } else if ((originBank !== null && originBank !== 'Todos') || (destinationBank !== null && destinationBank !== 'Todos')) {
        query = query + ' AND publish_time::date = $2::date';
      } else {
        query = query + ' WHERE publish_time::date = $1::date';
      }
      params.push(date);
    }
    // console.log(query);
    // console.log(params);
    pgClient.connect((err, client, done) => {
      if (err) throw err
      client.query(query, params, (err, res1) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          // console.log(res1.rows)
          res.status(200).send(res1.rows);
        }
      })
    })
  } catch (error) {
    console.error('Failed to recieve message:', error.response.data);
    res.status(500).send({ error: 'Failed to recieve message' });
  }
});

app.get("/conciliacion", (req, res) => {
  try {
    // console.log("Conciliacion")
    const originBank = req.query.origin_bank;
    const destinationBank = req.query.destination_bank;
    const date = req.query.date;
    // var query = 'SELECT  origin_bank, destination_bank, SUM(CASE WHEN type = $1 AND origin_bank = $2 THEN amount ELSE 0 END) AS monto_depositos_recibidos, SUM(CASE WHEN type = $1 AND destination_bank = $3 THEN amount ELSE 0 END) AS monto_depositos_enviados, SUM(CASE WHEN type = $4 AND origin_bank = $2 THEN amount ELSE 0 END) AS monto_reversas_recibidas, SUM(CASE WHEN type = $4 AND destination_bank = $3 THEN amount ELSE 0 END) AS monto_reversas_enviada FROM transactions';
    // var query = 'SELECT t1.origin_bank, t2.destination_bank, SUM(CASE WHEN t1.type = $1 THEN t1.amount ELSE 0 END) AS monto_depositos_recibidos, SUM(CASE WHEN t1.type = $2 THEN t1.amount ELSE 0 END) AS monto_reversas_recibidas, SUM(CASE WHEN t2.type = $1 THEN t2.amount ELSE 0 END) AS monto_depositos_enviados, SUM(CASE WHEN t2.type = $2 THEN t2.amount ELSE 0 END) AS monto_reversas_enviadas FROM transactions t1 JOIN transactions t2 ON t1.origin_bank = t2.destination_bank'
    var query = 'SELECT origin_bank, destination_bank, SUM(CASE WHEN type = $1 AND origin_bank = destination_bank THEN amount ELSE 0 END) AS monto_depositos_recibidos, SUM(CASE WHEN type = $1 AND origin_bank <> destination_bank THEN amount ELSE 0 END) AS monto_depositos_enviados, SUM(CASE WHEN type = $2 AND origin_bank = destination_bank THEN amount ELSE 0 END) AS monto_reversas_recibidas, SUM(CASE WHEN type = $2 AND origin_bank <> destination_bank THEN amount ELSE 0 END) AS monto_reversas_enviadas FROM transactions'
    // console.log(req.query)
    var params = [2200, 2400];
    if (originBank && originBank !== null && originBank !== 'Todos') {
      query = query + ' WHERE origin_bank = $3';
      params.push(originBank);
    }
    if (destinationBank && destinationBank !== null && destinationBank !== 'Todos') {
      if (originBank !== null && originBank !== 'Todos') {
        query = query + ' AND destination_bank = $5';
      } else {
        query = query + ' WHERE destination_bank = $3';
      }
      params.push(destinationBank);
    }
    if (date && date !== null) {
      if (originBank !== null && originBank !== 'Todos' && destinationBank !== null && destinationBank !== 'Todos') {
        query = query + ' AND publish_time::date = $5::date';
      } else if ((originBank !== null && originBank !== 'Todos') || (destinationBank !== null && destinationBank !== 'Todos')) {
        query = query + ' AND publish_time::date = $4::date';
      } else {
        query = query + ' WHERE publish_time::date = $3::date';
      }
      params.push(date);
    }
    query = query + ' GROUP BY origin_bank, destination_bank ORDER BY origin_bank ASC';
    // console.log(query);
    // console.log(params);
    pgClient.connect((err, client, done) => {
      if (err) throw err
      client.query(query, params, (err, res1) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          // console.log(res1.rows)
          var conciliacion = 0;
          res1.rows.forEach((row) => {
            conciliacion = row.monto_depositos_recibidos - row.monto_depositos_enviados - row.monto_reversas_recibidas + row.monto_reversas_enviadas;
            row.conciliacion = conciliacion;
            if (conciliacion > 0) {
              row.bancoDeudor = row.origin_bank;
            } else if (conciliacion < 0) {
              row.bancoDeudor = row.destination_bank;
            } else {
              row.bancoDeudor = 'Ninguno';
            }
          });
          res.status(200).send(res1.rows);
        }
      })
    })
  } catch (error) {
    console.error('Failed to recieve message:', error.response.data);
    res.status(500).send({ error: 'Failed to recieve message' });
  }
});

app.post("/", (req, res) => {
  try {
    // console.log("Mensaje",req.body);
    const message = req.body.message;
    // Decodificar la cadena base64 a buffer
    const buffer = Buffer.from(message.data, 'base64');
    
    // Convertir el buffer a cadena
    const decodedString = buffer.toString('utf8');

    const type = decodedString.substring(0, 4);
    const messageId = decodedString.substring(4, 14);
    const originBank = decodedString.substring(14, 21);
    const originAccount = decodedString.substring(21, 31);
    const destinationBank = decodedString.substring(31, 38);
    const destinationAccount = decodedString.substring(38, 48);
    const amount = decodedString.substring(48);
    const pattern = /^(\d{4})(\d{10})(\d{7})(\d{10})(\d{7})(\d{10})(\d{16})$/;
    // Insertar en la tabla

    pgClient.connect((err, client, done) => {
      console.log("Insertando el mensaje")
        if (err) throw err
        client.query('SELECT * FROM messages WHERE message_id = $1', [message.messageId], (err1, res1) => {
          console.log("La transacción no existe, se puede crear")
          if (res1.rowCount == 0) {
            if (err) throw err
            client.query('INSERT INTO messages(message_id, data, publish_time) VALUES ($1, $2, $3) RETURNING *', [message.messageId, decodedString, new Date(message.publishTime)], (err2, res2) => {
              })
              if (pattern.test(decodedString)) {
                const [, operationType] = decodedString.match(pattern);
                if (operationType === '2200' || operationType === '2400') {
                  console.log('El string tiene el formato correcto y el tipo de operación es válido.');
                  client.query('INSERT INTO transactions(type, message_id, origin_bank, origin_account, destination_bank, destination_account, amount, publish_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [type, messageId, originBank, originAccount, destinationBank, destinationAccount, amount, new Date(message.publishTime)], (err2, res2) => {
                  done()
                    if (err1) {
                      console.log(err1.stack)
                    } else {
                      console.log("Transacción creada")
                      return;
                    }
                  })
              }}
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