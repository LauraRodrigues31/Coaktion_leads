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
- **Camada offline:** Service Worker cacheando os assets estáticos
  (JS, CSS, imagens) para o app carregar e funcionar sem rede.

## Backend / dados

- **Backend:** Supabase — mesmo backend já usado pela landing page
  online. O projeto Lovable já tem a integração pronta em
  `integrations/supabase` (`client.ts`, `client.server.ts`, `types.ts`),
  incluindo o schema da tabela de leads.
- **Armazenamento local:** [Dexie.js](https://dexie.org/) (wrapper sobre
  IndexedDB) em vez de IndexedDB puro.
  **Por quê:** reduz boilerplate e risco de bug dado o prazo curto do
  projeto — Dexie já resolve várias arestas de API do IndexedDB puro que
  custariam tempo de debug que não sobra em 6 dias.

## Sincronização

- **Modo:** envio em lote (batch) para o Supabase quando o totem
  detectar conexão — o evento não é em tempo real, já que a
  sincronização só precisa acontecer no fim do evento (2 dias), quando
  o totem pegar Wi-Fi.
- **Fallback manual:** botão de "sincronizar agora" na interface.
  **Por quê:** o evento `online` do navegador não é 100% confiável
  sozinho para detectar conectividade real (pode disparar com Wi-Fi
  conectado mas sem internet de fato, por exemplo).
- **Rede de segurança adicional:** botão de exportação manual em CSV,
  para backup via pendrive caso algo dê errado antes da sincronização
  final.

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

- **Empacotamento:** [Capacitor](https://capacitorjs.com/), gerando um
  `.apk` instalável a partir do mesmo código React.
- **Armazenamento local:** SQLite em vez de Dexie/IndexedDB.
- **Sincronização:** em background, quando detectar internet.

Detalhes de esforço e trade-offs dessa alternativa estão no comparativo
da seção [Arquitetura Técnica](/arquitetura-tecnica).
