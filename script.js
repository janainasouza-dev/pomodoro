// ==========================================
// 1. MAPEAMENTO DOS ELEMENTOS DO HTML (DOM)
// ==========================================
const displayCronometro = document.getElementById('cronometro');
const textoStatus = document.getElementById('status-texto');
const btnIniciar = document.getElementById('btn-iniciar');
const btnPausar = document.getElementById('btn-pausar'); 
const btnResetar = document.getElementById('btn-resetar');
const body = document.body; 

// ==========================================
// 2. VARIÁVEIS DE ESTADO DO APLICATIVO
// ==========================================
let tempoRestante = 25 * 60;
let idIntervalo = null;
let modoAtual = 'foco';

// Pede permissão para notificações no navegador
if ("Notification" in window && Notification.permission !== "granted" ) {
    Notification.requestPermission();    
}

// ==========================================
// 3. FUNÇÕES LÓGICAS
// ==========================================

// Atualiza o texto do tempo na tela e na aba
function atualizarDisplay() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;

    const minutosFormatados = String(minutos).padStart(2, '0');
    const segundosFormatados = String(segundos).padStart(2, '0');

    const tempoTexto = `${minutosFormatados}:${segundosFormatados}`;

    displayCronometro.textContent = tempoTexto;
    document.title = `${tempoTexto} - Pomodoro Dev`; 
}

// Controla a passagem dos segundos
function contarTempo() {
    if(tempoRestante > 0) {
        tempoRestante--;
        atualizarDisplay();
    } else {
        pausarCronometro();
        dispararNotificacao(); 
        alternarModo();
    }
}

// Inicia o contador
function iniciarCronometro() {
    // Evita criar múltiplos intervalos se o usuário clicar várias vezes
    if (idIntervalo !== null) return; 

    idIntervalo = setInterval(contarTempo, 1000);

    btnIniciar.classList.add('oculto');
    btnPausar.classList.remove('oculto');
}

// ESTA FUNÇÃO ESTAVA FALTANDO NO SEU CÓDIGO ANTERIOR:
function pausarCronometro() {
    clearInterval(idIntervalo);
    idIntervalo = null; // Limpa o ID para permitir reiniciar depois

    btnIniciar.classList.remove('oculto');
    btnPausar.classList.add('oculto');
}

// Reseta o tempo baseado no modo atual
function resetarCronometro() {
   pausarCronometro();
   tempoRestante = modoAtual === 'foco' ? 25 * 60 : 5 * 60;
   atualizarDisplay(); 
}

// Altera as cores e textos entre foco e descanso
function alternarModo() {
    if (modoAtual === 'foco') {
        modoAtual = 'descanso';
        tempoRestante = 5 * 60; 
        textoStatus.textContent = 'Hora de descansar!';
        body.classList.add('modo-descanso'); 
    } else {
        modoAtual = 'foco';
        tempoRestante = 25 * 60; 
        textoStatus.textContent = 'Hora de focar!';
        body.classList.remove('modo-descanso'); 
    }
    atualizarDisplay();
}

// Envia a notificação do sistema
function dispararNotificacao() {
    if ("Notification" in window && Notification.permission === "granted") {
        const mensagem = modoAtual === 'foco' 
            ? "Hora de descansar! Seu ciclo de foco terminou." 
            : "Hora de voltar ao trabalho! Seu descanso acabou.";
        
        new Notification("Pomodoro Dev", { body: mensagem });
    }
}

// ==========================================
// 4. OUVINTES DE EVENTOS (LISTENERS)
// ==========================================
btnIniciar.addEventListener('click', iniciarCronometro);
btnPausar.addEventListener('click', pausarCronometro);
btnResetar.addEventListener('click', resetarCronometro);

// Inicializa a tela com o tempo padrão
atualizarDisplay();
