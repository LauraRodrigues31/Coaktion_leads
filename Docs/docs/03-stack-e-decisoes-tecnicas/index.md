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

- O formulário recarrega automaticamente após alguns segundos de
  inatividade, voltando ao estado inicial para a próxima pessoa.
  **Por quê:** garante um reset consistente entre atendimentos
  independentemente de qualquer decisão de lockdown do sistema (ver
  árvore de decisão em [Riscos e Contingência](/riscos-e-contingencia)).

## Stack alternativa (Opção 2 — Capacitor)

Caso a decisão de lockdown exija Device Owner + Lock Task mode (ver
[Riscos e Contingência](/riscos-e-contingencia)), a stack muda para:

- **Empacotamento:** [Capacitor](https://capacitorjs.com/), gerando um
  `.apk` instalável a partir do mesmo código React.
- **Armazenamento local:** SQLite em vez de Dexie/IndexedDB.
- **Sincronização:** em background, quando detectar internet.

Detalhes de esforço e trade-offs dessa alternativa estão no comparativo
da seção [Arquitetura Técnica](/arquitetura-tecnica).
