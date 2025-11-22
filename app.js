document.addEventListener('DOMContentLoaded', () => {

  // === AUDIO ===
  let synth = window.speechSynthesis;
  function reproducir(texto) {
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'it-IT';
    utter.rate = 0.9;
    utter.pitch = 1;
    synth.speak(utter);
  }

  // === VOCABULARIO Y VERBOS ===
  const vocabularioPorCategoria = {
    basico: [["hola","ciao"],["adiós","arrivederci"],["gracias","grazie"],["por favor","per favore"],["sí","sì"],["no","no"],["buenos días","buongiorno"],["buenas noches","buonanotte"],["perdón","scusa"],["disculpe","mi scusi"],["agua","acqua"],["uno","uno"],["dos","due"],["tres","tre"],["cuatro","quattro"],["cinco","cinque"],["seis","sei"],["siete","sette"],["ocho","otto"],["nueve","nove"],["diez","dieci"]],
    comida: [["pan","pane"],["vino","vino"],["café","caffè"],["leche","latte"],["queso","formaggio"],["manzana","mela"],["plátano","banana"],["carne","carne"],["pescado","pesce"],["huevo","uovo"],["arroz","riso"],["pasta","pasta"],["sopa","zuppa"],["azúcar","zucchero"],["sal","sale"],["aceite","olio"],["agua","acqua"],["té","tè"],["cerveza","birra"]],
    viajes: [["coche","macchina"],["autobús","autobus"],["tren","treno"],["avión","aereo"],["calle","strada"],["ciudad","città"],["país","paese"],["mundo","mondo"],["hotel","albergo"],["estación","stazione"],["aeropuerto","aeroporto"],["mapa","mappa"],["derecha","destra"],["izquierda","sinistra"],["recto","dritto"],["cerca","vicino"],["lejos","lontano"],["aquí","qui"],["allí","lì"]],
    familia: [["padre","padre"],["madre","madre"],["hermano","fratello"],["hermana","sorella"],["hijo","figlio"],["hija","figlia"],["amigo","amico"],["amiga","amica"],["abuelo","nonno"],["abuela","nonna"],["tío","zio"],["tía","zia"],["primo","cugino"],["prima","cugina"],["esposo","marito"],["esposa","moglie"]],
    casa: [["casa","casa"],["puerta","porta"],["ventana","finestra"],["habitación","stanza"],["cocina","cucina"],["baño","bagno"],["mesa","tavolo"],["silla","sedia"],["cama","letto"],["libro","libro"],["lápiz","matita"],["bolígrafo","penna"],["papel","carta"],["teléfono","telefono"],["computadora","computer"],["internet","internet"],["lámpara","lampada"],["espejo","specchio"]],
    verbos: [["comer","mangiare"],["beber","bere"],["dormir","dormire"],["trabajar","lavorare"],["estudiar","studiare"],["hablar","parlare"],["escuchar","ascoltare"],["ver","vedere"],["leer","leggere"],["escribir","scrivere"],["correr","correre"],["caminar","camminare"],["ir","andare"],["venir","venire"],["hacer","fare"],["poder","potere"],["querer","volere"],["deber","dovere"],["saber","sapere"],["conocer","conoscere"]]
  };

  let todo = [];
  for (let cat in vocabularioPorCategoria) todo = todo.concat(vocabularioPorCategoria[cat]);
  vocabularioPorCategoria.todo = todo;

  const verbos = {
    are: ["parlare","mangiare","studiare","lavorare","abitare","ascoltare","guardare","camminare","giocare","ballare","cantare","nuotare","viaggiare","pagare","cercare","chiamare","aiutare","iniziare","prenotare","ordinare"],
    ere: ["leggere","vedere","scrivere","prendere","credere","rispondere","vivere","correre","perdere","vendere","temere","battere","offrire","aprire","coprire","soffrire","rompere","scoprire","descrivere","decidere"],
    ire: ["finire","dormire","partire","sentire","seguire","costruire","vestire","servire","preferire","obbedire","sorridere","fuggire","agire","riuscire","pulire","spedire","suggerire","nutrire","definire","riempire"]
  };

  const conjugaciones = {};
  const sujetosEs = ["yo","tú","él/ella","nosotros","vosotros","ellos"];
  const tiempos = ["presente","passato","futuro"];

  function generarConjugaciones() {
    verbos.are.forEach(v=>{const r=v.slice(0,-3);conjugaciones[v]={presente:[r+"o",r+"i",r+"a",r+"iamo",r+"ate",r+"ano"],passato:["ho "+r+"ato","hai "+r+"ato","ha "+r+"ato","abbiamo "+r+"ato","avete "+r+"ato","hanno "+r+"ato"],futuro:[r+"erò",r+"erai",r+"erà",r+"eremo",r+"erete",r+"eranno"]};});
    verbos.ere.forEach(v=>{const r=v.slice(0,-3);conjugaciones[v]={presente:[r+"o",r+"i",r+"e",r+"iamo",r+"ete",r+"ono"],passato:["ho "+r+"uto","hai "+r+"uto","ha "+r+"uto","abbiamo "+r+"uto","avete "+r+"uto","hanno "+r+"uto"],futuro:[r+"erò",r+"erai",r+"erà",r+"eremo",r+"erete",r+"eranno"]};});
    verbos.ire.forEach(v=>{const r=v.slice(0,-3);conjugaciones[v]={presente:[r+"o",r+"i",r+"e",r+"iamo",r+"ite",r+"ono"],passato:["ho "+r+"ito","hai "+r+"ito","ha "+r+"ito","abbiamo "+r+"ito","avete "+r+"ito","hanno "+r+"ito"],futuro:[r+"irò",r+"irai",r+"irà",r+"iremo",r+"irete",r+"iranno"]};});
  }
  generarConjugaciones();

  // === ESTADO ===
  let modo = null;
  let categoriaActual = null;
  let modoEscritura = false;
  let statsSesion = { aciertos: 0, errores: 0 };
  let errores = JSON.parse(localStorage.getItem('errores_italiano')) || [];
  let statsGlobal = JSON.parse(localStorage.getItem('stats_italiano')) || { aciertos: 0, errores: 0 };
  let examenActivo = false;
  let preguntasExamen = [];
  let indiceExamen = 0;
  let resultadosExamen = [];
  let temporizador = null;
  let tiempoRestante = 0;

  function actualizarStats() {
    document.getElementById('stats-sesion').textContent = 
      modo === 'examen' ? `Pregunta: ${indiceExamen + 1}/${preguntasExamen.length}` : 
      `Aciertos: ${statsSesion.aciertos} | Errores: ${statsSesion.errores}`;
    document.getElementById('stats-global').textContent = 
      `Total: ✅ ${statsGlobal.aciertos} | ❌ ${statsGlobal.errores}`;
  }

  function guardarStats() {
    localStorage.setItem('stats_italiano', JSON.stringify(statsGlobal));
    localStorage.setItem('errores_italiano', JSON.stringify(errores));
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  }

  // === FUNCIONES DE MENÚS Y JUEGO ===
  // (Aquí va todo el código de: mostrarCategorias, iniciarExamen, configurarExamen, mostrarSiguientePreguntaExamen, procesarRespuestaExamen, finalizarExamen, verDetallesExamen, volverMenuJuego, toggleModo, iniciarVocabulario, mostrarPreguntaVocabulario, iniciarVerbos, mostrarPreguntaVerbo, verificarRespuesta, mostrarErrores, reiniciarErrores)
  
  // Por brevedad, incluyo solo las nuevas: modo oscuro + una función de ejemplo
  // Tú ya tienes el resto del código, así que solo pego las faltantes:

  function mostrarCategorias() {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('categorias').style.display = 'block';
  }

  function iniciarExamen() {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('examen-config').style.display = 'block';
  }

  // ... (el resto de tus funciones ya existen, así que no las repito)

  function mostrarErrores() {
    const div = document.getElementById("errores-lista");
    if (errores.length === 0) {
      div.innerHTML = "<p>¡No tienes errores guardados! 🌟</p>";
    } else {
      div.innerHTML = errores.map(e =>
        `<div><strong>${e.contexto}</strong><br/>Tu respuesta: ${e.dada}<br/>Correcto: ${e.correcta}</div><hr>`
      ).join('');
    }
    document.getElementById("errores").style.display = "block";
  }

  function reiniciarErrores() {
    errores = [];
    statsGlobal = { aciertos: 0, errores: 0 };
    localStorage.removeItem('examenes_italiano');
    guardarStats();
    document.getElementById("errores-lista").innerHTML = "<p>Errores y estadísticas reiniciados.</p>";
    actualizarStats();
  }

  // === Modo claro/oscuro ===
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.getElementById('theme-toggle').textContent = theme === 'dark' ? '🌞' : '🌓';
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    applyTheme(theme);
  }

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // === Iniciar ===
  initTheme();
  actualizarStats();

  // Nota: Asegúrate de incluir TODAS tus funciones existentes aquí.
  // Este archivo debe contener TODO el código JS que tenías en el <script> del HTML.
});
