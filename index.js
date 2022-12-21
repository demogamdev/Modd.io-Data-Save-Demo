const express = require('express');
const Database = require('@replit/database')
const db = new Database();
const app = express();
app.use(express.urlencoded({ extented: true }));

const mySecret = process.env['key']
app.post('/', (req, res) => {
  if (req.body.key == mySecret) {
    console.log('successful entry');
    switch (req.body.event) {
      case 'request data':
        db.get(req.body.playerName).then(data => {
          let response;
          if (data) {
            response = JSON.stringify([req.body.playerName, data]);
          } else {
            response = JSON.stringify([req.body.playerName, 'no data']);
          }
          res.send({ response: response });
        });
        break;
      case 'save data':
        db.set(req.body.playerName, req.body.playerData).then(() => {
          res.send({ response: 'data saved for ' + req.body.playerName });
        });
        break;
      case 'save all data':
        let data = req.body.data;
        if (data) {
          let names;
          for (let i = 0; i < data.length; i++) {
            names += data[i].playerName + ' ';
            db.set(data[i].playerName, data[i].playerData);
          }
          res.send({ response: 'data saved for ' + names })
        }
        break;
    }
  } else {
    res.send({ response: 'error key incorrect'});
    console.log('unsuccessful entry');
  }
  
})

app.get('/', (req, res) => {
  db.getAll().then((data) => {
    res.send(data);
  })
});

app.listen(3000, () => {
  console.log('server started');
});
