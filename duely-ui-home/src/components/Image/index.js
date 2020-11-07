import { BsImage } from 'react-icons/bs';
import { Util } from '@duely/react';

export function Image({ className, src, alt, loading, htmlFor, ...props }) {

  className = Util.createClassName('relative grid place-items-center', className);
  const Element = htmlFor ? 'label' : 'div';

  return (
    <Element className={className} htmlFor={htmlFor}>
      {src
        ? <img className="absolute w-full h-full object-contain" src={src} alt={alt ?? ''} {...props} />
        : <BsImage className="absolute w-8 h-8 text-gray-400" />
      }
    </Element>
  );
}
