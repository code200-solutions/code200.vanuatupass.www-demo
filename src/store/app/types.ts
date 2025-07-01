export type ConsoleLineEntry = { text: string; timestamp: number };

export type AppState = {
  // CIBA config
  realm: string;
  clientId: string;
  clientSecret: string;
  templateId: string;
  authReqId: string;
  grantType: string;

  // Console content
  consoleLines: ConsoleLineEntry[];
};
