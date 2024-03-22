import Conversation from '../Conversation';

// eslint-disable-next-line @next/next/no-async-client-component
export default function Chat({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Conversation />
    </>
  );
}
