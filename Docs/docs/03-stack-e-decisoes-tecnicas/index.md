---
sidebar_position: 1
---

# Stack e Decisões Técnicas

Esta seção detalha as peças da stack (ver
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
  pessoa vê) — mesmo back-end já usado pela landing page online, e
  destino final dos leads depois do evento. O projeto Lovable já tem a
  integração pronta em `integrations/supabase` (`client.ts`,
  `client.server.ts`, `types.ts`), incluindo o schema da tabela de
  leads, usado como referência para o CSV exportado bater com as
  colunas certas na importação manual. **O totem em si não chama a API
  do Supabase** — por decisão de operação 100% offline (ver
  [Riscos e Contingência](/riscos-e-contingencia)), a única saída de
  dados é o CSV, então o `supabase-js` não entra no app do totem.
- **Armazenamento local:** [Dexie.js](https://dexie.org/docs/) — uma
  biblioteca que facilita usar o
  [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
  (um banco de dados que já vem embutido em qualquer navegador, usado
  para guardar informações direto no aparelho) — em vez de IndexedDB
  puro.
  **Por quê:** reduz boilerplate e risco de bug dado o prazo curto do
  projeto — Dexie já resolve várias arestas de API do IndexedDB puro que
  custariam tempo de debug que o prazo apertado não comporta.

## Saída de dados

- **Método único:** botão de exportação manual em CSV (um arquivo de
  planilha simples, que abre direto no Excel ou Google Sheets), com
  transferência física via pendrive para importação manual no Supabase
  ou em uma planilha depois do evento. O passo a passo completo —
  incluindo como o CSV sai da pasta Downloads do tablet até chegar num
  computador — está em
  [Como os dados saem do totem](/arquitetura-tecnica#como-os-dados-saem-do-totem).
  **Por quê:** a contratante confirmou preferência por operação 100%
  offline — nenhuma sincronização automática via Wi-Fi com o Supabase
  entra nesta versão. Isso também simplifica a stack: sem checagem de
  conectividade, sem lógica de retry, sem estado de "pendente vs.
  sincronizado" para gerenciar.

## Identificação por totem

- Cada totem tem um `totem_id` fixo, configurado na instalação.
  **Por quê:** rastrear a origem de cada lead e evitar ambiguidade na
  hora de juntar os CSVs exportados dos dois totens.

## Reset entre atendimentos

O reset entre uma pessoa e a próxima **não é implementado por este
projeto**. A contratante confirmou que o totem sempre terá alguém da
equipe de marketing por perto: a pessoa completa o formulário, vê a
tela final de prêmios, e a equipe aperta um botão de "recomeçar" já
existente no fluxo da LP, que volta para a tela inicial. É reset manual,
acionado por humano, coberto pelo próprio time de design — não algo
que precisa ser construído aqui (ver decisão em
[Riscos e Contingência](/riscos-e-contingencia)).

## Referências

- [Service Worker API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA (Progressive Web Apps) — MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Supabase — documentação oficial](https://supabase.com/docs)
- [Dexie.js — documentação oficial](https://dexie.org/docs/)
- [IndexedDB API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
