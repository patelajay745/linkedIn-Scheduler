import { Empty } from "../retroui/Empty";

export const Error = () => {
  return (
    <Empty>
      <Empty.Content>
        <Empty.Icon className="size-10 md:size-12" />
        <Empty.Title>No Results</Empty.Title>
        <Empty.Separator />
        <Empty.Description>
          Something breaks ! Try again later
        </Empty.Description>
      </Empty.Content>
    </Empty>
  );
};
