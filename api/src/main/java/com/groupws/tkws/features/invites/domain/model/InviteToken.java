package com.groupws.tkws.features.invites.domain.model;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Objects;

/**
 * Token de uso único enviado por email para aceitar um convite.
 *
 * <p>Geração: 32 bytes aleatórios cripto-seguros, codificados em Base64URL sem padding
 * (~43 chars). O <strong>token claro</strong> existe apenas em memória durante a criação do
 * convite e no email enviado — nunca é persistido. O que vai pro banco é o
 * <strong>hash SHA-256</strong> (64 hex chars) do token, igual a como senhas são tratadas.
 *
 * <p>Isso significa que se o banco vazar, o atacante não consegue aceitar invites.
 */
public final class InviteToken {

    private static final SecureRandom RNG = new SecureRandom();
    private static final int TOKEN_BYTES = 32;

    private final String value;

    private InviteToken(String value) {
        this.value = Objects.requireNonNull(value, "value");
    }

    /** Gera um novo token cripto-seguro. */
    public static InviteToken generate() {
        byte[] bytes = new byte[TOKEN_BYTES];
        RNG.nextBytes(bytes);
        return new InviteToken(Base64.getUrlEncoder().withoutPadding().encodeToString(bytes));
    }

    /** Reconstitui um token a partir de um valor recebido (ex.: query string). */
    public static InviteToken of(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("token vazio");
        }
        return new InviteToken(value.trim());
    }

    /** Valor cru do token — só pra enviar no link, NUNCA persistir. */
    public String value() {
        return value;
    }

    /** Hash SHA-256 em hex; é isso que fica no banco e no índice. */
    public String hashHex() {
        return sha256Hex(value);
    }

    public static String hashOf(String rawToken) {
        return sha256Hex(rawToken);
    }

    private static String sha256Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 é garantido pelo JCE; se sumir, é bug grave da JVM.
            throw new IllegalStateException("SHA-256 não disponível", e);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof InviteToken other)) return false;
        return Objects.equals(this.value, other.value);
    }

    @Override
    public int hashCode() {
        return value.hashCode();
    }

    /** toString mascara o token pra evitar vazamento em logs. */
    @Override
    public String toString() {
        return "InviteToken[***]";
    }
}
