---
sidebar_position: 1
slug: /visao-geral
---

# Visão Geral

**Proposta elaborada por Laura Rodrigues** —
[laura.rodrigues@sou.inteli.edu.br](mailto:laura.rodrigues@sou.inteli.edu.br)

## Resumo executivo

Os totens hoje dependem de um serviço pago, próprio do evento, só para
travar o tablet na landing page e capturar leads via formulário — o que
exige contratar Wi-Fi dedicado para o evento, algo em torno de R$6.000.
Este projeto substitui essa dependência por uma solução 100% offline,
por preferência confirmada da equipe de marketing: o mesmo formulário
React que o time de design/marketing já entrega pronto passa a
funcionar sem depender de conexão em nenhum momento do evento, salvando
cada lead localmente no próprio tablet. No fim do evento, os leads saem
por exportação em CSV e transferência física (pendrive ou cabo USB) —
sem nenhuma sincronização automática via Wi-Fi com o Supabase (o banco
de dados na nuvem que já guarda os dados da landing page online hoje).

O ganho é duplo, com peso igual entre os dois lados: **economia direta**
de não precisar contratar Wi-Fi dedicado para o evento, e **autonomia e
confiabilidade** — os totens não dependem de conexão nenhuma, em nenhum
momento, para captar e não perder nenhum lead durante os dois dias de
evento.

## O problema

Hoje os totens rodam a landing page online e dependem de um serviço
pago, próprio do evento, só para travar o tablet na LP e capturar leads
via formulário. Rodar esse serviço exige internet estável nos totens
durante todo o evento — o que, na prática, significa contratar Wi-Fi
dedicado para o evento, a um custo de aproximadamente R$6.000. Esse é o
único ponto de dor de custo/infraestrutura identificado a resolver
neste projeto.

## A solução proposta

O mesmo código React da landing page (feito no Lovable, com Supabase
como back-end — a parte do sistema que guarda e processa os dados por
trás da tela que a pessoa vê) passa a rodar como um
[PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
(Progressive Web App — um site que se comporta como um aplicativo
instalado, inclusive funcionando sem internet) dentro do Chrome do
Android nos totens, com uma camada de
[Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
(um script que guarda os arquivos do site no próprio tablet, para ele
abrir sem precisar baixar tudo de novo) e armazenamento local
([Dexie.js](https://dexie.org/docs/) — uma forma de guardar os dados
direto no tablet, sem depender de conexão) que permite capturar e
guardar cada lead diretamente no aparelho, sem depender de internet em
nenhum momento do evento. Ao final do evento, os leads são exportados
em CSV direto do tablet e transferidos fisicamente (pendrive ou cabo
USB) para importação manual no Supabase ou em uma planilha — sem
nenhuma sincronização automática via rede, por decisão confirmada da
equipe de marketing.

Detalhes técnicos completos estão em
[Arquitetura Técnica](/arquitetura-tecnica) e
[Stack e Decisões Técnicas](/stack-e-decisoes-tecnicas).

## Objetivo

Não há uma meta numérica fixa de leads para o evento. O objetivo é
maximizar a captação dentro do fluxo de aproximadamente 15 mil pessoas
circulando pelo estande — ou seja, capturar o máximo possível de leads
dentro desse fluxo, sem depender de infraestrutura de rede cara ou de
um serviço de terceiros para isso.

## Referências

- [PWA (Progressive Web Apps) — MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Service Worker API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Dexie.js — documentação oficial](https://dexie.org/docs/)
- [Supabase — documentação oficial](https://supabase.com/docs)
