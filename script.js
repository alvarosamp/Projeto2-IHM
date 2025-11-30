// --- FUNÇÕES DE MENU E TEMA ---
function openMenu() { document.getElementById("menu_aba").style.display = "block"; }
function closeMenu() { document.getElementById("menu_aba").style.display = "none"; }

function openMenuPanel(panelId) {
    const menu = document.getElementById('menu_aba');
    if (!menu) return;
    // ensure menu visible
    menu.style.display = 'block';
    // hide all panels
    document.querySelectorAll('#menu_aba .menu_panel').forEach(p => p.classList.add('hidden'));
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.remove('hidden');
    // if oportunidades panel, render vagas inside it
    if (panelId === 'oportunidades-panel') {
        renderVagasInto(vagas, 'menu-vagas-list');
    }
    // if intercambio panel, try to load intercambios via helper (if available)
    if (panelId === 'intercambio-panel') {
        const container = document.getElementById('menu-intercambio-list');
        if (typeof loadIntercambiosFromJson === 'function') {
            // load and render into menu panel (helper renders in #lista-intercambios by default,
            // but it stores data in window._intercambiosData; we call the loader and then
            // render manually into the menu container if helper exposes data)
            try {
                // call loader which will populate window._intercambiosData and attempt a render
                loadIntercambiosFromJson('./intercambios.json');
                // if helper populated the data, render a small summary list here
                setTimeout(() => {
                    const data = window._intercambiosData || [];
                    if (!container) return;
                    container.innerHTML = '';
                    if (data.length === 0) {
                        container.textContent = 'Nenhum intercâmbio carregado.';
                        return;
                    }
                    const ul = document.createElement('div');
                    ul.style.display = 'flex';
                    ul.style.flexDirection = 'column';
                    ul.style.gap = '8px';
                    data.slice(0,5).forEach(i => {
                        const item = document.createElement('div');
                        item.className = 'font';
                        item.innerHTML = `<strong>${i.titulo}</strong><br/><small>${i.instituicao} — ${i.pais || i.tipo || ''}</small>`;
                        ul.appendChild(item);
                    });
                    container.appendChild(ul);
                }, 200);
            } catch (err) {
                if (container) container.textContent = 'Erro ao carregar intercâmbios.';
            }
        } else {
            if (container) container.textContent = 'Recurso de intercâmbio não disponível.';
        }
    }
}

// modify closeMenu to also hide inner panels
const _origCloseMenu = closeMenu;
function closeMenu() { 
    const menu = document.getElementById('menu_aba');
    if (menu) menu.style.display = 'none';
    document.querySelectorAll('#menu_aba .menu_panel').forEach(p => p.classList.add('hidden'));
}

function temaLim() {
    document.documentElement.style.setProperty('--cor-click', '#38184C');
    document.documentElement.style.setProperty('--cor-sombra', '#9b0a59');
    document.documentElement.style.setProperty('--cor-text', 'black');
    document.documentElement.style.setProperty('--cor-back1', '#CEF09D');
    document.documentElement.style.setProperty('--cor-back2', '#4f6a93');
    document.documentElement.style.setProperty('--md-sys-color-primary', '#38184C');
}

function temaInatel() {
    document.documentElement.style.setProperty('--cor-click', '#126ae2');
    document.documentElement.style.setProperty('--cor-sombra', '#0a599b');
    document.documentElement.style.setProperty('--cor-text', 'black');
    document.documentElement.style.setProperty('--cor-back1', '#edf2f4');
    document.documentElement.style.setProperty('--cor-back2', '#6a937a');
    document.documentElement.style.setProperty('--md-sys-color-primary', '#126ae2');
}

function temaDark() {
    const cores = {
        '--cor-click': '#CEF09D',
        '--cor-sombra': '#9b0a59',
        '--cor-text': 'black',
        '--cor-back1': '#38184C',
        '--cor-back2': '#4f6a93',
        '--md-sys-color-primary': '#CEF09D'
    };
    for (const [variavel, valor] of Object.entries(cores)) {
        document.documentElement.style.setProperty(variavel, valor);
    }
}

// --- DADOS DO CARROSSEL ---
const eventos = [
    {
        id: 1, title: 'Fetin 2025', date: '25/10', time: '14:00', location: 'Ginásio',
        description: 'Feira Tecnológica do Inatel com projetos inovadores.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400'
    },
    {
        id: 2, title: 'Hackathon Inatel', date: '12/11', time: '08:00', location: 'Lab Soft.',
        description: 'Maratona de programação voltada para Cidades Inteligentes.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800&h=400'
    },
    {
        id: 3, title: 'Festa dos Alunos', date: '18/12', time: '20:00', location: 'Área Esportiva',
        description: 'Encerramento do semestre letivo com música ao vivo.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800&h=400'
    }
];

// --- LÓGICA DO CARROSSEL ---
const carousel = document.querySelector('.carousel');
let index = 0;

function createCards() {
    if (!carousel) return;
    carousel.innerHTML = '';
    eventos.forEach(event => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${event.image}" alt="${event.title}">
            <div class="info">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p><span class="material-symbols-outlined icon" style="font-size:14px; vertical-align:middle;">event</span> ${event.date} às ${event.time} | ${event.location}</p>
            </div>`;
        carousel.appendChild(card);
    });
}

function updateCarousel() {
    if (!carousel) return;
    const count = eventos.length || 1;
    if (index < 0) index = count - 1;
    if (index >= count) index = 0;
    carousel.style.transform = `translateX(-${index * 100}%)`;
}

function prevSlide() { index = (index - 1 + eventos.length) % eventos.length; updateCarousel(); }
function nextSlide() { index = (index + 1) % eventos.length; updateCarousel(); }

// --- RESERVA DE ARMÁRIO E FILTROS ---
function reservarArmario() {
    const selected = document.querySelector('.tipo.selected');
    const tipo = selected ? selected.dataset.value || selected.textContent.trim().toLowerCase() : 'padrao';
    // Gera número aleatório de armário (exemplo)
    const num = Math.floor(Math.random() * 300) + 1;
    const armarioEl = document.getElementById('armarioNumero');
    const resultado = document.getElementById('resultado');
    if (armarioEl) {
        armarioEl.textContent = num;
        armarioEl.style.display = 'block';
    }
    if (resultado) {
        resultado.textContent = `Reservado: tipo ${tipo.toString()} — Armário nº ${num}`;
    }
}

// --- MURAL DE VAGAS (simples) ---
const vagas = [
    { id: 1, titulo: 'Estagiário Front-end', tipo: 'Estágio', empresa: 'Inatel', descricao: 'Trabalhar com React/Vue. Apoio ao time de UI/UX.', requisitos: ['Cursando Ciência da Computação ou similar', 'HTML/CSS/JS básicos', 'Noções de React ou frameworks similares'] },
    { id: 2, titulo: 'Desenvolvedor Back-end', tipo: 'Emprego', empresa: 'TechCorp', descricao: 'Node.js/Express. Desenvolvimento de APIs e microserviços.', requisitos: ['Experiência com Node.js', 'APIs REST/GraphQL', 'Banco de dados relacionais e NoSQL'] },
    { id: 3, titulo: 'Estágio QA', tipo: 'Estágio', empresa: 'SoftLab', descricao: 'Testes manuais e automatizados. Apoio em pipelines CI.', requisitos: ['Interesse por qualidade de software', 'Noções de testes automatizados', 'Conhecimento básico de Git'] }
];

function renderVagas(list) {
    // Por compatibilidade: renderiza no container padrão 'lista-vagas'
    renderVagasInto(list, 'lista-vagas');
}

function renderVagasInto(list, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    if (!list || list.length === 0) {
        container.textContent = 'Nenhuma vaga encontrada.';
        return;
    }
    list.forEach(v => {
        const el = document.createElement('div');
        el.className = 'vaga-card';
        const requisitosHTML = (v.requisitos || []).map(r => `<li>${r}</li>`).join('');
        el.innerHTML = `
            <h3>${v.titulo}</h3>
            <p class="font">${v.empresa} — <strong>${v.tipo}</strong></p>
            <p class="font">${v.descricao}</p>
            <div class="vaga-actions"><button class="detalhes-btn">Ver detalhes</button></div>
            <div class="vaga-details">
                <p class="font"><strong>Requisitos:</strong></p>
                <ul class="font">${requisitosHTML}</ul>
                <p class="font"><strong>Descrição completa:</strong> ${v.descricao}</p>
                <div style="margin-top:8px;"><button class="candidatar-btn">Candidatar</button></div>
            </div>`;
        container.appendChild(el);
        // Adiciona comportamento de toggle para o botão de detalhes
        const btn = el.querySelector('.detalhes-btn');
        const details = el.querySelector('.vaga-details');
        if (btn && details) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const open = details.classList.toggle('open');
                el.classList.toggle('expanded', open);
                btn.textContent = open ? 'Fechar' : 'Ver detalhes';
            });
        }

        // Botão candidatar abre o modal de envio (comportamento definido abaixo)
        const cand = el.querySelector('.candidatar-btn');
        if (cand) {
            cand.addEventListener('click', (e) => {
                e.stopPropagation();
                openApplyModal(v);
            });
        }
    });
}

function filtrarVagas(tipo) {
    if (tipo === 'todos' || !tipo) {
        renderVagas(vagas);
        return;
    }
    const filtradas = vagas.filter(v => v.tipo.toLowerCase() === tipo.toLowerCase());
    renderVagas(filtradas);
}

// Inicialização ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    createCards();
    updateCarousel();

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Marca seleção única para elementos de classe .tipo
    document.querySelectorAll('.tipo').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.tipo').forEach(s => s.classList.remove('selected'));
            el.classList.add('selected');
        });
    });

    // Inicializa lista de vagas
    renderVagas(vagas);

    // Se existir a seção de intercâmbios na página, tenta carregar do JSON
    if (document.getElementById('lista-intercambios')) {
        loadIntercambiosFromJson('./intercambios.json');
    }

    // Inicializa abas (Mural / Para Estudantes)
    const tabButtons = document.querySelectorAll('.tab-button');
    function switchTab(targetId) {
        document.querySelectorAll('.tab-content').forEach(p => p.classList.add('hidden'));
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        const panel = document.getElementById(targetId);
        const btn = document.querySelector(`.tab-button[data-target="${targetId}"]`);
        if (panel) panel.classList.remove('hidden');
        if (btn) btn.classList.add('active');
    }
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.target));
    });

    // Renderiza vagas determinadas para estudante (pode ser filtrado conforme regra)
    // Aqui mostramos vagas do tipo Estágio e Emprego (todas as vagas atuais)
    const determinadas = vagas.filter(v => v.tipo.toLowerCase() === 'estágio' || v.tipo.toLowerCase() === 'emprego');
    renderVagasInto(determinadas, 'lista-determinadas');
    // garante painel inicial visível
    switchTab('mural-panel');

    // === Modal de candidatura ===
    const modal = document.getElementById('modal-apply');
    const modalTitle = document.getElementById('modal-title');
    const modalInfo = document.getElementById('modal-vaga-info');
    const fileInput = document.getElementById('applicant-files');
    const fileList = document.getElementById('file-list');
    const applyForm = document.getElementById('apply-form');
    const applyResult = document.getElementById('apply-result');
    let currentVacancy = null;

    function openApplyModal(vaga) {
        currentVacancy = vaga;
        if (!modal) return;
        modalTitle.textContent = `Candidatar-se: ${vaga.titulo}`;
        modalInfo.textContent = `${vaga.empresa} — ${vaga.tipo}`;
        applyResult.textContent = '';
        fileList.textContent = '';
        fileInput.value = null;
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeApplyModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        applyResult.textContent = '';
        currentVacancy = null;
        // reset form and reabilitar controles do formulário (mantendo botões de fechar ativos)
        if (applyForm) {
            applyForm.reset();
            applyForm.querySelectorAll('input, button:not(.modal-close)').forEach(i => i.disabled = false);
        }
        if (fileList) fileList.textContent = '';
    }

    // Expor função para uso nas vagas
    window.openApplyModal = openApplyModal;

    // Close buttons
    document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', () => closeApplyModal()));

    // Atualizar lista de arquivos selecionados
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            const files = Array.from(fileInput.files || []);
            if (files.length === 0) {
                fileList.textContent = '';
                return;
            }
            fileList.innerHTML = files.map(f => `<div>${f.name} (${Math.round(f.size/1024)} KB)</div>`).join('');
        });
    }

    // Submit simulado: não envia nada, apenas mostra mensagem
    if (applyForm) {
        applyForm.addEventListener('submit', (ev) => {
            ev.preventDefault();
            // coletar informações (apenas para exibição)
            const nome = document.getElementById('applicant-name')?.value || '';
            const email = document.getElementById('applicant-email')?.value || '';
            const files = Array.from(document.getElementById('applicant-files')?.files || []);

            // Desabilitar somente os campos do formulário e o botão de envio; manter botões de fechar ativos
            applyForm.querySelectorAll('input, button:not(.modal-close)').forEach(i => i.disabled = true);
            applyResult.textContent = 'Aguarde seu email';

            // Simular pequena espera (comportamento visual). Nada é enviado realmente.
            setTimeout(() => {
                applyResult.textContent = 'Aguarde seu email';
            }, 800);
        });
    }
});