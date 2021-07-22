import { Card, LinkButton, Util } from '@duely/react';

type DashboardGetStartedCardProps = {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
} & (
  | {
      button: React.ReactNode;
    }
  | {
      to: string;
      buttonText: string;
    }
);

export function DashboardGetStartedCard({
  title,
  description,
  icon,
  ...rest
}: DashboardGetStartedCardProps) {
  return (
    <Card className="relative h-full overflow-hidden">
      <div className="absolute top-[-20%] bottom-[-20%] right-[-10%] z-0 w-2/5 text-white transform pointer-events-none bg-gray-100 rotate-12 grid place-items-center">
        <div className="grid transform -translate-x-4 -rotate-12 place-items-center">{icon}</div>
      </div>
      <div className="z-10 flex flex-1">
        <div className="flex flex-col w-5/6 h-full px-8 py-6 space-y-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="flex-1 text-sm font-medium text-gray-600">{description}</p>

          {Util.hasProperty(rest, 'button') ? (
            rest.button
          ) : (
            <LinkButton to={rest.to} color="indigo" className="text-sm">
              {rest.buttonText}
            </LinkButton>
          )}
        </div>
      </div>
    </Card>
  );
}
