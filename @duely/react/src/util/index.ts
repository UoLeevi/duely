import type { ImageInput } from '@duely/core';
import { isPrivateIp, omitUndefined } from '@duely/util';
import { DocumentNode, print as printGqlQuery } from 'graphql';

export const Util = {
  readFileAsDataUrl,
  readFileAsImageInput,
  estimateImageColor,
  findFirstFocusableChild,
  createGraphQLPlaygroundUrl,
  fetchRecapthcaToken,
  getReactElement
};

// see: https://github.com/graphql/graphql-playground/issues/1018#issuecomment-762935106
function createGraphQLPlaygroundUrl(
  query?: DocumentNode,
  variables?: object,
  tabName?: string
): URL {
  const jwt = localStorage.getItem('user-jwt') ?? localStorage.getItem('visitor-jwt');
  const baseUrl = 'https://api.duely.app';

  // tabs must be an array
  const tabsData = [
    {
      endpoint: baseUrl + '/graphql',
      name: tabName,
      // tab variables, NOTE: variables are unique in that they must be passed to the VariableEditor as a String, hence JSON.stringify
      variables: JSON.stringify(variables),
      headers: { authorization: `Bearer ${jwt}` },
      // tab query
      query: query && printGqlQuery(query)
    }
  ].map(omitUndefined);

  // create tabsQueryParam
  const tabsQueryParam = new URLSearchParams({
    tabs: JSON.stringify(tabsData)
  }).toString();

  // concat with baseUrl
  return new URL(`${baseUrl}?${tabsQueryParam}`);
}

// see: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
async function readFileAsDataUrl(file: File | null | undefined): Promise<string | null> {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = reject;
      reader.onload = async () => {
        if (!reader.result) {
          reject(new Error('Unable to read file as Data-URL.'));
          return;
        }

        const dataUrl = reader.result as string;
        resolve(dataUrl);
      };
    } catch (err: any) {
      reject(err);
    }
  });
}

async function readFileAsImageInput(file: File | null | undefined): Promise<ImageInput | null> {
  if (!file) return null;
  const dataUrl = await readFileAsDataUrl(file);
  if (!dataUrl) return null;
  const color = (await estimateImageColor(dataUrl)) ?? '#ffffff';
  return {
    name: file.name,
    data: dataUrl,
    color
  };
}

function estimateImageColor(url: string): Promise<string> {
  return new Promise((resolve) => {
    const context = document.createElement('canvas').getContext('2d');

    if (!context) {
      throw new Error('');
    }

    const img = new Image();
    img.src = url;
    img.onload = function () {
      context.drawImage(img, 0, 0, 1, 1);
      const hex =
        '#' +
        Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3))
          .map((c) => Math.round(c).toString(16).padStart(2, '0'))
          .join('');

      resolve(hex);
    };
  });
}

function findFirstFocusableChild(parent: ParentNode) {
  return parent.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
}

declare global {
  interface Window {
    __duely: {
      reCAPTCHA_site_key: string;
    };
    grecaptcha: any;
  }
}

function fetchRecapthcaToken(action?: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (
      !window.__duely.reCAPTCHA_site_key ||
      location.hostname === 'localhost' ||
      isPrivateIp(location.hostname)
    ) {
      resolve(undefined);
    }

    window.grecaptcha.ready(() => {
      return window.grecaptcha
        .execute(window.__duely.reCAPTCHA_site_key, { action: action ?? 'submit' })
        .then(function (token: string) {
          resolve(token);
        });
    });
  });
}

function getReactElement(
  node: React.ReactNode | ((props?: Record<string, any>) => React.ReactNode),
  props?: Record<string, any>
) {
  return typeof node === 'function' ? node(props) : node;
}
