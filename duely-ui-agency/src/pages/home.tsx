import { current_agency_Q, useQuery } from '@duely/client';
import { ErrorScreen, LoadingScreen, Util } from '@duely/react';
import TopBar from 'components/TopBar';
// import useMessage from 'hooks/useMessage';
import Markdown from 'markdown-to-jsx';
// import { BsExclamationDiamond } from 'react-icons/bs';

function Hero() {
  const { data: agency } = useQuery(current_agency_Q);
  return <span className="text-3xl font-bold">{agency?.name}</span>;
}

function Services() {
  const { data: agency } = useQuery(current_agency_Q);
  return <span className="text-2xl font-bold">Services</span>;
}

type MarkdownTemplateProps = {
  markdown: string;
  variables: Record<string, any>;
};

function MarkdownTemplate({ markdown, variables }: MarkdownTemplateProps) {
  markdown = Util.template(markdown, variables);
  return <Markdown children={markdown} options={{ overrides: { Hero, Services } }} />
}

export default function Home() {
  // useMessage(
  //   <div className="flex flex-row items-center space-x-4 font-semibold">
  //     <BsExclamationDiamond className="text-orange-600" />
  //     <span className="text-sm">Duely is still in development</span>
  //   </div>,
  //   { autoHideMs: 6000, show: true }
  // );

  const { data: agency, loading, error } = useQuery(current_agency_Q);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  const hero_markdown = `
Welcome to

<Hero />

overhere, you will find services we offer

<Services />

...
`;

  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <MarkdownTemplate markdown={hero_markdown} variables={{ agency }} />
        </main>
      </div>
    </div>
  );
}
