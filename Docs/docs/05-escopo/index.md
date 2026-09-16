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
- Sincronização em lote com o Supabase quando o totem detectar conexão
  (ao final do evento), mais botão manual de "sincronizar agora" como
  fallback.
- Configuração de `totem_id` fixo em cada um dos 2 totens, para
  rastrear a origem do lead e evitar conflito de dados na sincronização.
- Botão de exportação manual em CSV (arquivo de planilha simples, que
  abre direto no Excel ou Google Sheets) como rede de segurança, para
  backup via pendrive.
- Testes no hardware físico dos dois totens antes do evento.

Não entram configuração de lockdown de tela (travar o tablet em modo
totem, sem acesso a mais nada, via
[Fully Kiosk Browser](https://www.fully-kiosk.com/en/) ou
[Device Owner](https://developer.android.com/work/dpc/dedicated-devices/lock-task-mode))
nem reset automático por inatividade: a contratante confirmou que o
totem sempre terá supervisão humana, com reset manual já coberto pelo
próprio fluxo da LP. Ver [Riscos e Contingência](/riscos-e-contingencia).

## Fica de fora desta primeira versão

- Redesenho da landing page ou do formulário — o layout, os textos das
  perguntas e o design final são entregues prontos pelo time de
  design/marketing; o projeto aqui é só sobre fazer esse código
  funcionar offline.
- Sincronização em tempo real ou via dados móveis durante o evento — a
  sincronização acontece só ao final, quando o totem pegar Wi-Fi.
- Empacotamento nativo via [Capacitor](https://capacitorjs.com/docs)
  (ferramenta que empacota o mesmo código React como app Android
  instalável, Opção 2 da arquitetura) — não é necessário para esta v1,
  mas segue disponível caso a contratante prefira um app nativo
  instalável por outros motivos. Ver [Arquitetura Técnica](/arquitetura-tecnica).

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
- **Distribuição via loja de apps** (Google Play) — relevante só se o
  projeto migrar para a Opção 2 (Capacitor) como app nativo distribuído
  oficialmente, em vez de instalação direta do `.apk`.

**Regra geral para o restante da documentação:** qualquer item que não
foi pedido explicitamente pela contratante entra aqui, não no escopo
ativo da v1.

## Referências

- [PWA (Progressive Web Apps) — MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Service Worker API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Dexie.js — documentação oficial](https://dexie.org/docs/)
- [Supabase — documentação oficial](https://supabase.com/docs)
- [Capacitor — documentação oficial](https://capacitorjs.com/docs)
- [Fully Kiosk Browser — site oficial](https://www.fully-kiosk.com/en/)
- [Android Device Owner / Lock Task mode — developer.android.com](https://developer.android.com/work/dpc/dedicated-devices/lock-task-mode)
