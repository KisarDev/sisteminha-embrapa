export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-1 py-6 text-xs text-[var(--color-text-tertiary)]">
          <p>Sistema Inteligente para o Sisteminha Embrapa</p>
          <p className="text-[11px]">&copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
