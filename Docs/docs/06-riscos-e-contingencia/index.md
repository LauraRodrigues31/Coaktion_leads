---
sidebar_position: 1
---

# Riscos e Contingência

## Decisão em aberto: lockdown / modo kiosk

Esta é a decisão técnica mais importante ainda pendente do projeto, e
depende de uma resposta da contratante:

> **O totem vai ter sempre alguém da equipe de marketing supervisionando,
> ou ele fica sozinho captando lead sem ninguém por perto?**

Essa resposta define qual nível de bloqueio de tela é necessário — e o
nível de bloqueio, por sua vez, afeta qual das duas opções de arquitetura
(ver [Arquitetura Técnica](/arquitetura-tecnica)) faz sentido. Por isso
essa árvore de decisão **não está resolvida aqui** — está documentada
para ser decidida junto com a contratante.

### Se o totem for sempre supervisionado

Nenhum lockdown de sistema é estritamente necessário. Basta o
**Immersive Mode** (modo fullscreen nativo do Android, gratuito) para
reduzir saídas acidentais da tela do formulário.

A foto abaixo é de um totem físico do mesmo formato/hardware, em
operação real, rodando **sem nenhum lockdown nem fullscreen** — a barra
de status do Android fica visível no topo. Ou seja: já existe prova de
que esse tipo de solução funciona mesmo sem nenhuma trava de sistema,
desde que haja supervisão humana por perto.

![Totem de referência em operação, orientação retrato, barra de status do Android visível no topo — sem lockdown](/img/totem-exemplo.jpeg)

*Totem de referência (outro cliente/evento), mostrando o formato físico
retrato e a barra de status do Android visível — evidência de que a
solução roda hoje sem nenhuma trava de sistema.*

### Se o totem ficar sem supervisão constante

Duas alternativas, cada uma amarrada a uma das opções de arquitetura:

- **Fully Kiosk Browser** (Opção 1 — PWA): app de terceiros que trava a
  tela no formulário. Custo aproximado de R$45–70 por licença, para os
  dois totens. Não exige resetar o tablet de fábrica.
- **Device Owner + Lock Task mode** (Opção 2 — Capacitor): bloqueio
  nativo do Android, mais robusto que o Fully Kiosk Browser, mas exige
  resetar o tablet de fábrica para provisionar — e só é viável se isso
  puder ser feito antes do evento.

**Pendência:** confirmar com a contratante se será possível fazer reset
de fábrica dos tablets, caso o caminho do Device Owner seja necessário.
Enquanto essa resposta não vem, a Opção 1 (PWA + Fully Kiosk Browser
condicional) segue como recomendação, por não depender dessa
possibilidade.

## Outros riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Wi-Fi não disponível no fim do evento para a sincronização final | Leads capturados ficam presos no totem | Botão de exportação manual em CSV para backup via pendrive, além do botão de "sincronizar agora" assim que houver conexão |
| Hardware ligado continuamente por ~2 dias de evento | Travamento, lentidão ou reinício inesperado do tablet perdendo estado da sessão | Persistência imediata de cada resposta no armazenamento local (Dexie/IndexedDB), reset automático por inatividade, e checagem de estabilidade nos testes em hardware físico antes do evento |
| Rebuild/reexport do código no Lovable depois que o service worker já estiver configurado | Nova versão da LP ir para o totem sem passar pela camada offline, quebrando o cache ou perdendo o ajuste offline | Processo definido de que todo novo build do Lovable passa pela camada de service worker antes de ir para o totem — não é uma simples recópia de arquivos |
| Cache do service worker desatualizado (bug comum em PWA sobre SPA React) | Totem mostrar tela antiga mesmo após atualização do código | Disciplina de versionamento de cache no service worker |
| Acesso de provisionamento aos tablets (side-load de app como o Fully Kiosk Browser, ou reset de fábrica para Device Owner) ainda não confirmado | Pode inviabilizar a opção de lockdown escolhida depois que o desenvolvimento já tiver começado | Confirmar com a contratante o nível de acesso administrativo aos tablets antes de travar a decisão de lockdown |
