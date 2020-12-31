import { useMutation, create_page_block_M, current_agency_Q, delete_page_block_M, update_page_block_M, useQuery, page_block_Q } from '@duely/client';
import { ErrorScreen, Form, FormButton, FormField, FormInfoMessage, LoadingScreen, useFormMessages } from '@duely/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HeroWithAngledImage } from './HeroWithAngledImage';

// const pageBlockDefinitions = {
//   HeroWithAngledImage: {
//     name: 'HeroWithAngledImage',
//     fields: [
//       { name: 'headline1', type: 'text', label: 'Headline 1', default: 'Agency name' },
//       { name: 'headline2', type: 'text', label: 'Headline 2', default: 'Services' },
//       { name: 'paragraph', type: 'textarea', label: 'Paragraph', default: 'lorem ipsum dolor' },
//       { name: 'imageSrc', type: 'text', label: 'Image URL', default: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80' }
//     ]
//   }
// };

export const pageBlockComponents = {
  'Hero with angled image': HeroWithAngledImage
};

type PageBlockEditorProps = {
  page_block_id: string;
};

export function PageBlockEditor({ page_block_id }: PageBlockEditorProps) {
  const {
    data: block,
    loading: blockLoading,
    error: blockError
  } = useQuery(page_block_Q, { page_block_id });

  const loading = blockLoading;
  const error = blockError;

  const form = useForm();
  const reset = form.reset;

  // useEffect(() => {
  //   if (!definition) return;
  //   const defaultValues = Object.fromEntries(
  //     definition.fields.map((f) => [f.name, Util.template(f.default ?? '', { agency })])
  //   );
  //   reset(defaultValues);
  // }, [reset, definition]);

  useEffect(() => {
    if (!block) return;
    const defaultValues = JSON.parse(block.data);
    reset(defaultValues);
  }, [reset, block]);

  const [createPageBlock, stateCreate] = useMutation(create_page_block_M);
  const [updatePageBlock, stateUpdate] = useMutation(update_page_block_M);
  const [deletePageBlock, stateDelete] = useMutation(delete_page_block_M);

  const formLoading = stateCreate.loading || stateUpdate.loading || stateDelete.loading;

  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  if (loading) return <LoadingScreen />;
  if (error || !block) return <ErrorScreen />;

  const definition = block.definition;
  const Component = block && pageBlockComponents[definition.name as keyof typeof pageBlockComponents];

  if (!Component) return <ErrorScreen />;

  const values = form.watch();

  async function onSubmit(data: Record<string, any>) {

    const res = await updatePageBlock({ page_block_id, data: JSON.stringify(data) });

    if (res?.success) {
      setSuccessMessage('Saved');
      return;
    } else {
      setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    }
  }

  return (
    <div className="flex flex-col w-full md:flex-row">
      <Form form={form} onSubmit={onSubmit} className="flex-shrink-0 w-full px-3 py-6 space-y-3 border-r md:w-2/5 lg:w-1/3 xl:w-1/4 2xl:w-1/5">
        <h3 className="font-medium text-gray-800">{definition.name}</h3>
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
      <div className="relative flex-1">
        <Component {...values} />
      </div>
    </div>
  );
}
