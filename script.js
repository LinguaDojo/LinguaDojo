// === CONFIGURACIÓN Y ESTADO ===
const state = {
    view: 'intro',
    gems: localStorage.getItem('lingua_gems') ? parseInt(localStorage.getItem('lingua_gems')) : 0,
    streak: localStorage.getItem('lingua_streak') ? parseInt(localStorage.getItem('lingua_streak')) : 0,
    lives: 5,
    isPro: localStorage.getItem('lingua_pro') === 'true',
    currentUnit: 1,
    currentLevel: null,
    progress: 0,
    completedLevels: JSON.parse(localStorage.getItem('lingua_completed')) || [],
    lastLevelPassed: false,
    currentLanguage: localStorage.getItem('lingua_lang') || 'en',
    speechWarmedUp: false
};

// Mapeo de cursos disponibles
const courses = {
    'en': window.courseEn,
    'de': window.courseDe,
    'no': window.courseNo,
    'fi': window.courseFi,
    'it': window.courseIt,
    'ja': window.courseJa,
    'zh': window.courseZh
};

// courseData inicial basado en el idioma guardado
let courseData = courses[state.currentLanguage] || window.courseEn;

// Lógica del Selector de Idioma
const langSelector = document.getElementById('language-selector');
if (langSelector) {
    langSelector.value = state.currentLanguage;
    langSelector.onchange = (e) => {
        state.currentLanguage = e.target.value;
        localStorage.setItem('lingua_lang', state.currentLanguage);
        courseData = courses[state.currentLanguage];

        // Actualizar UI del Mapa Inmediatamente
        const displayTitle = document.getElementById('course-title-display');
        const displayMission = document.getElementById('course-mission-display');
        if (displayTitle) displayTitle.innerText = courseData.title;
        if (displayMission) displayMission.innerText = courseData.mission;

        // Sincronizar idioma del reconocimiento si está activo
        if (recognition) recognition.lang = courseData.langCode;

        renderMap();
    };
}

// === VOCES (WEB SPEECH API) ===
// === VOCES (WEB SPEECH API) ===
function speak(text, lang) {
    if (!window.speechSynthesis) return;

    // Intentar despertar el motor
    window.speechSynthesis.resume();

    // Cancelar cualquier audio anterior
    window.speechSynthesis.cancel();

    const targetLang = lang || (typeof courseData !== 'undefined' ? courseData.langCode : 'en-US');

    // Pequeño workaround para algunos navegadores móviles: 
    // Si cancel() fue llamado, a veces ignoran el siguiente speak() si es inmediato.
    // Usamos un timeout mínimo de 50ms que suele ser el dulce punto para mantener el user gesture.
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        let voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            const matchingVoice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
            if (matchingVoice) {
                utterance.voice = matchingVoice;
            }
        }

        utterance.onerror = (e) => {
            console.error("Error en síntesis de voz:", e);
        };

        window.speechSynthesis.speak(utterance);

        // Fix extra para móviles: si entra en pausa después de speak, forzamos resume
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
    }, 50);
}

// Función para "calentar" el motor de voz en la primera interacción
function warmUpSpeech() {
    if (!window.speechSynthesis || state.speechWarmedUp) return;
    try {
        const utterance = new SpeechSynthesisUtterance("");
        utterance.volume = 0;
        window.speechSynthesis.speak(utterance);
        state.speechWarmedUp = true;
        console.log("Sistema de voz pre-activado");
    } catch (e) {
        console.log("No se pudo pre-activar voz:", e);
    }
}

// Inicializar voces al cargar y escuchar cambios
if (window.speechSynthesis && typeof window.speechSynthesis.getVoices === 'function') {
    window.speechSynthesis.getVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }
}

// === RECONOCIMIENTO DE VOZ (PRO) ===
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        console.log("Voz reconocida:", text);
        handleVoiceAnswer(text);
    };

    recognition.onend = () => {
        document.getElementById('mic-btn').classList.remove('recording');
        document.getElementById('mic-theory-btn').classList.remove('recording');
    };

    recognition.onerror = (event) => {
        console.error("Error de reconocimiento:", event.error);
        document.getElementById('mic-btn').classList.remove('recording');
    };
}

function handleVoiceAnswer(text, targetText = null) {
    const currentAns = (targetText || state.currentLevel.questions[quizIndex].answer)
        .toLowerCase()
        .trim()
        .replace(/[!.?,]/g, '');

    const cleanText = text.toLowerCase().trim().replace(/[!.?,]/g, '');

    console.log(`Comparando: "${cleanText}" vs "${currentAns}"`);

    if (cleanText === currentAns) {
        if (!targetText) {
            // Modo Lección: Buscar botón con la respuesta
            let found = false;
            document.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.innerText.toLowerCase().trim().replace(/[!.?,]/g, '') === currentAns) {
                    btn.click();
                    found = true;
                }
            });
            // Si no lo encuentra en botones, intentamos check directo (bubbles o similar)
            document.getElementById('check-btn').click();
        } else {
            alert("¡Perfecto! Lo has pronunciado muy bien. ✨");
        }
    } else {
        // Feedback visual o alerta
        alert(`Escuché: "${text}"\nSe esperaba: "${currentAns}"\n¡Inténtalo de nuevo!`);
    }
}

// === NAVEGACIÓN ===
window.jumpToUnit = (unitId) => {
    const target = document.getElementById(`unit-header-${unitId}`);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

function showView(viewId) {
    document.querySelectorAll('.app-container > div').forEach(div => div.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    state.view = viewId;
    window.scrollTo(0, 0);
}

// === RENDERIZADO DEL MAPA ===
function renderMap() {
    const mainArea = document.querySelector('.map-scroll-area');
    mainArea.innerHTML = '';

    courseData.units.forEach((unit, uIdx) => {
        const header = document.createElement('div');
        header.className = 'map-header-branding';
        header.id = `unit-header-${unit.id}`;
        header.innerHTML = `
            <span class="logo-icon-small">${unit.icon}</span>
            <h2>${unit.title}</h2>
            <p>Misión: Unidad ${unit.id}</p>
        `;
        mainArea.appendChild(header);

        const pathContainer = document.createElement('div');
        pathContainer.className = 'path-container';

        unit.levels.forEach((lvl, lIdx) => {
            const isCompleted = state.completedLevels.includes(lvl.id);
            const isProLocked = lvl.isPro && !state.isPro;

            const node = document.createElement('div');
            node.className = `level-node ${isCompleted ? 'completed' : ''} ${isProLocked ? 'locked' : ''}`;

            if (isProLocked) {
                node.innerHTML = '💎';
                node.onclick = () => {
                    document.getElementById('payment-modal').classList.remove('hidden');
                };
            } else {
                node.innerHTML = lvl.ic;
                node.onclick = () => startLevel(lvl);
                if (!isCompleted && !state.completedLevels.some(id => unit.levels.map(l => l.id).includes(id) && id > lvl.id)) {
                    node.classList.add('current');
                }
            }
            pathContainer.appendChild(node);

            if (lIdx === 9) {
                const sep = document.createElement('div');
                sep.className = 'pro-separator';
                sep.innerHTML = '<span>Zona Premium Lingua Pro</span>';
                pathContainer.appendChild(sep);
            }
        });

        mainArea.appendChild(pathContainer);

        if (uIdx < courseData.units.length - 1) {
            const divider = document.createElement('div');
            divider.className = 'path-divider';
            divider.innerHTML = `<span>Siguiente: ${courseData.units[uIdx + 1].title}</span>`;
            mainArea.appendChild(divider);
        }
    });
}

// === LÓGICA DE LECCIÓN ===
let currentQuiz = null;
let quizIndex = 0;
let selectedTitle = "";

function startLevel(level) {
    state.currentLevel = level;
    state.lives = 5;
    quizIndex = 0;
    updateLessonUI();

    const theory = level.theory;
    document.getElementById('theory-title').innerText = level.title;
    document.getElementById('theory-text').innerHTML = theory.text;
    document.getElementById('theory-code').innerText = theory.example;

    document.getElementById('play-theory-audio').onclick = () => speak(theory.voice);

    const micTheoryBtn = document.getElementById('mic-theory-btn');
    if (state.isPro) {
        micTheoryBtn.classList.remove('hidden');
        micTheoryBtn.onclick = () => {
            if (!recognition) return alert("Navegador no compatible.");
            try {
                micTheoryBtn.classList.add('recording');
                recognition.lang = courseData.langCode;
                recognition.onresult = (event) => {
                    const text = event.results[0][0].transcript;
                    handleVoiceAnswer(text, theory.voice);
                };
                recognition.start();
            } catch (e) {
                recognition.stop();
                micTheoryBtn.classList.remove('recording');
            }
        };
    } else {
        micTheoryBtn.classList.add('hidden');
    }

    showView('theory');
}

document.getElementById('start-quiz-btn').onclick = () => {
    showView('lesson');
    loadQuestion();
};

function loadQuestion() {
    const questions = state.currentLevel.questions;
    if (quizIndex >= questions.length) {
        finishLevel();
        return;
    }

    const q = questions[quizIndex];
    currentQuiz = q;

    document.getElementById('question-text').innerText = q.text;
    document.getElementById('feedback-msg').classList.add('hidden');
    document.getElementById('footer-bar').className = 'bottom-bar';
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('check-btn').classList.remove('hidden');
    document.getElementById('check-btn').disabled = true;

    const container = document.getElementById('options-container');
    const challengeBox = document.getElementById('challenge-box');
    container.innerHTML = '';
    challengeBox.innerHTML = '';

    document.getElementById('play-question-audio').onclick = () => speak(q.voice);

    const micBtn = document.getElementById('mic-btn');
    if (state.isPro) {
        micBtn.classList.remove('hidden');
        micBtn.onclick = () => {
            if (!recognition) {
                alert("Tu navegador no soporta reconocimiento de voz.");
                return;
            }
            try {
                micBtn.classList.add('recording');
                recognition.lang = courseData.langCode;
                recognition.onresult = (event) => {
                    const text = event.results[0][0].transcript;
                    handleVoiceAnswer(text);
                };
                recognition.start();
            } catch (e) {
                recognition.stop();
                micBtn.classList.remove('recording');
            }
        };
    } else {
        micBtn.classList.add('hidden');
    }

    if (q.type === 'translate') {
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'action-btn option-btn';
            btn.style.width = 'auto';
            btn.style.background = '#fff';
            btn.style.color = '#333';
            btn.style.border = '2px solid #ddd';
            btn.style.boxShadow = '0 4px 0 #ddd';
            btn.innerText = opt;
            btn.onclick = () => {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                btn.style.borderColor = '#8a3ffc';
                document.getElementById('check-btn').disabled = false;
                selectedTitle = opt;
            };
            container.appendChild(btn);
        });
    } else if (q.type === 'bubbles') {
        let currentAnswer = [];
        q.options.forEach(opt => {
            const bubble = document.createElement('div');
            bubble.className = 'word-bubble';
            bubble.innerText = opt;
            bubble.onclick = () => {
                if (bubble.parentElement === container) {
                    challengeBox.appendChild(bubble);
                    currentAnswer.push(opt);
                } else {
                    container.appendChild(bubble);
                    currentAnswer = currentAnswer.filter(i => i !== opt);
                }
                document.getElementById('check-btn').disabled = currentAnswer.length === 0;
                selectedTitle = currentAnswer;
            };
            container.appendChild(bubble);
        });
    }
    updateProgress();
}

function updateProgress() {
    const total = state.currentLevel.questions.length;
    const perc = (quizIndex / total) * 100;
    document.getElementById('progress-bar').style.width = `${perc}%`;
}

function updateLessonUI() {
    document.getElementById('lives-count').innerText = state.lives;
    document.getElementById('gems-count').innerText = state.gems;
    document.getElementById('streak-count').innerText = state.streak;

    const proStatusTag = document.getElementById('pro-status-tag');
    const proBadge = document.querySelector('.pro-badge');

    if (state.isPro) {
        if (proStatusTag) proStatusTag.classList.remove('hidden');
        if (proBadge) {
            proBadge.innerText = 'PRO ACTIVO';
            proBadge.style.background = 'linear-gradient(45deg, #8a3ffc, #1192e8)';
            proBadge.style.color = 'white';
            proBadge.style.boxShadow = '0 4px 0 #6929c4';
        }
    } else {
        if (proStatusTag) proStatusTag.classList.add('hidden');
        if (proBadge) {
            proBadge.innerText = 'LINGUA PRO';
            proBadge.style.background = '';
            proBadge.style.color = '';
            proBadge.style.boxShadow = '';
        }
    }
}

document.getElementById('check-btn').onclick = () => {
    const q = currentQuiz;
    let isCorrect = false;

    if (q.type === 'translate') {
        isCorrect = (selectedTitle === q.answer);
    } else if (q.type === 'bubbles') {
        isCorrect = (JSON.stringify(selectedTitle) === JSON.stringify(q.answer));
    }

    const footer = document.getElementById('footer-bar');
    const feedback = document.getElementById('feedback-msg');
    const title = document.getElementById('feedback-title');
    const detail = document.getElementById('feedback-detail');

    footer.classList.remove('hidden');
    feedback.classList.remove('hidden');

    if (isCorrect) {
        footer.className = 'bottom-bar correct';
        title.innerText = "¡Excelente!";
        detail.innerText = "Sigue así.";
        speak(q.voice);

        const isLastQuestion = (quizIndex === state.currentLevel.questions.length - 1);
        if (isLastQuestion && !state.completedLevels.includes(state.currentLevel.id)) {
            state.completedLevels.push(state.currentLevel.id);
            state.gems += 10;
            state.streak++;
            state.lastLevelPassed = true;
        } else if (isLastQuestion) {
            state.lastLevelPassed = true;
        }
    } else {
        footer.className = 'bottom-bar wrong';
        title.innerText = "Casi...";
        detail.innerText = `La respuesta era: ${Array.isArray(q.answer) ? q.answer.join(' ') : q.answer}`;
        state.lives--;
        state.streak = 0;
        state.lastLevelPassed = false;

        if (state.lives <= 0) {
            alert("Te quedaste sin vidas. Intenta de nuevo.");
            showView('map');
            return;
        }
    }

    updateLessonUI();
    document.getElementById('check-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
};

document.getElementById('next-btn').onclick = () => {
    quizIndex++;
    loadQuestion();
};

function finishLevel() {
    localStorage.setItem('lingua_completed', JSON.stringify(state.completedLevels));
    localStorage.setItem('lingua_gems', state.gems);
    localStorage.setItem('lingua_streak', state.streak);

    if (state.lastLevelPassed) {
        alert("¡Nivel Completado! +10 Gemas 💎");
    } else {
        alert("Lección finalizada. ¡Inténtalo de nuevo sin errores para ganar gemas!");
    }

    renderMap();
    showView('map');
}

// === INICIALIZACIÓN ===
document.getElementById('start-learning-btn').onclick = () => {
    warmUpSpeech(); // Activar voces en la primera interacción real
    showView('map');
    renderMap();
};

document.getElementById('exit-lesson-btn').onclick = () => {
    if (confirm("¿Seguro que quieres salir? Perderás el progreso de la lección.")) {
        showView('map');
    }
};

document.getElementById('back-to-map-btn').onclick = () => showView('map');

document.querySelector('.pro-badge').onclick = () => {
    document.getElementById('payment-modal').classList.remove('hidden');
};

document.getElementById('save-btn').onclick = () => {
    localStorage.setItem('lingua_completed', JSON.stringify(state.completedLevels));
    localStorage.setItem('lingua_gems', state.gems);
    localStorage.setItem('lingua_streak', state.streak);
    localStorage.setItem('lingua_pro', state.isPro);
    localStorage.setItem('lingua_lang', state.currentLanguage);
    alert("¡Progreso guardado correctamente! 💾");
};

document.getElementById('verify-code-btn').onclick = () => {
    const inputField = document.getElementById('manual-code-input');
    const code = inputField.value.trim();
    if (code === "cliente_vip_enero_2026") {
        state.isPro = true;
        localStorage.setItem('lingua_pro', 'true');
        alert("¡Felicidades! Lingua Dojo PRO Activado.");
        updateLessonUI();
        renderMap();
        document.getElementById('payment-modal').classList.add('hidden');
    } else if (code === "") {
        alert("Por favor, ingresa un código.");
    } else {
        alert("Código inválido.");
    }
};

document.querySelector('.close-modal-pay').onclick = () => {
    document.getElementById('payment-modal').classList.add('hidden');
};

window.onclick = (event) => {
    const modal = document.getElementById('payment-modal');
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
};

// Modo Oscuro
const darkModeBtn = document.getElementById('dark-mode-btn');
const isDarkMode = localStorage.getItem('lingua_theme') === 'dark';
if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeBtn.innerText = '☀️';
}

darkModeBtn.onclick = () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('lingua_theme', isDark ? 'dark' : 'light');
    darkModeBtn.innerText = isDark ? '☀️' : '🌙';
};

// Acceso VIP URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('access') === 'cliente_vip_enero_2026') {
    state.isPro = true;
    localStorage.setItem('lingua_pro', 'true');
    console.log("Acceso PRO activado vía URL");
}

// Inicialización final
updateLessonUI();
const displayTitle = document.getElementById('course-title-display');
const displayMission = document.getElementById('course-mission-display');
if (displayTitle && courseData) displayTitle.innerText = courseData.title;
if (displayMission && courseData) displayMission.innerText = courseData.mission;

renderMap();

// Drag to scroll
const slider = document.querySelector('.units-nav');
let isDown = false;
let startX;
let scrollLeft;

if (slider) {
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}
