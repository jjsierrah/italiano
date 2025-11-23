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

  // === VERBOS ===
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

  // === MENÚS ===
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
    const todosVerbos = Object.keys(conjugaciones);
    for (let i = 0; i < numPreguntas; i++) {
      if (Math.random() > 0.4 && todosVerbos.length > 0) {
        const tipo = ["are","ere","ire"][Math.floor(Math.random()*3)];
        const verbo = verbos[tipo][Math.floor(Math.random()*verbos[tipo].length)];
        const tiempo = tiempos[Math.floor(Math.random()*3)];
        const suj = Math.floor(Math.random()*6);
        const correcta = conjugaciones[verbo][tiempo][suj];
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
        for (let t of tiempos) {
          for (let f of conjugaciones[p.verbo][t]) {
            todasFormas.push(f);
          }
        }
        todasFormas = [...new Set(todasFormas)];
        let opciones = [p.correcta];
        while (opciones.length < 4 && opciones.length < todasFormas.length) {
          const candidato = todasFormas[Math.floor(Math.random() * todasFormas.length)];
          if (!opciones.includes(candidato)) opciones.push(candidato);
        }
        while (opciones.length < 4) {
          const otroVerbo = Object.keys(conjugaciones)[Math.floor(Math.random()*Object.keys(conjugaciones).length)];
          const otroTiempo = tiempos[Math.floor(Math.random()*3)];
          const otroSuj = Math.floor(Math.random()*6);
          const cand = conjugaciones[otroVerbo][otroTiempo][otroSuj];
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

    const historial = JSON.parse(localStorage.getItem('examenes_italiano')) || [];
    historial.push({
      fecha: new Date().toLocaleString(),
      preguntas: total,
      aciertos,
      porcentaje
    });
    localStorage.setItem('examenes_italiano', JSON.stringify(historial));

    document.getElementById('juego').style.display = 'none';
    document.getElementById('examen-resultados').style.display = 'block';
    document.getElementById('resultados-contenido').innerHTML = `
      <p><strong>Preguntas:</strong> ${total}</p>
      <p><strong>Aciertos:</strong> ${aciertos}</p>
      <p><strong>Porcentaje:</strong> ${porcentaje}%</p>
      <p style="color:${porcentaje >= 80 ? 'green' : porcentaje >= 60 ? 'orange' : 'red'};">
        <strong>${porcentaje >= 80 ? '¡Excelente!' : porcentaje >= 60 ? 'Bien hecho' : 'Sigue practicando'}</strong>
      </p>
    `;
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
      '<button onclick="document.getElementById(\'examen-resultados\').style.display=\'none\'; document.getElementById(\'menu-principal\').style.display=\'block\';">Menú principal</button>';
  }
    // === FUNCIONES EXISTENTES (vocabulario y verbos normales) ===
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
    const btn = document.querySelector('#juego button[onclick="toggleModo()"]');
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
    // Evitar duplicados
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

  function mostrarPreguntaVocabulario() {
    const repasos = obtenerRepasosPendientes().filter(r => r.tipo === 'vocabulario');
    if (repasos.length > 0) {
      // Mostrar repaso
      const repaso = repasos[0];
      const [es, it] = repaso.contexto.includes('->') ? repaso.contexto.split('->') : [repaso.contexto, repaso.palabra];

      if (modoEscritura) {
        document.getElementById('pregunta').textContent = `🔁 REPASO: Escribe en italiano: "${es}"`;
        document.getElementById('respuesta-escrita').value = '';
        document.getElementById('btn-enviar').onclick = () => {
          const respuesta = document.getElementById('respuesta-escrita').value.trim().toLowerCase();
          if (respuesta === it.toLowerCase()) {
            subirNivelRepaso(repaso.contexto);
            statsSesion.aciertos++;
            statsGlobal.aciertos++;
            alert("✅ ¡Bien! Subes de nivel.");
          } else {
            programarRepaso(it, repaso.contexto, 'vocabulario'); // Reinicia nivel
            statsSesion.errores++;
            statsGlobal.errores++;
            alert(`❌ Incorrecto.\nTú: ${respuesta}\nCorrecto: ${it}`);
          }
          guardarStats();
          actualizarStats();
          setTimeout(mostrarPreguntaVocabulario, 600);
        };
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

    // Si no hay repasos, vocabulario normal
    const vocab = vocabularioPorCategoria[categoriaActual];
    const idx = Math.floor(Math.random() * vocab.length);
    const [es, it] = vocab[idx];

    if (modoEscritura) {
      document.getElementById('pregunta').textContent = `Escribe en italiano: "${es}"`;
      document.getElementById('respuesta-escrita').value = '';
      document.getElementById('btn-enviar').onclick = () => verificarRespuesta(document.getElementById('respuesta-escrita').value.trim().toLowerCase(), it.toLowerCase(), es, 'vocabulario');
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

  function mostrarPreguntaVerbo() {
    const repasos = obtenerRepasosPendientes().filter(r => r.tipo === 'verbo');
    if (repasos.length > 0) {
      const repaso = repasos[0];
      // Aquí asumimos que el contexto es como: "mangiare (presente, yo)"
      const [verboPart, resto] = repaso.contexto.split(' (');
      const tiempo = resto.split(', ')[0];
      const sujTexto = resto.split(', ')[1].slice(0, -1); // quita el ')'
      const sujIdx = sujetosEs.indexOf(sujTexto);
      const correcta = conjugaciones[verboPart][tiempo][sujIdx];

      if (modoEscritura) {
        document.getElementById('pregunta').textContent = `🔁 REPASO: Escribe la forma correcta de "${verboPart}" en ${tiempo} para "${sujTexto}":`;
        document.getElementById('respuesta-escrita').value = '';
        document.getElementById('btn-enviar').onclick = () => {
          const respuesta = document.getElementById('respuesta-escrita').value.trim().toLowerCase();
          if (respuesta === correcta.toLowerCase()) {
            subirNivelRepaso(repaso.contexto);
            statsSesion.aciertos++;
            statsGlobal.aciertos++;
            alert("✅ ¡Bien! Subes de nivel.");
          } else {
            programarRepaso(correcta, repaso.contexto, 'verbo');
            statsSesion.errores++;
            statsGlobal.errores++;
            alert(`❌ Incorrecto.\nTú: ${respuesta}\nCorrecto: ${correcta}`);
          }
          guardarStats();
          actualizarStats();
          setTimeout(mostrarPreguntaVerbo, 600);
        };
      } else {
        let todasFormas = [];
        for (let t of tiempos) {
          for (let f of conjugaciones[verboPart][t]) {
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
          const otroVerbo = Object.keys(conjugaciones)[Math.floor(Math.random()*Object.keys(conjugaciones).length)];
          const otroTiempo = tiempos[Math.floor(Math.random()*3)];
          const otroSuj = Math.floor(Math.random()*6);
          const cand = conjugaciones[otroVerbo][otroTiempo][otroSuj];
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

    // Verbos normales
    const tipo = ["are","ere","ire"][Math.floor(Math.random()*3)];
    const verbo = verbos[tipo][Math.floor(Math.random()*verbos[tipo].length)];
    const tiempo = tiempos[Math.floor(Math.random()*3)];
    const suj = Math.floor(Math.random()*6);
    const correcta = conjugaciones[verbo][tiempo][suj];

    if (modoEscritura) {
      document.getElementById('pregunta').textContent = `Escribe la forma correcta de "${verbo}" en ${tiempo} para "${sujetosEs[suj]}":`;
      document.getElementById('respuesta-escrita').value = '';
      document.getElementById('btn-enviar').onclick = () => verificarRespuesta(document.getElementById('respuesta-escrita').value.trim().toLowerCase(), correcta.toLowerCase(), `${verbo} (${tiempo}, ${sujetosEs[suj]})`, 'verbos');
    } else {
      let todasFormas = [];
      for (let t of tiempos) {
        for (let f of conjugaciones[verbo][t]) {
          todasFormas.push(f);
        }
      }
      todasFormas = [...new Set(todasFormas)];

      let opciones = [correcta];
      while (opciones.length < 4 && opciones.length < todasFormas.length) {
        const candidato = todasFormas[Math.floor(Math.random() * todasFormas.length)];
        if (!opciones.includes(candidato)) {
          opciones.push(candidato);
        }
      }
      while (opciones.length < 4) {
        const otroVerbo = Object.keys(conjugaciones)[Math.floor(Math.random()*Object.keys(conjugaciones).length)];
        const otroTiempo = tiempos[Math.floor(Math.random()*3)];
        const otroSuj = Math.floor(Math.random()*6);
        const cand = conjugaciones[otroVerbo][otroTiempo][otroSuj];
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
      if (modo === 'vocabulario') {
        mostrarPreguntaVocabulario();
      } else {
        mostrarPreguntaVerbo();
      }
    }, 600);
  }

  function procesarRespuestaExamen(respuesta, correcta, contexto, tipo) {
    const esCorrecta = respuesta === correcta;
    resultadosExamen.push({ contexto, dada: respuesta, correcta, esCorrecta });

    if (esCorrecta) {
      statsGlobal.aciertos++;
    } else {
      statsGlobal.errores++;
      errores.push({ tipo, contexto, dada: respuesta, correcta });
      // En modo examen, NO programar repaso (solo en práctica)
    }

    guardarStats();
    indiceExamen++;
    setTimeout(mostrarSiguientePreguntaExamen, 600);
  }

  function mostrarErrores() {
    const div = document.getElementById("errores-lista");
    if (errores.length === 0) {
      if (div) div.innerHTML = "<p>¡No tienes errores guardados! 🌟</p>";
    } else {
      if (div) {
        div.innerHTML = errores.map(e =>
          `<div><strong>${e.contexto}</strong><br/>Tu respuesta: ${e.dada}<br/>Correcto: ${e.correcta}</div><hr>`
        ).join('');
      }
    }
    const erroresEl = document.getElementById("errores");
    if (erroresEl) erroresEl.style.display = "block";
  }

  function reiniciarErrores() {
    errores = [];
    statsGlobal = { aciertos: 0, errores: 0 };
    localStorage.removeItem('examenes_italiano');
    localStorage.removeItem('repasos_italiano'); // también resetea SRS
    guardarStats();
    const erroresLista = document.getElementById("errores-lista");
    if (erroresLista) {
      erroresLista.innerHTML = "<p>Errores y estadísticas reiniciados.</p>";
    }
    actualizarStats();
  }

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

  // Registrar el listener del tema
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // === Hacer funciones accesibles globalmente para onclick inline ===
  window.mostrarCategorias = mostrarCategorias;
  window.iniciarVerbos = iniciarVerbos;
  window.iniciarExamen = iniciarExamen;
  window.configurarExamen = configurarExamen;
  window.mostrarErrores = mostrarErrores;
  window.reiniciarErrores = reiniciarErrores;
  window.volverMenuJuego = volverMenuJuego;
  window.toggleModo = toggleModo;
  window.iniciarVocabulario = iniciarVocabulario;
  window.verDetallesExamen = verDetallesExamen;

  // === INICIAR ===
  initTheme();
  actualizarStats();

});
