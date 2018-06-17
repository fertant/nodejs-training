const app = require('./app');
const port = process.env.PORT || 8080;
console.log(app);
app.listen(port, () => console.log(`App listening on port ${port}!`))
