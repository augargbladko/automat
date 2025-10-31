
import { Api, TelegramClient } from "telegram/index.js";
import { StringSession } from "telegram/sessions/index.js";

const phoneNumber = "+12062188125"; // use "+1..." format for US numbers
const apiId = 26841300; // your api_id
const apiHash = "10cf135bf4874a52b7c1452e5b78c0d7"; // your api_hash
const sessionKey = ""

export async function testClient(): Promise<TelegramClient> {
  const session = new StringSession(sessionKey); // You should put your string session here
  const client = new TelegramClient(session, apiId, apiHash, {});
  console.log("Starting client...");
  await client.start({
    phoneNumber,
    phoneCode: async () => prompt('Please enter the code you received: ') || '',
    onError: (err) => console.log(err),
  })
  console.log("Client started.");
  await client.connect(); // This assumes you have already authenticated with .start()
  console.log("Client connected.");

  const result = await client.invoke(
    new Api.contacts.GetBlocked({ offset: 0, limit: 100 })
  );
  console.log("got API result", result);
  return client;
}

testClient()