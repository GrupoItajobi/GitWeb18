
// Primeira letra em maiusculo e restante minuscula de cada palavra separa pelo caracter passado
function initcap(texto: string, init: number = 0, caracter: string = ' '): string {
  let result: string[] = [];
  let split: string[] = texto.split(caracter);
  split.forEach(t => {
    if (result.length >= init) {
      if (t) {
        t = t[0].toUpperCase() + t.slice(1).toLowerCase();
      }
    }

    result[result.length] = t;
  });
  texto = "";
  result.forEach(t => {
    texto += t + ' ';
  })
  return texto.trim();
}
// Primeira letra lower, restante Igual
function initLower(texto: string): string {
  return texto[0].toLowerCase() + texto.slice(1);
}

function nowString(): string {
  let date_Object = new Date();
  let date: string = (date_Object).toISOString().substring(0, 10)
  let time: string = (date_Object).toTimeString().substring(0, 8)
  return date + ' ' + time;
}

function dateToString(data: Date, retornaHoraCompleta:boolean=true): string {
  if (data) {
    let date_Object = new Date(data);
    let date: string = (date_Object).toISOString().substring(0, 10)
    let time: string = (date_Object).toTimeString().substring(0, 8);
    if (retornaHoraCompleta) {
       return date + ' ' + time;
    }
    return date;
  }
  return "";
}

function dividir(dividendo: number, divisor: number): number {

  if (divisor && divisor != 0) {
    return dividendo / divisor;
  }
  return 0;
}
function minutosEmHorasStr(minutos: number = 0): string {
  let hr: number = 0;
  let mi: number = 0;
  let ss: number = 0;

  hr = Math.trunc(minutos / 60);
  mi = Math.trunc(minutos - (hr * 60));

  let miTexto: string = mi.toString();
  return hr + "h: " + miTexto.padStart(2, '0') + "m";
}

export { initcap, initLower, nowString, minutosEmHorasStr, dividir, dateToString };
