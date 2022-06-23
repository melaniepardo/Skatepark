CREATE DATABASE skatepark;

CREATE TABLE skaters (
    id SERIAL,
    email VARCHAR(50) NOT NULL,
    nombre VARCHAR(25) NOT NULL,
    password VARCHAR(25) NOT NULL,
    anios_experiencia INT NOT NULL,
    especialidad VARCHAR(50) NOT NULL,
    foto VARCHAR(255) NOT NULL,
    estado BOOLEAN NOT NULL
);

INSERT INTO skaters (email, nombre, password, anios_experiencia, especialidad, foto, estado) VALUES ('aprobado@gmail.com', 'Camila', '123', 1, 'flotar', 'img.jpg', true);
