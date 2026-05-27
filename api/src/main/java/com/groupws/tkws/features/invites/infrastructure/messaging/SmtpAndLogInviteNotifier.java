package com.groupws.tkws.features.invites.infrastructure.messaging;

import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteRole;
import com.groupws.tkws.features.invites.domain.port.InviteNotifier;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Implementação default: envia o convite por email (HTML + texto puro como
 * alternativa) pelo {@link JavaMailSender} (configurável via {@code spring.mail.*})
 * e notifica o operador via log estruturado.
 *
 * <p>O corpo HTML segue o tom editorial do TKWS OS (ver docs/05-DESIGN-SYSTEM.md):
 * tipografia serif no título, respiro generoso, CTA sóbrio. Inline CSS porque
 * clientes de email ignoram {@code <style>} e classes.
 *
 * <p>Telegram/Slack ficam para uma próxima iteração — o adapter de webhook é
 * trivial de plugar como um {@link InviteNotifier} adicional ou via composição.
 */
@Component
class SmtpAndLogInviteNotifier implements InviteNotifier {

    private static final Logger log = LoggerFactory.getLogger(SmtpAndLogInviteNotifier.class);

    private static final DateTimeFormatter EXPIRY_FMT =
        DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH'h'mm", Locale.forLanguageTag("pt-BR"))
            .withZone(ZoneId.of("America/Sao_Paulo"));

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String adminLogTag;

    SmtpAndLogInviteNotifier(
        JavaMailSender mailSender,
        @Value("${tkws.invites.mail.from:no-reply@tkws.com.br}") String fromAddress,
        @Value("${tkws.invites.admin.log-tag:[INVITE-ADMIN-NOTIFY]}") String adminLogTag
    ) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.adminLogTag = adminLogTag;
    }

    @Override
    public void sendInviteEmail(Invite invite, String rawToken, String tenantName, String acceptUrl) {
        String subject = "Você foi convidado para " + tenantName + " no TKWS OS";
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true, StandardCharsets.UTF_8.name());
            helper.setFrom(fromAddress);
            helper.setTo(invite.email());
            helper.setSubject(subject);
            // true = o segundo argumento é o HTML; o primeiro é o texto puro (fallback).
            helper.setText(renderText(invite, tenantName, acceptUrl), renderHtml(invite, tenantName, acceptUrl));
            mailSender.send(mime);
        } catch (MessagingException | MailException e) {
            // Propaga: o CreateInviteUseCase já trata em best-effort (não derruba a transação).
            throw new IllegalStateException("Falha ao montar/enviar email de convite", e);
        }
        log.info("Invite email enviado: inviteId={} to={} tenant={}", invite.id(), invite.email(), tenantName);
    }

    @Override
    public void notifyAdminOfNewInvite(Invite invite, String tenantName, String issuedByEmail) {
        // Log estruturado pra Allysson acompanhar (pode virar webhook depois).
        log.warn("{} inviteId={} tenant=\"{}\" to={} role={} by={} expiresAt={}",
            adminLogTag,
            invite.id().value(),
            tenantName,
            invite.email(),
            invite.role().key(),
            issuedByEmail,
            invite.expiresAt());
    }

    // ── Rendering ────────────────────────────────────────────────────────────

    private static String firstName(Invite invite) {
        return invite.fullName() != null ? invite.fullName().trim().split("\\s+")[0] : null;
    }

    private static String renderText(Invite invite, String tenantName, String acceptUrl) {
        String first = firstName(invite);
        String greeting = first != null ? "Olá, " + first + "!" : "Olá!";
        return """
            %s

            Você foi convidado(a) para integrar o workspace "%s" no TKWS OS
            como %s.

            Para confirmar seu acesso e definir sua senha, abra este link:

            %s

            O link expira em %s. Você só passa a ter acesso depois de confirmar
            por este link — se não esperava esse convite, ignore esta mensagem.

            — TKWS OS · Group WS
            """.formatted(greeting, tenantName, roleLabel(invite.role()), acceptUrl,
                EXPIRY_FMT.format(invite.expiresAt()));
    }

    private static String renderHtml(Invite invite, String tenantName, String acceptUrl) {
        String first = firstName(invite);
        String greeting = first != null ? "Olá, " + escape(first) + "." : "Olá.";
        String expiry = EXPIRY_FMT.format(invite.expiresAt());
        String safeTenant = escape(tenantName);
        String role = escape(roleLabel(invite.role()));

        return """
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="margin:0; padding:0; background:#f4f3f0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif; color:#1a1a1a;">
              <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f3f0; padding:40px 16px;">
                <tr><td align="center">
                  <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border:1px solid #e6e3dd; border-radius:14px; overflow:hidden;">
                    <tr><td style="padding:36px 40px 8px;">
                      <p style="margin:0; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#8a857c;">TKWS OS · Convite</p>
                    </td></tr>
                    <tr><td style="padding:8px 40px 0;">
                      <h1 style="margin:0; font-family:Georgia,'Times New Roman',serif; font-weight:400; font-size:30px; line-height:1.15; letter-spacing:-0.02em; color:#1a1a1a;">
                        %s
                      </h1>
                      <p style="margin:18px 0 0; font-size:15px; line-height:1.6; color:#444;">
                        Você foi convidado(a) para integrar o workspace
                        <strong style="color:#1a1a1a;">%s</strong> no TKWS OS, com o papel de
                        <strong style="color:#1a1a1a;">%s</strong>.
                      </p>
                      <p style="margin:14px 0 0; font-size:15px; line-height:1.6; color:#444;">
                        Para <strong>confirmar seu acesso</strong> e definir sua senha, é só clicar no botão abaixo.
                        Seu acesso só é ativado depois dessa confirmação.
                      </p>
                    </td></tr>
                    <tr><td style="padding:28px 40px 8px;">
                      <a href="%s" style="display:inline-block; background:#1a1a1a; color:#ffffff; text-decoration:none; font-size:15px; font-weight:600; padding:14px 28px; border-radius:10px;">
                        Confirmar acesso e definir senha
                      </a>
                    </td></tr>
                    <tr><td style="padding:8px 40px 0;">
                      <p style="margin:0; font-size:13px; line-height:1.6; color:#8a857c;">
                        Ou copie e cole este endereço no navegador:<br>
                        <span style="color:#555; word-break:break-all;">%s</span>
                      </p>
                    </td></tr>
                    <tr><td style="padding:24px 40px 0;">
                      <hr style="border:none; border-top:1px solid #eceae5; margin:0;">
                    </td></tr>
                    <tr><td style="padding:18px 40px 36px;">
                      <p style="margin:0; font-size:12.5px; line-height:1.6; color:#8a857c;">
                        O link expira em <strong style="color:#555;">%s</strong>. Se você não esperava
                        este convite, pode ignorar esta mensagem com segurança — nenhuma conta é ativada
                        sem a confirmação acima.
                      </p>
                      <p style="margin:16px 0 0; font-size:12.5px; color:#b0aaa0;">— TKWS OS · Group WS</p>
                    </td></tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(greeting, safeTenant, role, acceptUrl, escape(acceptUrl), expiry);
    }

    /** Rótulo legível do papel para o convidado (o email não fala em snake_case). */
    private static String roleLabel(InviteRole role) {
        return switch (role) {
            case ORG_ADMIN -> "Administrador do escritório";
            case COMERCIAL_ATENDIMENTO -> "Comercial · Atendimento";
            case COMERCIAL_PROPOSTA -> "Comercial · Proposta";
            case DEFAULT -> "Membro";
        };
    }

    /** Escapa o mínimo para evitar quebra de HTML / injeção em campos vindos do usuário. */
    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;");
    }
}
