import { Util } from '@duely/react';

export function Image({ className, src, alt, loading, htmlFor, ...props }) {
  className = Util.createClassName('relative grid place-items-center', className);
  const Element = htmlFor ? 'label' : 'div';

  return (
    <Element className={className} htmlFor={htmlFor}>
      {src ? (
        <img
          className="absolute object-contain w-full h-full"
          src={src}
          alt={alt ?? ''}
          {...props}
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute w-8 h-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )}
    </Element>
  );
}
