package com.groupws.tkws.features.pessoas.application.dto;

import java.util.List;

/**
 * Resposta do endpoint de detecção de duplicidade.
 *
 * Semântica para o frontend (ver ADR-018):
 *
 *   - `matchedByDocumento` preenchido → MATCH EXATO. Não criar Lead novo.
 *     Se for CLIENTE, frontend alerta: "essa pessoa já é cliente, use o cadastro".
 *     Se for LEAD, frontend pode reutilizar o cadastro ou criar Oportunidade.
 *
 *   - `matchedByDocumento == null` mas `matchedSoft` não-vazio → MATCH FRACO
 *     (email ou celular bate). Frontend mostra candidatos e deixa o vendedor
 *     escolher: usar existente ou criar mesmo assim (`forceCreate=true`).
 *
 *   - Ambos vazios → ninguém cadastrado, pode criar à vontade.
 */
public record DedupResult(
    PessoaView matchedByDocumento,
    List<PessoaView> matchedSoft
) {}
