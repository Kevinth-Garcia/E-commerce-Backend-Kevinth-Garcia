import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../Models/Product.js";

dotenv.config();

//lista de productos listo para inyectar en mongoDB

const products = [
  {
    id: 1,
    nombre: "DualSense Edge Wireless Controller",
    descripcion: "Obtén una ventaja en el juego creando tus propios controles personalizados para adaptarse a tu estilo de juego.",
    precio: 170,
    imagen: "https://m.media-amazon.com/images/I/61eXEcwYZRL._SL1500_.jpg",
  },
  {
    id: 2,
    nombre: "PS5 PRO",
    descripcion:
      "Con la consola PlayStation5 Pro, los mejores creadores de juegos del mundo pueden mejorar sus juegos con características increíbles como trazado de rayos avanzado, claridad de imagen súper nítida para tu televisor 4K y una jugabilidad de alta velocidad de fotogramas.",
    precio: 750,
    imagen: "https://m.media-amazon.com/images/I/61vR3ovb2UL._SL1500_.jpg",
  },
  {
    id: 3,
    nombre: "Meta Quest 3 512 GB",
    descripcion:
      "Prepárate para el Meta Quest más potente hasta el momento*. Con realidad mixta, transmite programas en pantallas gigantes y vibrantes que puedes ajustar al tamaño perfecto, todo mientras ves el mundo que te rodea.",
    precio: 500,
    imagen: "https://m.media-amazon.com/images/I/61nkctF66PL._SL1500_.jpg",
  },
  {
    id: 4,
    nombre: "Residen Evil 4 Remake",
    descripcion:
      " conserva la esencia del juego original, ahora reconstruido utilizando el RE Engine patentado de Capcom para ofrecer imágenes realistas y profundidad narrativa adicional a la historia icónica que no era posible en el momento del lanzamiento original.",
    precio: 20,
    imagen: "https://m.media-amazon.com/images/I/712XPl7+qKL._SL1500_.jpg",
  },
  {
    id: 5,
    nombre: "Apex Pro Mini Gen 3",
    descripcion:
      "empuja los límites con interruptores OmniPoint 3.0 de vanguardia con disparador rápido, modo de protección, toque rápido y ajuste completo.",
    precio: 190,
    imagen: "https://m.media-amazon.com/images/I/61uIPk9HKRL._AC_SL1500_.jpg",
  },
  {
    id: 6,
    nombre: "CyberPowerPC Gamer Xtreme VR Gaming PC",
    descripcion:
      "Destruye la competencia con CYBERPOWERPC Gamer Xtreme VR series of de computadoras gaming de escritorio.",
    precio: 1960,
    imagen: "https://m.media-amazon.com/images/I/61HNWshcTyL._AC_SL1500_.jpg",
  },
  {
    id: 7,
    nombre: "Taza de café GAMEBOY",
    descripcion:
      "disfruta de un refresco retro mientras juegas con esta taza de cambio de calor de Nintendo Game Boy.",
    precio: 15,
    imagen: "https://m.media-amazon.com/images/I/71alMT8fYrL._AC_SL1500_.jpg",
  },
  {
    id: 8,
    nombre: "ASUS ROG Xbox Ally 7",
    descripcion:
      " El legado de juegos de Xbox se une a las décadas de diseño de hardware premium de ROG en ROG Xbox Ally.",
    precio: 490,
    imagen: "https://m.media-amazon.com/images/I/61gZGeavWGL._SL1500_.jpg",
  },
  {
    id: 9,
    nombre: "Logitech G Astro A50",
    descripcion:
      "El auricular inalámbrico para juegos A50 con micrófono se conecta a 3 plataformas a la vez a través de USB-C para que pueda tocar entre Xbox, PS5, PC/Mac o Nintendo Switch a través del control en la oreja",
    precio: 250,
    imagen: "https://m.media-amazon.com/images/I/61w4N5BimoL._AC_SL1500_.jpg",
  },
  {
    id: 10,
    nombre: "Logitech G 502 Lightspeed Mouse",
    descripcion:
      "nunca más te preocupes por la duración de la batería. Añade el sistema de carga inalámbrica Power Play para mantener tu mouse inalámbrico G502",
    precio: 85,
    imagen: "https://m.media-amazon.com/images/I/61In3+ndmcL._AC_SL1500_.jpg",
  },
];

//const para inyectar los productos en mongo

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a mongoDB");
    await Product.deleteMany({});
    console.log("Productos existentes eliminados");
    await Product.insertMany(products);
    console.log(
      "Productos insertados correctamente. Cantidad agregada: ",
      products.length
    );
    console.log("Conexion cerrada");
    process.exit(0);
  } catch (error) {
    console.error("error al poblar la base de datos: ", error);
    process.exit(1);
  }
};
seedProducts();
