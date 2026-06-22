type PageHeaderProps = {
  title: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[1.625rem] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
          {title}
        </h1>
        {description && (
          typeof description === "string"
            ? <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
            : <div className="mt-1">{description}</div>
        )}
      </div>
      {children && <div className="mt-3 flex items-center gap-3 sm:mt-0">{children}</div>}
    </div>
  );
}
