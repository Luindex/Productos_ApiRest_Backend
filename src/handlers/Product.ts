import {Request, Response} from "express" //Type para rep y res
import Producto from "../models/Producto.model"

export const createProduct = async (req: Request, res: Response) => {
  const producto = await Producto.create(req.body) //creamos un nuevo producto

  res.json({data: producto}) //retornar el producto que se ingreso a la base de Datos

  //  res.json("Desde Post")
}

export const getProducts = async (req: Request, res: Response) => {
  const products = await Producto.findAll({
    order: [
      ["precio", "DESC"], //se filtra por el precio mas alto
    ],
    attributes: {exclude: ["updatedAt", "createdAt"]}, //Obtiene todo menos estos 2
  })
  res.json({data: products})
}

export const getProductByID = async (req: Request, res: Response) => {
  const {id} = req.params
  const producto = await Producto.findByPk(id)

  if (!producto) {
    return res.status(404).json({
      error: "Producto no Encontrado",
    })
  }
  res.json({data: producto})
}

export const updateProduct = async (req: Request, res: Response) => {
  //Verificar Si el Producto Existe
  const {id} = req.params
  const producto = await Producto.findByPk(id)

  if (!producto) {
    return res.status(404).json({
      error: "No se Encontro Un Producto para Editar",
    })
  }

  //Editar El Producto
  await producto.update(req.body) //Cambia la Informacion
  await producto.save() //Informacion Guardada

  res.json({data: producto})
}

export const updateAvalibity = async (req: Request, res: Response) => {
  //Verificar Si el Producto Existe
  const {id} = req.params
  const producto = await Producto.findByPk(id)

  if (!producto) {
    return res.status(404).json({
      error: "No se Encontro Un Producto para Editar",
    })
  }

  //Editar El Producto
  producto.disponibilidad = !producto.dataValues.disponibilidad
  await producto.save() //Informacion Guardada

  res.json({data: producto})
}

export const deleteProduct = async (req: Request, res: Response) => {
  const {id} = req.params
  const producto = await Producto.findByPk(id)

  if (!producto) {
    return res.status(404).json({
      error: "No hay un Producto para Eliminar",
    })
  }

  await producto.destroy()
  res.json({data: "Producto Eliminado"})
}
