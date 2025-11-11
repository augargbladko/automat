
import bigInt, { BigInteger } from "big-integer";
import { SupabaseClient } from "supabase-jsr";
import { Api, TelegramClient } from "telegram";
import { Tables, TelegramUser } from "../../types/index.ts";
import { delay } from "../../utils/index.ts";
import { supabaseStoreArray } from "../database/supabase.ts";


export async function recursiveGetParticipants(client: TelegramClient, supabase: SupabaseClient, channel: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZАБДЕЄЖФГИІКЛМНОПРСТУВХЦЧШЩЫЮЯЗ";

  const mcf = await client.invoke(
    new Api.channels.GetFullChannel({
      channel: channel
    }));
  const count = (mcf.fullChat as Api.ChannelFull).participantsCount || -1;
  const channelData = await client.getEntity(channel);
  const channelId = channelData.id;
  const channelHash = (channelData as Api.Channel).accessHash || bigInt(0);
  console.log("Channel data: ", channel, count, channelId, channelHash);
  // console.log('full chat data:', mcf.fullChat);
  
  if (count < 1100000) {
    const result = await GetWithFilter(supabase, channel, channelId, channelHash, "", client);
    await StoreNewTelegramUsers(channel, result, supabase);    
    return;
  }

  for (let i = 0; i < alphabet.length; i++) {
    const c = alphabet[i];
    const result = await GetWithFilter(supabase, channel, channelId, channelHash, c, client);
    await StoreNewTelegramUsers(channel, result, supabase);    
    // at the end of each getwithfilter, we store in supabase, and reset result
  }
          
  return;
  
  }

async function StoreNewTelegramUsers(channel: string, result: { chats: Api.TypeChat[], users: Api.TypeUser[], participants: Api.ChannelParticipant[] }, supabase: SupabaseClient) {
  console.log(`Storing ${result.users.length} users from channel ${channel} into Supabase...`);

  const users: TelegramUser[] = (result.users as Api.User[]).filter((u) => !u.fake && !u.bot && !u.scam).map((u) => {
    return {
      date_joined: result.participants.find(p => p.userId.toString() === u.id.toString())?.date || 0,
      first_name: u.firstName || '',
      id: 0,
      lang_code: u.langCode || 'en',
      last_name: u.lastName || '',
      phone: u.phone || '',
      photo_url: '', // figure this out
      premium: u.premium || false,
      telegram_id: u.id.toString() || '',
      username: u.username || '',

      // this section needs to be set from data
      confirmed_email: false, // todo - set this properly
      email: '', // todo - set this properly
      tokens: 0, // todo - from data
      wallet_address: '', // todo = from walletId
      wallet_id: 0, // todo - from data
      ton_spend: 0, // todo - from data
      tool_flags: 0, // todo - from data
      treasure_flags: 0 // todo - from data
    } as TelegramUser
  });
  await supabaseStoreArray(supabase, users, Tables.telegram_users);
}

async function GetWithFilter(
  supabase: SupabaseClient,
  channel: string,
  channelId: BigInteger,
  channelHash: BigInteger,
  filter: string,
  client: any,
): Promise<{ chats: Api.TypeChat[], users: Api.TypeUser[], participants: Api.ChannelParticipant[] }> {
  const result: {
    chats: Api.TypeChat[],
    users: Api.TypeUser[],
    participants: Api.ChannelParticipant[]
  } = { chats: [], users: [], participants: [] };
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
    console.log(`Fetched ${result.users.length} / ${maxCount} users with filter "${filter}" so far...`);
    console.log('first user', result.users[0]);
    await StoreNewTelegramUsers(channel, result, supabase);
    (ccp.participants as Api.ChannelParticipant[]).forEach((participant) => {
        result.participants.push(participant);
    });

    offset += ccp.participants.length;
    if (offset >= ccp.count || ccp.participants.length == 0) {
      return result;
    }
    
    await delay(2000); // be nice to telegram servers
        
  }
}
