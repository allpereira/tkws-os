import type { ReactNode } from 'react';

type AuthGateProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function AuthGate({ title, description, children }: AuthGateProps) {
  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="text-xl font-semibold">{title}</h1>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
      {children ? <div className="mt-4 space-y-2 text-sm">{children}</div> : null}
    </div>
  );
}

type AuthSetupRequiredProps = {
  docsPath?: string;
};

export function AuthSetupRequired({ docsPath = 'docs/04-AUTH.md' }: AuthSetupRequiredProps) {
  return (
    <AuthGate
      title="Autenticação não configurada"
      description="O frontend precisa do Client ID da aplicação Web criada no Zitadel."
    >
      <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
        <li>
          Siga o setup em <code className="rounded bg-muted px-1">{docsPath}</code> (projeto TKWS
          OS → app Web → PKCE).
        </li>
        <li>
          Copie <code className="rounded bg-muted px-1">frontend/.env.example</code> para{' '}
          <code className="rounded bg-muted px-1">frontend/.env.local</code>.
        </li>
        <li>
          Defina <code className="rounded bg-muted px-1">VITE_ZITADEL_CLIENT_ID</code> com o
          Client ID gerado.
        </li>
        <li>Reinicie o Vite (<code className="rounded bg-muted px-1">npm run dev</code>).</li>
      </ol>
      <p className="text-muted-foreground">
        Com Docker Compose no frontend: crie <code className="rounded bg-muted px-1">.env</code>{' '}
        na raiz do repositório com <code className="rounded bg-muted px-1">ZITADEL_CLIENT_ID=...</code>{' '}
        e rode <code className="rounded bg-muted px-1">docker compose up -d --build frontend</code>.
      </p>
    </AuthGate>
  );
}

type AuthErrorPanelProps = {
  title: string;
  message: string;
  onRetry?: () => void;
};

export function AuthErrorPanel({ title, message, onRetry }: AuthErrorPanelProps) {
  return (
    <AuthGate title={title} description={message}>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Tentar novamente
        </button>
      ) : null}
      <p className="text-muted-foreground">
        Confira se o Zitadel está em execução (
        <code className="rounded bg-muted px-1">http://localhost:8088</code>), se o redirect URI{' '}
        <code className="rounded bg-muted px-1">http://localhost:5173/callback</code> está
        cadastrado no app Web e se o Client ID em{' '}
        <code className="rounded bg-muted px-1">frontend/.env.local</code> está correto.
      </p>
    </AuthGate>
  );
}
