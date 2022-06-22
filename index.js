const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileUpload");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const secretKey = "Shhh";

const { nuevoUsuario, getUsuarios, getUsuario, setUsuarioStatus,
    eliminarUsuario } = require("./consultas")

//server
app.listen(3000, () => console.log("Servidor encendido"));

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname +"/public"));
app.use(
    expressFileUpload({
        limits: 5000000,
        abortOnLimit: true,
        responseOnLimit: "El tamaño de la imagen supera el límite permitido",
    })
);
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.engine(
    "handlebars",
    exphbs.engine({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/mainLayout`,
    })
);
app.set("view engine", "handlebars");

//rutas

app.get("/", function (req, res) {
    res.render("Home", { layout:"main"} );
});


//Registrar
app.post('/registro', async (req, res) => {
    console.log(req.files.foto.name)
    const nombre_foto = req.files.foto.name
    const { email, nombre, password, anios, especialidad } = req.body;
    try {
        const respuesta = await nuevoUsuario(email, nombre, password, anios_experiencia, especialidad, nombre_foto);
        await req.files.foto.mv(__dirname + "/public/img/" + nombre_foto)
        res.status(201).send(respuesta);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

app.put("/usuarios", async (req, res) => {
    const { id, auth } = req.body;
    try {
        const usuario = await setUsuarioStatus(id, auth);
        res.status(200).send(JSON.stringify(usuario));
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal...${e}`,
            code: 500
        })
    };
});


    //Ruta para cambiar de falso a true
app.get("/Admin", async (req, res) => {
    try {
        const usuarios = await getUsuarios();
        res.render("Admin", { usuarios });
    } catch (e) {
        res.status(500).send(
            {
                error: 'Algo salió mal ${e}',
                code: 500
            })
    };
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/verify", async function (req, res) {
    const { email, password } = req.body;
    const user = await getUsuario(email, password);
    if (user) {
        if (user.auth) {
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 180,
                    data: user,
                },
                secretKey
            );
            res.send(token);
        } else {
            res.status(401).send({
                error: "Este usuario no está registrado en la base de datos",
                code: 401,
            });
        }
    } else {
        res.status(404).send({
            error: "Este usuario no está registrado en la base de datos",
            code: 404,
        });
    }
});

app.get("/Registro", function (req, res) {
    const { token } = req.query;
    jwt.verify(token, secretKey, (err, decoded) => {
        const { data } = decoded
        const { nombre, email, password, anios_experiencia, especialidad, nombre_foto } = data
        err
            ? res.status(401).send(
                res.send({
                    err: "401 Unauthorized",
                    message: "Lo sentimos, usted no está autorizado para ingresar",
                    token_error: err.message,
                })
            )
            : res.render("Registro", { nombre, email });
    });
});


app.delete('/eliminar_usuario/:email', async (req, res) => {

    try {
        const { email } = req.params;
        const respuesta = await eliminarUsuario(email);
        res.sendStatus(200).send(respuesta);

    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})