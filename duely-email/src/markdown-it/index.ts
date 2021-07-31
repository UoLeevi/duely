import MarkdownIt from 'markdown-it';

import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import { theme } from '../theme';

export const md = new MarkdownIt();

md.use(require('markdown-it-attrs'), {
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: ['class']
});

override_AddStyleAttribute(
  'link_open',
  `border: 0; margin: 0; padding: 0; color: ${theme.links.textColor} !important; text-decoration: none;`
);

override_If(
  'paragraph_open',
  (token) => token.level === 0,
  () => `
<table class="copy width width--mobile" border="0" cellpadding="0" cellspacing="0" width="600" style="min-width: 600px;">
  <tbody>
    <tr>
      <td class="spacer spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64">
        <div class="spacer spacer--filler"> </div>
      </td>
      <td style="border: 0; margin: 0; padding: 0; color: ${theme.textColor} !important; font-family: ${theme.fontFamily}; font-size: 16px; line-height: 24px;">
`
);
override_If(
  'paragraph_close',
  (token) => token.level === 0,
  () => `
      </td>
      <td class="spacer spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64">
        <div class="spacer spacer--filler"> </div>
      </td>
    </tr>
    <tr>
      <td class="spacer spacer--stacked" colspan="3" height="12" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;">
        <div class="spacer spacer--filler"> </div>
      </td>
    </tr>
  </tbody>
</table>
`
);

override_IfHasClass(
  'link_open',
  'button',
  ({ href }) => `
<table class="button button--fullWidth" border="0" cellpadding="0" cellspacing="0" width="100%">
  <tbody>
    <tr>
      <td align="center" class="button-area" height="38" valign="middle" style="border: 0; margin: 0; padding: 0; background-color: ${theme.buttons.backgroundColor}; border-radius: 5px; text-align: center;">
        <a class="button-link" href="${href}" style="border: 0; margin: 0; padding: 0; color: #ffffff; display: block; height: 38px; text-align: center; text-decoration: none;">
          <span class="button-internal" style="border: 0; margin: 0; padding: 0; color: #ffffff; font-family: ${theme.fontFamily}; font-size: 16px; font-weight: bold; height: 38px; line-height: 38px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: middle; white-space: nowrap; width: 100%;">
`
);
override_IfHasClass(
  'link_close',
  'button',
  () => `
          </span>
        </a>
      </td>
    </tr>
  </tbody>
</table>
`
);

function override_If(
  rule: keyof Renderer.RenderRuleRecord,
  predicate: (token: Token) => boolean,
  renderer: (htmlAttributes: Record<string, string>) => string
) {
  const defaultRender =
    md.renderer.rules[rule] ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules[rule] = function (tokens, idx, options, env, self) {
    const token = tokens[idx];

    if (predicate(token)) {
      return renderer(Object.fromEntries(token.attrs ?? []));
    }

    return defaultRender(tokens, idx, options, env, self);
  };
}

function override_IfHasClass(
  rule: keyof Renderer.RenderRuleRecord,
  className: string,
  renderer: (htmlAttributes: Record<string, string>) => string
) {
  const defaultRender =
    md.renderer.rules[rule] ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules[rule] = function (tokens, idx, options, env, self) {
    const token = tokens[idx];

    if (
      tokenHasClass(token.nesting === -1 ? findMatchingOpeningToken(tokens, idx) : token, className)
    ) {
      return renderer(Object.fromEntries(token.attrs ?? []));
    }

    return defaultRender(tokens, idx, options, env, self);
  };
}

function override_AddAttributes(
  rule: keyof Renderer.RenderRuleRecord,
  ...attributes: [name: string, value: string][]
): void {
  const defaultRender =
    md.renderer.rules[rule] ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules[rule] = function (tokens, idx, options, env, self) {
    const token = tokens[idx];

    for (const [name, value] of attributes) {
      if (token.attrIndex(name) >= 0) {
        continue;
      }

      token.attrPush([name, value]);
    }

    return defaultRender(tokens, idx, options, env, self);
  };
}

function override_AddStyleAttribute(rule: keyof Renderer.RenderRuleRecord, style: string) {
  override_AddAttributes(rule, ['style', style]);
}

function findMatchingOpeningToken(tokens: Token[], idx: number): Token {
  const closeToken = tokens[idx];
  const level = closeToken.level;

  if (closeToken.nesting !== -1) throw new Error('Closing token expected');

  while (--idx >= 0) {
    if (tokens[idx].level === level) {
      return tokens[idx];
    }
  }

  throw new Error('Unexpected error');
}

function tokenHasClass(token: Token, className: string) {
  const classAttrIndex = token.attrIndex('class');

  if (classAttrIndex < 0) {
    return false;
  }

  const classNames = token.attrs![classAttrIndex][1];
  return hasClass(classNames, className);
}

function hasClass(classNames: string, className: string) {
  const startIndex = classNames.indexOf(className);

  if (startIndex < 0) {
    return false;
  }

  if (startIndex > 0 && classNames[startIndex].trim() !== '') {
    return false;
  }

  const endIndex = className.length + startIndex;
  return classNames.length === endIndex || classNames[endIndex].trim() === '';
}
