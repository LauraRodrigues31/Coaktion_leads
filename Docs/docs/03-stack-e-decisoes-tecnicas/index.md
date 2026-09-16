---
sidebar_position: 1
---

# Stack e Decisões Técnicas

Esta seção detalha as peças da stack recomendada (Opção 1 — PWA, ver
[Arquitetura Técnica](/arquitetura-tecnica)) e o porquê de cada escolha.

## Hardware e sistema operacional

- **Totens:** 2 unidades, orientação retrato.
- **SO:** Android 14.
- **Navegador:** Google Chrome padrão do Android — não é um app nativo
  do fabricante do hardware.

Isso descarta qualquer abordagem baseada em Windows ou em flags de
Chrome desktop (como `--kiosk`, que não existe na versão Android do
Chrome): a solução inteira roda dentro do navegador mobile.

## Frontend

- **Base de código:** o React existente da landing page, feito no
  Lovable e entregue pronto pelo time de design/marketing, já ajustado
  para a resolução do totem. Não é um app novo escrito do zero — é o
  mesmo formulário, adaptado para funcionar offline.
- **Camada offline:** [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
  (um script que roda em segundo plano no navegador e guarda os
  arquivos do site no aparelho) cacheando os assets estáticos (JS, CSS,
  imagens) para o app carregar e funcionar sem rede — a base técnica de
  qualquer [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
  (Progressive Web App — um site que se comporta como um aplicativo
  instalado, inclusive offline).

## Backend / dados

- **Backend:** [Supabase](https://supabase.com/docs) (o banco de dados
  na nuvem que guarda e processa os dados por trás da tela que a
  pessoa vê) — mesmo back-end já usado pela landing page online. O
  projeto Lovable já tem a integração pronta em `integrations/supabase`
  (`client.ts`, `client.server.ts`, `types.ts`), incluindo o schema da
  tabela de leads. Sincronização feita via
  [supabase-js](https://supabase.com/docs/reference/javascript/introduction)
  (a biblioteca oficial para o código conversar com o Supabase).
- **Armazenamento local:** [Dexie.js](https://dexie.org/docs/) — uma
  biblioteca que facilita usar o
  [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
  (um banco de dados que já vem embutido em qualquer navegador, usado
  para guardar informações direto no aparelho) — em vez de IndexedDB
  puro.
  **Por quê:** reduz boilerplate e risco de bug dado o prazo curto do
  projeto — Dexie já resolve várias arestas de API do IndexedDB puro que
  custariam tempo de debug que o prazo apertado não comporta.

## Sincronização

- **Modo:** envio em lote (batch) para o Supabase quando o totem
  detectar conexão — o evento não é em tempo real, já que a
  sincronização só precisa acontecer no fim do evento (2 dias), quando
  o totem pegar Wi-Fi.
- **Fallback manual:** botão de "sincronizar agora" na interface.
  **Por quê:** o evento `online` do navegador não é 100% confiável
  sozinho para detectar conectividade real (pode disparar com Wi-Fi
  conectado mas sem internet de fato, por exemplo).
- **Rede de segurança adicional:** botão de exportação manual em CSV
  (um arquivo de planilha simples, que abre direto no Excel ou Google
  Sheets), para backup via pendrive caso algo dê errado antes da
  sincronização final.

## Identificação por totem

- Cada totem tem um `totem_id` fixo, configurado na instalação.
  **Por quê:** rastrear a origem de cada lead e evitar conflito de dados
  ao sincronizar os dois totens com a mesma tabela no Supabase.

## Reset entre atendimentos

O reset entre uma pessoa e a próxima **não é implementado por este
projeto**. A contratante confirmou que o totem sempre terá alguém da
equipe de marketing por perto: a pessoa completa o formulário, vê a
tela final de prêmios, e a equipe aperta um botão de "recomeçar" já
existente no fluxo da LP, que volta para a tela inicial. É reset manual,
acionado por humano, coberto pelo próprio time de design — não algo
que precisa ser construído aqui (ver decisão em
[Riscos e Contingência](/riscos-e-contingencia)).

## Stack alternativa (Opção 2 — Capacitor)

A Opção 1 (PWA + Dexie.js) já resolve o projeto sem necessidade de
lockdown de sistema, já que o totem sempre terá supervisão humana (ver
[Riscos e Contingência](/riscos-e-contingencia)). A Opção 2 continua
disponível como alternativa caso a contratante prefira, agora ou em
eventos futuros, um app nativo instalável em vez de um PWA — por
exemplo por querer ícone na tela ou gerenciar o tablet como dispositivo
dedicado. Nesse caso, a stack muda para:

- **Empacotamento:** [Capacitor](https://capacitorjs.com/docs) (uma
  ferramenta que empacota um site em React como app Android instalável),
  gerando um `.apk` (o formato de arquivo instalável de aplicativos
  Android) a partir do mesmo código React.
- **Armazenamento local:** SQLite (um banco de dados local usado dentro
  de apps nativos), via o plugin
  [capacitor-community/sqlite](https://github.com/capacitor-community/sqlite),
  em vez de Dexie/IndexedDB.
- **Sincronização:** em background, quando detectar internet.
- **Lockdown (se necessário no futuro):** trava o tablet em modo totem,
  sem acesso a mais nada, via
  [Android Device Owner / Lock Task mode](https://developer.android.com/work/dpc/dedicated-devices/lock-task-mode),
  ou [Fully Kiosk Browser](https://www.fully-kiosk.com/en/) como
  alternativa de terceiros licenciada.

Detalhes de esforço e trade-offs dessa alternativa estão no comparativo
da seção [Arquitetura Técnica](/arquitetura-tecnica).

## Referências

- [Service Worker API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA (Progressive Web Apps) — MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Supabase — documentação oficial](https://supabase.com/docs)
- [supabase-js — referência da API](https://supabase.com/docs/reference/javascript/introduction)
- [Dexie.js — documentação oficial](https://dexie.org/docs/)
- [IndexedDB API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Capacitor — documentação oficial](https://capacitorjs.com/docs)
- [capacitor-community/sqlite — plugin de SQLite para Capacitor](https://github.com/capacitor-community/sqlite)
- [Android Device Owner / Lock Task mode — developer.android.com](https://developer.android.com/work/dpc/dedicated-devices/lock-task-mode)
- [Fully Kiosk Browser — site oficial](https://www.fully-kiosk.com/en/)
