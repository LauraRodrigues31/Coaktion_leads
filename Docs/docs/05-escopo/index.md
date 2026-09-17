---
sidebar_position: 1
---

# Escopo

## Entra nesta primeira versão

- Adaptar o código React já pronto da landing page (Lovable +
  [Supabase](https://supabase.com/docs), o banco de dados na nuvem que
  já guarda os dados da LP online hoje) para funcionar offline — **não**
  é uma reconstrução do formulário do zero, é reaproveitamento do que o
  time de design/marketing entrega.
- Camada [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
  (um site que se comporta como um app instalado, funcionando mesmo sem
  internet): [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
  (script que guarda os arquivos do site no aparelho) fazendo cache dos
  assets estáticos para o totem carregar e funcionar sem rede.
- Armazenamento local imediato de cada resposta com
  [Dexie.js](https://dexie.org/docs/) (uma forma de guardar os dados
  direto no tablet), para não depender de conexão durante o evento e
  não perder nenhum lead.
- Configuração de `totem_id` fixo em cada um dos 2 totens, para
  rastrear a origem do lead e evitar ambiguidade na hora de juntar os
  CSVs exportados dos dois totens.
- Botão de exportação manual em CSV (arquivo de planilha simples, que
  abre direto no Excel ou Google Sheets) como **método único** de tirar
  os leads do totem, para transferência física (pendrive ou cabo USB) e
  importação manual no Supabase ou em uma planilha depois do evento.
- Testes no hardware físico dos dois totens antes do evento.

Não entram configuração de lockdown de tela (travar o tablet em modo
totem, sem acesso a mais nada, via
[Fully Kiosk Browser](https://www.fully-kiosk.com/en/), por exemplo)
nem reset automático por inatividade: a contratante confirmou que o
totem sempre terá supervisão humana, com reset manual já coberto pelo
próprio fluxo da LP. Ver [Riscos e Contingência](/riscos-e-contingencia).

## Fica de fora desta primeira versão

- Redesenho da landing page ou do formulário — o layout, os textos das
  perguntas e o design final são entregues prontos pelo time de
  design/marketing; o projeto aqui é só sobre fazer esse código
  funcionar offline.
- Qualquer sincronização automática via rede com o Supabase (em tempo
  real, via dados móveis ou via Wi-Fi ao final do evento) — a equipe de
  marketing confirmou preferência por operação 100% offline. A saída de
  dados é sempre manual: exportação CSV + transferência física. Ver
  [Riscos e Contingência](/riscos-e-contingencia).
- Empacotamento nativo (app instalável via loja ou `.apk`) — a
  contratante confirmou a abordagem 100% PWA; empacotamento nativo não
  faz parte desta proposta.

## Trabalhos futuros / expansão para próximos eventos

Itens que surgiram na conversa mas não foram pedidos explicitamente
pela contratante para esta v1. Ficam registrados aqui como possíveis
iterações futuras, não como escopo ativo:

- **Dashboard de acompanhamento pós-evento** — visualização dos leads
  capturados e da performance de cada totem, além da tabela crua no
  Supabase.
- **Deduplicação de leads entre os dois totens** além do que o
  `totem_id` já resolve (rastreio de origem) — ex: identificar a mesma
  pessoa cadastrada duas vezes em totens diferentes.
- **Distribuição via loja de apps** (Google Play) — só seria relevante
  se o projeto migrasse de PWA para um app nativo empacotado, o que não
  está no radar desta proposta.

**Regra geral para o restante da documentação:** qualquer item que não
foi pedido explicitamente pela contratante entra aqui, não no escopo
ativo da v1.

## Referências

- [PWA (Progressive Web Apps) — MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Service Worker API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Dexie.js — documentação oficial](https://dexie.org/docs/)
- [Supabase — documentação oficial](https://supabase.com/docs)
- [Fully Kiosk Browser — site oficial](https://www.fully-kiosk.com/en/)
