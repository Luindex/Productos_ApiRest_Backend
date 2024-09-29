import server from "./server"

const port = process.env.PORT || 4000

server.listen(port, () => {
  console.log(`Rest Api en el Puerto ${port}`)
})
