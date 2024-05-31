export default function CenteredLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-w-0 max-w-2xl grow sm:shrink lg:max-w-2xl h-full mx-auto flex flex-col ">{children}</div>;
}
