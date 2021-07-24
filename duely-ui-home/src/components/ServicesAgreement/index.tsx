import Markdown from 'markdown-to-jsx';
import { useQuery, markdown_Q } from '@duely/client';
import { SkeletonParagraph, Modal, Button } from '@duely/react';

type ServicesAgreementModalContentProps = {
  ok: () => void;
};

export default function ServicesAgreement({ ok }: ServicesAgreementModalContentProps) {
  const { data, loading, error } = useQuery(markdown_Q, {
    markdown_id: 'duely-files/legal/services-agreement.md'
  });

  return (
    <>
      <Modal.Body className="prose-sm prose prose-indigo">
        {error && error.message}
        {loading && <SkeletonParagraph />}
        {data && <Markdown>{data.data}</Markdown>}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={ok} dense color="gray">
          OK
        </Button>
      </Modal.Footer>
    </>
  );
}
