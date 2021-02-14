import React, { useCallback } from 'react';
import { useQuery, useMutation, product_Q, delete_product_M } from '@duely/client';
import { Modal, Button, SkeletonParagraph, ConfirmationModal } from '@duely/react';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useHistory, useLocation } from 'react-router-dom';
import produce from 'immer';
import { usePrevious } from 'hooks';

export function ConfirmProductDeletionModal() {
  // Get product id from url query string and replace history entry if cancelled
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let product_id = searchParams.get('delete_product');
  const show = product_id != null;
  const prev = usePrevious(product_id);
  product_id = product_id ?? prev;

  const { data: product, loading: loadingProduct } = useQuery(
    product_Q,
    { product_id: product_id! },
    { skip: !product_id }
  );
  const [deleteProduct] = useMutation(delete_product_M);

  const close = useCallback(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('delete_product');

    const location = produce(history.location, (location) => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    history.replace(location);
  }, [history]);

  async function confirmDeletion(e: React.MouseEvent) {
    e.preventDefault();
    const res = await deleteProduct({ product_id: product_id! });
    if (res?.success) close();
  }

  return (
    <ConfirmationModal
      show={show}
      confirm={confirmDeletion}
      cancel={close}
      heading="Delete product"
      confirmText="Delete"
      color="red"
      icon={<BsExclamationTriangle />}
      loading={loadingProduct}
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to delete product{' '}
        <span className="font-semibold">{product?.name}</span>? The product will be permanently
        removed. This action cannot be undone.
      </p>
    </ConfirmationModal>
  );
}
