---
sidebar_position: 1
---

# Arquitetura Técnica

## Ponto de partida

O ponto de partida não é uma tela nova: é o código React da landing page
que o time de design/marketing já entrega pronta, feita no Lovable, com
Supabase como backend. Esse código já vem ajustado para a resolução e
orientação do totem (retrato, tela alta e estreita, algo em torno de
1080×1920, a confirmar). O projeto aqui não é desenhar um formulário do
zero — é pegar esse React existente e fazer ele funcionar sem depender de
internet durante o evento.

No projeto Lovable já existe uma pasta `integrations/supabase` com
`client.ts`, `client.server.ts` e `types.ts` — esse último deve listar o
schema completo das tabelas, incluindo a de leads, que é a mesma tabela
que vai receber os dados sincronizados dos totens.

Os totens rodam Android 14 com o Google Chrome padrão (não é um app
nativo do fabricante do hardware). São 2 totens, mesmo código nos dois,
cada um com um `totem_id` fixo configurado na instalação para rastrear a
origem do lead e evitar conflito na hora de sincronizar.

## Duas opções técnicas

Avaliamos duas formas de fazer esse React existente funcionar offline.
**A recomendação é a Opção 1.**

### Opção 1 (recomendada): PWA sobre o código React existente

O código do Lovable vira um Progressive Web App: continua rodando dentro
do Chrome do Android, mas ganha uma camada de Service Worker que faz o
cache de todos os assets estáticos (JS, CSS, imagens) para carregar sem
rede.

- **Armazenamento local:** [Dexie.js](https://dexie.org/), um wrapper
  sobre IndexedDB, em vez de IndexedDB puro — reduz boilerplate e risco
  de bug dado o prazo curto do projeto.
- **Sincronização:** envio em lote (batch) para o Supabase quando o
  totem detectar conexão, mais um botão manual de "sincronizar agora"
  como fallback — o evento `online` do navegador sozinho não é 100%
  confiável para detectar conectividade real.
- **Reset entre atendimentos:** reload automático do formulário após
  alguns segundos de inatividade, para voltar ao estado inicial entre
  uma pessoa e a próxima. Isso funciona independente de qualquer decisão
  de lockdown do sistema (veja a árvore de decisão na seção
  [Riscos e Contingência](/riscos-e-contingencia)).
- **Bloqueio de tela:** *se* for confirmado que o totem vai ficar sem
  supervisão humana constante, usar o app Fully Kiosk Browser
  (~R$45–70 por licença, dois totens) para travar a tela no formulário.
  Essa é uma dependência condicional, não uma decisão já tomada — está
  documentada como item em aberto na seção de riscos.

**Trade-offs:** reaproveita cerca de 95% do código existente sem mexer na
UI. Em compensação, qualquer rebuild/reexport feito no Lovable precisa
passar de novo pela camada de service worker antes de ir para o totem —
não é só recopiar os arquivos. Depurar cache de service worker em cima
de uma SPA React também exige disciplina de versionamento de cache
(cache antigo servindo tela desatualizada é a forma mais comum desse
tipo de bug).

### Opção 2 (alternativa): empacotamento nativo com Capacitor

O mesmo código React é empacotado como um app Android instalável (.apk)
via [Capacitor](https://capacitorjs.com/), com armazenamento local em
SQLite em vez de IndexedDB/Dexie, e sincronização em background quando
detectar internet.

**Trade-offs:** exige montar um pipeline de build Android (Android
Studio/Gradle) — complexidade nova para os 6 dias de prazo. Só compensa
o esforço extra se a decisão de lockdown via Device Owner (bloqueio mais
robusto que o Fully Kiosk Browser, mas que exige resetar o tablet de
fábrica para provisionar) for confirmada como necessária.

### Comparativo

| Critério | Opção 1 — PWA (recomendada) | Opção 2 — Capacitor (nativo) |
|---|---|---|
| Esforço no prazo de 6 dias | Baixo — reaproveita ~95% do código, sem novo pipeline de build | Alto — exige montar build Android (Android Studio/Gradle) do zero |
| Modificação do código existente | Mínima — camada de service worker + armazenamento, sem tocar na UI | Empacotamento completo do app; possível ajuste de APIs web → nativas |
| Armazenamento local | Dexie.js (IndexedDB) | SQLite |
| Risco de perda de dados | Baixo, mas depende de disciplina de versionamento de cache do service worker | Baixo — storage nativo mais previsível |
| Lockdown de tela suportado | Fully Kiosk Browser (app de terceiros, licenciado) | Device Owner + Lock Task mode (nativo Android, mais robusto) |
| Pré-requisito de provisionamento | Nenhum além de instalar o Fully Kiosk Browser, se necessário | Reset de fábrica dos tablets para configurar Device Owner |
| Quando compensa | Cenário padrão — recomendado para este prazo | Só se o lockdown via Device Owner for confirmado como necessário |

## Diagramas

> Espaço reservado para os diagramas de arquitetura (fluxo de dados,
> componentes do PWA, fluxo de sincronização). A colar depois.
