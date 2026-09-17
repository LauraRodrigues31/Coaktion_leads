---
sidebar_position: 1
---

# Plano de Implementação e Cronograma

O compromisso é com o prazo final combinado com a contratante — não com
marcos internos fixos por dia. Algumas etapas abaixo podem ser resolvidas
em poucas horas, outras exigem mais tempo dependendo de imprevistos (por
exemplo, atraso no build final do Lovable — ver
[Risco de cronograma](#risco-de-cronograma) abaixo). O trabalho é
organizado em duas fases, não em dias marcados: o que dá para fazer sem
os totens em mãos, e o que só dá para validar no hardware físico. Isso
permite começar antes mesmo dos tablets chegarem.

A transição da Fase 1 para a Fase 2 depende da data real de entrega dos
totens físicos pela contratante, não de um número fixo de dias contado a
partir do início do projeto.

## Fase 1 — sem hardware em mãos

- **Acesso e levantamento:** confirmar acesso ao repositório/export do
  código React do Lovable, revisar o schema da tabela de leads em
  `integrations/supabase/types.ts`, e montar o ambiente de
  desenvolvimento local reproduzindo o formulário existente.
- **Camada offline:** implementar o
  [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
  (script que guarda os arquivos do site no próprio tablet, para abrir
  sem rede — cache dos assets estáticos) e o schema
  [Dexie.js](https://dexie.org/docs/) (forma de guardar os dados de
  cada lead direto no tablet) espelhando a tabela de leads. Testar
  captura e persistência local com dados de teste, sem depender do
  build final do Lovable.
- **Saída de dados:** implementar a exportação em CSV (arquivo de
  planilha que abre direto no Excel/Google Sheets) e a configuração de
  `totem_id` por instalação. Sem sincronização automática via rede
  nesta versão (operação 100% offline — ver
  [Riscos e Contingência](/riscos-e-contingencia)), essa etapa fica bem
  mais simples do que uma integração de sync: é só testar que o CSV sai
  com os dados certos.

## Fase 2 — com hardware em mãos

- **Primeira instalação nos totens reais:** validar orientação e
  resolução no hardware físico, instalar o
  [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
  (o app web que roda offline) nos dois totens, e rodar o primeiro
  teste ponta a ponta (captura offline + exportação CSV) em cada um.
- **Endurance e ajustes:** simular uso contínuo por período prolongado,
  visando a resistência das ~48h do evento, e corrigir bugs que só
  aparecem em hardware real. Revalidar o fluxo de reset manual pela
  equipe de marketing (botão "recomeçar" da própria LP).
- **Ensaio final:** simulação completa do fluxo de 2 dias de evento:
  captura, resets manuais, exportação CSV e transferência física
  (pendrive/cabo USB) testadas ponta a ponta, e handoff para a equipe
  de marketing sobre como usar esses recursos.

## Risco de cronograma

O time do Lovable ainda está ajustando o formulário final, sem ETA
confirmado. Isso pode fazer a Fase 1 rodar com dados de teste em vez do
build definitivo do formulário. Se o build final atrasar, a prioridade
vai para ter a camada de captura e persistência funcionando — que não
muda com o layout final — integrando o build definitivo assim que ele
chegar, mesmo que isso empurre trabalho para dentro da Fase 2. Ver
também [Riscos e Contingência](/riscos-e-contingencia).

## Referências

- [Service Worker API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA (Progressive Web Apps) — MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Dexie.js — documentação oficial](https://dexie.org/docs/)
- [Supabase — documentação oficial](https://supabase.com/docs)
