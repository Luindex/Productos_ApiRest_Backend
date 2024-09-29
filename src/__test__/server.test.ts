import {connectDB} from "../server"
import db from "../config/db"

jest.mock("../config/db")

describe("connectDB", () => {
  it("Should handle database connection error", async () => {
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValueOnce(
        new Error("Hubo un Error al Conectar la Base de Datos")
      )
    const consoleSpy = jest.spyOn(console, "log")

    await connectDB()

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Hubo un Error al Conectar la Base de Datos")
    )
  })
})
