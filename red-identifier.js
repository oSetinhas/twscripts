(function() {
    'use strict';

    // --- CONFIGURAÇÃO ---
    const API_URL = "https://script.google.com/macros/s/AKfycbw6vk2qpZIAHi5utnlKlwzmsRUFo8NI1nb5oUqOQ1fjvRtP4CdGTvIFMoBVEYaNNLq4wA/exec";
    // --------------------

    let listaGlobalInfo = [];

    const css = `
        #kimmis-ui { position: fixed; width: 220px; background: #e3d5b3; border: 2px solid #7d510f; border-radius: 5px; z-index: 99999; box-shadow: 3px 3px 10px rgba(0,0,0,0.5); font-family: Verdana, Arial; font-size: 10px; }
        #kimmis-header { background: #a07337; color: white; padding: 5px; font-weight: bold; cursor: move; border-bottom: 1px solid #7d510f; display: flex; justify-content: space-between; }
        #kimmis-content { padding: 10px; text-align: center; }
        .kimmis-btn-min { cursor: pointer; font-weight: bold; border: 1px solid #fff; padding: 0 4px; background: #865e27; }
        .kimmis-status-ok { color: green; font-weight: bold; }
        .kimmis-status-loading { color: blue; }
        .tw-btn-report { margin-left: 5px; cursor: pointer; font-size: 9px !important; background: linear-gradient(to bottom, #ff6b6b, #870000); color: white; border: 1px solid #000; padding: 1px 4px; border-radius: 3px; }
        .tw-badge-fake { margin-left: 5px; font-size: 9px !important; background: #91ff91; border: 1px solid #008000; color: #005200; padding: 1px 4px; font-weight: bold; cursor: help; }
        .tw-warning-icon { font-size: 12px; margin-left: 5px; cursor: help; }
        .btn-massa-report { margin-left: 5px; background: linear-gradient(to bottom, #ff3333, #990000) !important; color: white !important; font-weight: bold !important; }
        .btn-massa-rename { margin-left: 5px; background: linear-gradient(to bottom, #33cc33, #006600) !important; color: white !important; font-weight: bold !important; }
    `;
    GM_addStyle(css);

    // --- UI ---
    function criarInterface() {
        if ($("#kimmis-ui").length > 0) return;
        let savedPos = JSON.parse(localStorage.getItem('kimmis_pos') || '{"top":"100px", "left":"50px"}');
        let isMin = localStorage.getItem('kimmis_min') === 'true';

        const html = `
        <div id="kimmis-ui" style="top:${savedPos.top}; left:${savedPos.left};">
            <div id="kimmis-header"><span>🛡️ Defesa Coletiva</span><span class="kimmis-btn-min">${isMin ? '+' : '_'}</span></div>
            <div id="kimmis-content" style="${isMin ? 'display:none;' : ''}">
                <div id="kimmis-status" class="kimmis-status-loading">A carregar...</div>
                <hr style="margin: 5px 0; border: 0; border-top: 1px solid #cba;">
                <div id="kimmis-stats">Fulls Detetados: <b>0</b></div>
                <br><button id="btn-force-sync" class="btn">🔄 Sincronizar</button>
            </div>
        </div>`;
        $("body").append(html);
        try { $("#kimmis-ui").draggable({ handle: "#kimmis-header", stop: function() { localStorage.setItem('kimmis_pos', JSON.stringify($(this).css(["top", "left"]))); } }); } catch(e) {}
        $(".kimmis-btn-min").click(function() { $("#kimmis-content").slideToggle(function() { localStorage.setItem('kimmis_min', !$(this).is(":visible")); $(".kimmis-btn-min").text($(this).is(":visible") ? '_' : '+'); }); });
        $("#btn-force-sync").click(function() { $("#kimmis-status").html("A Sincronizar...").addClass("kimmis-status-loading"); carregarCoordenadas(); });
    }

    // --- BOTÕES DE MASSA (Reportar & Renomear) ---
    function adicionarBotoesMassa() {
        const container = $("#incomings_form th[colspan]").last();
        if (container.length === 0) return;

        // Botão Reportar
        if ($(".btn-massa-report").length === 0) {
            const btnMassa = $(`<input type="button" class="btn btn-massa-report" value="Reportar Selecionados 🔴" />`);
            btnMassa.click(function(e) { e.preventDefault(); executarReportMassa(); });
            container.append(btnMassa);
        }

        // Botão Renomear Fakes 
        if ($(".btn-massa-rename").length === 0) {
            const btnRename = $(`<input type="button" class="btn btn-massa-rename" value="Renomear Fakes Identificados ✏️" />`);
            btnRename.click(function(e) { e.preventDefault(); executarRenomeacaoMassa(); });
            container.append(btnRename);
        }
    }

    // --- LÓGICA DE REPORTAR EM MASSA ---
    function executarReportMassa() {
        const checks = $('input[name^="id_"]:checked');
        if (checks.length === 0) { alert("Seleciona ataques primeiro!"); return; }
        if(!confirm(`Vais reportar ${checks.length} ataques como Fulls Reais.\n\nConfirmas?`)) return;

        let dadosParaEnviar = [];
        checks.each(function() {
            const row = $(this).closest('tr');
            const links = row.find("a").filter((i, el) => /\(\d+\|\d+\)/.test($(el).text()));
            if (links.length >= 2) {
                const dest = links[0].innerText.match(/(\d+\|\d+)/)[0];
                const origin = links[1].innerText.match(/(\d+\|\d+)/)[0];
                dadosParaEnviar.push({origin: origin, dest: dest});
            }
        });
        enviarListaSequencial(dadosParaEnviar);
    }

    function enviarListaSequencial(lista) {
        if (lista.length === 0) { alert("Concluído!"); return; }
        const item = lista.shift();
        const jogador = game_data.player.name;
        $("#kimmis-status").html(`A enviar ${item.origin}...`);

        GM_xmlhttpRequest({
            method: "POST", url: API_URL,
            data: JSON.stringify({ origin: item.origin, dest: item.dest, jogador: jogador, tipo: "Full Detetado (Massa)" }),
            headers: { "Content-Type": "application/json" },
            onload: function() {
                if(!listaGlobalInfo.find(i => i.origin === item.origin && i.dest === item.dest)) {
                    listaGlobalInfo.push({origin: item.origin, dest: item.dest, reporter: jogador});
                }
                processarTabela();
                setTimeout(() => enviarListaSequencial(lista), 200);
            },
            onerror: function() { setTimeout(() => enviarListaSequencial(lista), 200); }
        });
    }

    // --- LÓGICA DE RENOMEAR FAKES ---
    function executarRenomeacaoMassa() {
        // 1. Encontrar todas as linhas que têm a badge FAKE
        const linhasFakes = $("#incomings_table > tbody > tr").filter(function() {
            return $(this).find(".tw-badge-fake").length > 0;
        });

        if (linhasFakes.length === 0) {
            alert("Não há Fakes identificados nesta página para renomear.");
            return;
        }

        // 2. Filtrar os que JÁ têm "[Fake]" no nome para não repetir
        let linhasParaRenomear = [];
        linhasFakes.each(function() {
            const inputTexto = $(this).find(".quickedit-label").text();
            if (!inputTexto.toLowerCase().includes("fake")) {
                linhasParaRenomear.push($(this));
            }
        });

        if (linhasParaRenomear.length === 0) {
            alert("Todos os Fakes identificados já estão renomeados!");
            return;
        }

        if(!confirm(`O script vai renomear ${linhasParaRenomear.length} ataques.\n\n⚠️ IMPORTANTE:\nNão feches a página. O script vai processar 1 ataque a cada 300ms para evitar bloqueios.`)) return;

        processarFilaRenomeacao(linhasParaRenomear);
    }

    function processarFilaRenomeacao(lista) {
        if (lista.length === 0) {
            $("#kimmis-status").html("Renomeação concluída!");
            return;
        }

        const row = lista.shift(); // Pega a primeira linha
        
        // Simula os cliques do utilizador
        const renameIcon = row.find(".rename-icon");
        
        if(renameIcon.length > 0) {
            renameIcon.click(); // 1. Abre a edição
            
            setTimeout(() => {
                const input = row.find("input[type=text]");
                const btnOk = row.find("input[type=button]");
                
                if(input.length > 0 && btnOk.length > 0) {
                    // 2. Altera o texto (Mantém o original + [Fake])
                    let textoAtual = input.val();
                    if(!textoAtual.toLowerCase().includes("fake")) {
                        input.val(textoAtual + " [Fake]");
                        
                        // 3. Clica em OK
                        btnOk.click();
                        $("#kimmis-status").html(`A renomear... (${lista.length} falta)`);
                    } else {
                        // Se por algum motivo já tiver fake, fecha só (clica no icone de novo ou nada)
                        // Mas como filtramos antes, deve estar ok.
                    }
                }
                
                // 4. Chama o próximo com delay de segurança
                setTimeout(() => processarFilaRenomeacao(lista), 300); 
                
            }, 50); // Pequeno delay para a caixa de texto abrir
        } else {
            // Se falhar ao encontrar icone, passa ao proximo
            processarFilaRenomeacao(lista);
        }
    }


    // --- CORE ---
    function carregarCoordenadas() {
        GM_xmlhttpRequest({
            method: "GET", url: API_URL,
            onload: function(response) {
                try {
                    const listaInfos = JSON.parse(response.responseText);
                    listaGlobalInfo = listaInfos;
                    atualizarInterface(listaInfos.length);
                    processarTabela();
                } catch (e) { console.error(e); }
            }
        });
    }

    function atualizarInterface(qtd) {
        $("#kimmis-status").html("✅ Sincronizado").removeClass("kimmis-status-loading").addClass("kimmis-status-ok");
        $("#kimmis-stats").html(`Fulls Detetados: <span style="color:red; font-weight:bold">${qtd}</span>`);
    }

    function reportarCoordenada(origin, dest, elementoBotao) {
        const jogador = game_data.player.name;
        elementoBotao.innerText = "⏳";
        GM_xmlhttpRequest({
            method: "POST", url: API_URL,
            data: JSON.stringify({ origin: origin, dest: dest, jogador: jogador, tipo: "Full Detetado" }),
            headers: { "Content-Type": "application/json" },
            onload: function() {
                elementoBotao.innerText = "✅";
                $(elementoBotao).css("background", "green").prop("disabled", true);
                if(!listaGlobalInfo.find(i => i.origin === origin && i.dest === dest)) {
                    listaGlobalInfo.push({origin: origin, dest: dest, reporter: jogador});
                }
                setTimeout(() => { processarTabela(); }, 500);
            }
        });
    }

    function processarTabela() {
        const tabela = $("#incomings_table");
        if (tabela.length === 0) return;

        $("#incomings_table > tbody > tr").each(function(index) {
            if (index < 1) return;
            const row = $(this);
            const links = row.find("a").filter((i, el) => /\(\d+\|\d+\)/.test($(el).text()));
            if (links.length < 2) return;

            const linkDestino = $(links[0]);
            const linkOrigem = $(links[1]);

            const matchDest = linkDestino.text().match(/(\d+\|\d+)/);
            const matchOrig = linkOrigem.text().match(/(\d+\|\d+)/);
            if(!matchOrig || !matchDest) return;

            const currentDest = matchDest[0];
            const currentOrigin = matchOrig[0];

            // Limpeza
            row.find(".tw-btn-report").remove();
            row.find(".tw-badge-fake").remove();
            row.find(".tw-warning-icon").remove();

            // 1. Verificar ORIGEM
            const reportesDestaOrigem = listaGlobalInfo.filter(item => item.origin === currentOrigin);

            if (reportesDestaOrigem.length > 0) {
                linkOrigem.css("font-weight", "bold").css("color", "red");
                const reportadorOriginal = reportesDestaOrigem[0].reporter;

                if (row.find(".tw-warning-icon").length === 0) {
                    linkOrigem.after(` <span class="tw-warning-icon" title="Reportado por ${reportadorOriginal}">⚠️</span>`);
                }

                // 2. LÓGICA INTELIGENTE
                const ehAtaqueReal = reportesDestaOrigem.some(item => item.dest === currentDest);

                if (!ehAtaqueReal) {
                    if (row.find(".tw-badge-fake").length === 0) {
                        linkDestino.after('<span class="tw-badge-fake" title="Ataque da mesma origem com outro alvo">FAKE 🟢</span>');
                    }
                }

            } else {
                if (row.find(".tw-btn-report").length === 0) {
                    const btn = $(`<button class="tw-btn-report">Reportar 🔴</button>`);
                    btn.click(function(e) {
                        e.preventDefault();
                        if(confirm(`Confirmas que ${currentOrigin} está a mandar FULL para ${currentDest}?`)) {
                            reportarCoordenada(currentOrigin, currentDest, btn[0]);
                        }
                    });
                    linkOrigem.after(btn);
                }
            }
        });
    }

    $(document).ready(function() {
        criarInterface();
        carregarCoordenadas();
        setTimeout(adicionarBotoesMassa, 1000); // Nome da função atualizado
        setInterval(() => {
             if($("#incomings_table").length > 0) processarTabela();
             if($(".btn-massa-report").length === 0) adicionarBotoesMassa(); // Nome da função atualizado
        }, 2000);
    });

})();
