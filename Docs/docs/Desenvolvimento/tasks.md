# Tasks — Coaktion Conarec 2026 (totem offline)

Checklist de execução. Complementa a proposta em [Docs](../01-visao-geral/index.md) (que é a
versão pra contratante) — aqui é técnico e vai ficando marcado conforme a
tarefa é feita. Conforme cada task avança, documentar decisões/aprendizados
direto embaixo dela (ou num arquivo novo aqui em `Desenvolvimento/`, linkado
daqui).

Convenção: `[ ]` a fazer, `[x]` feito. Tamanho aproximado entre parênteses
(P/M/G) só como referência de fôlego pra encaixar na rotina, sem compromisso.

## 0. Descobertas técnicas a validar antes de codar (bloqueantes de decisão, não de código)

Duas coisas que vi lendo o código atual e que não estão resolvidas na
proposta — não decidi nada, só documentei o que achei:

- [ ] **Geração do `ticket_code` é hoje 100% server-side.** O submit atual
  chama `supabase.rpc("submit_experience", payload)` (ver
  [index.tsx:142](https://github.com/LauraRodrigues31/Coaktion_leads/blob/main/Lovable_Coaktion/src/routes/index.tsx#L142)), que roda
  no Postgres (`submit_experience` em
  [20260909183811_...sql](https://github.com/LauraRodrigues31/Coaktion_leads/blob/main/Lovable_Coaktion/supabase/migrations/20260909183811_441a55fb-61a9-4e4b-84ef-3d49c86d8e36.sql#L73)),
  gera o código via `next_ticket_code()` e insere direto na tabela `leads`.
  Offline, isso não pode chamar Postgres — o código do ticket precisa ser
  gerado no próprio tablet. Decisão a tomar: formato do código local (ex:
  `totem_id` + contador local, ou `totem_id` + timestamp) que não colida
  entre os dois totens.
- [ ] **Retirada de mimo (`redeem_ticket` / painel `/admin`) hoje depende do
  lead já estar no banco de dados do Lovable.** Ver
  [admin.tsx:136-150](https://github.com/LauraRodrigues31/Coaktion_leads/blob/main/Lovable_Coaktion/src/routes/admin.tsx#L136-L150) —
  a equipe digita o `ticket_code` no painel e ele busca na tabela `leads` do
  banco do Lovable. Mas, no fluxo offline, o lead só chega nesse banco depois do
  evento (import manual do CSV) — ver
  [Como os dados saem do totem](../02-arquitetura-tecnica/index.md#como-os-dados-saem-do-totem).
  **Pergunta que falta responder com a contratante:** a retirada do
  mimo/voucher nos carrinhos de comida acontece *durante* o evento? Se sim,
  como isso é validado sem rede — visualmente (a pessoa mostra a tela do
  ticket) ou precisa de alguma lista/checagem que o painel atual não cobre
  nesse cenário? Isso não está no escopo fechado (R$2.800 cobre só a camada
  offline do totem) — mas se a resposta for "precisa validar digitalmente
  durante o evento", é um requisito novo que muda a arquitetura e provavelmente
  o valor.

## Fase 1 — sem totem em mãos

### 1. Setup (P)

- [ ] Confirmar acesso ao repo/export atual do Lovable (já em
  [Lovable_Coaktion/](https://github.com/LauraRodrigues31/Coaktion_leads/tree/main/Lovable_Coaktion)).
- [ ] Rodar local (`bun install`, dev server) e validar que o fluxo atual
  (online, contra Supabase) funciona ponta a ponta com dados de teste.
- [ ] Revisar schema completo da tabela `leads` em
  [types.ts](https://github.com/LauraRodrigues31/Coaktion_leads/blob/main/Lovable_Coaktion/src/integrations/supabase/types.ts) — vai
  virar a base do schema Dexie no passo 3.

### 2. Shell PWA (M)

- [ ] Adicionar `manifest.json` (nome, ícones, `display: standalone`,
  orientação `portrait`).
- [ ] Registrar service worker (`vite-plugin-pwa` resolve rápido) fazendo
  cache dos assets estáticos (JS/CSS/imagens) pra carregar sem rede.
- [ ] Definir disciplina de versionamento de cache desde já (nome do cache
  com hash/versão do build) — é o bug mais comum de PWA sobre SPA React
  (cache velho servindo tela desatualizada), já mapeado em
  [Riscos e Contingência](../06-riscos-e-contingencia/index.md).
- [ ] Testar: abrir o app, desligar a rede (DevTools → offline), recarregar
  — tem que continuar funcionando.

### 3. Schema Dexie (M)

- [ ] Criar schema Dexie espelhando a tabela `leads` (campos em
  [types.ts:73-99](https://github.com/LauraRodrigues31/Coaktion_leads/blob/main/Lovable_Coaktion/src/integrations/supabase/types.ts#L73-L99)):
  `nome`, `empresa`, `cargo`, `email`, `telefone`, `consent`, `score_aktie`,
  `score_kompelys`, `empresa_principal`, `empresa_secundaria`,
  `dor_principal`, `dor_secundaria`, `perguntas_aktie_respondidas`,
  `perguntas_kompelys_respondidas`, `qualificacao`, `perfil_slug`,
  `perfil_titulo`, `respostas` (json), `ticket_code`, `ticket_status`,
  `created_at` — **mais `totem_id`**, que não existe na tabela online hoje
  e é novo, só do totem.
- [ ] Implementar geração local do `ticket_code` (depende da decisão do
  item 0).
- [ ] Hook/função `saveLeadLocal(payload)` equivalente ao que
  `submit_experience` faz hoje no Postgres, mas gravando no Dexie.

### 4. Ligar o formulário ao Dexie (M)

- [ ] Em [index.tsx](https://github.com/LauraRodrigues31/Coaktion_leads/blob/main/Lovable_Coaktion/src/routes/index.tsx), trocar a
  chamada `supabase.rpc("submit_experience", ...)` (linha 142) por
  `saveLeadLocal(payload)`.
- [ ] Manter o mesmo contrato de retorno (`{ ticket_code }`) que a tela de
  ticket (`TicketScreen`) já espera, pra não precisar tocar na UI.
- [ ] Confirmar que o botão "recomeçar" (reset entre atendimentos, já
  existente) continua funcionando igual — ele é local ao componente, não
  deve precisar mudar.

### 5. `totem_id` por instalação (P)

- [ ] Definir onde fica configurado (env var no build, ou tela simples de
  setup na primeira abertura).
- [ ] Incluir `totem_id` em cada registro salvo no Dexie.

### 6. Exportação CSV (M)

- [ ] Botão de exportação — mesmo padrão de "aperta e segura ~1,5s" do botão
  de recomeçar, fora do fluxo visível do visitante (ver
  [Arquitetura Técnica](../02-arquitetura-tecnica/index.md#1-gerar-o-arquivo-csv-no-totem)).
  Ao acionar: lê tudo do Dexie daquele totem, monta CSV com colunas
  equivalentes à tabela `leads` + `totem_id`, salva em Downloads (comportamento
  padrão do Chrome Android).
- [ ] Nome do arquivo: `leads_<totem_id>_<data>.csv`.

### 7. Teste com dados fake (P)

- [ ] Simular captura + export com dados de teste, sem depender do build
  final do Lovable (que ainda vai ser redimensionado pelo design — avisam
  quando estiver pronto). Confirmar que a camada de captura/persistência não
  quebra quando o build definitivo entrar depois.

## Fase 2 — com totem em mãos (só quando o hardware chegar)

### 8. Primeira instalação real (P)

- [ ] Instalar o PWA nos 2 totens.
- [ ] Validar orientação/resolução no hardware físico (aqui sim é onde o
  redimensionamento do design importa de verdade).
- [ ] Rodar primeiro teste ponta a ponta (captura offline + export CSV) em
  cada totem.

### 9. Endurance e ajustes (G)

- [ ] Simular uso contínuo por período prolongado, visando as ~48h do
  evento — checar travamento/lentidão/reinício do tablet (risco já mapeado).
- [ ] Corrigir bugs que só aparecem em hardware real.
- [ ] Revalidar o fluxo de reset manual pela equipe de marketing.
- [ ] Confirmar com a contratante que os 2 totens têm porta USB acessível
  (USB-C ou micro-USB) pra tirar o CSV — risco já mapeado, ainda sem
  confirmação.

### 10. Ensaio final (M)

- [ ] Simulação completa do fluxo de 2 dias: captura, resets manuais,
  exportação CSV, transferência física (pendrive/cabo USB) ponta a ponta nos
  dois totens.
- [ ] Handoff pra equipe de marketing: como exportar, como resetar, como
  tirar o pendrive.
