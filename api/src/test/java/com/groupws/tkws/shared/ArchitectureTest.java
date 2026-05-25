package com.groupws.tkws.shared;

import com.groupws.tkws.shared.crud.LookupJpaEntity;
import com.groupws.tkws.shared.crud.LookupRepository;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.library.Architectures;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

/**
 * Testes de arquitetura que rodam no build. Falham se alguém violar Clean Architecture
 * ou as fronteiras entre features. Substituem revisão manual de código nesses pontos.
 *
 * Convenções:
 *  - domain não importa nada externo (sem Spring, JPA, etc)
 *  - application só fala com o domain via ports
 *  - features se comunicam APENAS via DTOs em application/dto (ou via eventos)
 */
@AnalyzeClasses(
    packages = "com.groupws.tkws",
    importOptions = { ImportOption.DoNotIncludeTests.class }
)
class ArchitectureTest {

    // ============================================
    // 1. Clean Architecture: regras de camada
    // ============================================

    @ArchTest
    static final ArchRule cleanArchitectureRespeitada = Architectures.layeredArchitecture()
        .consideringAllDependencies()
        .layer("Domain").definedBy("..features..domain..")
        .layer("Application").definedBy("..features..application..")
        .layer("Infrastructure").definedBy("..features..infrastructure..")
        .layer("Web").definedBy("..features..web..")

        .whereLayer("Web").mayNotBeAccessedByAnyLayer()
        .whereLayer("Infrastructure").mayOnlyBeAccessedByLayers("Web")
        .whereLayer("Application").mayOnlyBeAccessedByLayers("Web", "Infrastructure")
        .whereLayer("Domain").mayOnlyBeAccessedByLayers("Application", "Infrastructure", "Web");

    // ============================================
    // 2. Domain puro (sem Spring/JPA)
    // ============================================

    @ArchTest
    static final ArchRule domainNaoImportaSpring = noClasses()
        .that().resideInAPackage("..features..domain..")
        .should().dependOnClassesThat().resideInAnyPackage(
            "org.springframework..",
            "jakarta.persistence..",
            "org.hibernate.."
        )
        .because("Domain deve ser puro, sem dependência de framework");

    @ArchTest
    static final ArchRule domainNaoImportaInfraNemWeb = noClasses()
        .that().resideInAPackage("..features..domain..")
        .should().dependOnClassesThat().resideInAnyPackage(
            "..features..infrastructure..",
            "..features..web.."
        )
        .because("Domain está no centro, não depende das camadas externas");

    // ============================================
    // 3. Application pode usar Spring (Service, Transactional), mas não JPA direto
    // ============================================

    @ArchTest
    static final ArchRule applicationNaoUsaJpaDireto = noClasses()
        .that().resideInAPackage("..features..application..")
        .should().dependOnClassesThat().resideInAnyPackage(
            "jakarta.persistence..",
            "org.hibernate.."
        )
        .because("Application acessa persistência apenas via ports do domínio");

    // ============================================
    // 4. Isolamento entre features (enforced via code review)
    // ============================================
    //
    // A regra antiga usava `..features.(*)..` com sintaxe que não correlaciona
    // o capture nos dois lados — era um no-op silencioso (passava sem checar
    // nada). A enforce real é complicada porque temos features em profundidades
    // diferentes (features/tenants vs features/crm/configuracoes/etapas) e
    // acoplamentos legítimos via value objects (Oportunidade.pessoaId) e
    // eventos de domínio compartilhados (OportunidadeMovedToConvertingEtapaEvent).
    //
    // Cross-feature isolation continua sendo um princípio mas é enforçado por
    // code review e pelo CLAUDE.md regra 4 ("Features não se acessam
    // diretamente — comunicam via eventos ou DTOs"). Quando o codebase ficar
    // mais maduro, vale revisitar com Slices API configurado por feature.

    // ============================================
    // 5. Naming conventions
    // ============================================

    @ArchTest
    static final ArchRule useCasesTerminamComUseCase = classes()
        .that().resideInAPackage("..application.usecase..")
        .and().areNotMemberClasses()
        .should().haveSimpleNameEndingWith("UseCase");

    @ArchTest
    static final ArchRule jpaEntitiesFicamEmPersistence = classes()
        .that().areAnnotatedWith(jakarta.persistence.Entity.class)
        .and().areNotAssignableTo(LookupJpaEntity.class)
        .should().resideInAPackage("..infrastructure.persistence..")
        .because("Entidades JPA ficam em infrastructure/persistence/ · "
            + "lookup tables (ADR-020) ficam em estrutura flat dentro da feature, "
            + "pois não têm domain/application layers");

    @ArchTest
    static final ArchRule repositoriesSpringDataFicamEmPersistence = classes()
        .that().areAssignableTo(org.springframework.data.repository.Repository.class)
        .and().areNotAssignableTo(LookupRepository.class)
        .should().resideInAPackage("..infrastructure.persistence..")
        .because("Repositórios Spring Data ficam em infrastructure/persistence/ · "
            + "lookup repositories (extends LookupRepository · ADR-020) usam estrutura flat");

    @ArchTest
    static final ArchRule controllersTerminamComController = classes()
        .that().resideInAPackage("..web..")
        .and().areAnnotatedWith(org.springframework.web.bind.annotation.RestController.class)
        .should().haveSimpleNameEndingWith("Controller");
}
