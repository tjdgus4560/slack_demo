import { currentUser } from "@clerk/nextjs/server";
import { ChannelChatScreen, getInitialChannelChat } from "@/features/channel-chat";

export default async function Home() {
  const user = await currentUser();
  const snapshot = await getInitialChannelChat(
    user
      ? {
          displayName: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          username: user.username,
        }
      : undefined,
  );

  return <ChannelChatScreen initialSnapshot={snapshot} />;
}
