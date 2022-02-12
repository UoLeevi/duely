import { createClassName } from '@duely/util';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { getIconElement, IconProp, icons } from '../../icons';

export const SearchResult = Object.assign(SearchResultRoot, {
  DashboardPage: DashboardPageSearchResult
});

export type SearchResultProps = LinkProps & {
  icon?: IconProp
};

function SearchResultRoot({ children, className, icon, ...linkProps }: SearchResultProps) {
  return (
    <Link
      className={createClassName(
        className,
        'hover:bg-indigo-600 hover:text-white text-sm flex rounded-md space-x-3 py-0.5 px-1.5 text-gray-700 whitespace-nowrap items-center'
      )}
      {...linkProps}
    >
      {getIconElement(icon)}
      {children}
    </Link>
  );
}

export type DashboardPageSearchResult = {
  page: 'subscriptions' | 'products';
};

function DashboardPageSearchResult({ page }: DashboardPageSearchResult) {
  const { icon, to, path } = dashboardPageResults[page];
  const pathElements: React.ReactNode[] = [];

  path.forEach((element, i) => {
    const key = i + 1;
    pathElements.push(<span key={key}>{element}</span>);
    if (i < path.length - 1)
      pathElements.push(<span key={-key}>{icons['chevron-right.solid']}</span>);
  });

  return (
    <SearchResultRoot to={to} icon={icon}>
      <span className="flex items-center space-x-1">{pathElements}</span>
    </SearchResultRoot>
  );
}

const dashboardPageResults = {
  subscriptions: {
    path: ['Orders', 'Subscriptions'],
    to: '/dashboard/orders/subscriptions',
    icon: icons['credit-card.solid']
  },
  products: {
    path: ['Products'],
    to: '/dashboard/products',
    icon: icons['box.solid']
  }
};
