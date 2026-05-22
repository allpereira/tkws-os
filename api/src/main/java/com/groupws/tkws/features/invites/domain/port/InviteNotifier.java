package com.groupws.tkws.features.invites.domain.port;

import com.groupws.tkws.features.invites.domain.model.Invite;

/**
 * Port: envia notificações sobre o invite — email pro convidado e
 * notificação ao admin (Telegram/Slack/etc).
 *
 * Implementações concretas em infrastructure/messaging.
 */
public interface InviteNotifier {

    /** Envia o magic link pro convidado. */
    void sendInviteEmail(Invite invite, String rawToken, String tenantName, String acceptUrl);

    /** Notifica o operador (Allysson) que um invite foi emitido. */
    void notifyAdminOfNewInvite(Invite invite, String tenantName, String issuedByEmail);
}
