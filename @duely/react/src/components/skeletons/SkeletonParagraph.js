import React, { useMemo } from 'react';
import { Util } from '../../util';
import { SkeletonText } from './SkeletonText';

function* generateWordLengths(count, seed) {
  const averageWordLength = 5;
  seed = seed ?? 0;
  const generateRandom = () => Util.pseudoRandom(++seed);

  while (count--) {
    const wordLength = Util.poisson(averageWordLength, generateRandom);
    if (wordLength > 0) yield wordLength;
  }
}

export function SkeletonParagraph({ className, words, seed }) {
  words = words || 20;
  const wordLengths = useMemo(() => Array.from(generateWordLengths(words, seed)), [words, seed]);

  return (
    <p className={className}>
      {wordLengths.map((ch, i) => (
        <SkeletonText key={i} ch={ch} />
      ))}
    </p>
  );
}
