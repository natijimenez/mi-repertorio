const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()
const FILE = "repertorio.json"

app.use(cors())
app.use(express.json())

const leerData = () => JSON.parse(fs.readFileSync(FILE, 'utf-8') || "[]")
const guardarData = (data) => fs.writeFileSync(FILE, JSON.stringify(data, null, 2))

app.get("/canciones", (req, res) => res.json(leerData()))

app.post("/canciones", (req, res) => {
  const canciones = leerData()
  canciones.push(req.body)
  guardarData(canciones)
  res.status(201).json({ message: "Canción agregada" })
})

app.put("/canciones/:id", (req, res) => {
  const canciones = leerData()
  const index = canciones.findIndex((c) => c.id == req.params.id)
  if (index === -1) return res.status(404).json({ error: "Canción no encontrada" })
  canciones[index] = { ...canciones[index], ...req.body }
  guardarData(canciones)
  res.json({ message: "Canción actualizada" })
})

app.delete("/canciones/:id", (req, res) => {
  const canciones = leerData().filter((c) => c.id != req.params.id)
  guardarData(canciones)
  res.json({ message: "Canción eliminada" })
})

app.listen(5000, () => console.log("¡Example app listening on port 5000!"))