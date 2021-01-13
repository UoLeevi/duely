export function p(literals: TemplateStringsArray, ...substitutions: string[]) {
  const s = literals.reduce(
    (stringsJoined, currentString, i) => stringsJoined + currentString + (substitutions[i] || ''),
    ''
  );
  return `<p style="font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin: 1em 0;">${s}</p>`;
}

export function br(literals: TemplateStringsArray, ...substitutions: string[]) {
  return `<br style="font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;">`;
}

export function strong(literals: TemplateStringsArray, ...substitutions: string[]) {
  const s = literals.reduce(
    (stringsJoined, currentString, i) => stringsJoined + currentString + (substitutions[i] || ''),
    ''
  );
  return `<strong style="font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; font-weight: bold;">${s}</strong>`;
}

export function em(literals: TemplateStringsArray, ...substitutions: string[]) {
  const s = literals.reduce(
    (stringsJoined, currentString, i) => stringsJoined + currentString + (substitutions[i] || ''),
    ''
  );
  return `<em style="font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;">${s}</em>`;
}

export function a(
  [hrefLiteral, ...literals]: TemplateStringsArray,
  hrefSubstitution: string,
  ...substitutions: string[]
) {
  const s = literals.reduce(
    (stringsJoined, currentString, i) => stringsJoined + currentString + (substitutions[i] || ''),
    ''
  );
  return `<a href="${hrefLiteral}${
    hrefSubstitution || ''
  }" style="color: blue; font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;">${s}</a>`;
}
