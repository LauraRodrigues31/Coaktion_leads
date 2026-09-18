# Tasks — Coaktion Conarec 2026 (totem offline)

Checklist de execução. Complementa a proposta em [Proposta e Escopo](/) (que é a
versão pra contratante) — aqui é técnico e vai ficando marcado conforme a
tarefa é feita. Conforme cada task avança, documentar decisões/aprendizados
direto embaixo dela (ou num arquivo novo aqui em `Desenvolvimento/`, linkado
daqui).

Convenção: `[ ]` a fazer, `[x]` feito. Tamanho aproximado entre parênteses
(P/M/G) só como referência de fôlego pra encaixar na rotina, sem compromisso.

## 0. Decisões tomadas antes de codar

- [x] **Retirada do mimo/voucher: resolvido, sem validação digital.** Ao
  terminar o formulário, a pessoa recebe da equipe, na mão, um voucher
  impresso genérico (papel pré-impresso, igual para todos). O totem não
  imprime nada e nada é validado por sistema durante o evento. Portanto o
  painel `/admin` e a função `redeem_ticket` (que consultam o banco do
  Lovable) não entram no fluxo offline do totem e não precisam ser tocados.
  Decisão confirmada pela equipe de marketing.
- [ ] **Geração do `ticket_code` precisa passar a ser local.** Hoje o submit
  chama `supabase.rpc("submit_experience", payload)` (`src/routes/index.tsx`,
  linha ~142), que gera o código no Postgres via `next_ticket_code()` e insere
  na tabela `leads`. Offline isso não roda, então o código exibido na tela de
  ticket passa a ser gerado no tablet. Como o voucher físico é o controle real,
  o código serve só como identificação do lead: basta não colidir entre os
  dois totens ao juntar os CSVs (ex: `totem_id` + contador local). Formato a
  definir na task 3.

## Fase 1 — sem totem em mãos

### 1. Setup (P)

- [ ] Confirmar acesso ao repo/export atual do Lovable (já em
  `Lovable_Coaktion/`).
- [ ] Rodar local (`bun install`, dev server) e validar que o fluxo atual
  (online, contra Supabase) funciona ponta a ponta com dados de teste.
- [ ] Revisar schema completo da tabela `leads` em
  `types.ts` — vai
  virar a base do schema Dexie no passo 3.

### 2. Shell PWA (M)

- [ ] Adicionar `manifest.json` (nome, ícones, `display: standalone`,
  orientação `portrait`).
- [ ] Registrar service worker (`vite-plugin-pwa` resolve rápido) fazendo
  cache dos assets estáticos (JS/CSS/imagens) pra carregar sem rede.
- [ ] Definir disciplina de versionamento de cache desde já (nome do cache
  com hash/versão do build) — é o bug mais comum de PWA sobre SPA React
  (cache velho servindo tela desatualizada), já mapeado em
  [Riscos e Contingência](/riscos-e-contingencia).
- [ ] Testar: abrir o app, desligar a rede (DevTools → offline), recarregar
  — tem que continuar funcionando.

### 3. Schema Dexie (M)

- [ ] Criar schema Dexie espelhando a tabela `leads` (campos em
  `types.ts:73-99`):
  `nome`, `empresa`, `cargo`, `email`, `telefone`, `consent`, `score_aktie`,
  `score_kompelys`, `empresa_principal`, `empresa_secundaria`,
  `dor_principal`, `dor_secundaria`, `perguntas_aktie_respondidas`,
  `perguntas_kompelys_respondidas`, `qualificacao`, `perfil_slug`,
  `perfil_titulo`, `respostas` (json), `ticket_code`, `ticket_status`,
  `created_at` — **mais `totem_id`**, que não existe na tabela online hoje
  e é novo, só do totem.
- [ ] Implementar geração local do `ticket_code` (formato definido no item 0).
- [ ] Hook/função `saveLeadLocal(payload)` equivalente ao que
  `submit_experience` faz hoje no Postgres, mas gravando no Dexie.

### 4. Ligar o formulário ao Dexie (M)

- [ ] Em `index.tsx`, trocar a
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
  [Arquitetura Técnica](/arquitetura-tecnica#1-gerar-o-arquivo-csv-no-totem)).
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
