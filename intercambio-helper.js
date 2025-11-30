// Helper para carregar e renderizar intercâmbios sem modificar `script.js`
(function(){
    window.loadIntercambiosFromJson = async function(path) {
        try {
            const res = await fetch(path);
            if (!res.ok) throw new Error('Falha ao carregar ' + path);
            const data = await res.json();
            window._intercambiosData = data;
            renderIntercambios(data);
            attachIntercambioFilters();
        } catch (err) {
            console.error(err);
            const container = document.getElementById('lista-intercambios');
            if (container) container.textContent = 'Erro ao carregar intercâmbios.';
        }
    };

    function renderIntercambios(list) {
        const container = document.getElementById('lista-intercambios');
        if (!container) return;
        container.innerHTML = '';
        if (!list || list.length === 0) {
            container.textContent = 'Nenhum intercâmbio encontrado.';
            return;
        }
        list.forEach(i => {
            const el = document.createElement('div');
            el.className = 'vaga-card intercambio-card';
            const requisitosHTML = (i.requisitos || []).map(r => `<li>${r}</li>`).join('');
            el.innerHTML = `
                <h3>${i.titulo}</h3>
                <p class="font">${i.instituicao} ${i.pais ? '— <strong>' + i.pais + '</strong>' : ''}</p>
                <p class="font">${i.descricao}</p>
                <div class="vaga-actions"><button class="detalhes-btn">Opções</button></div>
                <div class="vaga-details">
                    <p class="font"><strong>Requisitos:</strong></p>
                    <ul class="font">${requisitosHTML}</ul>
                    <p class="font"><strong>Descrição completa:</strong> ${i.descricao}</p>
                    <div style="margin-top:8px; display:flex; gap:8px; align-items:flex-start;">
                        <button class="nesp-btn">Marcar horário com NESP</button>
                        <button class="docs-btn">Ver documentação</button>
                    </div>
                    <div class="docs-list hidden" style="margin-top:8px;"></div>
                </div>`;
            container.appendChild(el);

            // Toggle detalhes
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

            // Botão NESP — abre modal de agendamento quando existir
            const nespBtn = el.querySelector('.nesp-btn');
            if (nespBtn) {
                nespBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const modal = document.getElementById('modal-nesp');
                    const title = document.getElementById('nesp-title');
                    const info = document.getElementById('nesp-info');
                    if (title) title.textContent = `Marcar horário - ${i.titulo}`;
                    if (info) info.textContent = `Solicitação de agendamento para ${i.titulo} (${i.instituicao}). Preencha seus dados para solicitar horário com o NESP.`;
                    if (modal) { modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); }
                });
            }

            // Botão Ver documentação — expande uma lista de documentos padrão
            const docsBtn = el.querySelector('.docs-btn');
            const docsListEl = el.querySelector('.docs-list');
            if (docsBtn && docsListEl) {
                docsBtn.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    const docs = i.documentos || [];
                    if (docs.length === 0) {
                        docsListEl.textContent = 'Nenhum documento listado.';
                    } else {
                        docsListEl.innerHTML = '<ul class="font">' + docs.map(d => `<li>${d}</li>`).join('') + '</ul>';
                    }
                    docsListEl.classList.toggle('hidden');
                });
            }
        });
    }

    function attachIntercambioFilters() {
        const tipoButtons = document.querySelectorAll('#lista-intercambios ~ .tipo-container .tipo[data-tipo], #lista-intercambios .tipo[data-tipo]');
        // fallback: select any tipo with data-tipo in the page
        const fallback = document.querySelectorAll('.tipo[data-tipo]');
        const buttons = tipoButtons.length ? tipoButtons : fallback;
        buttons.forEach(b => {
            b.addEventListener('click', () => {
                const tipo = b.dataset.tipo || b.getAttribute('data-tipo') || 'todos';
                filterIntercambios(tipo);
            });
        });
    }

    function filterIntercambios(tipo) {
        const all = window._intercambiosData || [];
        if (!tipo || tipo === 'todos') return renderIntercambios(all);
        const filtered = all.filter(i => (i.tipo || '').toLowerCase() === tipo.toLowerCase());
        renderIntercambios(filtered);
    }

})();
