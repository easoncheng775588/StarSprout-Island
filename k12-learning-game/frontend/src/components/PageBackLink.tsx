import { Link } from 'react-router-dom';

interface PageBackLinkProps {
  to: string;
  label: string;
}

export function PageBackLink({ to, label }: PageBackLinkProps) {
  return (
    <Link className="page-back-link" to={to}>
      {label}
    </Link>
  );
}
