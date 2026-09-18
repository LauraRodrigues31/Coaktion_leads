---
sidebar_position: 1
slug: /estimativa-custo-horas
---

# Estimativa de Custo e Horas

Esta seção cobre o **custo técnico de ferramentas** usadas para
construir o projeto e o **valor do trabalho de desenvolvimento** (o
trabalho da Laura), fechado por escopo.

## Custo técnico (ferramentas)

- **[Claude Code](https://claude.com/pricing) Pro** — o assistente de
  IA usado para desenvolver a camada offline do projeto (PWA, Service
  Worker, Dexie.js, integração com Supabase). É vendido por assinatura
  mensal, sem opção de cobrança fracionada por dia ou por semana.
  - **Valor:** US$ 20/mês (cobrança mensal, sem plano anual neste caso).
  - Em reais, à cotação de referência de
    [setembro de 2026](https://dolarhoje.com/) (~R$5,15/US$1), isso
    equivale a aproximadamente **R$103** — valor sujeito a variar
    conforme a cotação do dia da cobrança e eventuais taxas de IOF/spread
    do cartão usado, já que a Anthropic cobra em dólar.
  - Como o projeto usa a ferramenta por aproximadamente 1 semana e meia
    (dentro do ciclo mensal da assinatura, que não é fracionável), o
    valor cobrado do cliente é o do mês cheio: **US$ 20 (~R$103)**.

## Valor do trabalho de desenvolvimento

O valor é fechado por escopo, não por hora — cobre integralmente tudo o
que está listado em [Escopo](/escopo) (v1): adaptação do React
existente para offline, camada PWA/Service Worker, armazenamento local
com Dexie.js, `totem_id` por totem, exportação CSV e testes em hardware
físico nos dois totens.

- **Valor:** R$2.800.
- Esse valor já incorpora o custo técnico do Claude Code descrito
  acima (~R$103), não é cobrado à parte.
- Qualquer item listado em ["Fica de fora desta primeira
  versão"](/escopo#fica-de-fora-desta-primeira-versão) (redesenho da
  LP, sincronização automática, empacotamento nativo, lockdown de tela,
  etc.) não está incluído neste valor e seria orçado separadamente, se
  solicitado.

## Total da proposta

**R$2.800**, fechado, cobrindo ferramentas e desenvolvimento conforme o
escopo definido.

## Referências

- [Claude — planos e preços](https://claude.com/pricing)
- [Cotação do dólar — dolarhoje.com](https://dolarhoje.com/)
