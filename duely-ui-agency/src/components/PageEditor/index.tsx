import {
  useMutation,
  update_page_block_M,
  useQuery,
  page_Q,
  agency_Q,
  product_Q
} from '@duely/client';
import { AgencyFragment, PageFragment, Page_BlockFragment, ProductFragment } from '@duely/core';
import {
  Card,
  ErrorScreen,
  Form,
  LoadingScreen,
  useFormMessages,
  useForm,
  UseFormReturn,
  DynamicFormFields,
  Icon
} from '@duely/react';
import { pageBlockComponents } from '~/components/page-blocks';
import React, { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClassName } from '@duely/util';
import { flushSync } from 'react-dom';

type PageEditorContextValue = {
  page: PageFragment;
  agency: AgencyFragment;
  product?: ProductFragment;
  selectedBlock: Page_BlockFragment | null;
  selectBlock(block: Page_BlockFragment): void;
  goBackToBlockList(): void;
  editBlockForm: UseFormReturn;
};

const PageEditorContext = React.createContext<PageEditorContextValue | null>(null);

function usePageEditor() {
  return useContext(PageEditorContext)!;
}

type PageBlockProps = {
  block: Page_BlockFragment;
};

type PageEditorSidebarItemTileProps = React.HTMLAttributes<HTMLElement>;

function PageEditorSidebarItemTile({ children, ...props }: PageEditorSidebarItemTileProps) {
  return (
    <div
      className="flex items-center p-1 space-x-4 text-sm font-medium transition-colors rounded hover:bg-gray-100"
      {...props}
    >
      {children}
    </div>
  );
}

type PageEditorSidebarBlockItemTileProps = {} & PageBlockProps;

function PageEditorSidebarBlockItemTile({ block }: PageEditorSidebarBlockItemTileProps) {
  const { selectBlock } = usePageEditor();
  return (
    <PageEditorSidebarItemTile onClick={() => selectBlock(block)}>
      <Icon name="view-grid" solid className="w-4 h-4 text-gray-300" />
      <div className="flex-1">{block?.definition?.name}</div>
    </PageEditorSidebarItemTile>
  );
}

type PageEditorSidebarNewBlockItemTileProps = {};

function PageEditorSidebarNewBlockItemTile(props: PageEditorSidebarNewBlockItemTileProps) {
  const { goBackToBlockList } = usePageEditor();
  return (
    <PageEditorSidebarItemTile onClick={goBackToBlockList}>
      <Icon name="plus" solid className="w-4 h-4" />
      <div className="text-sm font-medium">Add new block</div>
    </PageEditorSidebarItemTile>
  );
}

type PageBlockPreviewProps = {
  block: Page_BlockFragment;
};

function PageBlockPreview({ block }: PageBlockPreviewProps) {
  const { selectedBlock, selectBlock, page, agency, product, editBlockForm } = usePageEditor();
  const className = createClassName(block === selectedBlock && 'overlay-ring');
  const data = useMemo(() => JSON.parse(block.data), [block.data]);
  const formValue = editBlockForm.useFormValue();
  const values = block === selectedBlock ? formValue : data;

  const definition = block.definition;
  const Component = pageBlockComponents[definition.name];

  return (
    <div className={className} onClick={() => selectBlock(block)}>
      <div className="pointer-events-none">
        <Component key={block.id} page={page} agency={agency} product={product} {...values} />
      </div>
    </div>
  );
}

function PageEditorEditBlockForm() {
  const { editBlockForm: form, selectedBlock } = usePageEditor();
  const block = selectedBlock!;
  const data = useMemo(() => JSON.parse(block.data), [block.data]);
  const [updatePageBlock, stateUpdate] = useMutation(update_page_block_M);
  // const [deletePageBlock, stateDelete] = useMutation(delete_page_block_M);

  const formLoading = stateUpdate.loading;

  const { infoMessage, successMessage, setSuccessMessage, errorMessage, setErrorMessage } =
    useFormMessages();

  const definition = block!.definition;

  async function onSubmit(data: Record<string, any>) {
    const res = await updatePageBlock({ page_block_id: block.id, data: JSON.stringify(data) });

    if (res?.success) {
      setSuccessMessage('Saved');
      return;
    } else {
      setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    }
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-3">
      <DynamicFormFields fields={definition.fields ?? []} defaultValues={data} />
      <div className="flex flex-row items-center pt-3 space-x-4">
        <Form.Button dense>Save</Form.Button>
        <Form.Button type="reset" dense>
          Cancel
        </Form.Button>
        <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
      </div>
    </Form>
  );
}

function PageEditorSidebarBlockList() {
  const { page } = usePageEditor();
  return (
    <>
      <div className="flex flex-col space-y-1">
        {page?.blocks.map((block) => (
          <PageEditorSidebarBlockItemTile key={block.id} block={block} />
        ))}
        <PageEditorSidebarNewBlockItemTile />
      </div>
    </>
  );
}

function PageEditorSidebar() {
  const { selectedBlock, goBackToBlockList } = usePageEditor();
  return selectedBlock ? (
    <>
      <div className="flex items-center pb-1.5 space-x-3 border-b dark:border-gray-700">
        <button className="focus:outline-none" onClick={goBackToBlockList} type="button">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h3 className="font-medium text-gray-800 dark:text-gray-300">
          {selectedBlock.definition.name}
        </h3>
      </div>
      <PageEditorEditBlockForm />
    </>
  ) : (
    <>
      <div className="flex items-center pb-1.5 space-x-3 border-b dark:border-gray-700">
        <div className="w-5 h-5"></div>
        <h3 className="font-medium text-gray-800 dark:text-gray-300">Page blocks</h3>
      </div>
      <PageEditorSidebarBlockList />
    </>
  );
}

export function PageEditor() {
  const { page_id } = useParams<{ page_id: string }>();
  const { data: page, loading: pageLoading, error: pageError } = useQuery(page_Q, { page_id });
  const [selectedBlock, setSelectedBlock] = useState<Page_BlockFragment | null>(null);
  const editBlockForm = useForm();

  const { data: agency, loading: agencyLoading } = useQuery(
    agency_Q,
    { agency_id: page?.agency.id! },
    { skip: !page }
  );

  const { data: product, loading: productLoading } = useQuery(
    product_Q,
    { product_id: page?.product?.id! },
    { skip: !page || !page?.product }
  );
  const loading = pageLoading || agencyLoading || productLoading;

  const element = useMemo(
    () =>
      loading || !page || agencyLoading || productLoading || page.blocks.length === 0 ? null : (
        <>
          {page.blocks.map((block) => (
            <PageBlockPreview key={block.id} block={block} />
          ))}
        </>
      ),
    [agencyLoading, loading, page, productLoading]
  );

  if (loading) return <LoadingScreen />;
  if (pageError || !page || !agency) return <ErrorScreen />;

  return (
    <PageEditorContext.Provider
      value={{
        selectedBlock,
        selectBlock: (block) => {
          if (selectedBlock === block) return;
          const defaultValues = JSON.parse(block.data);
          editBlockForm.reset(defaultValues);

          // TODO: This causes setState in render bug. Has some connection to form fields.
          setSelectedBlock(block);
        },
        goBackToBlockList: () => setSelectedBlock(null),
        agency,
        product: product ?? undefined,
        page,
        editBlockForm
      }}
    >
      <div className="flex flex-col w-full h-full space-y-2 md:space-y-0 md:space-x-2 md:space-x-reverse md:flex-row-reverse">
        <Card className="flex-shrink-0 w-full px-3 py-6 space-y-3 md:w-2/5 lg:w-1/3 xl:w-1/4 2xl:w-1/5">
          <PageEditorSidebar />
        </Card>
        <Card className="relative flex-1 overflow-hidden border">{element}</Card>
      </div>
    </PageEditorContext.Provider>
  );
}
