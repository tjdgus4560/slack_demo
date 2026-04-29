import { ChannelChatScreen, getInitialChannelChat } from "@/features/channel-chat";

export default async function Home() {
  const snapshot = await getInitialChannelChat();

  return <ChannelChatScreen initialSnapshot={snapshot} />;
}
