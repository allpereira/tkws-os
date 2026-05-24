package com.groupws.tkws.shared.web.tenant;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

/**
 * Registra o {@link CurrentTenantArgumentResolver} no Spring MVC para que
 * controllers possam usar `@CurrentTenant TenantContext tenant` como
 * parâmetro normal.
 */
@Configuration
class TenantWebMvcConfig implements WebMvcConfigurer {

    private final CurrentTenantArgumentResolver resolver;

    TenantWebMvcConfig(CurrentTenantArgumentResolver resolver) {
        this.resolver = resolver;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(resolver);
    }
}
