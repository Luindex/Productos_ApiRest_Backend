import {Table, Column, Model, DataType, Default} from "sequelize-typescript"

@Table({
  tableName: "productos",
})
class Producto extends Model {
  @Column({
    type: DataType.STRING(100), // maximo 100 Caracteres
  })
  declare nombre: String //tipo de Dato

  @Column({
    type: DataType.FLOAT(6), //longitud, decimales
  })
  declare precio: number //tipo de Dato

  @Default(true) //el codigo de aqui hacia abajo automanticamente sera True en caso de ser tipo boolean
  @Column({
    type: DataType.BOOLEAN,
  })
  declare disponibilidad: boolean //tipo de Dato
}

export default Producto
