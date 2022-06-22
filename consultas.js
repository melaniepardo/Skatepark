const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "espinoza",
    database: "skatepark",
    port: 5432,
});

async function nuevoUsuario(email, nombre, password, anios_experiencia, especialidad) {
    const result = await pool.query(
        `INSERT INTO skaters (email, nombre, password, anios_experiencia, especialidad, foto, estado) values ('${email}','${nombre}', '${password}','${anios_experiencia}', '${especialidad}', '${foto}' false) RETURNING *`
    );
    const usuario = result.rows[0];
    return usuario;
}

async function getUsuarios() {
    const result = await pool.query(`SELECT * FROM skaters`);
    return result.rows;
}

async function setUsuarioStatus(id, estado) {
    const result = await pool.query(
        `UPDATE skaters SET estado = ${estado} WHERE id = ${id} RETURNING*`
    );
    const usuario = result.rows[0];
    return usuario;
}

async function getUsuario(email, password) {
    const result = await pool.query(
        `SELECT * FROM skaters WHERE email = '${email}' AND password = '${password}'`
    );
    return result.rows[0]
}

async function setDatosUsuario(email, nombre, password, anios, especialidad) {
    const result = await pool.query(
        `UPDATE skaters SET
            nombre = '${nombre}',
            password = '${password}',
            anios_experiencia = ${anios},
            especialidad = '${especialidad}'
            WHERE email = '${email}' RETURNING *`
    )

    const usuario = result.rows[0];
    return usuario;
}


async function eliminarUsuario(email) {
    const result = await pool.query(`
        DELETE FROM skaters WHERE email = '${email}'
    `);

    return result.rowCount;
}


module.exports = {
    nuevoUsuario,
    getUsuarios,
    setUsuarioStatus,
    getUsuario,
    setDatosUsuario,
    eliminarUsuario
}