
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Permite recibir datos en formato JSON


// Datos iniciales de ejemplo para probar la API
let fallas = [
    {
        id: 1,
        maquina: "Compresor 01",
        tipo: "Mecanica",
        descripcion: "Vibracion excesiva en el motor",
        prioridad: "Alta",
        estado: "Pendiente"
    },
    {
        id: 2,
        maquina: "Bomba 03",
        tipo: "Electrica",
        descripcion: "El motor no enciende",
        prioridad: "Media",
        estado: "En diagnostico"
    }
];

// 1. Consultar todas las fallas
app.get("/api/fallas", (req, res) => {
    const { prioridad, estado } = req.query;

    let resultado = fallas;

    if (prioridad) {
        resultado = resultado.filter(
            falla => falla.prioridad.toLowerCase() === prioridad.toLowerCase()
        );
    }

    if (estado) {
        resultado = resultado.filter(
            falla => falla.estado.toLowerCase() === estado.toLowerCase()
        );
    }

    res.status(200).json({
        total: resultado.length,
        fallas: resultado
    });
});

// 2. Consultar una falla por su identificador
app.get("/api/fallas/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "El identificador debe ser un numero entero positivo"
        });
    }

    const falla = fallas.find(f => f.id === id);

    if (!falla) {
        return res.status(404).json({
            error: "No se encontro la falla solicitada"
        });
    }

    res.status(200).json(falla);
});

// 3. Registrar una nueva falla
app.post("/api/fallas", (req, res) => {
    const { maquina, tipo, descripcion, prioridad } = req.body;

    if (
        typeof maquina !== "string" || !maquina.trim() ||
        typeof tipo !== "string" || !tipo.trim() ||
        typeof descripcion !== "string" || !descripcion.trim() ||
        typeof prioridad !== "string" ||
        !["Baja", "Media", "Alta"].includes(prioridad)
    ) {
        return res.status(400).json({
            error: "Envia maquina, tipo, descripcion y prioridad valida (Baja, Media o Alta)"
        });
    }

    const nuevaFalla = {
        id: fallas.length
            ? Math.max(...fallas.map(f => f.id)) + 1
            : 1,
        maquina: maquina.trim(),
        tipo: tipo.trim(),
        descripcion: descripcion.trim(),
        prioridad,
        estado: "Pendiente"
    };

    fallas.push(nuevaFalla);

    res.status(201).json({
        mensaje: "Falla registrada correctamente",
        falla: nuevaFalla
    });
});

// 4. Actualizar el estado de una falla
app.put("/api/fallas/:id/estado", (req, res) => {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "El identificador debe ser un numero entero positivo"
        });
    }

    const estadosPermitidos = [
        "Pendiente",
        "En diagnostico",
        "En reparacion",
        "Resuelta"
    ];

    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({
            error: "Estado no valido",
            estadosPermitidos
        });
    }

    const falla = fallas.find(f => f.id === id);

    if (!falla) {
        return res.status(404).json({
            error: "No se encontro la falla solicitada"
        });
    }

    falla.estado = estado;

    res.status(200).json({
        mensaje: "Estado actualizado correctamente",
        falla
    });
});

// Ruta inicial para comprobar que el servidor funciona
app.get("/", (req, res) => {
    res.send("API de Gestion de Fallas de Maquinaria funcionando correctamente");
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`API disponible en http://localhost:${PORT}`);
});