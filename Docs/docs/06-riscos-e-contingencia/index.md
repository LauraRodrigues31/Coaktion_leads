---
sidebar_position: 1
---

# Riscos e Contingência

## Decisão resolvida: lockdown / modo kiosk

A contratante confirmou como o totem vai operar: sempre com alguém da
equipe de marketing por perto. O fluxo real é assistido de ponta a
ponta — a pessoa completa o formulário, vê a tela final onde escolhe
prêmios (há uma ativação de comida com 4 carrinhos, e a pessoa ganha um
voucher para escolher duas opções), e depois alguém da equipe aperta um
botão de "recomeçar", já existente no fluxo da própria LP, que volta
para a tela inicial para atender a próxima pessoa da fila.

Como o reset entre atendimentos é manual, acionado por humano, e o
totem nunca fica sozinho, **nenhum bloqueio de sistema é necessário** —
nem Fully Kiosk Browser, nem Device Owner/Lock Task mode. O totem roda
em modo normal do Chrome Android. Um fullscreen simples (Immersive
Mode, nativo e gratuito) é opcional, não obrigatório.

A foto abaixo é de um totem físico do mesmo formato/hardware, em
operação real, rodando **sem nenhum lockdown nem fullscreen** — a barra
de status do Android fica visível no topo. Ela é consistente com a
operação confirmada: esse tipo de solução funciona normalmente sem
nenhuma trava de sistema, desde que haja supervisão humana por perto,
como será o caso aqui.

![Totem de referência em operação, orientação retrato, barra de status do Android visível no topo — sem lockdown](/img/totem-exemplo.jpeg)

*Totem de referência (outro cliente/evento), mostrando o formato físico
retrato e a barra de status do Android visível — evidência de que a
solução roda hoje sem nenhuma trava de sistema.*

Essa decisão também simplifica a arquitetura: a Opção 1 (PWA + Dexie.js)
resolve o projeto sozinha, sem precisar de nenhuma camada extra de
lockdown. A Opção 2 (Capacitor) continua documentada e tecnicamente
disponível em [Arquitetura Técnica](/arquitetura-tecnica), mas não por
motivo de lockdown — só se a contratante preferir um app nativo
instalável por outras razões, agora ou em eventos futuros.

## Outros riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Wi-Fi não disponível no fim do evento para a sincronização final | Leads capturados ficam presos no totem | Botão de exportação manual em CSV para backup via pendrive, além do botão de "sincronizar agora" assim que houver conexão |
| Hardware ligado continuamente por ~2 dias de evento | Travamento, lentidão ou reinício inesperado do tablet perdendo estado da sessão | Persistência imediata de cada resposta no armazenamento local (Dexie/IndexedDB) e checagem de estabilidade nos testes em hardware físico antes do evento |
| Rebuild/reexport do código no Lovable depois que o service worker já estiver configurado | Nova versão da LP ir para o totem sem passar pela camada offline, quebrando o cache ou perdendo o ajuste offline | Processo definido de que todo novo build do Lovable passa pela camada de service worker antes de ir para o totem — não é uma simples recópia de arquivos |
| Cache do service worker desatualizado (bug comum em PWA sobre SPA React) | Totem mostrar tela antiga mesmo após atualização do código | Disciplina de versionamento de cache no service worker |
| Time do Lovable ainda ajustando o formulário final, sem ETA confirmado | Pode atrasar a integração da camada offline com o código definitivo | Ver detalhamento e plano de contingência em [Plano de Implementação e Cronograma](/plano-e-cronograma) |
