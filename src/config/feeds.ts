import type { Feed } from '@/types';

// Helper to create RSS proxy URL (Vercel)
const rss = (url: string) => `/api/rss-proxy?url=${encodeURIComponent(url)}`;

// Keep dedicated alias for feeds historically fetched through Railway.
// `rss-proxy` now handles secure server-side fallback.
const railwayRss = (url: string) => rss(url);

// Source tier system for prioritization (lower = more authoritative)
// Tier 1: Wire services - fastest, most reliable breaking news
// Tier 2: Major outlets - high-quality journalism
// Tier 3: Specialty sources - domain expertise
// Tier 4: Aggregators & blogs - useful but less authoritative
export const SOURCE_TIERS: Record<string, number> = {
  // Tier 1 - Wire Services
  'Reuters': 1,
  'AP News': 1,
  'AFP': 1,
  'Bloomberg': 1,

  // Tier 2 - Major Outlets
  'BBC World': 2,
  'BBC Middle East': 2,
  'Guardian World': 2,
  'Guardian ME': 2,
  'NPR News': 2,
  'CNN World': 2,
  'CNBC': 2,
  'MarketWatch': 2,
  'Al Jazeera': 2,
  'Financial Times': 2,
  'Politico': 2,
  'EuroNews': 2,
  'France 24': 2,
  'Le Monde': 2,
  // Spanish
  'El País': 2,
  'El Mundo': 2,
  'BBC Mundo': 2,
  // German
  'Tagesschau': 1,
  'Der Spiegel': 2,
  'Die Zeit': 2,
  'DW News': 2,
  // Italian
  'ANSA': 1,
  'Corriere della Sera': 2,
  'Repubblica': 2,
  // Dutch
  'NOS Nieuws': 1,
  'NRC': 2,
  'De Telegraaf': 2,
  // Swedish
  'SVT Nyheter': 1,
  'Dagens Nyheter': 2,
  'Svenska Dagbladet': 2,
  'Reuters World': 1,
  'Reuters Business': 1,
  'OpenAI News': 3,
  // Portuguese
  'Brasil Paralelo': 2,

  // Tier 1 - Official Government & International Orgs
  'White House': 1,
  'State Dept': 1,
  'Pentagon': 1,
  'UN News': 1,
  'CISA': 1,
  'Treasury': 2,
  'DOJ': 2,
  'DHS': 2,
  'CDC': 2,
  'FEMA': 2,

  // Tier 3 - Specialty
  'Defense One': 3,
  'Breaking Defense': 3,
  'The War Zone': 3,
  'Defense News': 3,
  'Janes': 3,
  'Military Times': 2,
  'Task & Purpose': 3,
  'USNI News': 2,
  'Oryx OSINT': 2,
  'UK MOD': 1,
  'Foreign Policy': 3,
  'The Diplomat': 3,
  'Bellingcat': 3,
  'Krebs Security': 3,
  'Federal Reserve': 3,
  'SEC': 3,
  'MIT Tech Review': 3,
  'Ars Technica': 3,
  'Atlantic Council': 3,
  'Foreign Affairs': 3,
  'CrisisWatch': 3,
  'CSIS': 3,
  'RAND': 3,
  'Brookings': 3,
  'Carnegie': 3,
  'IAEA': 1,
  'WHO': 1,
  'UNHCR': 1,
  'Xinhua': 3,
  'TASS': 3,
  'Layoffs.fyi': 3,
  'BBC Persian': 2,
  'Iran International': 3,
  'Fars News': 3,
  'MIIT (China)': 1,
  'MOFCOM (China)': 1,
  // Turkish
  'BBC Turkce': 2,
  'DW Turkish': 2,
  'Hurriyet': 2,
  // Polish
  'TVN24': 2,
  'Polsat News': 2,
  'Rzeczpospolita': 2,
  // Russian (independent)
  'BBC Russian': 2,
  'Meduza': 2,
  'Novaya Gazeta Europe': 2,
  // Thai
  'Bangkok Post': 2,
  'Thai PBS': 2,
  // Australian
  'ABC News Australia': 2,
  'Guardian Australia': 2,
  // Vietnamese
  'VnExpress': 2,
  'Tuoi Tre News': 2,

  // Tier 2 - Premium Startup/VC Sources
  'Y Combinator Blog': 2,
  'a16z Blog': 2,
  'Sequoia Blog': 2,
  'Crunchbase News': 2,
  'CB Insights': 2,
  'PitchBook News': 2,
  'The Information': 2,

  // Tier 3 - Regional/Specialty Startup Sources
  'EU Startups': 3,
  'Tech.eu': 3,
  'Sifted (Europe)': 3,
  'The Next Web': 3,
  'Tech in Asia': 3,
  'TechCabal (Africa)': 3,
  'Inc42 (India)': 3,
  'YourStory': 3,
  'Paul Graham Essays': 2,
  'Stratechery': 2,
  // Asia - Regional
  'e27 (SEA)': 3,
  'DealStreetAsia': 3,
  'Pandaily (China)': 3,
  '36Kr English': 3,
  'TechNode (China)': 3,
  'China Tech News': 3,
  'The Bridge (Japan)': 3,
  'Japan Tech News': 3,
  'Nikkei Tech': 2,
  'NHK World': 2,
  'Nikkei Asia': 2,
  'Korea Tech News': 3,
  'KED Global': 3,
  'Entrackr (India)': 3,
  'India Tech News': 3,
  'Taiwan Tech News': 3,
  'GloNewswire (Taiwan)': 4,
  // LATAM
  'La Silla Vacía': 3,
  'LATAM Tech News': 3,
  'Startups.co (LATAM)': 3,
  'Contxto (LATAM)': 3,
  'Brazil Tech News': 3,
  'Mexico Tech News': 3,
  'LATAM Fintech': 3,
  // Africa & MENA
  'Disrupt Africa': 3,
  'Wamda (MENA)': 3,
  'Magnitt': 3,
  // Nigeria
  'Premium Times': 2,
  'Vanguard Nigeria': 2,
  'Channels TV': 2,
  'Daily Trust': 3,
  'ThisDay': 2,
  // Greek
  'Kathimerini': 2,
  'Naftemporiki': 2,
  'in.gr': 3,
  'iefimerida': 3,
  'Proto Thema': 3,

  // Tier 3 - Think Tanks
  'Brookings Tech': 3,
  'CSIS Tech': 3,
  'MIT Tech Policy': 3,
  'Stanford HAI': 2,
  'AI Now Institute': 3,
  'OECD Digital': 2,
  'Bruegel (EU)': 3,
  'Chatham House Tech': 3,
  'ISEAS (Singapore)': 3,
  'ORF Tech (India)': 3,
  'RIETI (Japan)': 3,
  'Lowy Institute': 3,
  'China Tech Analysis': 3,
  'DigiChina': 2,
  // Security/Defense Think Tanks
  'RUSI': 2,
  'Wilson Center': 3,
  'GMF': 3,
  'Stimson Center': 3,
  'CNAS': 2,
  // Nuclear & Arms Control
  'Arms Control Assn': 2,
  'Bulletin of Atomic Scientists': 2,
  // Food Security
  'FAO GIEWS': 2,
  'EU ISS': 3,
  // New verified think tanks
  'War on the Rocks': 2,
  'AEI': 3,
  'Responsible Statecraft': 3,
  'FPRI': 3,
  'Jamestown': 3,

  // Tier 3 - Policy Sources
  'Politico Tech': 2,
  'AI Regulation': 3,
  'Tech Antitrust': 3,
  'EFF News': 3,
  'EU Digital Policy': 3,
  'Euractiv Digital': 3,
  'EU Commission Digital': 2,
  'China Tech Policy': 3,
  'UK Tech Policy': 3,
  'India Tech Policy': 3,

  // Tier 2-3 - Podcasts & Newsletters
  'Acquired Podcast': 2,
  'All-In Podcast': 2,
  'a16z Podcast': 2,
  'This Week in Startups': 3,
  'The Twenty Minute VC': 2,
  'Lex Fridman Tech': 3,
  'The Vergecast': 3,
  'Decoder (Verge)': 3,
  'Hard Fork (NYT)': 2,
  'Pivot (Vox)': 2,
  'Benedict Evans': 2,
  'The Pragmatic Engineer': 2,
  'Lenny Newsletter': 2,
  'AI Podcast (NVIDIA)': 3,
  'Gradient Dissent': 3,
  'Eye on AI': 3,
  'How I Built This': 2,
  'Masters of Scale': 2,
  'The Pitch': 3,

  // Tier 4 - Aggregators
  'Hacker News': 4,
  'The Verge': 4,
  'The Verge AI': 4,
  'VentureBeat AI': 4,
  'Yahoo Finance': 4,
  'TechCrunch Layoffs': 4,
  'ArXiv AI': 4,
  'AI News': 4,
  'Layoffs News': 4,

  // Tier 2 - Positive News Sources (Happy variant)
  'Good News Network': 2,
  'Positive.News': 2,
  'Reasons to be Cheerful': 2,
  'Optimist Daily': 2,
  'GNN Science': 3,
  'GNN Animals': 3,
  'GNN Health': 3,
  'GNN Heroes': 3,
};

export function getSourceTier(sourceName: string): number {
  return SOURCE_TIERS[sourceName] ?? 4; // Default to tier 4 if unknown
}

export type SourceType = 'wire' | 'gov' | 'intel' | 'mainstream' | 'market' | 'tech' | 'other';

export const SOURCE_TYPES: Record<string, SourceType> = {
  // Wire services - fastest, most authoritative
  'Reuters': 'wire', 'Reuters World': 'wire', 'Reuters Business': 'wire',
  'AP News': 'wire', 'AFP': 'wire', 'Bloomberg': 'wire',

  // Government & International Org sources
  'White House': 'gov', 'State Dept': 'gov', 'Pentagon': 'gov',
  'Treasury': 'gov', 'DOJ': 'gov', 'DHS': 'gov', 'CDC': 'gov',
  'FEMA': 'gov', 'Federal Reserve': 'gov', 'SEC': 'gov',
  'UN News': 'gov', 'CISA': 'gov',

  // Intel/Defense specialty
  'Defense One': 'intel', 'Breaking Defense': 'intel', 'The War Zone': 'intel',
  'Defense News': 'intel', 'Janes': 'intel', 'Military Times': 'intel', 'Task & Purpose': 'intel',
  'USNI News': 'intel', 'Oryx OSINT': 'intel', 'UK MOD': 'gov',
  'Bellingcat': 'intel', 'Krebs Security': 'intel',
  'Foreign Policy': 'intel', 'The Diplomat': 'intel',
  'Atlantic Council': 'intel', 'Foreign Affairs': 'intel',
  'CrisisWatch': 'intel',
  'CSIS': 'intel', 'RAND': 'intel', 'Brookings': 'intel', 'Carnegie': 'intel',
  'IAEA': 'gov', 'WHO': 'gov', 'UNHCR': 'gov',
  'Xinhua': 'wire', 'TASS': 'wire',
  'NHK World': 'mainstream', 'Nikkei Asia': 'market',

  // Mainstream outlets
  'BBC World': 'mainstream', 'BBC Middle East': 'mainstream',
  'Guardian World': 'mainstream', 'Guardian ME': 'mainstream',
  'NPR News': 'mainstream', 'Al Jazeera': 'mainstream',
  'CNN World': 'mainstream', 'Politico': 'mainstream',
  'EuroNews': 'mainstream', 'France 24': 'mainstream', 'Le Monde': 'mainstream',
  // European Addition
  'El País': 'mainstream', 'El Mundo': 'mainstream', 'BBC Mundo': 'mainstream',
  'Tagesschau': 'mainstream', 'Der Spiegel': 'mainstream', 'Die Zeit': 'mainstream', 'DW News': 'mainstream',
  'ANSA': 'wire', 'Corriere della Sera': 'mainstream', 'Repubblica': 'mainstream',
  'NOS Nieuws': 'mainstream', 'NRC': 'mainstream', 'De Telegraaf': 'mainstream',
  'SVT Nyheter': 'mainstream', 'Dagens Nyheter': 'mainstream', 'Svenska Dagbladet': 'mainstream',
  // Brazilian Addition
  'Brasil Paralelo': 'mainstream',

  // Market/Finance
  'CNBC': 'market', 'MarketWatch': 'market', 'Yahoo Finance': 'market',
  'Financial Times': 'market',

  // Tech
  'Hacker News': 'tech', 'Ars Technica': 'tech', 'The Verge': 'tech',
  'The Verge AI': 'tech', 'MIT Tech Review': 'tech', 'TechCrunch Layoffs': 'tech',
  'AI News': 'tech', 'ArXiv AI': 'tech', 'VentureBeat AI': 'tech',
  'Layoffs.fyi': 'tech', 'Layoffs News': 'tech',

  // Regional Tech Startups
  'EU Startups': 'tech', 'Tech.eu': 'tech', 'Sifted (Europe)': 'tech',
  'The Next Web': 'tech', 'Tech in Asia': 'tech', 'e27 (SEA)': 'tech',
  'DealStreetAsia': 'tech', 'Pandaily (China)': 'tech', '36Kr English': 'tech',
  'TechNode (China)': 'tech', 'The Bridge (Japan)': 'tech', 'Nikkei Tech': 'tech',
  'Inc42 (India)': 'tech', 'YourStory': 'tech', 'TechCabal (Africa)': 'tech',
  'Disrupt Africa': 'tech', 'Wamda (MENA)': 'tech', 'Magnitt': 'tech',

  // Think Tanks & Policy
  'Brookings Tech': 'intel', 'CSIS Tech': 'intel', 'Stanford HAI': 'intel',
  'AI Now Institute': 'intel', 'OECD Digital': 'intel', 'Bruegel (EU)': 'intel',
  'Chatham House Tech': 'intel', 'DigiChina': 'intel', 'Lowy Institute': 'intel',
  'EFF News': 'intel', 'Politico Tech': 'intel',
  // Security/Defense Think Tanks
  'RUSI': 'intel', 'Wilson Center': 'intel', 'GMF': 'intel',
  'Stimson Center': 'intel', 'CNAS': 'intel',
  // Nuclear & Arms Control
  'Arms Control Assn': 'intel', 'Bulletin of Atomic Scientists': 'intel',
  // Food Security & Regional
  'FAO GIEWS': 'gov', 'EU ISS': 'intel',
  // New verified think tanks
  'War on the Rocks': 'intel', 'AEI': 'intel', 'Responsible Statecraft': 'intel',
  'FPRI': 'intel', 'Jamestown': 'intel',

  // Podcasts & Newsletters
  'Acquired Podcast': 'tech', 'All-In Podcast': 'tech', 'a16z Podcast': 'tech',
  'This Week in Startups': 'tech', 'The Twenty Minute VC': 'tech',
  'Hard Fork (NYT)': 'tech', 'Pivot (Vox)': 'tech', 'Stratechery': 'tech',
  'Benedict Evans': 'tech', 'How I Built This': 'tech', 'Masters of Scale': 'tech',
};

export function getSourceType(sourceName: string): SourceType {
  return SOURCE_TYPES[sourceName] ?? 'other';
}

// Propaganda risk assessment for sources (Quick Win #5)
// 'high' = State-controlled media, known to push government narratives
// 'medium' = State-affiliated or known editorial bias toward specific governments
// 'low' = Independent journalism with editorial standards
export type PropagandaRisk = 'low' | 'medium' | 'high';

export interface SourceRiskProfile {
  risk: PropagandaRisk;
  stateAffiliated?: string;
  knownBiases?: string[];
  note?: string;
}

export const SOURCE_PROPAGANDA_RISK: Record<string, SourceRiskProfile> = {
  // High risk - State-controlled media
  'Xinhua': { risk: 'high', stateAffiliated: 'China', note: 'Official CCP news agency' },
  'TASS': { risk: 'high', stateAffiliated: 'Russia', note: 'Russian state news agency' },
  'RT': { risk: 'high', stateAffiliated: 'Russia', note: 'Russian state media, banned in EU' },
  'Sputnik': { risk: 'high', stateAffiliated: 'Russia', note: 'Russian state media' },
  'CGTN': { risk: 'high', stateAffiliated: 'China', note: 'Chinese state broadcaster' },
  'Press TV': { risk: 'high', stateAffiliated: 'Iran', note: 'Iranian state media' },
  'KCNA': { risk: 'high', stateAffiliated: 'North Korea', note: 'North Korean state media' },

  // Medium risk - State-affiliated or known bias
  'Al Jazeera': { risk: 'medium', stateAffiliated: 'Qatar', note: 'Qatari state-funded, independent editorial' },
  'Al Arabiya': { risk: 'medium', stateAffiliated: 'Saudi Arabia', note: 'Saudi-owned, reflects Gulf perspective' },
  'TRT World': { risk: 'medium', stateAffiliated: 'Turkey', note: 'Turkish state broadcaster' },
  'France 24': { risk: 'medium', stateAffiliated: 'France', note: 'French state-funded, editorially independent' },
  'EuroNews': { risk: 'low', note: 'European public broadcaster consortium', knownBiases: ['Pro-EU'] },
  'Le Monde': { risk: 'low', note: 'French newspaper of record' },
  'DW News': { risk: 'medium', stateAffiliated: 'Germany', note: 'German state-funded, editorially independent' },
  'Voice of America': { risk: 'medium', stateAffiliated: 'USA', note: 'US government-funded' },
  'Kyiv Independent': { risk: 'medium', knownBiases: ['Pro-Ukraine'], note: 'Ukrainian perspective on Russia-Ukraine war' },
  'Moscow Times': { risk: 'medium', knownBiases: ['Anti-Kremlin'], note: 'Independent, critical of Russian government' },

  // Low risk - Independent with editorial standards (explicit)
  'Reuters': { risk: 'low', note: 'Wire service, strict editorial standards' },
  'AP News': { risk: 'low', note: 'Wire service, nonprofit cooperative' },
  'AFP': { risk: 'low', note: 'Wire service, editorially independent' },
  'BBC World': { risk: 'low', note: 'Public broadcaster, editorial independence charter' },
  'BBC Middle East': { risk: 'low', note: 'Public broadcaster, editorial independence charter' },
  'Guardian World': { risk: 'low', knownBiases: ['Center-left'], note: 'Scott Trust ownership, no shareholders' },
  'Financial Times': { risk: 'low', note: 'Business focus, Nikkei-owned' },
  'Bellingcat': { risk: 'low', note: 'Open-source investigations, methodology transparent' },
  'Brasil Paralelo': { risk: 'low', note: 'Independent media company: no political ties, no public funding, 100% subscriber-funded.' },
};

export function getSourcePropagandaRisk(sourceName: string): SourceRiskProfile {
  return SOURCE_PROPAGANDA_RISK[sourceName] ?? { risk: 'low' };
}

export function isStateAffiliatedSource(sourceName: string): boolean {
  const profile = SOURCE_PROPAGANDA_RISK[sourceName];
  return !!profile?.stateAffiliated;
}



// Finance/Trading variant feeds (all free RSS / Google News proxies)
const FINANCE_FEEDS: Record<string, Feed[]> = {
  markets: [
    { name: 'CNBC', url: rss('https://www.cnbc.com/id/100003114/device/rss/rss.html') },
    // Direct MarketWatch RSS returns frequent 403s from cloud IPs; use Google News fallback.
    { name: 'MarketWatch', url: rss('https://news.google.com/rss/search?q=site:marketwatch.com+markets+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Yahoo Finance', url: rss('https://finance.yahoo.com/rss/topstories') },
    { name: 'Seeking Alpha', url: rss('https://seekingalpha.com/market_currents.xml') },
    { name: 'Reuters Markets', url: rss('https://news.google.com/rss/search?q=site:reuters.com+markets+stocks+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Bloomberg Markets', url: rss('https://news.google.com/rss/search?q=site:bloomberg.com+markets+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Investing.com News', url: rss('https://news.google.com/rss/search?q=site:investing.com+markets+when:1d&hl=en-US&gl=US&ceid=US:en') },
  ],
  forex: [
    { name: 'Forex News', url: rss('https://news.google.com/rss/search?q=("forex"+OR+"currency"+OR+"FX+market")+trading+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Dollar Watch', url: rss('https://news.google.com/rss/search?q=("dollar+index"+OR+DXY+OR+"US+dollar"+OR+"euro+dollar")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Central Bank Rates', url: rss('https://news.google.com/rss/search?q=("central+bank"+OR+"interest+rate"+OR+"rate+decision"+OR+"monetary+policy")+when:2d&hl=en-US&gl=US&ceid=US:en') },
  ],
  bonds: [
    { name: 'Bond Market', url: rss('https://news.google.com/rss/search?q=("bond+market"+OR+"treasury+yields"+OR+"bond+yields"+OR+"fixed+income")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Treasury Watch', url: rss('https://news.google.com/rss/search?q=("US+Treasury"+OR+"Treasury+auction"+OR+"10-year+yield"+OR+"2-year+yield")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Corporate Bonds', url: rss('https://news.google.com/rss/search?q=("corporate+bond"+OR+"high+yield"+OR+"investment+grade"+OR+"credit+spread")+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  commodities: [
    { name: 'Oil & Gas', url: rss('https://news.google.com/rss/search?q=(oil+price+OR+OPEC+OR+"natural+gas"+OR+"crude+oil"+OR+WTI+OR+Brent)+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Gold & Metals', url: rss('https://news.google.com/rss/search?q=(gold+price+OR+silver+price+OR+copper+OR+platinum+OR+"precious+metals")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Agriculture', url: rss('https://news.google.com/rss/search?q=(wheat+OR+corn+OR+soybeans+OR+coffee+OR+sugar)+price+OR+commodity+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Commodity Trading', url: rss('https://news.google.com/rss/search?q=("commodity+trading"+OR+"futures+market"+OR+CME+OR+NYMEX+OR+COMEX)+when:2d&hl=en-US&gl=US&ceid=US:en') },
  ],
  crypto: [
    { name: 'CoinDesk', url: rss('https://www.coindesk.com/arc/outboundfeeds/rss/') },
    { name: 'Cointelegraph', url: rss('https://cointelegraph.com/rss') },
    { name: 'The Block', url: rss('https://news.google.com/rss/search?q=site:theblock.co+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Crypto News', url: rss('https://news.google.com/rss/search?q=(bitcoin+OR+ethereum+OR+crypto+OR+"digital+assets")+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'DeFi News', url: rss('https://news.google.com/rss/search?q=(DeFi+OR+"decentralized+finance"+OR+DEX+OR+"yield+farming")+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  centralbanks: [
    { name: 'Federal Reserve', url: rss('https://www.federalreserve.gov/feeds/press_all.xml') },
    { name: 'ECB Watch', url: rss('https://news.google.com/rss/search?q=("European+Central+Bank"+OR+ECB+OR+Lagarde)+monetary+policy+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'BoJ Watch', url: rss('https://news.google.com/rss/search?q=("Bank+of+Japan"+OR+BoJ)+monetary+policy+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'BoE Watch', url: rss('https://news.google.com/rss/search?q=("Bank+of+England"+OR+BoE)+monetary+policy+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'PBoC Watch', url: rss('https://news.google.com/rss/search?q=("People%27s+Bank+of+China"+OR+PBoC+OR+PBOC)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Global Central Banks', url: rss('https://news.google.com/rss/search?q=("rate+hike"+OR+"rate+cut"+OR+"interest+rate+decision")+central+bank+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  economic: [
    { name: 'Economic Data', url: rss('https://news.google.com/rss/search?q=(CPI+OR+inflation+OR+GDP+OR+"jobs+report"+OR+"nonfarm+payrolls"+OR+PMI)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Trade & Tariffs', url: rss('https://news.google.com/rss/search?q=(tariff+OR+"trade+war"+OR+"trade+deficit"+OR+sanctions)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Housing Market', url: rss('https://news.google.com/rss/search?q=("housing+market"+OR+"home+prices"+OR+"mortgage+rates"+OR+REIT)+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  ipo: [
    { name: 'IPO News', url: rss('https://news.google.com/rss/search?q=(IPO+OR+"initial+public+offering"+OR+SPAC+OR+"direct+listing")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Earnings Reports', url: rss('https://news.google.com/rss/search?q=("earnings+report"+OR+"quarterly+earnings"+OR+"revenue+beat"+OR+"earnings+miss")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'M&A News', url: rss('https://news.google.com/rss/search?q=("merger"+OR+"acquisition"+OR+"takeover+bid"+OR+"buyout")+billion+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  derivatives: [
    { name: 'Options Market', url: rss('https://news.google.com/rss/search?q=("options+market"+OR+"options+trading"+OR+"put+call+ratio"+OR+VIX)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Futures Trading', url: rss('https://news.google.com/rss/search?q=("futures+trading"+OR+"S%26P+500+futures"+OR+"Nasdaq+futures")+when:1d&hl=en-US&gl=US&ceid=US:en') },
  ],
  fintech: [
    { name: 'Fintech News', url: rss('https://news.google.com/rss/search?q=(fintech+OR+"payment+technology"+OR+"neobank"+OR+"digital+banking")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Trading Tech', url: rss('https://news.google.com/rss/search?q=("algorithmic+trading"+OR+"trading+platform"+OR+"quantitative+finance")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Blockchain Finance', url: rss('https://news.google.com/rss/search?q=("blockchain+finance"+OR+"tokenization"+OR+"digital+securities"+OR+CBDC)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  regulation: [
    { name: 'SEC', url: rss('https://www.sec.gov/news/pressreleases.rss') },
    { name: 'Financial Regulation', url: rss('https://news.google.com/rss/search?q=(SEC+OR+CFTC+OR+FINRA+OR+FCA)+regulation+OR+enforcement+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Banking Rules', url: rss('https://news.google.com/rss/search?q=(Basel+OR+"capital+requirements"+OR+"banking+regulation")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Crypto Regulation', url: rss('https://news.google.com/rss/search?q=(crypto+regulation+OR+"digital+asset"+regulation+OR+"stablecoin"+regulation)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  institutional: [
    { name: 'Hedge Fund News', url: rss('https://news.google.com/rss/search?q=("hedge+fund"+OR+"Bridgewater"+OR+"Citadel"+OR+"Renaissance")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Private Equity', url: rss('https://news.google.com/rss/search?q=("private+equity"+OR+Blackstone+OR+KKR+OR+Apollo+OR+Carlyle)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Sovereign Wealth', url: rss('https://news.google.com/rss/search?q=("sovereign+wealth+fund"+OR+"pension+fund"+OR+"institutional+investor")+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  analysis: [
    { name: 'Market Outlook', url: rss('https://news.google.com/rss/search?q=("market+outlook"+OR+"stock+market+forecast"+OR+"bull+market"+OR+"bear+market")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Risk & Volatility', url: rss('https://news.google.com/rss/search?q=(VIX+OR+"market+volatility"+OR+"risk+off"+OR+"market+correction")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Bank Research', url: rss('https://news.google.com/rss/search?q=("Goldman+Sachs"+OR+"JPMorgan"+OR+"Morgan+Stanley")+forecast+OR+outlook+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  gccNews: [
    { name: 'Arabian Business', url: rss('https://news.google.com/rss/search?q=site:arabianbusiness.com+(Saudi+Arabia+OR+UAE+OR+GCC)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'The National', url: rss('https://news.google.com/rss/search?q=site:thenationalnews.com+(Abu+Dhabi+OR+UAE+OR+Saudi)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Arab News', url: rss('https://news.google.com/rss/search?q=site:arabnews.com+(Saudi+Arabia+OR+investment+OR+infrastructure)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Gulf FDI', url: rss('https://news.google.com/rss/search?q=(PIF+OR+"DP+World"+OR+Mubadala+OR+ADNOC+OR+Masdar+OR+"ACWA+Power")+infrastructure+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Gulf Investments', url: rss('https://news.google.com/rss/search?q=("Saudi+Arabia"+OR+"UAE"+OR+"Abu+Dhabi")+investment+infrastructure+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Vision 2030', url: rss('https://news.google.com/rss/search?q="Vision+2030"+(project+OR+investment+OR+announced)+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],
  bricsNews: [
    { name: 'BRICS', url: rss('https://news.google.com/rss/search?q=BRICS+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'New Development Bank', url: rss('https://news.google.com/rss/search?q="New+Development+Bank"+OR+NDB+BRICS+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'BRICS Investment', url: rss('https://news.google.com/rss/search?q=(BRICS+OR+"Brazil+Russia+India+China+South+Africa")+investment+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'BRICS Expansion', url: rss('https://news.google.com/rss/search?q=BRICS+expansion+OR+members+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
};

// Finance & tesserect only
export const FEEDS = FINANCE_FEEDS;

export const SOURCE_REGION_MAP: Record<string, { labelKey: string; feedKeys: string[] }> = {
  marketsAnalysis: { labelKey: 'header.sourceRegionMarkets', feedKeys: ['markets', 'analysis', 'ipo'] },
  fixedIncomeFx: { labelKey: 'header.sourceRegionFixedIncomeFx', feedKeys: ['forex', 'bonds'] },
  commoditiesRegion: { labelKey: 'header.sourceRegionCommodities', feedKeys: ['commodities'] },
  cryptoDigital: { labelKey: 'header.sourceRegionCryptoDigital', feedKeys: ['crypto', 'fintech'] },
  centralBanksEcon: { labelKey: 'header.sourceRegionCentralBanks', feedKeys: ['centralbanks', 'economic'] },
  dealsCorpFin: { labelKey: 'header.sourceRegionDeals', feedKeys: ['institutional', 'derivatives'] },
  finRegulation: { labelKey: 'header.sourceRegionFinRegulation', feedKeys: ['regulation'] },
  gulfMena: { labelKey: 'header.sourceRegionGulfMena', feedKeys: ['gccNews'] },
  brics: { labelKey: 'header.sourceRegionBrics', feedKeys: ['bricsNews'] },
};

export const INTEL_SOURCES: Feed[] = [
  // Trade & Commerce (Tier 1 - prefer for intel context)
  { name: 'WTO News', url: rss('https://www.wto.org/english/news_e/rss_e.htm'), type: 'economic' },
  { name: 'UNCTAD', url: rss('https://unctad.org/rss.xml'), type: 'economic' },
  { name: 'Reuters Trade', url: rss('https://news.google.com/rss/search?q=site:reuters.com+(trade+OR+tariff+OR+export+OR+import+OR+supply+chain)+when:3d&hl=en-US&gl=US&ceid=US:en'), type: 'economic' },
  { name: 'Bloomberg Trade', url: rss('https://news.google.com/rss/search?q=site:bloomberg.com+(trade+OR+tariff+OR+shipping+OR+ports)+when:3d&hl=en-US&gl=US&ceid=US:en'), type: 'economic' },
  { name: 'Journal of Commerce', url: rss('https://news.google.com/rss/search?q=site:joc.com+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'economic' },
  { name: 'Trade & Tariffs', url: rss('https://news.google.com/rss/search?q=(tariff+OR+"trade+war"+OR+"trade+deficit"+OR+sanctions+OR+embargo+OR+"supply+chain")+when:3d&hl=en-US&gl=US&ceid=US:en'), type: 'economic' },

  // Defense & Security (Tier 2)
  { name: 'Defense One', url: rss('https://www.defenseone.com/rss/all/'), type: 'defense' },
  { name: 'Breaking Defense', url: rss('https://breakingdefense.com/feed/'), type: 'defense' },
  { name: 'The War Zone', url: rss('https://news.google.com/rss/search?q=site:thedrive.com+"war+zone"+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'defense' },
  { name: 'Defense News', url: rss('https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml'), type: 'defense' },
  { name: 'Janes', url: rss('https://news.google.com/rss/search?q=site:janes.com+when:3d&hl=en-US&gl=US&ceid=US:en'), type: 'defense' },
  { name: 'Military Times', url: rss('https://www.militarytimes.com/arc/outboundfeeds/rss/?outputType=xml'), type: 'defense' },
  { name: 'Task & Purpose', url: rss('https://taskandpurpose.com/feed/'), type: 'defense' },
  { name: 'USNI News', url: rss('https://news.usni.org/feed'), type: 'defense' },
  { name: 'Oryx OSINT', url: rss('https://www.oryxspioenkop.com/feeds/posts/default?alt=rss'), type: 'defense' },
  { name: 'UK MOD', url: rss('https://www.gov.uk/government/organisations/ministry-of-defence.atom'), type: 'defense' },
  { name: 'CSIS', url: rss('https://www.csis.org/analysis?type=analysis'), type: 'defense' },

  // International Relations (Tier 2)
  { name: 'Chatham House', url: rss('https://news.google.com/rss/search?q=site:chathamhouse.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },
  { name: 'ECFR', url: rss('https://news.google.com/rss/search?q=site:ecfr.eu+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },
  { name: 'Foreign Policy', url: rss('https://foreignpolicy.com/feed/'), type: 'intl' },
  { name: 'Foreign Affairs', url: rss('https://www.foreignaffairs.com/rss.xml'), type: 'intl' },
  { name: 'Atlantic Council', url: railwayRss('https://www.atlanticcouncil.org/feed/'), type: 'intl' },
  { name: 'Middle East Institute', url: rss('https://news.google.com/rss/search?q=site:mei.edu+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },

  // Think Tanks & Research (Tier 3)
  { name: 'RAND', url: rss('https://www.rand.org/rss/all.xml'), type: 'research' },
  { name: 'Brookings', url: rss('https://www.brookings.edu/feed/'), type: 'research' },
  { name: 'Carnegie', url: rss('https://carnegieendowment.org/rss/'), type: 'research' },
  { name: 'FAS', url: rss('https://fas.org/feed/'), type: 'research' },
  { name: 'NTI', url: rss('https://www.nti.org/rss/'), type: 'research' },
  { name: 'RUSI', url: rss('https://news.google.com/rss/search?q=site:rusi.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  { name: 'Wilson Center', url: rss('https://news.google.com/rss/search?q=site:wilsoncenter.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  { name: 'GMF', url: rss('https://news.google.com/rss/search?q=site:gmfus.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  { name: 'Stimson Center', url: rss('https://www.stimson.org/feed/'), type: 'research' },
  { name: 'CNAS', url: rss('https://news.google.com/rss/search?q=site:cnas.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  { name: 'Lowy Institute', url: rss('https://news.google.com/rss/search?q=site:lowyinstitute.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },

  // Nuclear & Arms Control (Tier 2)
  { name: 'Arms Control Assn', url: rss('https://news.google.com/rss/search?q=site:armscontrol.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'nuclear' },
  { name: 'Bulletin of Atomic Scientists', url: rss('https://news.google.com/rss/search?q=site:thebulletin.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'nuclear' },

  // OSINT & Monitoring (Tier 2)
  { name: 'Bellingcat', url: rss('https://www.bellingcat.com/feed/'), type: 'osint' },
  { name: 'Krebs Security', url: rss('https://krebsonsecurity.com/feed/'), type: 'cyber' },

  // Economic & Food Security (Tier 2)
  { name: 'FAO News', url: rss('https://www.fao.org/feeds/fao-newsroom-rss'), type: 'economic' },
  { name: 'FAO GIEWS', url: rss('https://news.google.com/rss/search?q=site:fao.org+GIEWS+food+security+when:30d&hl=en-US&gl=US&ceid=US:en'), type: 'economic' },
  { name: 'EU ISS', url: rss('https://news.google.com/rss/search?q=site:iss.europa.eu+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },
];

// Keywords that trigger alert status - must be specific to avoid false positives
export const ALERT_KEYWORDS = [
  'war', 'invasion', 'military', 'nuclear', 'sanctions', 'missile',
  'airstrike', 'drone strike', 'troops deployed', 'armed conflict', 'bombing', 'casualties',
  'ceasefire', 'peace treaty', 'nato', 'coup', 'martial law',
  'assassination', 'terrorist', 'terror attack', 'cyber attack', 'hostage', 'evacuation order',
  'tariff', 'embargo', 'port closure', 'supply chain disruption', 'trade deal', 'blockade',
];

// Patterns that indicate non-alert content (lifestyle, entertainment, etc.)
export const ALERT_EXCLUSIONS = [
  'protein', 'couples', 'relationship', 'dating', 'diet', 'fitness',
  'recipe', 'cooking', 'shopping', 'fashion', 'celebrity', 'movie',
  'tv show', 'sports', 'game', 'concert', 'festival', 'wedding',
  'vacation', 'travel tips', 'life hack', 'self-care', 'wellness',
];
