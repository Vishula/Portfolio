// Re-mounts on every navigation, so the CSS fade-and-rise plays per page (and works without JS).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
