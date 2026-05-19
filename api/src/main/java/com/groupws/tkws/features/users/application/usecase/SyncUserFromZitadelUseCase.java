package com.groupws.tkws.features.users.application.usecase;

import com.groupws.tkws.features.users.application.dto.UserView;
import com.groupws.tkws.features.users.application.dto.ZitadelUserData;
import com.groupws.tkws.features.users.domain.model.User;
import com.groupws.tkws.features.users.domain.port.UserRepository;
import com.groupws.tkws.shared.domain.Email;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Sincroniza ou cria usuário local a partir de dados do JWT do Zitadel.
 * Chamado tipicamente no endpoint /me após login.
 */
@Service
public class SyncUserFromZitadelUseCase {

    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public SyncUserFromZitadelUseCase(UserRepository userRepository,
                                      ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public UserView execute(ZitadelUserData data) {
        Email email = new Email(data.email());

        User user = userRepository.findByZitadelId(data.zitadelId())
            .map(existing -> {
                existing.syncFromZitadel(email, data.fullName(), data.avatarUrl());
                return existing;
            })
            .orElseGet(() -> User.createFromZitadel(
                data.zitadelId(), email, data.fullName(), data.avatarUrl()
            ));

        User saved = userRepository.save(user);
        saved.pullDomainEvents().forEach(eventPublisher::publishEvent);
        return UserView.from(saved);
    }
}
