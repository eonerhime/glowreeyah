interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = '' }: Props) {
  return (
    <div className={`max-w-6xl mx-auto px-6 py-12 ${className}`}>
      {children}
    </div>
  );
}
