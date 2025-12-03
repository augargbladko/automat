import { TelegramClient } from "telegram/index.js"
import { StringSession } from "telegram/sessions/index.js"

const phoneNumber = "+12062188125" // use "+1..." format for US numbers
const apiId = 26841300 // your api_id
const apiHash = "10cf135bf4874a52b7c1452e5b78c0d7" // your api_hash
const sessionKey = ""

async function testClient(): Promise<TelegramClient> {
  const session = new StringSession(sessionKey) // You should put your string session here
  const client = new TelegramClient(session, apiId, apiHash, {})
  console.log("Starting client...")
  await client.start({
    phoneNumber,
    phoneCode: async () => prompt("Please enter the code you received: ") || "",
    onError: (err) => console.log(err),
  })
  console.log("Client started.")
  await client.connect() // This assumes you have already authenticated with .start()
  console.log("Client connected.")

  return client
}

/*
full chat data: {
  CONSTRUCTOR_ID: 1389789291,
  SUBCLASS_OF_ID: 3566872215,
  className: "ChannelFull",
  classType: "constructor",
  flags: 1090658345,
  canViewParticipants: true,
  canSetUsername: false,
  canSetStickers: false,
  hiddenPrehistory: false,
  canSetLocation: false,
  hasScheduled: false,
  canViewStats: false,
  blocked: false,
  flags2: 8196,
  canDeleteChannel: false,
  antispam: false,
  participantsHidden: true,
  translationsDisabled: false,
  storiesPinnedAvailable: false,
  viewForumAsMessages: false,
  restrictedSponsored: false,
  canViewRevenue: false,
  paidMediaAllowed: false,
  canViewStarsRevenue: false,
  paidReactionsAvailable: false,
  stargiftsAvailable: false,
  id: Integer { value: 2253556479n },
  about: "#,1most trusted adult group in the world \n" +
    "chatting enjoying_/And/_making friends\n" +
    "\n" +
    "_biggest group for fun & entertainment_\n" +
    "\n" +
    "only group verified girls are genuine here\n" +
    "for any problm or tag dm to group owner\n" +
    "\n" +
    "    👑 𝗢𝘄𝗻𝗲𝗿 > 》☆ @The_Tg_Star 𓃮",
  participantsCount: 61548,
  adminsCount: null,
  kickedCount: null,
  bannedCount: null,
  onlineCount: 4479,
  readInboxMaxId: 0,
  readOutboxMaxId: 2497366,
  unreadCount: 0,
  chatPhoto: {
    CONSTRUCTOR_ID: 4212750949,
    SUBCLASS_OF_ID: 3581324060,
    className: "Photo",
    classType: "constructor",
    flags: 0,
    hasStickers: false,
    id: Integer { value: 5787376459386571269n },
    accessHash: Integer { value: -4202143463816425324n },
    fileReference: <Buffer 00 69 13 82 42 05 23 a5 fe 74 79 a7 06 f4 28 94 26 88 3e f0 38>,
    date: 1753864505,
    sizes: [
      {
        CONSTRUCTOR_ID: 1976012384,
        SUBCLASS_OF_ID: 399256025,
        className: "PhotoSize",
        classType: "constructor",
        type: "a",
        w: 160,
        h: 160,
        size: 10868
      },
      {
        CONSTRUCTOR_ID: 1976012384,
        SUBCLASS_OF_ID: 399256025,
        className: "PhotoSize",
        classType: "constructor",
        type: "b",
        w: 320,
        h: 320,
        size: 27999
      },
      {
        CONSTRUCTOR_ID: 1976012384,
        SUBCLASS_OF_ID: 399256025,
        className: "PhotoSize",
        classType: "constructor",
        type: "c",
        w: 640,
        h: 640,
        size: 79337
      },
      {
        CONSTRUCTOR_ID: 3769678894,
        SUBCLASS_OF_ID: 399256025,
        className: "PhotoStrippedSize",
        classType: "constructor",
        type: "i",
        bytes: <Buffer 01 28 28 be 4e 06 4d 54 37 bb 9c aa 29 18 ee 45 36 f6 52 5c 44 0e 30 32 7f 2a ad bf 62 6e 2b bb 3c 62 b9 29 d3 56 bb 34 6c 96 4b a7 0c 48 7c 01 f4 c1 ... 227 more bytes>
      }
    ],
    videoSizes: null,
    dcId: 4
  },
  notifySettings: {
    CONSTRUCTOR_ID: 2573347852,
    SUBCLASS_OF_ID: 3475030132,
    className: "PeerNotifySettings",
    classType: "constructor",
    flags: 0,
    showPreviews: null,
    silent: null,
    muteUntil: null,
    iosSound: null,
    androidSound: null,
    otherSound: null,
    storiesMuted: null,
    storiesHideSender: null,
    storiesIosSound: null,
    storiesAndroidSound: null,
    storiesOtherSound: null
  },
  exportedInvite: null,
  botInfo: [
    {
      CONSTRUCTOR_ID: 1300890265,
      SUBCLASS_OF_ID: 4059496923,
      className: "BotInfo",
      classType: "constructor",
      flags: 135,
      hasPreviewMedias: false,
      userId: Integer { value: 6336634497n },
      description: "languages: 🇬🇧 🇹🇷 🇦🇿 🇷🇺 🇮🇷 🇮🇳\n" +
        "\n" +
        "Using me is quite simple 😊\n" +
        "You can get information about me with /help",
      descriptionPhoto: null,
      descriptionDocument: null,
      commands: [
        {
          CONSTRUCTOR_ID: 3262826695,
          SUBCLASS_OF_ID: 236872386,
          className: "BotCommand",
          classType: "constructor",
          command: "lang",
          description: "change language"
        },
        {
          CONSTRUCTOR_ID: 3262826695,
          SUBCLASS_OF_ID: 236872386,
          className: "BotCommand",
          classType: "constructor",
          command: "help",
          description: "about this bot"
        },
        {
          CONSTRUCTOR_ID: 3262826695,
          SUBCLASS_OF_ID: 236872386,
          className: "BotCommand",
          classType: "constructor",
          command: "utag",
          description: "Tags all users /utag your message"
        },
        {
          CONSTRUCTOR_ID: 3262826695,
          SUBCLASS_OF_ID: 236872386,
          className: "BotCommand",
          classType: "constructor",
          command: "atag",
          description: "Tags only admins /atag your message"
        },
        {
          CONSTRUCTOR_ID: 3262826695,
          SUBCLASS_OF_ID: 236872386,
          className: "BotCommand",
          classType: "constructor",
          command: "reload",
          description: "Update list"
        },
        {
          CONSTRUCTOR_ID: 3262826695,
          SUBCLASS_OF_ID: 236872386,
          className: "BotCommand",
          classType: "constructor",
          command: "cancel",
          description: "Cancel to tag"
        },
        {
          CONSTRUCTOR_ID: 3262826695,
          SUBCLASS_OF_ID: 236872386,
          className: "BotCommand",
          classType: "constructor",
          command: "privacy",
          description: "Privacy Policy"
        }
      ],
      menuButton: null,
      privacyPolicyUrl: "https://telegra.ph/Privacy-Policy-07-03-58",
      appSettings: null,
      verifierSettings: null
    },
    {
      CONSTRUCTOR_ID: 1300890265,
      SUBCLASS_OF_ID: 4059496923,
      className: "BotInfo",
      classType: "constructor",
      flags: 3,
      hasPreviewMedias: false,
      userId: Integer { value: 7275553578n },
      description: "https://t.me/+Z6LiaY7aCuwxYTFk\nhttps://t.me/+Z6LiaY7aCuwxYTFk",
      descriptionPhoto: null,
      descriptionDocument: null,
      commands: null,
      menuButton: null,
      privacyPolicyUrl: null,
      appSettings: null,
      verifierSettings: null
    },
    {
      CONSTRUCTOR_ID: 1300890265,
      SUBCLASS_OF_ID: 4059496923,
      className: "BotInfo",
      classType: "constructor",
      flags: 3,
      hasPreviewMedias: false,
      userId: Integer { value: 609517172n },
      description: "Heya! I'm Rose - a group management bot here to help you manage your groups as effectively as possible.\n" +
        "\n" +
        "Press START!",
      descriptionPhoto: null,
      descriptionDocument: null,
      commands: null,
      menuButton: null,
      privacyPolicyUrl: null,
      appSettings: null,
      verifierSettings: null
    },
    {
      CONSTRUCTOR_ID: 1300890265,
      SUBCLASS_OF_ID: 4059496923,
      className: "BotInfo",
      classType: "constructor",
      flags: 7,
      hasPreviewMedias: false,
      userId: Integer { value: 210944655n },
      description: "Combot will transform your Telegram chat and channels into a full-fledged community. Chat and comment moderation, analytics, anti-spam, the best trigger system in Telegram, and much more. Over 175,000 groups use Combot, join us!\n" +
        "\n" +
        "1. Add the bot to your group, and it will start working automatically.\n" +
        "2. Log in to manage your groups: combot.org/sign_in",
      descriptionPhoto: null,
      descriptionDocument: null,
      commands: [
        {
          CONSTRUCTOR_ID: 3262826695,
          SUBCLASS_OF_ID: 236872386,
          className: "BotCommand",
          classType: "constructor",
          command: "stat",
          description: "See chat stats. For more options start the bot via direct message."
        }
      ],
      menuButton: null,
      privacyPolicyUrl: null,
      appSettings: null,
      verifierSettings: null
    }
  ],
  migratedFromChatId: null,
  migratedFromMaxId: null,
  pinnedMsgId: 2497163,
  stickerset: null,
  availableMinId: null,
  folderId: null,
  linkedChatId: null,
  location: null,
  slowmodeSeconds: 10,
  slowmodeNextSendDate: null,
  statsDc: null,
  pts: 5074503,
  call: null,
  ttlPeriod: 86400,
  pendingSuggestions: null,
  groupcallDefaultJoinAs: null,
  themeEmoticon: null,
  requestsPending: null,
  recentRequesters: null,
  defaultSendAs: null,
  availableReactions: {
    CONSTRUCTOR_ID: 1713193015,
    SUBCLASS_OF_ID: 320742581,
    className: "ChatReactionsSome",
    classType: "constructor",
    reactions: [
      {
        CONSTRUCTOR_ID: 455247544,
        SUBCLASS_OF_ID: 1570858401,
        className: "ReactionEmoji",
        classType: "constructor",
        emoticon: "❤"
      }
    ]
  },
  reactionsLimit: 1,
  stories: null,
  wallpaper: null,
  boostsApplied: null,
  boostsUnrestrict: null,
  emojiset: null,
  botVerification: null,
  stargiftsCount: null
}
*/
