
import { BigInteger } from "big-integer";
import { SupabaseClient } from "supabase-jsr";
import { Api, TelegramClient } from "telegram";


export async function recursiveGetParticipants(client: TelegramClient, supabase: SupabaseClient, channel: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZАБДЕЄЖФГИІКЛМНОПРСТУВХЦЧШЩЫЮЯЗ";

  const result: { chats: Api.TypeChat[], users: Api.TypeUser[], participants: Api.ChannelParticipant[], count: number } = { chats: [], users: [], participants: [], count: 0 };
  const user_ids: BigInteger[] = [];

  const mcf = await client.invoke(
    new Api.channels.GetFullChannel({
      channel: channel
    }));
  result.count = (mcf.fullChat as Api.ChannelFull).participantsCount || -1;
  const channelData = await client.getEntity(channel);
  const channelId =channelData.id;
  const channelHash = (channelData as Api.Channel).accessHash;
    console.log("Channel data: ", result.count, channelId, channelHash);

  if (result.count < 11000) {
    await GetWithFilter('');
    // store in supabase here too...
    
    return;
  }

  for (let i = 0; i < alphabet.length; i++) {
    const c = alphabet[i];
    await GetWithFilter(c);
    // at the end of each getwithfilter, we store in supabase, and reset result
  }
          
  return;
  
  async function GetWithFilter(filter: string) {
    {
      let ccp: Api.channels.ChannelParticipants;
      let maxCount = 0;
      for (let offset = 0; ;) {
        ccp = await client.invoke(
          new Api.channels.GetParticipants({
            channel: channelId,
            filter: new Api.ChannelParticipantsSearch({ q: filter }),
            offset: offset,
            limit: 1024,
            hash: channelHash,
          })
        ) as Api.channels.ChannelParticipants;
        if (ccp.count > maxCount) {
          maxCount = ccp.count;
        }
        ccp.chats.forEach((chat) => result.chats.push(chat));
        ccp.users.forEach((user) => result.users.push(user));
        (ccp.participants as Api.ChannelParticipant[]).forEach((participant) => {
          if (!user_ids.includes(participant.userId)) {
            user_ids.push(participant.userId);
            result.participants.push(participant);
          }
          offset += ccp.participants.length;
          if (offset >= ccp.count || ccp.participants.length == 0) {
            return;
          }
        });
            
      }
    }
  }
}