import TawkChat from '@/components/ui/TawkChat';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <TawkChat />
    </>
  );
}
