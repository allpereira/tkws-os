package com.groupws.tkws.features.users.domain.port;

import com.groupws.tkws.features.users.domain.model.User;
import com.groupws.tkws.features.users.domain.model.UserId;
import com.groupws.tkws.shared.domain.Email;

import java.util.Optional;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(UserId id);
    Optional<User> findByZitadelId(String zitadelId);
    Optional<User> findByEmail(Email email);
}
