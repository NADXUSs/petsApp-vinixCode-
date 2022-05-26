import express from 'express'
import cors from "cors";
const app = express()
const port = process.env.PORT || 3000

//middlewares
//cors
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/userFiles'));

//rutas
import router from "./src/routes/routes.js";
app.use(router)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})