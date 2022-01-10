const app = require('./app');

app.listen(process.env.PORT,()=>{
  console.log(`Authentication API Running on PORT ${process.env.PORT}`);
})