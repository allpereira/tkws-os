package com.groupws.tkws.features.invites.infrastructure.messaging;

import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.port.InviteNotifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

/**
 * Implementação default: envia email pelo {@link JavaMailSender} (configurável via
 * {@code spring.mail.*}) e notifica o operador via log estruturado.
 *
 * Telegram/Slack ficam para uma próxima iteração — o adapter de webhook é trivial
 * de plugar como um {@link InviteNotifier} adicional ou via composição.
 */
@Component
class SmtpAndLogInviteNotifier implements InviteNotifier {

    private static final Logger log = LoggerFactory.getLogger(SmtpAndLogInviteNotifier.class);

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
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromAddress);
        msg.setTo(invite.email());
        msg.setSubject("Você foi convidado para " + tenantName + " no TKWS OS");
        msg.setText(renderBody(invite, tenantName, acceptUrl));
        mailSender.send(msg);
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

    private static String renderBody(Invite invite, String tenantName, String acceptUrl) {
        String greeting = invite.fullName() != null
            ? "Olá, " + invite.fullName().split(" ")[0] + "!"
            : "Olá!";
        return """
            %s

            Você foi convidado(a) para integrar o workspace "%s" no TKWS OS
            como %s.

            Para aceitar e definir sua senha, abra este link:

            %s

            O link expira em %s. Se você não esperava esse convite, pode ignorar
            esta mensagem com segurança.

            — TKWS OS · Group WS
            """.formatted(greeting, tenantName, invite.role().key(), acceptUrl, invite.expiresAt());
    }
}
