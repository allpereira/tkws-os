package com.groupws.tkws.shared.domain;

/**
 * Exceção base para regras de negócio.
 * Subclasses representam violações específicas de invariantes do domínio.
 *
 * <p>Carrega o status HTTP como {@code int} (não o {@code HttpStatus} do Spring,
 * para manter o domínio livre de framework). O {@code GlobalExceptionHandler}
 * mapeia qualquer {@code DomainException} para um {@code ProblemDetail} usando
 * {@link #code()} e {@link #httpStatus()} — assim nenhuma camada de infra/web
 * precisa conhecer as exceções específicas de cada feature.
 */
public abstract class DomainException extends RuntimeException {

    /** Status padrão de regra de negócio violada · 422 Unprocessable Entity. */
    public static final int DEFAULT_STATUS = 422;

    private final String code;
    private final int httpStatus;

    protected DomainException(String code, String message) {
        this(code, message, DEFAULT_STATUS);
    }

    protected DomainException(String code, String message, int httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }

    public String code() {
        return code;
    }

    public int httpStatus() {
        return httpStatus;
    }
}
