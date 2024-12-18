const express = require('express');
const db = require('./models');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/static', express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.get('*', (req, res) => {
  res.render('404');
});

db.sequelize.sync({ force: false }).then(() => {
  console.log('DB연결 성공!');

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(
      `Current environment: ${process.env.NODE_ENV || 'development'}`,
    );
  });
});
