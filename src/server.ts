import express from "express"
import db from "./config/db"
import router from "./router"
import colors from "colors"
import cors, {CorsOptions} from "cors"

export async function connectDB() {
  try {
    await db.authenticate()
    db.sync()
    console.log(
      colors.bgGreen.black.bold("Conexion Exitosa a la Base De Datos")
    )
  } catch (error) {
    console.log(colors.red.bold("Hubo un Error al Conectar la Base de Datos"))
    console.log(error)
  }
}

connectDB()
const server = express()

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTED_URL) {
      callback(null, true)
    } else {
      callback(new Error("Error de Cors"))
    }
  },
}

server.use(cors(corsOptions))

server.use(express.json())

server.use("/api/productos", router)

export default server
