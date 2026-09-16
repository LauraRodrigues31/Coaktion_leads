---
sidebar_position: 1
---

# Escopo

## Entra nesta primeira versão

- Adaptar o código React já pronto da landing page (Lovable + Supabase)
  para funcionar offline — **não** é uma reconstrução do formulário do
  zero, é reaproveitamento do que o time de design/marketing entrega.
- Camada PWA: Service Worker fazendo cache dos assets estáticos para o
  totem carregar e funcionar sem rede.
- Armazenamento local imediato de cada resposta com Dexie.js, para não
  depender de conexão durante o evento e não perder nenhum lead.
- Sincronização em lote com o Supabase quando o totem detectar conexão
  (ao final do evento), mais botão manual de "sincronizar agora" como
  fallback.
- Configuração de `totem_id` fixo em cada um dos 2 totens, para
  rastrear a origem do lead e evitar conflito de dados na sincronização.
- Reset automático do formulário após período de inatividade, para
  voltar ao estado inicial entre atendimentos.
- Botão de exportação manual em CSV como rede de segurança, para backup
  via pendrive.
- Testes no hardware físico dos dois totens antes do evento.
- **Escopo condicional:** configuração de lockdown de tela (Fully Kiosk
  Browser ou Device Owner + Lock Task mode) — depende da resposta ainda
  pendente sobre supervisão constante do totem durante o evento. Ver a
  árvore de decisão completa em
  [Riscos e Contingência](/riscos-e-contingencia).

## Fica de fora desta primeira versão

- Redesenho da landing page ou do formulário — o layout, os textos das
  perguntas e o design final são entregues prontos pelo time de
  design/marketing; o projeto aqui é só sobre fazer esse código
  funcionar offline.
- Sincronização em tempo real ou via dados móveis durante o evento — a
  sincronização acontece só ao final, quando o totem pegar Wi-Fi.
- Empacotamento nativo via Capacitor (Opção 2 da arquitetura) — só entra
  em escopo se a decisão de lockdown exigir Device Owner + Lock Task
  mode.

> Itens acima refletem o que já foi decidido até aqui. Pontos de
> escopo ainda não cobertos pela conversa (ex: dashboard de
> acompanhamento pós-evento, deduplicação de leads entre os dois totens
> além do `totem_id`, distribuição via loja de apps) ficam marcados como
> a confirmar — sinaliza se algum desses deve entrar.
