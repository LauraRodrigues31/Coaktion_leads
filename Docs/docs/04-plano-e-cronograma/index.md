---
sidebar_position: 1
---

# Plano de Implementação e Cronograma

O prazo total é de 6 dias até o evento, incluindo tempo de teste no
hardware físico dos totens. O cronograma separa o que dá para fazer sem
os totens em mãos (setup do PWA, Dexie, integração com o Supabase usando
dados de teste) do que só dá para validar no hardware real — assim o
trabalho começa mesmo antes dos tablets chegarem.

> O corte exato entre "Fase 1" e "Fase 2" abaixo assume que os totens
> físicos estarão disponíveis a partir do dia 4. Ajusta os dias conforme
> a data real de entrega dos tablets.

## Fase 1 — sem hardware em mãos

**Dia 1 — Acesso e levantamento**
Confirmar acesso ao repositório/export do código React do Lovable,
revisar o schema da tabela de leads em `integrations/supabase/types.ts`,
e montar o ambiente de desenvolvimento local reproduzindo o formulário
existente.

**Dia 2 — Camada offline**
Implementar o Service Worker (cache dos assets estáticos) e o schema
Dexie.js espelhando a tabela de leads. Testar captura e persistência
local com dados de teste, sem depender do build final do Lovable.

**Dia 3 — Sincronização**
Implementar a sincronização em lote com o Supabase ao detectar conexão,
o botão manual de "sincronizar agora", a exportação em CSV, e a
configuração de `totem_id` por instalação. Testar contra o Supabase com
dados de teste.

## Fase 2 — com hardware em mãos

**Dia 4 — Primeira instalação nos totens reais**
Validar orientação e resolução no hardware físico, instalar o PWA nos
dois totens, e rodar o primeiro teste ponta a ponta (captura offline +
sincronização) em cada um.

**Dia 5 — Endurance e ajustes**
Simular uso contínuo por período prolongado, visando a resistência das
~48h do evento, e corrigir bugs que só aparecem em hardware real.
Revalidar o fluxo de reset manual pela equipe de marketing (botão
"recomeçar" da própria LP).

**Dia 6 — Ensaio final**
Simulação completa do fluxo de 2 dias de evento: captura, resets
manuais, sincronização final. Checklist de contingência (exportação
CSV testada, botão de sincronização manual testado) e handoff para a
equipe de marketing sobre como usar esses dois recursos.

## Risco de cronograma

O time do Lovable ainda está ajustando o formulário final, sem ETA
confirmado. Isso pode fazer a Fase 1 rodar com dados de teste em vez do
build definitivo do formulário. Se o build final atrasar, a prioridade
vai para ter a camada de captura e persistência funcionando — que não
muda com o layout final — integrando o build definitivo assim que ele
chegar, mesmo que isso empurre trabalho para dentro da Fase 2. Ver
também [Riscos e Contingência](/riscos-e-contingencia).
