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

  // === VOCABULARIO POR CATEGORÍAS ===
  const vocabularioPorCategoria = {
    basico: [
      ["hola", "ciao"],["adiós", "arrivederci"],["gracias", "grazie"],["por favor", "per favore"],
      ["sí", "sì"],["no", "no"],["buenos días", "buongiorno"],["buenas noches", "buonanotte"],
      ["perdón", "scusa"],["disculpe", "mi scusi"],["agua", "acqua"],["uno", "uno"],["dos", "due"],
      ["tres", "tre"],["cuatro", "quattro"],["cinco", "cinque"],["seis", "sei"],["siete", "sette"],
      ["ocho", "otto"],["nueve", "nove"],["diez", "dieci"]
    ],
    comida: [
      ["pan", "pane"],["vino", "vino"],["café", "caffè"],["leche", "latte"],["queso", "formaggio"],
      ["manzana", "mela"],["plátano", "banana"],["carne", "carne"],["pescado", "pesce"],
      ["huevo", "uovo"],["arroz", "riso"],["pasta", "pasta"],["sopa", "zuppa"],["azúcar", "zucchero"],
      ["sal", "sale"],["aceite", "olio"],["agua", "acqua"],["té", "tè"],["cerveza", "birra"]
    ],
    viajes: [
      ["coche", "macchina"],["autobús", "autobus"],["tren", "treno"],["avión", "aereo"],
      ["calle", "strada"],["ciudad", "città"],["país", "paese"],["mundo", "mondo"],
      ["hotel", "albergo"],["estación", "stazione"],["aeropuerto", "aeroporto"],["mapa", "mappa"],
      ["derecha", "destra"],["izquierda", "sinistra"],["recto", "dritto"],["cerca", "vicino"],
      ["lejos", "lontano"],["aquí", "qui"],["allí", "lì"]
    ],
    familia: [
      ["padre", "padre"],["madre", "madre"],["hermano", "fratello"],["hermana", "sorella"],
      ["hijo", "figlio"],["hija", "figlia"],["amigo", "amico"],["amiga", "amica"],
      ["abuelo", "nonno"],["abuela", "nonna"],["tío", "zio"],["tía", "zia"],["primo", "cugino"],
      ["prima", "cugina"],["esposo", "marito"],["esposa", "moglie"]
    ],
    casa: [
      ["casa", "casa"],["puerta", "porta"],["ventana", "finestra"],["habitación", "stanza"],
      ["cocina", "cucina"],["baño", "bagno"],["mesa", "tavolo"],["silla", "sedia"],
      ["cama", "letto"],["libro", "libro"],["lápiz", "matita"],["bolígrafo", "penna"],
      ["papel", "carta"],["teléfono", "telefono"],["computadora", "computer"],["internet", "internet"],
      ["lámpara", "lampada"],["espejo", "specchio"]
    ],
    verbos: [
      ["comer", "mangiare"],["beber", "bere"],["dormir", "dormire"],["trabajar", "lavorare"],
      ["estudiar", "studiare"],["hablar", "parlare"],["escuchar", "ascoltare"],["ver", "vedere"],
      ["leer", "leggere"],["escribir", "scrivere"],["correr", "correre"],["caminar", "camminare"],
      ["ir", "andare"],["venir", "venire"],["hacer", "fare"],["poder", "potere"],["querer", "volere"],
      ["deber", "dovere"],["saber", "sapere"],["conocer", "conoscere"]
    ]
  };

  let todo = [];
  for (let cat in vocabularioPorCategoria) {
    todo = todo.concat(vocabularioPorCategoria[cat]);
  }
  vocabularioPorCategoria.todo = todo;

  // === VERBOS REGULARES ===
  const verbos = {
    are: ["parlare","mangiare","studiare","lavorare","abitare","ascoltare","guardare","camminare","giocare","ballare","cantare","nuotare","viaggiare","pagare","cercare","chiamare","aiutare","iniziare","prenotare","ordinare"],
    ere: ["leggere","vedere","scrivere","prendere","credere","rispondere","vivere","correre","perdere","vendere","temere","battere","offrire","aprire","coprire","soffrire","rompere","scoprire","descrivere","decidere"],
    ire: ["finire","dormire","partire","sentire","seguire","costruire","vestire","servire","preferire","obbedire","sorridere","fuggire","agire","riuscire","pulire","spedire","suggerire","nutrire","definire","riempire"]
  };

  const conjugaciones = {};
  const sujetosEs = ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"];
  const tiempos = ["presente", "passato", "futuro"];

  function generarConjugaciones() {
    verbos.are.forEach(v => {
      const r = v.slice(0, -3);
      conjugaciones[v] = {
        presente: [r+"o", r+"i", r+"a", r+"iamo", r+"ate", r+"ano"],
        passato: ["ho "+r+"ato", "hai "+r+"ato", "ha "+r+"ato", "abbiamo "+r+"ato", "avete "+r+"ato", "hanno "+r+"ato"],
        futuro: [r+"erò", r+"erai", r+"erà", r+"eremo", r+"erete", r+"eranno"]
      };
    });
    verbos.ere.forEach(v => {
      const r = v.slice(0, -3);
      conjugaciones[v] = {
        presente: [r+"o", r+"i", r+"e", r+"iamo", r+"ete", r+"ono"],
        passato: ["ho "+r+"uto", "hai "+r+"uto", "ha "+r+"uto", "abbiamo "+r+"uto", "avete "+r+"uto", "hanno "+r+"uto"],
        futuro: [r+"erò", r+"erai", r+"erà", r+"eremo", r+"erete", r+"eranno"]
      };
    });
    verbos.ire.forEach(v => {
      const r = v.slice(0, -3);
      conjugaciones[v] = {
        presente: [r+"o", r+"i", r+"e", r+"iamo", r+"ite", r+"ono"],
        passato: ["ho "+r+"ito", "hai "+r+"ito", "ha "+r+"ito", "abbiamo "+r+"ito", "avete "+r+"ito", "hanno "+r+"ito"],
        futuro: [r+"irò", r+"irai", r+"irà", r+"iremo", r+"irete", r+"iranno"]
      };
    });
  }
  generarConjugaciones();

  // === VERBOS IRREGULARES ===
  const verbosIrregulares = {
    andare: {
      presente: ["vado", "vai", "va", "andiamo", "andate", "vanno"],
      passato: ["sono andato", "sei andato", "è andato", "siamo andati", "siete andati", "sono andati"],
      futuro: ["andrò", "andrai", "andrà", "andremo", "andrete", "andranno"]
    },
    fare: {
      presente: ["faccio", "fai", "fa", "facciamo", "fate", "fanno"],
      passato: ["ho fatto", "hai fatto", "ha fatto", "abbiamo fatto", "avete fatto", "hanno fatto"],
      futuro: ["farò", "farai", "farà", "faremo", "farete", "faranno"]
    },
    dire: {
      presente: ["dico", "dici", "dice", "diciamo", "dite", "dicono"],
      passato: ["ho detto", "hai detto", "ha detto", "abbiamo detto", "avete detto", "hanno detto"],
      futuro: ["dirò", "dirai", "dirà", "diremo", "direte", "diranno"]
    },
    dare: {
      presente: ["do", "dai", "da", "diamo", "date", "danno"],
      passato: ["ho dato", "hai dato", "ha dato", "abbiamo dato", "avete dato", "hanno dato"],
      futuro: ["darò", "darai", "darà", "daremo", "darete", "daranno"]
    },
    vedere: {
      presente: ["vedo", "vedi", "vede", "vediamo", "vedete", "vedono"],
      passato: ["ho visto", "hai visto", "ha visto", "abbiamo visto", "avete visto", "hanno visto"],
      futuro: ["vedrò", "vedrai", "vedrà", "vedremo", "vedrete", "vedranno"]
    },
    venire: {
      presente: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"],
      passato: ["sono venuto", "sei venuto", "è venuto", "siamo venuti", "siete venuti", "sono venuti"],
      futuro: ["verrò", "verrai", "verrà", "verremo", "verrete", "verranno"]
    },
    uscire: {
      presente: ["esco", "esci", "esce", "usciamo", "uscite", "escono"],
      passato: ["sono uscito", "sei uscito", "è uscito", "siamo usciti", "siete usciti", "sono usciti"],
      futuro: ["uscirò", "uscirai", "uscirà", "usciremo", "uscirete", "usciranno"]
    },
    dovere: {
      presente: ["devo", "devi", "deve", "dobbiamo", "dovete", "devono"],
      passato: ["ho dovuto", "hai dovuto", "ha dovuto", "abbiamo dovuto", "avete dovuto", "hanno dovuto"],
      futuro: ["dovrò", "dovrai", "dovrà", "dovremo", "dovrete", "dovranno"]
    },
    potere: {
      presente: ["posso", "puoi", "può", "possiamo", "potete", "possono"],
      passato: ["ho potuto", "hai potuto", "ha potuto", "abbiamo potuto", "avete potuto", "hanno potuto"],
      futuro: ["potrò", "potrai", "potrà", "potremo", "potrete", "potranno"]
    },
    volere: {
      presente: ["voglio", "vuoi", "vuole", "vogliamo", "volete", "vogliono"],
      passato: ["ho voluto", "hai voluto", "ha voluto", "abbiamo voluto", "avete voluto", "hanno voluto"],
      futuro: ["vorrò", "vorrai", "vorrà", "vorremo", "vorrete", "vorranno"]
    },
    stare: {
      presente: ["sto", "stai", "sta", "stiamo", "state", "stanno"],
      passato: ["sono stato", "sei stato", "è stato", "siamo stati", "siete stati", "sono stati"],
      futuro: ["starò", "starai", "starà", "staremo", "starete", "staranno"]
    },
    sapere: {
      presente: ["so", "sai", "sa", "sappiamo", "sapete", "sanno"],
      passato: ["ho saputo", "hai saputo", "ha saputo", "abbiamo saputo", "avete saputo", "hanno saputo"],
      futuro: ["saprò", "saprai", "saprà", "sapremo", "saprète", "sapranno"]
    },
    bere: {
      presente: ["bevo", "bevi", "beve", "beviamo", "bevete", "bevono"],
      passato: ["ho bevuto", "hai bevuto", "ha bevuto", "abbiamo bevuto", "avete bevuto", "hanno bevuto"],
      futuro: ["berrò", "berrai", "berrà", "berremo", "berrete", "berranno"]
    },
    chiedere: {
      presente: ["chiedo", "chiedi", "chiede", "chiediamo", "chiedete", "chiedono"],
      passato: ["ho chiesto", "hai chiesto", "ha chiesto", "abbiamo chiesto", "avete chiesto", "hanno chiesto"],
      futuro: ["chiederò", "chiederai", "chiederà", "chiederemo", "chiederete", "chiederanno"]
    },
    leggere: {
      presente: ["leggo", "leggi", "legge", "leggiamo", "leggete", "leggono"],
      passato: ["ho letto", "hai letto", "ha letto", "abbiamo letto", "avete letto", "hanno letto"],
      futuro: ["leggerò", "leggerai", "leggerà", "leggeremo", "leggerete", "leggeranno"]
    }
  };

  // === ESTADO GLOBAL ===
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
  let preguntaActual = null;
  let modoActual = null;

  function actualizarStats() {
    const statsSesionEl = document.getElementById('stats-sesion');
    const statsGlobalEl = document.getElementById('stats-global');
    if (statsSesionEl) {
      statsSesionEl.textContent = modo === 'examen' ? 
        `Pregunta: ${indiceExamen + 1}/${preguntasExamen.length}` : 
        `Aciertos: ${statsSesion.aciertos} | Errores: ${statsSesion.errores}`;
    }
    if (statsGlobalEl) {
      statsGlobalEl.textContent = `Total: ✅ ${statsGlobal.aciertos} | ❌ ${statsGlobal.errores}`;
    }
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
    // === SISTEMA DE REPASO (SRS) ===
  function calcularProximoRepaso(nivel) {
    const hoy = new Date();
    if (nivel === 1) return hoy;
    if (nivel === 2) {
      hoy.setDate(hoy.getDate() + 3);
      return hoy;
    }
    hoy.setDate(hoy.getDate() + 7);
    return hoy;
  }

  function programarRepaso(palabra, contexto, tipo) {
    const repasos = JSON.parse(localStorage.getItem('repasos_italiano')) || [];
    const existe = repasos.find(r => r.contexto === contexto && r.tipo === tipo);
    if (existe) return;

    const nivel = 1;
    const proximo = calcularProximoRepaso(nivel);
    repasos.push({
      palabra,
      contexto,
      tipo,
      nivel,
      proximoRepaso: proximo.toISOString().split('T')[0]
    });
    localStorage.setItem('repasos_italiano', JSON.stringify(repasos));
  }

  function obtenerRepasosPendientes() {
    const hoy = new Date().toISOString().split('T')[0];
    const repasos = JSON.parse(localStorage.getItem('repasos_italiano')) || [];
    return repasos.filter(r => r.proximoRepaso <= hoy);
  }

  function eliminarRepaso(contexto) {
    let repasos = JSON.parse(localStorage.getItem('repasos_italiano')) || [];
    repasos = repasos.filter(r => r.contexto !== contexto);
    localStorage.setItem('repasos_italiano', JSON.stringify(repasos));
  }

  function subirNivelRepaso(contexto) {
    let repasos = JSON.parse(localStorage.getItem('repasos_italiano')) || [];
    const item = repasos.find(r => r.contexto === contexto);
    if (item && item.nivel < 3) {
      item.nivel++;
      item.proximoRepaso = calcularProximoRepaso(item.nivel).toISOString().split('T')[0];
      localStorage.setItem('repasos_italiano', JSON.stringify(repasos));
    } else {
      eliminarRepaso(contexto);
    }
  }

  // === MENÚS Y EXAMEN ===
  function mostrarCategorias() {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('categorias').style.display = 'block';
  }

  function iniciarExamen() {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('examen-config').style.display = 'block';
  }

  function configurarExamen(numPreguntas, segundos = null) {
    examenActivo = true;
    modo = 'examen';
    modoEscritura = Math.random() > 0.5;
    preguntasExamen = [];
    resultadosExamen = [];
    indiceExamen = 0;
    tiempoRestante = segundos;

    const todasPalabras = vocabularioPorCategoria.todo;
    const todosVerbos = [
      ...Object.keys(conjugaciones),
      ...Object.keys(verbosIrregulares)
    ];
    for (let i = 0; i < numPreguntas; i++) {
      if (Math.random() > 0.4 && todosVerbos.length > 0) {
        const usarIrregular = Math.random() > 0.6;
        let verbo;
        if (usarIrregular) {
          const irregularLista = Object.keys(verbosIrregulares);
          verbo = irregularLista[Math.floor(Math.random() * irregularLista.length)];
        } else {
          const tipo = ["are","ere","ire"][Math.floor(Math.random()*3)];
          verbo = verbos[tipo][Math.floor(Math.random()*verbos[tipo].length)];
        }
        const tiempo = tiempos[Math.floor(Math.random()*3)];
        const suj = Math.floor(Math.random()*6);
        let correcta;
        if (verbosIrregulares[verbo]) {
          correcta = verbosIrregulares[verbo][tiempo][suj];
        } else {
          correcta = conjugaciones[verbo][tiempo][suj];
        }
        preguntasExamen.push({ tipo: 'verbo', verbo, tiempo, suj, correcta, contexto: `${verbo} (${tiempo}, ${sujetosEs[suj]})` });
      } else {
        const [es, it] = todasPalabras[Math.floor(Math.random() * todasPalabras.length)];
        preguntasExamen.push({ tipo: 'vocab', es, it, contexto: es });
      }
    }

    document.getElementById('examen-config').style.display = 'none';
    document.getElementById('juego').style.display = 'block';
    actualizarStats();

    if (segundos) {
      document.getElementById('examen-timer').style.display = 'block';
      actualizarTemporizador();
      temporizador = setInterval(() => {
        tiempoRestante--;
        if (tiempoRestante <= 0) {
          finalizarExamen();
        } else {
          actualizarTemporizador();
        }
      }, 1000);
    }

    mostrarSiguientePreguntaExamen();
  }

  function actualizarTemporizador() {
    const mins = Math.floor(tiempoRestante / 60);
    const secs = tiempoRestante % 60;
    const timerEl = document.getElementById('examen-timer');
    if (timerEl) {
      timerEl.textContent = `⏳ Tiempo: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  }

  function mostrarSiguientePreguntaExamen() {
    if (indiceExamen >= preguntasExamen.length) {
      finalizarExamen();
      return;
    }

    const p = preguntasExamen[indiceExamen];
    actualizarStats();

    if (modoEscritura) {
      document.getElementById('opciones').style.display = 'none';
      document.getElementById('respuesta-escrita').style.display = 'block';
      document.getElementById('btn-enviar').style.display = 'block';
      document.getElementById('respuesta-escrita').value = '';
      document.getElementById('respuesta-escrita').focus();

      if (p.tipo === 'vocab') {
        document.getElementById('pregunta').textContent = `Escribe en italiano: "${p.es}"`;
        document.getElementById('btn-enviar').onclick = () => procesarRespuestaExamen(document.getElementById('respuesta-escrita').value.trim().toLowerCase(), p.it.toLowerCase(), p.contexto, p.tipo);
      } else {
        document.getElementById('pregunta').textContent = `Escribe la forma correcta de "${p.verbo}" en ${p.tiempo} para "${sujetosEs[p.suj]}":`;
        document.getElementById('btn-enviar').onclick = () => procesarRespuestaExamen(document.getElementById('respuesta-escrita').value.trim().toLowerCase(), p.correcta.toLowerCase(), p.contexto, p.tipo);
      }
    } else {
      document.getElementById('opciones').style.display = 'block';
      document.getElementById('respuesta-escrita').style.display = 'none';
      document.getElementById('btn-enviar').style.display = 'none';

      if (p.tipo === 'vocab') {
        let opciones = [p.it];
        while (opciones.length < 4) {
          const r = vocabularioPorCategoria.todo[Math.floor(Math.random() * vocabularioPorCategoria.todo.length)][1];
          if (!opciones.includes(r)) opciones.push(r);
        }
        shuffle(opciones);
        document.getElementById('pregunta').textContent = `¿Cómo se dice "${p.es}" en italiano?`;
        for (let i = 0; i < 4; i++) {
          document.getElementById(`opcion${i}`).textContent = opciones[i];
          document.getElementById(`opcion${i}`).onclick = () => {
            reproducir(opciones[i]);
            procesarRespuestaExamen(opciones[i].toLowerCase(), p.it.toLowerCase(), p.contexto, p.tipo);
          };
        }
      } else {
        let todasFormas = [];
        if (verbosIrregulares[p.verbo]) {
          for (let t of tiempos) {
            for (let f of verbosIrregulares[p.verbo][t]) {
              todasFormas.push(f);
            }
          }
        } else {
          for (let t of tiempos) {
            for (let f of conjugaciones[p.verbo][t]) {
              todasFormas.push(f);
            }
          }
        }
        todasFormas = [...new Set(todasFormas)];
        let opciones = [p.correcta];
        while (opciones.length < 4 && opciones.length < todasFormas.length) {
          const candidato = todasFormas[Math.floor(Math.random() * todasFormas.length)];
          if (!opciones.includes(candidato)) opciones.push(candidato);
        }
        while (opciones.length < 4) {
          const listaTotal = [...Object.keys(conjugaciones), ...Object.keys(verbosIrregulares)];
          const otroVerbo = listaTotal[Math.floor(Math.random()*listaTotal.length)];
          const otroTiempo = tiempos[Math.floor(Math.random()*3)];
          const otroSuj = Math.floor(Math.random()*6);
          let cand;
          if (verbosIrregulares[otroVerbo]) {
            cand = verbosIrregulares[otroVerbo][otroTiempo][otroSuj];
          } else {
            cand = conjugaciones[otroVerbo][otroTiempo][otroSuj];
          }
          if (!opciones.includes(cand)) opciones.push(cand);
        }
        shuffle(opciones);
        document.getElementById('pregunta').textContent = `¿"${p.verbo}" en ${p.tiempo} para "${sujetosEs[p.suj]}"?`;
        for (let i = 0; i < 4; i++) {
          document.getElementById(`opcion${i}`).textContent = opciones[i];
          document.getElementById(`opcion${i}`).onclick = () => {
            reproducir(opciones[i]);
            procesarRespuestaExamen(opciones[i].toLowerCase(), p.correcta.toLowerCase(), p.contexto, p.tipo);
          };
        }
      }
    }
  }

  function procesarRespuestaExamen(respuesta, correcta, contexto, tipo) {
    const esCorrecta = respuesta === correcta;
    resultadosExamen.push({ contexto, dada: respuesta, correcta, esCorrecta });

    if (esCorrecta) {
      statsGlobal.aciertos++;
    } else {
      statsGlobal.errores++;
      errores.push({ tipo, contexto, dada: respuesta, correcta });
    }

    guardarStats();
    indiceExamen++;
    setTimeout(mostrarSiguientePreguntaExamen, 600);
  }

  function finalizarExamen() {
    if (temporizador) clearInterval(temporizador);
    examenActivo = false;

    const aciertos = resultadosExamen.filter(r => r.esCorrecta).length;
    const total = resultadosExamen.length;
    const porcentaje = Math.round((aciertos / total) * 100);

    if (modo === 'desafio') {
      const hoy = new Date().toISOString().split('T')[0];
      localStorage.setItem('desafio_italiano', JSON.stringify({
        fecha: hoy,
        completado: true,
        aciertos,
        total,
        porcentaje
      }));
      statsGlobal.aciertos += aciertos;
      statsGlobal.errores += (total - aciertos);
      guardarStats();
    } else {
      const historial = JSON.parse(localStorage.getItem('examenes_italiano')) || [];
      historial.push({
        fecha: new Date().toLocaleString(),
        preguntas: total,
        aciertos,
        porcentaje
      });
      localStorage.setItem('examenes_italiano', JSON.stringify(historial));
    }

    document.getElementById('juego').style.display = 'none';
    document.getElementById('examen-resultados').style.display = 'block';
    
    if (modo === 'desafio') {
      document.getElementById('resultados-contenido').innerHTML = `
        <p>🎯 <strong>Desafío Diario Completado</strong></p>
        <p><strong>Aciertos:</strong> ${aciertos}/${total}</p>
        <p><strong>Porcentaje:</strong> ${porcentaje}%</p>
        <p style="color:${porcentaje >= 80 ? 'green' : porcentaje >= 60 ? 'orange' : 'red'};">
          <strong>${porcentaje >= 80 ? '¡Excelente! 🏅' : porcentaje >= 60 ? 'Bien hecho' : 'Sigue practicando'}</strong>
        </p>
        <p>¡Vuelve mañana para un nuevo desafío!</p>
      `;
    } else {
      document.getElementById('resultados-contenido').innerHTML = `
        <p><strong>Preguntas:</strong> ${total}</p>
        <p><strong>Aciertos:</strong> ${aciertos}</p>
        <p><strong>Porcentaje:</strong> ${porcentaje}%</p>
        <p style="color:${porcentaje >= 80 ? 'green' : porcentaje >= 60 ? 'orange' : 'red'};">
          <strong>${porcentaje >= 80 ? '¡Excelente!' : porcentaje >= 60 ? 'Bien hecho' : 'Sigue practicando'}</strong>
        </p>
      `;
    }
  }

  function verDetallesExamen() {
    let html = '<h3>Detalles de tus respuestas:</h3>';
    resultadosExamen.forEach((r, i) => {
      html += `
        <div style="padding:10px; border-bottom:1px solid #eee;">
          <strong>P${i+1}: ${r.contexto}</strong><br>
          Tu respuesta: <span style="color:${r.esCorrecta ? 'green' : 'red'}">${r.dada || '(vacío)'}</span><br>
          Correcto: ${r.correcta}
        </div>
      `;
    });
    document.getElementById('resultados-contenido').innerHTML = html + 
      '<button id="btn-volver-menu-resultados">Menú principal</button>';
  }

  function iniciarDesafioDiario() {
    const hoy = new Date().toISOString().split('T')[0];
    const desafio = JSON.parse(localStorage.getItem('desafio_italiano')) || { fecha: '', completado: false };

    if (desafio.fecha === hoy && desafio.completado) {
      alert("🎉 ¡Ya completaste el desafío de hoy! Vuelve mañana.");
      return;
    }

    localStorage.setItem('desafio_italiano', JSON.stringify({ fecha: hoy, completado: false }));

    modo = 'desafio';
    statsSesion = { aciertos: 0, errores: 0 };
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('juego').style.display = 'block';
    
    preguntasExamen = [];
    for (let i = 0; i < 5; i++) {
      if (i < 2) {
        const todasPalabras = vocabularioPorCategoria.todo;
        const [es, it] = todasPalabras[Math.floor(Math.random() * todasPalabras.length)];
        preguntasExamen.push({ tipo: 'vocab', es, it, contexto: es });
      } else {
        const usarIrregular = Math.random() > 0.5;
        let verbo, conjugacion;
        if (usarIrregular) {
          const irregularLista = Object.keys(verbosIrregulares);
          verbo = irregularLista[Math.floor(Math.random() * irregularLista.length)];
          conjugacion = verbosIrregulares[verbo];
        } else {
          const tipo = ["are","ere","ire"][Math.floor(Math.random()*3)];
          verbo = verbos[tipo][Math.floor(Math.random()*verbos[tipo].length)];
          conjugacion = conjugaciones[verbo];
        }
        const tiempo = tiempos[Math.floor(Math.random()*3)];
        const suj = Math.floor(Math.random()*6);
        const correcta = conjugacion[tiempo][suj];
        preguntasExamen.push({ tipo: 'verbo', verbo, tiempo, suj, correcta, contexto: `${verbo} (${tiempo}, ${sujetosEs[suj]})` });
      }
    }

    indiceExamen = 0;
    resultadosExamen = [];
    actualizarStats();
    mostrarSiguientePreguntaExamen();
        }
    // === FUNCIONES DE JUEGO ===
  function volverMenuJuego() {
    if (temporizador) clearInterval(temporizador);
    modo = null;
    categoriaActual = null;
    modoEscritura = false;
    examenActivo = false;
    statsSesion = { aciertos: 0, errores: 0 };
    document.getElementById('juego').style.display = 'none';
    document.getElementById('menu-principal').style.display = 'block';
    actualizarStats();
  }

  function toggleModo() {
    if (examenActivo) return;
    modoEscritura = !modoEscritura;
    const btn = document.getElementById('btn-toggle-modo');
    if (btn) {
      btn.textContent = modoEscritura ? '↔️ Cambiar a opción múltiple' : '↔️ Cambiar a modo escritura';
    }
    document.getElementById('opciones').style.display = modoEscritura ? 'none' : 'block';
    document.getElementById('respuesta-escrita').style.display = modoEscritura ? 'block' : 'none';
    document.getElementById('btn-enviar').style.display = modoEscritura ? 'block' : 'none';
    if (modoEscritura) {
      document.getElementById('respuesta-escrita').focus();
    }
  }

  function iniciarVocabulario(categoria) {
    modo = 'vocabulario';
    categoriaActual = categoria;
    statsSesion = { aciertos: 0, errores: 0 };
    document.getElementById('categorias').style.display = 'none';
    document.getElementById('juego').style.display = 'block';
    actualizarStats();
    mostrarPreguntaVocabulario();
  }

  function mostrarPreguntaVocabulario() {
    const repasos = obtenerRepasosPendientes().filter(r => r.tipo === 'vocabulario');
    if (repasos.length > 0) {
      const repaso = repasos[0];
      const [es, it] = repaso.contexto.includes('->') ? repaso.contexto.split('->') : [repaso.contexto, repaso.palabra];

      preguntaActual = { tipo: 'vocabulario', es, it, contexto: repaso.contexto, correcta: it, esRepaso: true };
      modoActual = 'vocabulario';

      if (modoEscritura) {
        document.getElementById('pregunta').textContent = `🔁 REPASO: Escribe en italiano: "${es}"`;
        document.getElementById('respuesta-escrita').value = '';
        document.getElementById('respuesta-escrita').style.display = 'block';
        document.getElementById('btn-enviar').style.display = 'block';
        document.getElementById('opciones').style.display = 'none';
      } else {
        let opciones = [it];
        while (opciones.length < 4) {
          const r = vocabularioPorCategoria.todo[Math.floor(Math.random() * vocabularioPorCategoria.todo.length)][1];
          if (!opciones.includes(r)) opciones.push(r);
        }
        shuffle(opciones);
        document.getElementById('pregunta').textContent = `🔁 REPASO: ¿Cómo se dice "${es}" en italiano?`;
        for (let i = 0; i < 4; i++) {
          document.getElementById(`opcion${i}`).textContent = opciones[i];
          document.getElementById(`opcion${i}`).onclick = () => {
            reproducir(opciones[i]);
            if (opciones[i].toLowerCase() === it.toLowerCase()) {
              subirNivelRepaso(repaso.contexto);
              statsSesion.aciertos++;
              statsGlobal.aciertos++;
              alert("✅ ¡Bien! Subes de nivel.");
            } else {
              programarRepaso(it, repaso.contexto, 'vocabulario');
              statsSesion.errores++;
              statsGlobal.errores++;
              alert(`❌ Incorrecto.\nTú: ${opciones[i]}\nCorrecto: ${it}`);
            }
            guardarStats();
            actualizarStats();
            setTimeout(mostrarPreguntaVocabulario, 600);
          };
        }
      }
      return;
    }

    const vocab = vocabularioPorCategoria[categoriaActual];
    const idx = Math.floor(Math.random() * vocab.length);
    const [es, it] = vocab[idx];

    preguntaActual = { tipo: 'vocabulario', es, it, contexto: es, correcta: it, esRepaso: false };
    modoActual = 'vocabulario';

    if (modoEscritura) {
      document.getElementById('pregunta').textContent = `Escribe en italiano: "${es}"`;
      document.getElementById('respuesta-escrita').value = '';
      document.getElementById('respuesta-escrita').style.display = 'block';
      document.getElementById('btn-enviar').style.display = 'block';
      document.getElementById('opciones').style.display = 'none';
    } else {
      let opciones = [it];
      while (opciones.length < 4) {
        const r = vocabularioPorCategoria.todo[Math.floor(Math.random() * vocabularioPorCategoria.todo.length)][1];
        if (!opciones.includes(r)) opciones.push(r);
      }
      shuffle(opciones);
      document.getElementById('pregunta').textContent = `¿Cómo se dice "${es}" en italiano?`;
      for (let i = 0; i < 4; i++) {
        document.getElementById(`opcion${i}`).textContent = opciones[i];
        document.getElementById(`opcion${i}`).onclick = () => {
          reproducir(opciones[i]);
          verificarRespuesta(opciones[i].toLowerCase(), it.toLowerCase(), es, 'vocabulario');
        };
      }
    }
  }

  function iniciarVerbos() {
    modo = 'verbos';
    statsSesion = { aciertos: 0, errores: 0 };
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('juego').style.display = 'block';
    actualizarStats();
    mostrarPreguntaVerbo();
  }

  function mostrarPreguntaVerbo() {
    const repasos = obtenerRepasosPendientes().filter(r => r.tipo === 'verbo');
    if (repasos.length > 0) {
      const repaso = repasos[0];
      const [verboPart, resto] = repaso.contexto.split(' (');
      const tiempo = resto.split(', ')[0];
      const sujTexto = resto.split(', ')[1].slice(0, -1);
      const sujIdx = sujetosEs.indexOf(sujTexto);
      let correcta;
      if (verbosIrregulares[verboPart]) {
        correcta = verbosIrregulares[verboPart][tiempo][sujIdx];
      } else {
        correcta = conjugaciones[verboPart][tiempo][sujIdx];
      }

      preguntaActual = { tipo: 'verbos', verbo: verboPart, tiempo, suj: sujIdx, contexto: repaso.contexto, correcta, esRepaso: true };
      modoActual = 'verbos';

      if (modoEscritura) {
        document.getElementById('pregunta').textContent = `🔁 REPASO: Escribe la forma correcta de "${verboPart}" en ${tiempo} para "${sujTexto}":`;
        document.getElementById('respuesta-escrita').value = '';
        document.getElementById('respuesta-escrita').style.display = 'block';
        document.getElementById('btn-enviar').style.display = 'block';
        document.getElementById('opciones').style.display = 'none';
      } else {
        let todasFormas = [];
        if (verbosIrregulares[verboPart]) {
          for (let t of tiempos) {
            for (let f of verbosIrregulares[verboPart][t]) {
              todasFormas.push(f);
            }
          }
        } else {
          for (let t of tiempos) {
            for (let f of conjugaciones[verboPart][t]) {
              todasFormas.push(f);
            }
          }
        }
        todasFormas = [...new Set(todasFormas)];
        let opciones = [correcta];
        while (opciones.length < 4 && opciones.length < todasFormas.length) {
          const candidato = todasFormas[Math.floor(Math.random() * todasFormas.length)];
          if (!opciones.includes(candidato)) opciones.push(candidato);
        }
        while (opciones.length < 4) {
          const listaTotal = [...Object.keys(conjugaciones), ...Object.keys(verbosIrregulares)];
          const otroVerbo = listaTotal[Math.floor(Math.random()*listaTotal.length)];
          const otroTiempo = tiempos[Math.floor(Math.random()*3)];
          const otroSuj = Math.floor(Math.random()*6);
          let cand;
          if (verbosIrregulares[otroVerbo]) {
            cand = verbosIrregulares[otroVerbo][otroTiempo][otroSuj];
          } else {
            cand = conjugaciones[otroVerbo][otroTiempo][otroSuj];
          }
          if (!opciones.includes(cand)) opciones.push(cand);
        }
        shuffle(opciones);
        document.getElementById('pregunta').textContent = `🔁 REPASO: ¿"${verboPart}" en ${tiempo} para "${sujTexto}"?`;
        for (let i = 0; i < 4; i++) {
          document.getElementById(`opcion${i}`).textContent = opciones[i];
          document.getElementById(`opcion${i}`).onclick = () => {
            reproducir(opciones[i]);
            if (opciones[i].toLowerCase() === correcta.toLowerCase()) {
              subirNivelRepaso(repaso.contexto);
              statsSesion.aciertos++;
              statsGlobal.aciertos++;
              alert("✅ ¡Bien! Subes de nivel.");
            } else {
              programarRepaso(correcta, repaso.contexto, 'verbo');
              statsSesion.errores++;
              statsGlobal.errores++;
              alert(`❌ Incorrecto.\nTú: ${opciones[i]}\nCorrecto: ${correcta}`);
            }
            guardarStats();
            actualizarStats();
            setTimeout(mostrarPreguntaVerbo, 600);
          };
        }
      }
      return;
    }

    const usarIrregular = Math.random() > 0.6;
    let verbo, conjugacion;
    if (usarIrregular) {
      const irregularLista = Object.keys(verbosIrregulares);
      verbo = irregularLista[Math.floor(Math.random() * irregularLista.length)];
      conjugacion = verbosIrregulares[verbo];
    } else {
      const tipo = ["are","ere","ire"][Math.floor(Math.random()*3)];
      verbo = verbos[tipo][Math.floor(Math.random()*verbos[tipo].length)];
      conjugacion = conjugaciones[verbo];
    }

    const tiempo = tiempos[Math.floor(Math.random()*3)];
    const suj = Math.floor(Math.random()*6);
    const correcta = conjugacion[tiempo][suj];

    preguntaActual = { tipo: 'verbos', verbo, tiempo, suj, contexto: `${verbo} (${tiempo}, ${sujetosEs[suj]})`, correcta, esRepaso: false };
    modoActual = 'verbos';

    if (modoEscritura) {
      document.getElementById('pregunta').textContent = `Escribe la forma correcta de "${verbo}" en ${tiempo} para "${sujetosEs[suj]}":`;
      document.getElementById('respuesta-escrita').value = '';
      document.getElementById('respuesta-escrita').style.display = 'block';
      document.getElementById('btn-enviar').style.display = 'block';
      document.getElementById('opciones').style.display = 'none';
    } else {
      let todasFormas = [];
      for (let t of tiempos) {
        for (let f of conjugacion[t]) {
          todasFormas.push(f);
        }
      }
      todasFormas = [...new Set(todasFormas)];
      let opciones = [correcta];
      while (opciones.length < 4 && opciones.length < todasFormas.length) {
        const candidato = todasFormas[Math.floor(Math.random() * todasFormas.length)];
        if (!opciones.includes(candidato)) opciones.push(candidato);
      }
      while (opciones.length < 4) {
        const listaTotal = [...Object.keys(conjugaciones), ...Object.keys(verbosIrregulares)];
        const otroVerbo = listaTotal[Math.floor(Math.random()*listaTotal.length)];
        const otroTiempo = tiempos[Math.floor(Math.random()*3)];
        const otroSuj = Math.floor(Math.random()*6);
        let cand;
        if (verbosIrregulares[otroVerbo]) {
          cand = verbosIrregulares[otroVerbo][otroTiempo][otroSuj];
        } else {
          cand = conjugaciones[otroVerbo][otroTiempo][otroSuj];
        }
        if (!opciones.includes(cand)) opciones.push(cand);
      }
      shuffle(opciones);
      document.getElementById('pregunta').textContent = `¿"${verbo}" en ${tiempo} para "${sujetosEs[suj]}"?`;
      for (let i = 0; i < 4; i++) {
        document.getElementById(`opcion${i}`).textContent = opciones[i];
        document.getElementById(`opcion${i}`).onclick = () => {
          reproducir(opciones[i]);
          verificarRespuesta(opciones[i].toLowerCase(), correcta.toLowerCase(), `${verbo} (${tiempo}, ${sujetosEs[suj]})`, 'verbos');
        };
      }
    }
  }

  function verificarRespuesta(respuesta, correcta, contexto, tipo) {
    if (respuesta === correcta) {
      statsSesion.aciertos++;
      statsGlobal.aciertos++;
      alert("¡Correcto! ✅");
    } else {
      statsSesion.errores++;
      statsGlobal.errores++;
      errores.push({tipo, contexto, dada: respuesta, correcta});
      programarRepaso(correcta, contexto, tipo);
      alert(`❌ Incorrecto.\nTú: ${respuesta}\nCorrecto: ${correcta}`);
    }
    guardarStats();
    actualizarStats();

    setTimeout(() => {
      if (modoActual === 'vocabulario') {
        mostrarPreguntaVocabulario();
      } else if (modoActual === 'verbos') {
        mostrarPreguntaVerbo();
      }
    }, 600);
  }

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
    localStorage.removeItem('repasos_italiano');
    guardarStats();
    document.getElementById("errores-lista").innerHTML = "<p>Errores y estadísticas reiniciados.</p>";
    actualizarStats();
  }

  // === Listener ÚNICO para el botón Enviar ===
  document.getElementById('btn-enviar')?.addEventListener('click', () => {
    if (!preguntaActual || !modoEscritura) return;

    const respuestaEl = document.getElementById('respuesta-escrita');
    if (!respuestaEl) return;

    const respuesta = respuestaEl.value.trim().toLowerCase();
    const correcta = preguntaActual.correcta.toLowerCase();

    if (respuesta === correcta) {
      statsSesion.aciertos++;
      statsGlobal.aciertos++;
      if (preguntaActual.esRepaso) {
        subirNivelRepaso(preguntaActual.contexto);
        alert("✅ ¡Bien! Subes de nivel.");
      } else {
        alert("¡Correcto! ✅");
      }
    } else {
      statsSesion.errores++;
      statsGlobal.errores++;
      errores.push({
        tipo: preguntaActual.tipo,
        contexto: preguntaActual.contexto,
        dada: respuesta,
        correcta: preguntaActual.correcta
      });
      if (preguntaActual.esRepaso) {
        programarRepaso(preguntaActual.correcta, preguntaActual.contexto, preguntaActual.tipo);
        alert(`❌ Incorrecto.\nTú: ${respuesta}\nCorrecto: ${preguntaActual.correcta}`);
      } else {
        programarRepaso(preguntaActual.correcta, preguntaActual.contexto, preguntaActual.tipo);
        alert(`❌ Incorrecto.\nTú: ${respuesta}\nCorrecto: ${preguntaActual.correcta}`);
      }
    }

    guardarStats();
    actualizarStats();

    setTimeout(() => {
      if (modoActual === 'vocabulario') {
        mostrarPreguntaVocabulario();
      } else if (modoActual === 'verbos') {
        mostrarPreguntaVerbo();
      }
    }, 600);
  });

  // === Modo claro/oscuro ===
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '🌞' : '🌓';
    }
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = 'light';
    if (savedTheme) {
      theme = savedTheme;
    } else if (systemPrefersDark) {
      theme = 'dark';
    }
    applyTheme(theme);
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // === EVENT LISTENERS ===
  document.getElementById('btn-categorias')?.addEventListener('click', mostrarCategorias);
  document.getElementById('btn-verbos')?.addEventListener('click', iniciarVerbos);
  document.getElementById('btn-examen')?.addEventListener('click', iniciarExamen);
  document.getElementById('btn-desafio')?.addEventListener('click', iniciarDesafioDiario);
  document.getElementById('btn-errores')?.addEventListener('click', mostrarErrores);
  document.getElementById('cat-todo')?.addEventListener('click', () => iniciarVocabulario('todo'));
  document.getElementById('cat-basico')?.addEventListener('click', () => iniciarVocabulario('basico'));
  document.getElementById('cat-comida')?.addEventListener('click', () => iniciarVocabulario('comida'));
  document.getElementById('cat-viajes')?.addEventListener('click', () => iniciarVocabulario('viajes'));
  document.getElementById('cat-familia')?.addEventListener('click', () => iniciarVocabulario('familia'));
  document.getElementById('cat-casa')?.addEventListener('click', () => iniciarVocabulario('casa'));
  document.getElementById('cat-verbos')?.addEventListener('click', () => iniciarVocabulario('verbos'));
  document.getElementById('btn-volver-categorias')?.addEventListener('click', () => {
    document.getElementById('categorias').style.display = 'none';
    document.getElementById('menu-principal').style.display = 'block';
  });
  document.getElementById('ex-10')?.addEventListener('click', () => configurarExamen(10));
  document.getElementById('ex-20')?.addEventListener('click', () => configurarExamen(20));
  document.getElementById('ex-30')?.addEventListener('click', () => configurarExamen(30));
  document.getElementById('ex-20-300')?.addEventListener('click', () => configurarExamen(20, 300));
  document.getElementById('ex-30-600')?.addEventListener('click', () => configurarExamen(30, 600));
  document.getElementById('btn-volver-examen')?.addEventListener('click', () => {
    document.getElementById('examen-config').style.display = 'none';
    document.getElementById('menu-principal').style.display = 'block';
  });
  document.getElementById('btn-toggle-modo')?.addEventListener('click', toggleModo);
  document.getElementById('btn-volver-menu')?.addEventListener('click', volverMenuJuego);
  document.getElementById('btn-reiniciar-errores')?.addEventListener('click', reiniciarErrores);
  document.getElementById('btn-cerrar-errores')?.addEventListener('click', () => {
    document.getElementById('errores').style.display = 'none';
  });
  document.getElementById('btn-ver-detalle')?.addEventListener('click', verDetallesExamen);
  document.getElementById('btn-volver-menu-resultados')?.addEventListener('click', () => {
    document.getElementById('examen-resultados').style.display = 'none';
    document.getElementById('menu-principal').style.display = 'block';
  });

  // === INICIAR ===
  initTheme();
  actualizarStats();

});
