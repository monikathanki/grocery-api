let app = require('./app')
let {PORT} = require('./config')


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})