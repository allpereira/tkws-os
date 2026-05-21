package com.groupws.tkws.features.users.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Busca os claims do usuário no UserInfo endpoint do Zitadel.
 *
 * <p>Usado como fallback quando o JWT de acesso não carrega o claim {@code email}
 * — situação comum quando o Zitadel não tem o email no perfil do usuário ou
 * quando o access token é emitido sem os scopes de perfil completos.
 *
 * <p>A chamada é feita com o próprio access token do usuário, sem PAT adicional.
 */
@Component
class ZitadelUserInfoClient {

    private static final Logger log = LoggerFactory.getLogger(ZitadelUserInfoClient.class);

    private final RestClient restClient;

    ZitadelUserInfoClient(
            RestClient.Builder builder,
            @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}") String issuerUri) {
        this.restClient = builder
                .baseUrl(issuerUri)
                .build();
    }

    /**
     * Chama {@code /oidc/v1/userinfo} com o token do usuário e retorna os claims.
     * Retorna mapa vazio em caso de falha (não propaga exceção).
     */
    @SuppressWarnings("unchecked")
    Map<String, Object> fetchUserInfo(String accessToken) {
        try {
            Map<String, Object> claims = restClient.get()
                    .uri("/oidc/v1/userinfo")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .body(Map.class);
            return claims != null ? claims : Map.of();
        } catch (Exception ex) {
            log.warn("Não foi possível buscar UserInfo no Zitadel: {}", ex.getMessage());
            return Map.of();
        }
    }
}
