const API_URL = "http://localhost:3000/api/fallas";

async function consultarFallas() {
    const resultado = document.getElementById("resultado");

    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        resultado.textContent = JSON.stringify(datos, null, 2);

    } catch (error) {
        resultado.textContent =
            "No fue posible consultar la API: " + error.message;
    }
    
}
async function registrarFalla() {
    const nuevaFalla = {
        maquina: "Motor 05",
        tipo: "Electrica",
        descripcion: "El motor presenta sobrecalentamiento",
        prioridad: "Alta"
    };

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevaFalla)
        });

        const datos = await respuesta.json();

        document.getElementById("resultado").textContent =
            JSON.stringify(datos, null, 2);

    } catch (error) {
        document.getElementById("resultado").textContent =
            "No fue posible registrar la falla: " + error.message;
    }
}
async function actualizarEstado() {
    const id = 4;

    const datosEstado = {
        estado: "Resuelta"
    };

    try {
        const respuesta = await fetch(`${API_URL}/${id}/estado`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosEstado)
        });

        const datos = await respuesta.json();

        document.getElementById("resultado").textContent =
            JSON.stringify(datos, null, 2);

    } catch (error) {
        document.getElementById("resultado").textContent =
            "No fue posible actualizar el estado: " + error.message;
    }
}
async function consultarFallaPorId() {
    const id = 1;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        document.getElementById("resultado").textContent =
            JSON.stringify(datos, null, 2);

    } catch (error) {
        document.getElementById("resultado").textContent =
            "No fue posible consultar la falla: " + error.message;
    }
}