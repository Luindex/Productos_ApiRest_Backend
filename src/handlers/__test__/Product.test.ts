import request from "supertest"
import server from "../../server"

describe("POST /api/productos", () => {
  it("should display validation errors", async () => {
    const response = await request(server).post("/api/productos").send({}) //validar que el producto si se creo
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors).toHaveLength(4) // la longitud de los errores sea 4

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(2)
  })

  it("should validate that price is grater than 0", async () => {
    const response = await request(server).post("/api/productos").send({
      nombre: "Monitor Curvo",
      precio: 0,
    })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors).toHaveLength(1)

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(2)
  })

  it("should validate that price is a number and greater than 0", async () => {
    const response = await request(server).post("/api/productos").send({
      nombre: "Monitor Curvo",
      precio: "Hola",
    })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors).toHaveLength(2)

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(4)
  })

  it("should create a new product", async () => {
    const response = await request(server).post("/api/productos").send({
      nombre: "Audifonos con testing",
      precio: 90,
    })

    //###Bien###
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("data")

    //XXXX
    expect(response.status).not.toBe(404)
    expect(response.body).not.toHaveProperty("errors")
  })
})

describe("GET /api/productos", () => {
  it("should check if api/products url exists", async () => {
    const response = await request(server).get("/api/productos")
    expect(response.status).not.toBe(404)
  })

  it("GET a json response with products", async () => {
    const response = await request(server).get("/api/productos")

    //lo que esperamos
    expect(response.status).toBe(200) //esperamos que la respuesta sea 200
    expect(response.header["content-type"]).toMatch(/json/) //Tiene que ser Tipo JSON
    expect(response.body).toHaveProperty("data") //Su propiedad es 'data'
    expect(response.body.data).toHaveLength(1) //Se espera 1 solo producto

    //lo que no esperamos
    expect(response.body).not.toHaveProperty("errors") //no tiene que contener Errors
  })
})

describe("GET /api/productos/:id", () => {
  it("Should retur a 404 response for a non-existent product", async () => {
    const productId = 2000
    const response = await request(server).get(`/api/productos/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty("error")
    expect(response.body.error).toBe("Producto no Encontrado")
  })

  it("Should check a valid ID in the URL", async () => {
    //revisar el ID sea valido
    const response = await request(server).get("/api/productos/not-valid-url")
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe("ID no Valido")
  })

  it("get a JSON response a single product", async () => {
    //encontrar un solo Producto
    const response = await request(server).get("/api/productos/1")
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("data")
  })
})

describe("PUT /api/productos/:id", () => {
  it("Should check a valid ID in the URL", async () => {
    const response = await request(server)
      .put("/api/productos/not-valid-url")
      .send({
        nombre: "Monitor Generico",
        disponibilidad: true,
        precio: 10,
      })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe("ID no Valido")
  })

  it("should display validate error message when updatien a product", async () => {
    const response = await request(server).put("/api/productos/1").send({})
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(5)

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty("data")
  })

  it("should valitade that the price is greater then 0", async () => {
    const response = await request(server).put("/api/productos/1").send({
      nombre: "Monitor Generico",
      disponibilidad: true,
      precio: -300,
    })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe("Precio no Valido")

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty("data")
  })

  it("should return a 404 response for a non-existeat product", async () => {
    const productId = 12344
    const response = await request(server)
      .put(`/api/productos/${productId}`)
      .send({
        nombre: "Monitor Generico",
        disponibilidad: true,
        precio: 300,
      })
    expect(response.status).toBe(404)
    expect(response.body.error).toBe("No se Encontro Un Producto para Editar")

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty("data")
  })

  it("should update an existing product with valid data", async () => {
    const response = await request(server).put(`/api/productos/1`).send({
      nombre: "Monitor Generico",
      disponibilidad: true,
      precio: 300,
    })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("data")

    expect(response.status).not.toBe(404)
    expect(response.body).not.toHaveProperty("errors")
  })
})

describe("DELETE /api/productos/:id", () => {
  it("should check a validate ID", async () => {
    const response = await request(server).delete("/api/productos/not-valid")
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors[0].msg).toBe("ID no Valido")
  })

  it("should return a 404 response for a non-existent produnt", async () => {
    const productId = 12425
    const response = await request(server).delete(`/api/productos/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe("No hay un Producto para Eliminar")

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty("data")
  })

  it("should delete a product", async () => {
    const response = await request(server).delete("/api/productos/2")
    expect(response.status).toBe(200)
    expect(response.body.data).toBe("Producto Eliminado")

    expect(response.status).not.toBe(404)
  })
})

describe("PATCH /api/productos/:id", () => {
  it("should return a 404 response a non-existing product", async () => {
    const productId = 3012
    const response = await request(server).patch(`/api/product/${productId}`)

    expect(response.status).toBe(404)

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty("data")
  })

  it("shoul update the product avalability", async () => {
    const response = await request(server).patch("/api/productos/3")
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("data")
    expect(response.body.data.disponibilidad).toBe(false)

    expect(response.status).not.toBe(404)
    expect(response.status).not.toBe(400)
    expect(response.body).not.toHaveProperty("error")
  })
})
