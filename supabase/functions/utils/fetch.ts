const USER_AGENTS = [
  "Mozilla/5.0 (Linux; Android 12; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G973F; Android 12; SDK 31; HIGH)",
  "Mozilla/5.0 (Linux; Android 12; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G973F; Android 12; SDK 31; HIGH)",
  "Mozilla/5.0 (Linux; Android 12; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G973F; Android 12; SDK 31; HIGH)",
  "Mozilla/5.0 (Linux; Android 12; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G973F; Android 12; SDK 31; HIGH)",
  "Mozilla/5.0 (Linux; Android 12; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G973F; Android 12; SDK 31; HIGH)",
  "Mozilla/5.0 (Linux; Android 12; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G973F; Android 12; SDK 31; HIGH)",
  "Mozilla/5.0 (Linux; Android 16; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G990B2; Android 16; SDK 36; HIGH)",
  "Mozilla/5.0 (Linux; Android 16; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G990B2; Android 16; SDK 36; HIGH)",
  "Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.116 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-A137F; Android 14; SDK 34; LOW)",
  "Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.116 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-A137F; Android 14; SDK 34; LOW)",
  "Mozilla/5.0 (Linux; Android 12; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.116 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G970F; Android 12; SDK 31; HIGH)",
  "Mozilla/5.0 (Linux; Android 12; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.116 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G970F; Android 12; SDK 31; HIGH)",
  "Mozilla/5.0 (Linux; Android 13; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G770F; Android 13; SDK 33; HIGH)",
  "Mozilla/5.0 (Linux; Android 13; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G770F; Android 13; SDK 33; HIGH)",
  "Mozilla/5.0 (Linux; Android 12; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Samsung SM-G970F; Android 12; SDK 31; HIGH)",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 iMe/12.2.2",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36 Telegram-Android/12.2.10 (Huawei ELE-L29; Android 10; SDK 29; HIGH)",
]

export function getUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}
