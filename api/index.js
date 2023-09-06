const {express, routes} = require('./controller')
const path = require('path')
const app = express()
const port = +process.env.PORT || 3000
const cors = require('cors')

app.use(express.static('./static'))
app.use(
    express.urlencoded({
        extended: false
    }),
    routes,
    cors()
)
routes.get('./controller/index.js', (req, res) =>{
    res.sendFile(path.resolve(__dirname, './static/html/index.html'))
})
app.listen(port, () => {
    console.log(`The server is running on port http://localhost:${port}`);
})