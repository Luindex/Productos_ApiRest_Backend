import {Router} from "express"
import {
  createProduct,
  deleteProduct,
  getProductByID,
  getProducts,
  updateAvalibity,
  updateProduct,
} from "./handlers/Product"
import {body, param} from "express-validator"
import {handleInputErrors} from "./middleware"

const router = Router()

router.get("/", getProducts)

router.get(
  "/:id",
  param("id").isInt().withMessage("ID no Valido"),
  handleInputErrors,
  getProductByID
)

router.post(
  "/",
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacio"),

  body("precio")
    .notEmpty()
    .withMessage("El Precio no puede ir vacio")
    .isNumeric()
    .withMessage("Valor No valido")
    .custom((value) => value > 0)
    .withMessage("Precio no Valido"),
  handleInputErrors,
  createProduct
)

router.put(
  "/:id",
  param("id").isInt().withMessage("ID no Valido"),
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacio"),

  body("precio")
    .notEmpty()
    .withMessage("El Precio no puede ir vacio")
    .isNumeric()
    .withMessage("Valor No valido")
    .custom((value) => value > 0)
    .withMessage("Precio no Valido"),
  body("disponibilidad")
    .isBoolean()
    .withMessage("Valor para Disponibilidad No Valido"),
  handleInputErrors,
  updateProduct
)

router.patch(
  "/:id",
  param("id").isInt().withMessage("ID no Valido"),
  handleInputErrors,
  updateAvalibity
)

router.delete(
  "/:id",
  param("id").isInt().withMessage("ID no Valido"),
  handleInputErrors,
  deleteProduct
)

export default router
