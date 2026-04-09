const tColores = {
  Rojo:   0,
  Verde:  1,
  Azul:   2,
  Dorado: 3,
};

const MAX_COLORES_SEQ = 12;

const readline = require("readline");


function pregunta(rl, texto) {
  return new Promise((resolve) => {
    rl.question(texto, resolve);
  });
}



function charToColor(color) {
  switch (color.toLowerCase()) {
    case "r": return tColores.Rojo;
    case "v": return tColores.Verde;
    case "a": return tColores.Azul;
    case "d": return tColores.Dorado;
    default:  return null;
  }
}


function intToColor(numero) {
  switch (numero) {
    case 0: return tColores.Rojo;
    case 1: return tColores.Verde;
    case 2: return tColores.Azul;
    case 3: return tColores.Dorado;
    default: return null;
  }
}

function generarSecuencia(numColores) {
  const secuencia = [];
  for (let i = 0; i < MAX_COLORES_SEQ; i++) {
    const aleatorio = parseInt(Math.random() * (numColores + 1));
    secuencia.push(intToColor(aleatorio));
  }
  return secuencia;
}