"use client";

interface WhatsAppButtonProps {
  number: string;
  message?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function WhatsAppButton({
  number,
  message = "",
  className = "",
  style,
  children,
}: WhatsAppButtonProps) {
  const encoded = encodeURIComponent(message);
  const href = `https://wa.me/${number}${encoded ? `?text=${encoded}` : ""}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
