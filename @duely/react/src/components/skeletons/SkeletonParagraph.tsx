import React, { useMemo } from 'react';
import { createClassName, poisson, pseudoRandom } from '@duely/util';
import { SkeletonText } from './SkeletonText';

type SkeletonParagraphProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
> & {
  words?: number;
  seed?: number;
};

export function SkeletonParagraph({ className, words, seed }: SkeletonParagraphProps) {
  words ||= 20;
  const wordLengths = useMemo(() => Array.from(generateWordLengths(words!, seed)), [words, seed]);

  return (
    <p className={className}>
      {wordLengths.map((ch, i) => (
        <SkeletonText key={i} ch={ch} />
      ))}
    </p>
  );
}

function* generateWordLengths(count: number, seed?: number) {
  const averageWordLength = 5;
  seed ??= 0;
  const generateRandom = () => pseudoRandom(++seed!);

  while (count--) {
    const wordLength = poisson(averageWordLength, generateRandom);
    if (wordLength > 0) yield wordLength;
  }
}
