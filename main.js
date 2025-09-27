// Sorgente di esempio per il layer "code background".
// Se pubblichi il sito, questo file viene letto dall'animazione.
// Puoi sostituirlo con qualunque contenuto JS del progetto.

const months = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]; // commento

export function greet(name){
  const h = new Date().getHours();
  const hi = h < 12 ? 'Buongiorno' : (h < 18 ? 'Buon pomeriggio' : 'Buonasera');
  return `${hi}, ${name}!`;
}

function pad(n){ return String(n).padStart(2,'0'); }

const now = new Date();
console.log(`[${pad(now.getHours())}:${pad(now.getMinutes())}]`, greet('Paolo'));

