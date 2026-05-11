const tColores = {
  Rojo:    0,
  Verde:   1,
  Azul:    2,
  Dorado:  3,
  Blanco:  4,
  Marron:  5,
  Naranja: 6,
};

const tModo = {
  Sencillo: 1,
  Dificil:  2,
};

const MAX_COLORES_SEQ     = 18;
const MAX_COLORES_FACIL   = 4;
const MAX_COLORES_DIFICIL = 7;
const MAX_SEQ_FACIL       = 12;
const MAX_SEQ_DIFICIL     = 15;
const NUM_AYUDAS_DEFAULT  = 3;

const readline = require("readline");

function pregunta(rl, texto) {
  return new Promise(function (resolve) {
    rl.question(texto, resolve);
  });
}

function charToColor(char, modo) {
  switch (char.toLowerCase()) {
    case "r": return tColores.Rojo;
    case "v": return tColores.Verde;
    case "a": return tColores.Azul;
    case "d": return tColores.Dorado;
    case "b": return modo === tModo.Dificil ? tColores.Blanco  : null;
    case "m": return modo === tModo.Dificil ? tColores.Marron  : null;
    case "n": return modo === tModo.Dificil ? tColores.Naranja : null;
    default:  return null;
  }
}

function tColorToString(numero) {
  switch (numero) {
    case tColores.Rojo:    return "Rojo";
    case tColores.Verde:   return "Verde";
    case tColores.Azul:    return "Azul";
    case tColores.Dorado:  return "Dorado";
    case tColores.Blanco:  return "Blanco";
    case tColores.Marron:  return "Marrón";
    case tColores.Naranja: return "Naranja";
    default:               return null;
  }
}

function generarSecuencia(modo, numColores) {
  const secuencia = [];
  const maxSeq = modo === tModo.Dificil ? MAX_SEQ_DIFICIL : MAX_SEQ_FACIL;

  for (let i = 0; i < maxSeq; i++) {
    const aleatorio = Math.floor(Math.random() * numColores);
    secuencia.push(aleatorio);
  }
  return secuencia;
}

function comprobarColor(secuenciaColores, indice, color) {
  return secuenciaColores[indice] === color;
}

function utilizarAyuda(secuenciaColores, indice, numAyudas) {
  if (numAyudas > 0) {
    numAyudas--;
    const colorActual = tColorToString(secuenciaColores[indice]);
    console.log("El siguiente color es el " + colorActual + ". Te quedan " + numAyudas + " ayudas!");
    return { usada: true, numAyudas };
  } else {
    console.log("No dispones de más ayudas.");
    return { usada: false, numAyudas };
  }
}

async function mostrarSecuencia(secuenciaColores, numero) {
  const partes = [];
  for (let i = 0; i < numero; i++) {
    partes.push(tColorToString(secuenciaColores[i]));
  }
  console.log("\nSecuencia número " + (numero - 2) + ": " + partes.join(" - "));

  await new Promise(function (resolve) {
    process.stdout.write("Memoriza la secuencia y pulsa Enter para continuar...");
    process.stdin.once("data", resolve);
  });

  console.clear();
}

async function comenzarJuego(nombre, modo, rl) {
  const numColores   = modo === tModo.Dificil ? MAX_COLORES_DIFICIL : MAX_COLORES_FACIL;
  const maxSeq       = modo === tModo.Dificil ? MAX_SEQ_DIFICIL     : MAX_SEQ_FACIL;
  const secuencia    = generarSecuencia(modo, numColores);
  let longitudActual = 3;
  let juegoTerminado = false;
  let numAyudas      = NUM_AYUDAS_DEFAULT;

  const leyenda =
    modo === tModo.Dificil
      ? "(R = Rojo, V = Verde, A = Azul, D = Dorado, B = Blanco, M = Marrón, N = Naranja, x = Ayuda)"
      : "(R = Rojo, V = Verde, A = Azul, D = Dorado, x = Ayuda)";

  while (longitudActual <= maxSeq && !juegoTerminado) {
    await mostrarSecuencia(secuencia, longitudActual);

    console.log("Ayudas disponibles: " + numAyudas);
    console.log(nombre + ", introduce la secuencia de " + longitudActual + " colores:");
    console.log(leyenda);

    let acierto = true;
    let i = 0;

    while (i < longitudActual && acierto) {
      let color = null;

      while (color === null) {
        const entrada = await pregunta(rl, "Color " + (i + 1) + ": ");
        const input   = entrada.trim();

        if (input.toLowerCase() === "x") {
          const resultado = utilizarAyuda(secuencia, i, numAyudas);
          numAyudas = resultado.numAyudas;
          continue;
        }

        color = charToColor(input, modo);
        if (color === null) {
          console.log("Color no válido. Introduce " + leyenda);
        }
      }

      if (!comprobarColor(secuencia, i, color)) {
        acierto = false;
      }

      i++;
    }

    if (!acierto) {
      console.log("\nHas fallado. Game over, " + nombre + ".");
      juegoTerminado = true;
    } else if (longitudActual === maxSeq) {
      console.log("\n¡Enhorabuena, " + nombre + "! ¡Has completado la secuencia máxima y ganado el juego!");
      juegoTerminado = true;
    } else {
      console.log("\nEnhorabuena, has acertado la secuencia número " + (longitudActual - 2) + ".");
      longitudActual++;
    }
  }
}

async function mostrarMenu(rl) {
  console.log("\nElija una opción para continuar:");
  console.log("0: Salir.");
  console.log("1: Jugar en modo sencillo.");
  console.log("2: Jugar en modo difícil.");

  let opcion = null;
  while (opcion === null) {
    const entrada = await pregunta(rl, "Opción: ");
    const num = parseInt(entrada.trim(), 10);
    if (num === 0 || num === 1 || num === 2) {
      opcion = num;
    } else {
      console.log("Opción no válida. Introduce 0, 1 o 2.");
    }
  }
  return opcion;
}

async function main() {
  const rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout,
  });

  console.log("¡Bienvenido a Simon dice!");
  const nombre = await pregunta(rl, "¿Cuál es tu nombre? ");
  console.log("Hola " + nombre + "!");

  let salir = false;

  while (!salir) {
    const opcion = await mostrarMenu(rl);

    switch (opcion) {
      case 0:
        salir = true;
        console.log("¡Hasta luego, " + nombre + "!");
        break;
      case 1:
        await comenzarJuego(nombre, tModo.Sencillo, rl);
        break;
      case 2:
        await comenzarJuego(nombre, tModo.Dificil, rl);
        break;
    }
  }

  rl.close();
}

main();