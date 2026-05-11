const tColores = {
  Rojo:     0,
  Verde:    1,
  Azul:     2,
  Dorado:   3,
  Amarillo: 4,
};

const MAX_COLORES_SEQ = 12;

const readline = require("readline");

function pregunta(rl, texto) {
  return new Promise(function (resolve) {
    rl.question(texto, resolve);
  });
}

function charToColor(color) {
  switch (color.toLowerCase()) {
    case "r": return tColores.Rojo;
    case "v": return tColores.Verde;
    case "a": return tColores.Azul;
    case "d": return tColores.Dorado;
    case "y": return tColores.Amarillo;
    default:  return null;
  }
}

function intToColor(numero) {
  switch (numero) {
    case 0: return tColores.Rojo;
    case 1: return tColores.Verde;
    case 2: return tColores.Azul;
    case 3: return tColores.Dorado;
    case 4: return tColores.Amarillo;
    default: return null;
  }
}

function tColorToString(numero) {
  switch (numero) {
    case tColores.Rojo:     return "Rojo";
    case tColores.Verde:    return "Verde";
    case tColores.Azul:     return "Azul";
    case tColores.Dorado:   return "Dorado";
    case tColores.Amarillo: return "Amarillo";
    default:                return null;
  }
}

function generarSecuencia(numColores) {
  const secuencia = [];
  for (let i = 0; i < MAX_COLORES_SEQ; i++) {
    const aleatorio = Math.floor(Math.random() * numColores);
    secuencia.push(intToColor(aleatorio));
  }
  return secuencia;
}

function comprobarColor(secuenciaColores, indice, color) {
  return secuenciaColores[indice] === color;
}

async function mostrarSecuencia(secuenciaColores, numero) {
  const partes = [];
  for (let i = 0; i < numero; i++) {
    partes.push(tColorToString(secuenciaColores[i]));
  }
  
  console.log(" Secuencia: " + partes.join(" - "));

  await new Promise(function (resolve) {
    process.stdout.write("Memoriza la secuencia y pulsa Enter para continuar...");
    process.stdin.once("data", resolve);
  });

  console.clear();
}

async function comenzarJuego(nombre, rl, longitudActual) {
  const numColores = 5;
  const secuencia = generarSecuencia(numColores);
  let juegoTerminado = false;

  
  if (longitudActual === "f") {
    longitudActual = 2;
  } else if (longitudActual === "n") {
    longitudActual = 3;
  } else {
    longitudActual = 4;
  }

  while (longitudActual <= MAX_COLORES_SEQ && !juegoTerminado) {
    await mostrarSecuencia(secuencia, longitudActual);

    console.log(nombre + ", introduce la secuencia de " + longitudActual + " colores:");
    console.log("( r = Rojo , v = Verde , a = Azul , d = Dorado , y = Amarillo )");

    let acierto = true;
    let i = 0;

    while (i < longitudActual && acierto) {
      let color = null;

      while (color === null) {
        const entrada = await pregunta(rl, "Color " + (i + 1) + ": ");
        color = charToColor(entrada.trim());
        if (color === null) {
          console.log("Color no válido. Introduce r, v, a, y o d.");
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
    } else if (longitudActual === MAX_COLORES_SEQ) {
      console.log("\n¡Enhorabuena, " + nombre + "! ¡Has completado la secuencia máxima y ganado el juego!");
      juegoTerminado = true;
    } else {
      console.log("\nEnhorabuena, has acertado .");
      longitudActual++;
    }
  }

  rl.close();
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("¡Bienvenido a Simon dice!");
  const nombre = await pregunta(rl, "¿Cuál es tu nombre? ");

  let nivelValido = false;
  let longitudActual;

  
  while (!nivelValido) {
    console.log("Nivel Fácil pulse f, Nivel Normal pulse n y Nivel Difícil pulse d");
    longitudActual = (await pregunta(rl, "¿Qué nivel de dificultad desea? "));
    if (longitudActual === "f" || longitudActual === "n" || longitudActual === "d") {
      nivelValido = true;
    } else {
      console.log("Opción no válida. Por favor, introduce f, n o d.");
    }
  }

  await pregunta(rl, "Hola " + nombre + ", pulsa Enter para empezar a jugar.");

  await comenzarJuego(nombre, rl, longitudActual);
}

main();