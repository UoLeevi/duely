import Markdown from 'markdown-to-jsx';
import { useQuery, services_agreement_Q } from '@duely/client';
import { SkeletonParagraph, Modal, Button } from '@duely/react';

type ServicesAgreementModalContentProps = {
  ok: () => void;
};

export default function ServicesAgreement({ ok }: ServicesAgreementModalContentProps) {
  const { data, loading, error } = useQuery(services_agreement_Q);

  return (
    <>
      <Modal.Body className="prose-sm prose sm:prose lg:prose-lg">
        {error && error.message}
        {loading && <SkeletonParagraph />}
        {data && <Markdown>{data}</Markdown>}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={ok} dense color="gray">
          OK
        </Button>
      </Modal.Footer>
    </>
  );
}
