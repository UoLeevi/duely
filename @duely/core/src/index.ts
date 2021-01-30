import { DocumentNode } from 'graphql';
import * as tdn from './typed-document-nodes';

export * from './typed-document-nodes';
export * from './util';
export * from './Country';
export * from './Currency';
export * from './DataUrl';
export * from './PaginationParams';

// TODO: remove this when the nested fragment issues are fixed
// see: https://github.com/dotansimha/graphql-code-generator/issues/4684
// see: https://github.com/dotansimha/graphql-code-generator/issues/4573
function dedupe(ds: DocumentNode[]) {
  for (let d of ds) {
    const names: string[] = [];
    const res = [];
    for (let def of d.definitions) {
      let name: string | undefined = (def as any).name?.value;
      if (name && !names.includes(name)) {
        res.push(def);
        names.push(name);
      }
    }
    (d as any).definitions = res;
  }
}

function isDocumentNode(d: DocumentNode | any): d is DocumentNode {
  return d?.kind === 'Document';
}

const documents = Object.values(tdn).filter(isDocumentNode);
dedupe(documents);
