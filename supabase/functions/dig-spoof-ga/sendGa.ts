import { testSupabaseUser } from "../ton/test.ts";
import { getWalletAddress } from "../ton/tonWallet.ts";
import { SupabaseUser } from "../users/data/types.ts";
import { generatePromoCode } from "../users/data/wordlist.ts";

export enum GaType {
  initial = "initial",
  day_first = "day_first",
  normal = "normal",
}

// many/day: game_results(60)
// page_view(60) /play(10) and /home(10)
// cta_seen(20) scroll(20)
    
export enum EventName {
  first_visit = "first_visit", // 1 time
  wallet_connected = 'wallet_connected', // 1 time
  promoCreated = 'promo_created', // 1 time




  // 4 session per day; 2 track calls per session - one for page views, one for all the rest.
  page_view = 'page_view', // home: 7/session , play: 8/session, airdrop: 2/session, quests 1/session friends: 0.5/session // 2000msec+
  dailyRewards = 'daily_rewards', // 0.2/session
  gameResults = 'game_results', // 10/session  1600msec
  login = "login", // 1/session
  scroll = 'scroll', // 4/session   25 msec
  ctaSeen = 'cta_seen', // 4/session   15-106 seconds
  ctaTaken = 'cta_taken', // 0.4/session
  questOpen = 'quest_open', // 0.5/session
  questComplete = 'quest_complete', // 0.6/session
}

interface MpEventParams {
    session_id: string,
    engagement_time_msec: number
    // tODO other params based on event type
  }

interface MpEvent {
  name: EventName,
  params: MpEventParams & Record<string, string | number | undefined>
}

interface GaLocation {
  city: string,
  region_id: string,
  country_id: string,
}

interface GaDevice {
  category: string, //mobile/web
  // language: string, // lang code
  screen_resolution: string,
  operating_system: string,
  // operating_system_version: string,
  // model: string,
  // brand: string,
  browser: string,
  // browser_version: string
}

interface MpBody {
  timestamp_micros: string;
  client_id: string;
  events: MpEvent[]; // max 25 events
  user_location: GaLocation;
  device: GaDevice;
}


const clientId = (user: SupabaseUser) => {
  return `${1600000000 + user.telegram_id}.${1600000000 + Math.floor(user.telegram_id * 0.29315743)}`;
}

const userLocation = (user: SupabaseUser): GaLocation => {
  return {
    city: user.city,
    region_id: user.region_id,
    country_id: user.country_id,
  }
}

const deviceInfo = (user: SupabaseUser): GaDevice => {
  return {
    category: user.category,
    screen_resolution: user.screen_resolution,
    operating_system: user.operating_system,
    browser: user.browser,
  }
}

async function createCreationGA(user: SupabaseUser, now: number): Promise<MpEvent[]> {
  const session_id = now.toString()
  const wallet = await getWalletAddress(user.wallet_id, user.referral_group);
  return [
      {
        name: EventName.wallet_connected,
        params: {
          session_id,
          engagement_time_msec: Math.floor(Math.random() * 4000) + 1500,
          wallet,
        }
      },
      {
        name: EventName.promoCreated,
        params: {
          session_id,
          engagement_time_msec: Math.floor(Math.random() * 1000) + 500,
          promo_code: generatePromoCode(user.telegram_id.toString()),
        }
      },
    ]
}

function createSessionPageGa(user: SupabaseUser, now: number): MpBody {
  const session_id = now.toString()
  const eventList: string[] = ['home', 'play', 'home', 'play', 'home', 'play', 'home', 'play', 'airdrop', 'quests', 'airdrop']
  if (Math.random() < 0.5) {
    eventList.push('friends');
  }
  const extraHome = Math.floor(Math.random() * 6);
  const extraPlay = 1 + Math.floor(Math.random() * 6);
  for (let i = 0; i < extraHome; i++) {
    eventList.push('home');
  }
  for (let i = 0; i < extraPlay; i++) {
    eventList.push('play');
  }
  eventList.sort(() => Math.random() - 0.5);

  return {
    client_id: clientId(user),
    timestamp_micros: (now * 1000).toString(),
    user_location: userLocation(user),
    device: deviceInfo(user),
    events: eventList.map((page) => {
    return {
      name: EventName.page_view,
      params: {
        session_id,
        engagement_time_msec: Math.floor(page === 'home' ? Math.random() * 20000 + 5000
          : page === 'play' ? Math.random() * 50000 + 20000
            : page === 'airdrop' ? Math.random() * 25000 + 5000
              : page === 'quests' ? Math.random() * 40000 + 5000
                : Math.random() * 20000 + 5000),
        page_location: 'https://dig-it-gold.vercel.app/game',
        page_path: `/${page}`,
        page_title: page ? `${page} page` : undefined,
      }
    }
  }),
  }
}

function getEventPlayParams(event: EventName, session_id: string, user: SupabaseUser): MpEventParams & Record<string, string | number | undefined> {
  const params = {
    session_id,
        engagement_time_msec: Math.floor(event === EventName.login ? Math.random() * 1000 + 100
          : event === EventName.gameResults ? Math.random() * 2000 + 1000
            : event === EventName.ctaSeen || event === EventName.ctaTaken ? Math.random() * 300 + 100
              : event === EventName.questOpen ? Math.random() * 200 + 100
                : Math.random() * 2000 + 500),
  }
  switch (event) {
    case EventName.gameResults:
      {
        const multiplier = user.user_level < 6 ? user.user_level + 1 : user.user_level < 9 ? user.user_level * 2 - 4 : user.user_level === 9 ? 15 : 20;
        const isPoints = Math.random() < 0.7;
        return {
          ...params,
          reel_0: Math.floor(Math.random() * 27),
          reel_1: Math.floor(Math.random() * 27),
          reel_2: Math.floor(Math.random() * 27),
          multiplier: multiplier,
          level: user.user_level,
          response_level: user.user_level,
          points: isPoints ? Math.floor(Math.random() * 500 + 100) * 1000 * multiplier : 0,
          tokens: !isPoints ? Math.floor(Math.random() * 20 + 10) * 50 : 0,
          energy: 0,
        };
      }
    // We're faking these ones
    case EventName.ctaSeen:
    case EventName.ctaTaken:
    default:
      return params;
  }
}

function createSessionPlayGa(user: SupabaseUser, now: number): MpBody {
  const session_id = now.toString()

  /* 

  gameResults = 'game_results', // 10/session  1600msec
  ctaSeen = 'cta_seen', // 4/session   15-106 seconds
  ctaTaken = 'cta_taken', // 0.4/session
  questOpen = 'quest_open', // 0.5/session
  questComplete = 'quest_complete', // 0.6/session
  */
  
  const eventList: EventName[] = [EventName.login,
    EventName.gameResults, EventName.gameResults, EventName.gameResults, EventName.ctaSeen,
    EventName.gameResults, EventName.gameResults, EventName.gameResults, EventName.ctaSeen,
    EventName.gameResults, EventName.gameResults, EventName.gameResults, EventName.ctaSeen,];
  
  if (Math.random() < 0.2) {
    eventList.splice(1, 0, EventName.dailyRewards);
  }
  if (Math.random() < 0.4) {
    eventList.push(EventName.ctaTaken);
  }
  if (Math.random() < 0.5) {
    eventList.push(EventName.questOpen);
    if (Math.random() < 0.9) {
      eventList.push(EventName.questComplete);
    }
  }
  

  // page_view
  return {
    client_id: clientId(user),
    timestamp_micros: (now * 1000).toString(),
    user_location: userLocation(user),
    device: deviceInfo(user),
    events: eventList.map((event) => {
    return {
      name: event,
      params: {
        ...getEventPlayParams(event, session_id, user),
      }
    }
  }),
  }
}

async function sendGa(mpBody: MpBody, desc: string) {
  const gaUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${Deno.env.get("NEXT_PUBLIC_GA_TRACKING_ID")}&api_secret=${Deno.env.get("GA_API_SECRET")}`;
      
  // send the play data
  // send the page data
  const response = await fetch(gaUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mpBody),
  });
  if(!response.ok) {
    console.error(`GA ${desc} response not ok:`, response.status, response);
  }
}

export async function sendGaForUser(user: SupabaseUser, isFirstSignup: boolean) {
  const now = Date.now()

  const sessionPlayGa = createSessionPlayGa(user, now);
  const sessionPageGa = createSessionPageGa(user, now);

  sessionPlayGa.events.length = 0
  if (isFirstSignup) {
    const creationGaEvents = await createCreationGA(user, now);
    sessionPlayGa.events.splice(0, 0, ...creationGaEvents);
  }

  await sendGa(sessionPlayGa, 'play session for ' + user.telegram_id);
  await sendGa(sessionPageGa, 'page session for ' + user.telegram_id);
}



// deno run --allow-all --env-file supabase/functions/dig-spoof-ga/sendGa.ts

async function sendBogusGa() {
  const user: SupabaseUser = testSupabaseUser();
  const session_id = Date.now().toString()
  const mpBody: MpBody = {
    client_id: clientId(user),
    timestamp_micros: (Date.now() * 1000).toString(),
    user_location: userLocation(user),
    device: deviceInfo(user),
    events: [] as MpEvent[],
  }
  for (let i = 0; i < 5; i++) {
    mpBody.events.push({
      name: EventName.page_view,
      params: {
        session_id,
        engagement_time_msec: 15000 + Math.floor(Math.random() * 20000),
        page_location: 'https://dig-it-gold.vercel.app/game',
        page_path: '/test',
        page_title: 'test page',
        debug_mode: 1,
      }
    })
  }
  await sendGa(mpBody, 'bogus test');
}