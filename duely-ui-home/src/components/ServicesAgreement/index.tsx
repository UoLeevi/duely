import { SkeletonParagraph, Modal, Button, useMarkdoc } from '@duely/react';

type ServicesAgreementModalContentProps = {
  ok: () => void;
};

export default function ServicesAgreement({ ok }: ServicesAgreementModalContentProps) {
  const { children, loading, error } = useMarkdoc({
    markdown_id: 'duely-files/legal/services-agreement.md'
  });

  return (
    <>
      <Modal.Body className="prose-sm prose prose-indigo">
        {error && error.message}
        {loading && <SkeletonParagraph />}
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={ok} dense color="gray">
          OK
        </Button>
      </Modal.Footer>
    </>
  );
}
