export function p(literals, ...substitutions) {
  const s = literals.reduce((stringsJoined, currentString, i) => stringsJoined + currentString + (substitutions[i] || ''), '');
  return `<p style="font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin: 1em 0;">${s}</p>`;
}

export function br(literals, ...substitutions) {
  return `<br style="font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;">`;
}

export function strong(literals, ...substitutions) {
  const s = literals.reduce((stringsJoined, currentString, i) => stringsJoined + currentString + (substitutions[i] || ''), '');
  return `<strong style="font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; font-weight: bold;">${s}</strong>`;
}

export function em(literals, ...substitutions) {
  const s = literals.reduce((stringsJoined, currentString, i) => stringsJoined + currentString + (substitutions[i] || ''), '');
  return `<em style="font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;">${s}</em>`;
}

export function a([hrefLiteral, ...literals], hrefSubstitution, ...substitutions) {
  const s = literals.reduce((stringsJoined, currentString, i) => stringsJoined + currentString + (substitutions[i] || ''), '');
  return `<a href="${hrefLiteral}${hrefSubstitution || ''}" style="color: blue; font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;">${s}</a>`;
}
