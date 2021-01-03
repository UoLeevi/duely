import {
  useMutation,
  create_page_block_M,
  current_agency_Q,
  delete_page_block_M,
  update_page_block_M,
  useQuery,
  page_block_Q,
  page_Q,
  agency_Q,
  service_Q
} from '@duely/client';
import {
  AgencyFragment,
  PageFragment,
  Page_BlockFragment,
  Page_Block_DefinitionFragment,
  ServiceFragment
} from '@duely/core';
import {
  Card,
  ErrorScreen,
  Form,
  FormButton,
  FormField,
  FormInfoMessage,
  LoadingScreen,
  useFormMessages,
  Util
} from '@duely/react';
import { pageBlockComponents } from 'components/page-blocks';
import { usePrevious } from 'hooks';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

type PageEditorContextValue = {
  page: PageFragment;
  agency: AgencyFragment;
  service?: ServiceFragment;
  selectedBlock: Page_BlockFragment | null;
  selectBlock(block: Page_BlockFragment): void;
  goBackToBlockList(): void;
  editBlockForm: ReturnType<typeof useForm>;
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
      <svg
        className="w-4 h-4 text-gray-300"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
      <div className="flex-1">{block?.definition?.name}</div>
      <div></div>
    </PageEditorSidebarItemTile>
  );
}

type PageEditorSidebarNewBlockItemTileProps = {};

function PageEditorSidebarNewBlockItemTile(props: PageEditorSidebarNewBlockItemTileProps) {
  const { goBackToBlockList } = usePageEditor();
  return (
    <PageEditorSidebarItemTile onClick={goBackToBlockList}>
      <svg
        className="w-4 h-4 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
      <div className="text-sm font-medium">Add new block</div>
    </PageEditorSidebarItemTile>
  );
}

type PageBlockPreviewProps = {
  block: Page_BlockFragment;
};

function PageBlockPreview({ block }: PageBlockPreviewProps) {
  const { selectedBlock, selectBlock, page, agency, service, editBlockForm } = usePageEditor();
  const className = Util.createClassName(block === selectedBlock && 'overlay-ring');
  const data = useMemo(() => JSON.parse(block.data), [block.data]);
  const values = block === selectedBlock ? editBlockForm.watch() : data;

  const definition = block.definition;
  const Component = pageBlockComponents[definition.name];

  return (
    <div className={className} onClick={() => selectBlock(block)}>
      <div className="pointer-events-none">
        <Component key={block.id} page={page} agency={agency} service={service} {...values} />
      </div>
    </div>
  );
}

function PageEditorEditBlockForm() {
  const { editBlockForm: form, selectedBlock } = usePageEditor();
  const block = selectedBlock!;
  const [updatePageBlock, stateUpdate] = useMutation(update_page_block_M);
  // const [deletePageBlock, stateDelete] = useMutation(delete_page_block_M);

  const formLoading = stateUpdate.loading;

  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

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
      {definition.fields.map((field) => (
        <FormField
          key={field.name}
          form={form}
          name={field.name}
          label={field.label}
          type={field.type}
        />
      ))}
      <div className="flex flex-row items-center pt-3 space-x-4">
        <FormButton form={form} spinner dense loading={formLoading}>
          Save
        </FormButton>
        <FormButton form={form} type="reset" dense disabled={formLoading}>
          Cancel
        </FormButton>
        <FormInfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
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
  const { selectedBlock, goBackToBlockList, page } = usePageEditor();
  return selectedBlock ? (
    <>
      <div className="flex items-center pb-1.5 space-x-3 border-b">
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
        <h3 className="font-medium text-gray-800">{selectedBlock.definition.name}</h3>
      </div>
      <PageEditorEditBlockForm />
    </>
  ) : (
    <>
      <div className="flex items-center pb-1.5 space-x-3 border-b">
        <div className="w-5 h-5"></div>
        <h3 className="font-medium text-gray-800">Page blocks</h3>
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

  const { data: service, loading: serviceLoading } = useQuery(
    service_Q,
    { service_id: page?.service?.id! },
    { skip: !page || !page?.service }
  );
  const loading = pageLoading || agencyLoading || serviceLoading;

  const element = useMemo(
    () =>
      loading || !page || agencyLoading || serviceLoading || page.blocks.length === 0 ? null : (
        <>
          {page.blocks.map((block) => (
            <PageBlockPreview key={block.id} block={block} />
          ))}
        </>
      ),
    [agencyLoading, loading, page, serviceLoading]
  );

  if (loading) return <LoadingScreen />;
  if (pageError || !page || !agency) return <ErrorScreen />;

  return (
    <PageEditorContext.Provider
      value={{
        selectedBlock,
        selectBlock: block => {
          if (selectedBlock === block) return;
          const defaultValues = JSON.parse(block.data);
          editBlockForm.reset(defaultValues);
          setSelectedBlock(block);
        },
        goBackToBlockList: () => setSelectedBlock(null),
        agency,
        service: service ?? undefined,
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
