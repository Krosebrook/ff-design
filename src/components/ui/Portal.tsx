import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  id?: string;
}

export function Portal({ children, id = 'ff-portal' }: PortalProps) {
  const elRef = useRef<HTMLElement | null>(null);

  if (!elRef.current) {
    let host = document.getElementById(id);
    if (!host) {
      host = document.createElement('div');
      host.id = id;
      document.body.appendChild(host);
    }
    elRef.current = host;
  }

  useEffect(() => {
    const host = elRef.current;
    if (host && !document.body.contains(host)) {
      document.body.appendChild(host);
    }
  }, []);

  return createPortal(children, elRef.current);
}
