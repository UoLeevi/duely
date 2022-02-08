import React from 'react';
import { hasOwnProperty, hasProperty } from '@duely/util';

export type IconName = keyof typeof icons;

export type IconProp = IconName | React.ReactNode;

export function getIconElement(icon: IconProp): React.ReactNode {
  if (icon && typeof icon === 'string' && hasProperty(icons, icon)) {
    return icons[icon] as React.ReactNode;
  }

  return icon;
}

const iconPathDefinitions = {
  'arrow-sm-down': {
    solid: [
      'M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z'
    ],
    outline: []
  },
  briefcase: {
    solid: [
      'M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z',
      'M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z'
    ],
    outline: [
      'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    ]
  },
  'chevron-right': {
    solid: [
      'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
    ],
    outline: []
  },
  clipboard: {
    solid: [
      'M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z',
      'M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z'
    ],
    outline: [
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    ]
  },
  'clipboard-check': {
    solid: [
      'M9 2a1 1 0 000 2h2a1 1 0 100-2H9z',
      'M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
    ],
    outline: []
  },
  'credit-card': {
    solid: [
      'M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z',
      'M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
    ],
    outline: [
      'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
    ]
  },
  exclamation: {
    solid: [
      'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
    ],
    outline: []
  },
  plus: {
    solid: [
      'M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
    ],
    outline: []
  },
  check: {
    solid: [
      'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
    ],
    outline: []
  },
  'check-circle': {
    solid: [
      'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
    ],
    outline: []
  },
  x: {
    solid: [
      'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
    ],
    outline: []
  },
  'external-link': {
    solid: [
      'M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z',
      'M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z'
    ],
    outline: []
  },
  'question-mark-circle': {
    solid: [
      'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
    ],
    outline: []
  },
  search: {
    solid: [
      'M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
    ],
    outline: []
  },
  user: {
    solid: ['M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'],
    outline: []
  },
  'office-building': {
    solid: [
      'M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z'
    ],
    outline: []
  },
  cog: {
    solid: [],
    outline: [
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    ]
  },
  'dots-vertical': {
    solid: [],
    outline: [
      'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
    ]
  },
  duplicate: {
    solid: [],
    outline: [
      'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
    ]
  },
  'exclamation-circle': {
    solid: [],
    outline: ['M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z']
  },
  eye: {
    solid: [],
    outline: [
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
    ]
  },
  home: {
    solid: [],
    outline: [
      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    ]
  },
  identification: {
    solid: [],
    outline: [
      'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2'
    ]
  },
  'shopping-cart': {
    solid: [],
    outline: [
      'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
    ]
  },
  trash: {
    solid: [],
    outline: [
      'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
    ]
  },
  pencil: {
    solid: [],
    outline: [
      'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
    ]
  },
  'receipt-tax': {
    solid: [],
    outline: [
      'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z'
    ]
  },
  users: {
    solid: [],
    outline: [
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    ]
  },
  template: {
    solid: [],
    outline: [
      'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
    ]
  }
} as const;

export type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'name' | 'd'> & {
  className?: string;
  strokeWidth?: number | string;
  solid?: boolean;
} & (
    | { name: keyof typeof iconPathDefinitions & string; d?: undefined }
    | { d: string | string[]; name?: undefined }
  );

export function Icon({ className, strokeWidth, solid, name, d, ...props }: IconProps) {
  className ??= solid ? 'w-[1.25em] h-[1.25em]' : 'w-[1.5em] h-[1.5em]';

  let ds: readonly string[];

  if (name) {
    ds = iconPathDefinitions[name][solid ? 'solid' : 'outline'];
  } else if (Array.isArray(d)) {
    ds = d;
  } else {
    ds = [d];
  }

  return solid ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      {ds.map((d, i) => (
        <path key={i} fillRule="evenodd" d={d} clipRule="evenodd" />
      ))}
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      {ds.map((d, i) => (
        <path
          key={i}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth ?? 2}
          d={d}
        />
      ))}
    </svg>
  );
}

// see: https://heroicons.com/
// TODO: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use
export const icons = {
  'arrow-sm-down.solid': <Icon name="arrow-sm-down" solid />,
  'briefcase.solid': <Icon name="briefcase" solid />,
  'chevron-right.solid': <Icon name="chevron-right" solid />,
  'clipboard.solid': <Icon name="clipboard" solid />,
  'clipboard-check.solid': <Icon name="clipboard-check" solid />,
  'credit-card.solid': <Icon name="credit-card" solid />,
  'exclamation.solid': <Icon name="exclamation" solid />,
  'plus.solid': <Icon name="plus" solid />,
  'check.solid': <Icon name="check" solid />,
  'check-circle.solid': <Icon name="check-circle" solid />,
  'x.solid': <Icon name="x" solid />,
  'external-link.solid': <Icon name="external-link" solid />,
  'question-mark-circle.solid': <Icon name="question-mark-circle" solid />,
  'search.solid': <Icon name="search" solid />,
  'user.solid': <Icon name="user" solid />,
  'office-building.solid': <Icon name="office-building" solid />,
  briefcase: <Icon name="briefcase" />,
  clipboard: <Icon name="clipboard" />,
  cog: <Icon name="cog" />,
  'credit-card': <Icon name="credit-card" />,
  'dots-vertical': <Icon name="dots-vertical" />,
  duplicate: <Icon name="duplicate" />,
  'exclamation-circle': <Icon name="exclamation-circle" />,
  eye: <Icon name="eye" />,
  home: <Icon name="home" />,
  identification: <Icon name="identification" />,
  'shopping-cart': <Icon name="shopping-cart" />,
  trash: <Icon name="trash" />,
  pencil: <Icon name="pencil" />,
  'receipt-tax': <Icon name="receipt-tax" />,
  users: <Icon name="users" />,
  template: <Icon name="template" />
} as const;
