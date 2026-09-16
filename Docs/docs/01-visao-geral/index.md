---
sidebar_position: 1
slug: /
---

# Visão Geral

## Resumo executivo

Os totens hoje dependem de um serviço pago, próprio do evento, só para
travar o tablet na landing page e capturar leads via formulário — o que
exige contratar Wi-Fi dedicado para o evento, algo em torno de R$6.000.
Este projeto substitui essa dependência por uma solução que roda
offline: o mesmo formulário React que o time de design/marketing já
entrega pronto passa a funcionar sem depender de conexão durante o
evento, salvando cada lead localmente no próprio tablet e sincronizando
com o Supabase só no fim, quando o totem pegar qualquer Wi-Fi
disponível.

O ganho é duplo, com peso igual entre os dois lados: **economia direta**
de não precisar contratar Wi-Fi dedicado para o evento, e **autonomia e
confiabilidade** — os totens deixam de depender de conexão contínua ou
de um serviço de terceiros para captar e não perder nenhum lead durante
os dois dias de evento.

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
como backend) passa a rodar como um PWA (Progressive Web App) dentro do
Chrome do Android nos totens, com uma camada de Service Worker e
armazenamento local (Dexie.js) que permite capturar e guardar cada lead
diretamente no tablet, sem depender de internet durante o evento. Ao
final do evento, quando o totem tiver acesso a qualquer Wi-Fi, os leads
são sincronizados em lote com a mesma tabela do Supabase que a LP
online já usa — sem necessidade de Wi-Fi dedicado nem de tempo real
durante os dois dias de captação.

Detalhes técnicos completos estão em
[Arquitetura Técnica](/arquitetura-tecnica) e
[Stack e Decisões Técnicas](/stack-e-decisoes-tecnicas).

## Objetivo

Não há uma meta numérica fixa de leads para o evento. O objetivo é
maximizar a captação dentro do fluxo de aproximadamente 15 mil pessoas
circulando pelo estande — ou seja, capturar o máximo possível de leads
dentro desse fluxo, sem depender de infraestrutura de rede cara ou de
um serviço de terceiros para isso.
