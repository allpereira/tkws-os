package com.groupws.tkws.features.invites.infrastructure.idp;

import com.groupws.tkws.features.invites.domain.model.InviteRole;
import com.groupws.tkws.features.invites.domain.port.IdentityProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Adapter da port {@link IdentityProvider} usando a Admin API do Zitadel.
 *
 * <p>Autentica com o PAT do machine user {@code login-client}, igual ao Vite proxy
 * faz para a Session API. O PAT mora em
 * {@code ZITADEL_LOGIN_CLIENT_PAT_PATH} (default {@code /zitadel/bootstrap/login-client.pat}
 * dentro do container; em dev fora do container, sobrescrever para
 * {@code docker/zitadel/login-client.pat}).
 *
 * <p>Endpoints usados (Zitadel V4.x):
 * <ul>
 *   <li>POST {@code /v2/users/human} — cria user shell</li>
 *   <li>POST {@code /v2/users/{userId}/password} — define senha</li>
 *   <li>POST {@code /management/v1/users/{userId}/grants} — atribui role no projeto</li>
 * </ul>
 */
@Component
class ZitadelIdentityProviderAdapter implements IdentityProvider {

    private static final Logger log = LoggerFactory.getLogger(ZitadelIdentityProviderAdapter.class);

    private final RestClient client;
    private final String pat;
    private final String projectId;

    ZitadelIdentityProviderAdapter(
        RestClient.Builder builder,
        @Value("${tkws.zitadel.issuer:http://localhost:8088}") String issuer,
        @Value("${tkws.zitadel.login-client-pat-path:docker/zitadel/login-client.pat}") String patPath,
        @Value("${tkws.zitadel.project-id:}") String projectId
    ) {
        this.client = builder.baseUrl(issuer).build();
        this.pat = readPat(patPath);
        this.projectId = projectId;
    }

    private static String readPat(String path) {
        try {
            return Files.readString(Path.of(path)).trim();
        } catch (Exception e) {
            log.warn("Não foi possível ler PAT em {}: {}. ZitadelIdentityProvider operará em modo degradado.",
                path, e.getMessage());
            return "";
        }
    }

    @Override
    public String createShellUser(String zitadelOrgId, String email, String fullName) {
        String[] parts = splitName(fullName, email);
        Map<String, Object> body = Map.of(
            "username", email,
            "organization", Map.of("orgId", zitadelOrgId),
            "profile", Map.of(
                "givenName", parts[0],
                "familyName", parts[1]
            ),
            "email", Map.of("email", email, "isVerified", true)
        );

        Map<?, ?> resp = client.post()
            .uri("/v2/users/human")
            .header("Authorization", "Bearer " + pat)
            .contentType(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body(Map.class);

        Object userId = resp != null ? resp.get("userId") : null;
        if (userId == null) {
            // Em alguns retornos o id vem como "id". Fallback defensivo.
            userId = resp != null ? resp.get("id") : null;
        }
        if (userId == null) {
            throw new IllegalStateException("Resposta do Zitadel sem userId: " + resp);
        }
        return String.valueOf(userId);
    }

    @Override
    public void setPassword(String userId, String password) {
        Map<String, Object> body = Map.of(
            "newPassword", Map.of("password", password, "changeRequired", false)
        );
        client.post()
            .uri("/v2/users/{id}/password", userId)
            .header("Authorization", "Bearer " + pat)
            .contentType(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .toBodilessEntity();
    }

    @Override
    public void grantProjectRole(String userId, String zitadelOrgId, InviteRole role) {
        if (projectId == null || projectId.isBlank()) {
            log.warn("tkws.zitadel.project-id não configurado — pulando grant de role {} para user {}",
                role.key(), userId);
            return;
        }
        Map<String, Object> body = Map.of(
            "projectId", projectId,
            "roleKeys", List.of(role.key())
        );
        client.post()
            .uri("/management/v1/users/{id}/grants", userId)
            .header("Authorization", "Bearer " + pat)
            .header("x-zitadel-orgid", zitadelOrgId)
            .contentType(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .toBodilessEntity();
    }

    /** Quebra "Maria Souza" → {"Maria", "Souza"}; tudo single → {given, ""}. */
    private static String[] splitName(String fullName, String fallbackEmail) {
        if (fullName == null || fullName.isBlank()) {
            String localPart = fallbackEmail.contains("@")
                ? fallbackEmail.substring(0, fallbackEmail.indexOf('@'))
                : fallbackEmail;
            return new String[]{ localPart, "(novo)" };
        }
        String trimmed = fullName.trim();
        int firstSpace = trimmed.indexOf(' ');
        if (firstSpace < 0) {
            return new String[]{ trimmed, "(novo)" };
        }
        return new String[]{
            trimmed.substring(0, firstSpace),
            trimmed.substring(firstSpace + 1)
        };
    }

    // utilizado pelos testes pra checar config carregou — não chamado em produção
    UUID dummy() { return UUID.randomUUID(); }
}
