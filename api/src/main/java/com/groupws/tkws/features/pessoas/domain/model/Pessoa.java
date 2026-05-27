package com.groupws.tkws.features.pessoas.domain.model;

import com.groupws.tkws.features.pessoas.domain.event.PessoaConvertedToClienteEvent;
import com.groupws.tkws.features.pessoas.domain.event.PessoaCreatedEvent;
import com.groupws.tkws.shared.domain.AggregateRoot;

import java.time.Instant;
import java.util.Objects;
import java.util.Optional;

/**
 * Aggregate Root · cadastro único de Pessoa (PF/PJ) no funil comercial.
 *
 * `tenantId` é o BIGINT local (PK em tenants.id · multi-tenancy resolvida via
 * {@link com.groupws.tkws.shared.web.tenant.CurrentTenant}, nunca via payload).
 *
 * Estados:
 *   LEAD     · inicial · ainda não fechou proposta
 *   CLIENTE  · fechou ao menos uma proposta (vira via `convertToCliente()`,
 *              disparado quando uma Oportunidade entra em etapa marcada
 *              como conversão)
 *
 * Ver ADR-018.
 */
public final class Pessoa extends AggregateRoot<PessoaId> {

    private final PessoaId id;
    private final long tenantId;

    private TipoPessoa tipoPessoa;
    private Documento documento;        // opcional · null quando ainda não informado
    private String nomeContato;
    private String emailContato;        // opcional
    private String celularContato;      // opcional
    private String nomeEmpresa;         // opcional · normalmente preenchido só em PJ

    private StatusPessoa status;
    private Instant convertidoEm;

    // Campos extras · preenchidos depois do cadastro inicial
    private String endereco;
    private String cidade;
    private String uf;
    private String cep;
    private String notas;

    private final Instant createdAt;
    private Instant updatedAt;

    private Pessoa(PessoaId id, long tenantId, TipoPessoa tipoPessoa, Documento documento,
                   String nomeContato, String emailContato, String celularContato, String nomeEmpresa,
                   StatusPessoa status, Instant convertidoEm,
                   String endereco, String cidade, String uf, String cep, String notas,
                   Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id, "id");
        if (tenantId <= 0) {
            throw new IllegalArgumentException("tenantId deve ser positivo · recebeu: " + tenantId);
        }
        this.tenantId = tenantId;
        this.tipoPessoa = Objects.requireNonNull(tipoPessoa, "tipoPessoa");
        this.documento = documento;
        this.nomeContato = validateNome(nomeContato);
        this.emailContato = blankToNull(emailContato);
        this.celularContato = blankToNull(celularContato);
        this.nomeEmpresa = blankToNull(nomeEmpresa);
        this.status = Objects.requireNonNull(status, "status");
        this.convertidoEm = convertidoEm;
        this.endereco = blankToNull(endereco);
        this.cidade = blankToNull(cidade);
        this.uf = blankToNull(uf);
        this.cep = blankToNull(cep);
        this.notas = blankToNull(notas);
        this.createdAt = Objects.requireNonNull(createdAt, "createdAt");
        this.updatedAt = Objects.requireNonNull(updatedAt, "updatedAt");
    }

    /**
     * Factory · cria uma Pessoa nova como LEAD.
     * Use case de criação deve verificar duplicidade de documento ANTES.
     */
    public static Pessoa createLead(long tenantId, TipoPessoa tipoPessoa, Documento documento,
                                    String nomeContato, String emailContato,
                                    String celularContato, String nomeEmpresa) {
        return create(tenantId, tipoPessoa, documento, nomeContato, emailContato,
            celularContato, nomeEmpresa, StatusPessoa.LEAD);
    }

    /**
     * Factory · cria uma Pessoa nova com o {@code status} inicial informado.
     *
     * Aceita apenas {@link StatusPessoa#LEAD} ou {@link StatusPessoa#CLIENTE}
     * (ADR-023). Quando nasce CLIENTE, marca {@code convertidoEm = now} e emite
     * também o {@link PessoaConvertedToClienteEvent}, para os consumidores da
     * conversão por funil não precisarem de caso especial.
     *
     * Use case de criação deve verificar duplicidade de documento ANTES.
     */
    public static Pessoa create(long tenantId, TipoPessoa tipoPessoa, Documento documento,
                                String nomeContato, String emailContato, String celularContato,
                                String nomeEmpresa, StatusPessoa status) {
        Objects.requireNonNull(status, "status");
        if (status != StatusPessoa.LEAD && status != StatusPessoa.CLIENTE) {
            throw new IllegalArgumentException(
                "Criação de Pessoa só aceita status LEAD ou CLIENTE · recebeu: " + status);
        }
        Instant now = Instant.now();
        PessoaId id = PessoaId.generate();
        Instant convertidoEm = status == StatusPessoa.CLIENTE ? now : null;
        Pessoa pessoa = new Pessoa(
            id, tenantId, tipoPessoa, documento,
            nomeContato, emailContato, celularContato, nomeEmpresa,
            status, convertidoEm,
            null, null, null, null, null,
            now, now
        );
        pessoa.registerEvent(new PessoaCreatedEvent(id, tenantId, tipoPessoa, status, now));
        if (status == StatusPessoa.CLIENTE) {
            pessoa.registerEvent(new PessoaConvertedToClienteEvent(id, tenantId, now));
        }
        return pessoa;
    }

    /** Factory de reconstrução · usado pelo adapter de persistência (não emite eventos). */
    public static Pessoa reconstitute(PessoaId id, long tenantId, TipoPessoa tipoPessoa,
                                      Documento documento, String nomeContato, String emailContato,
                                      String celularContato, String nomeEmpresa,
                                      StatusPessoa status, Instant convertidoEm,
                                      String endereco, String cidade, String uf, String cep, String notas,
                                      Instant createdAt, Instant updatedAt) {
        return new Pessoa(id, tenantId, tipoPessoa, documento, nomeContato, emailContato,
            celularContato, nomeEmpresa, status, convertidoEm,
            endereco, cidade, uf, cep, notas, createdAt, updatedAt);
    }

    // ============ Comportamentos ============

    /**
     * Promove a Pessoa de LEAD para CLIENTE. Idempotente: se já é CLIENTE,
     * é no-op (não emite evento de novo).
     */
    public void convertToCliente() {
        if (status == StatusPessoa.CLIENTE) return;
        Instant now = Instant.now();
        this.status = StatusPessoa.CLIENTE;
        this.convertidoEm = now;
        this.updatedAt = now;
        registerEvent(new PessoaConvertedToClienteEvent(id, tenantId, now));
    }

    /**
     * Atualiza os dados cadastrais editáveis no formulário (tipo, documento e
     * contato). Não muda `status` nem `convertidoEm` — esses só transitam via
     * {@link #convertToCliente()}.
     *
     * A validação de formato do documento (CPF/CNPJ × tipoPessoa) é feita pelo
     * VO {@link Documento}; a unicidade dentro do tenant é responsabilidade do
     * use case (que checa antes de chamar este método).
     */
    public void updateCadastro(TipoPessoa tipoPessoa, Documento documento,
                               String nomeContato, String emailContato,
                               String celularContato, String nomeEmpresa) {
        this.tipoPessoa = Objects.requireNonNull(tipoPessoa, "tipoPessoa");
        this.documento = documento;
        this.nomeContato = validateNome(nomeContato);
        this.emailContato = blankToNull(emailContato);
        this.celularContato = blankToNull(celularContato);
        this.nomeEmpresa = blankToNull(nomeEmpresa);
        this.updatedAt = Instant.now();
    }

    /** Atualiza os dados de contato. Não muda status nem documento. */
    public void updateContato(String nomeContato, String emailContato,
                              String celularContato, String nomeEmpresa) {
        this.nomeContato = validateNome(nomeContato);
        this.emailContato = blankToNull(emailContato);
        this.celularContato = blankToNull(celularContato);
        this.nomeEmpresa = blankToNull(nomeEmpresa);
        this.updatedAt = Instant.now();
    }

    /** Atualiza endereço e notas. Use case decide se é em chamada separada. */
    public void updateEnderecoENotas(String endereco, String cidade, String uf,
                                     String cep, String notas) {
        this.endereco = blankToNull(endereco);
        this.cidade = blankToNull(cidade);
        this.uf = blankToNull(uf);
        this.cep = blankToNull(cep);
        this.notas = blankToNull(notas);
        this.updatedAt = Instant.now();
    }

    /** Define ou troca o documento. Validações de duplicidade ficam no use case. */
    public void setDocumento(Documento documento) {
        this.documento = documento;
        this.updatedAt = Instant.now();
    }

    // ============ Validações ============

    private String validateNome(String nome) {
        Objects.requireNonNull(nome, "nomeContato");
        String t = nome.trim();
        if (t.isEmpty()) throw new IllegalArgumentException("Nome do contato não pode ser vazio");
        if (t.length() > 160) throw new IllegalArgumentException("Nome muito longo (máximo 160)");
        return t;
    }

    private static String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    // ============ Getters ============

    @Override public PessoaId id() { return id; }
    public long tenantId() { return tenantId; }
    public TipoPessoa tipoPessoa() { return tipoPessoa; }
    public Optional<Documento> documento() { return Optional.ofNullable(documento); }
    public String nomeContato() { return nomeContato; }
    public Optional<String> emailContato() { return Optional.ofNullable(emailContato); }
    public Optional<String> celularContato() { return Optional.ofNullable(celularContato); }
    public Optional<String> nomeEmpresa() { return Optional.ofNullable(nomeEmpresa); }
    public StatusPessoa status() { return status; }
    public Optional<Instant> convertidoEm() { return Optional.ofNullable(convertidoEm); }
    public Optional<String> endereco() { return Optional.ofNullable(endereco); }
    public Optional<String> cidade() { return Optional.ofNullable(cidade); }
    public Optional<String> uf() { return Optional.ofNullable(uf); }
    public Optional<String> cep() { return Optional.ofNullable(cep); }
    public Optional<String> notas() { return Optional.ofNullable(notas); }
    public Instant createdAt() { return createdAt; }
    public Instant updatedAt() { return updatedAt; }
}
