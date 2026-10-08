export type Language = 'VI' | 'JA';

export type ScreenType = 'world-map' | 'japan-map' | 'places' | 'memories';

export type CountryId = 'JP' | 'VN';

export type PrefectureStatus = 'visited' | 'dream' | 'not_visited';

export interface Prefecture {
  id: string;
  name: string;
  nameJa: string;
  regionId: string;
  status: PrefectureStatus;
  memoryCount: number;
  capital: string;
  highlights: string[];
  emoji: string;
}

export interface Region {
  id: string;
  name: string;
  nameJa: string;
  countryId: CountryId;
  totalPrefectures: number;
  visitedPrefectures: number;
  memoryCount: number;
  wishlistCount: number;
  status: 'visited' | 'dream' | 'not_visited';
  color: string;
  pinPosition: { x: number; y: number }; // percentage coordinates
  prefectureIds: string[];
  description: string;
  descriptionJa: string;
}

export interface Memory {
  id: string;
  icon?: string; // Biểu tượng trang kiểu Notion (🌸, ⛩️, 🍵, 📷, etc.)
  title: string;
  titleJa: string;
  countryId: CountryId;
  regionId: string;
  provinceId?: string;
  locationName: string;
  specificSpot?: string;
  date: string;
  daysAgoText: string;
  daysAgoTextJa: string;
  weather: 'sunny' | 'sakura' | 'rainy' | 'autumn' | 'snowy';
  image: string; // Ảnh chủ đề (Cover / Card Thumbnail)
  imageAlt: string;
  imageSize?: 'small' | 'medium' | 'full';
  imageAspect?: 'square' | 'standard' | 'wide';
  articleImages?: string[]; // Ảnh đăng trong bài viết
  leftArtImage?: string; // Ảnh nghệ thuật cột trái
  rightArtImage?: string; // Ảnh nghệ thuật cột phải
  quote?: string; // Lời tựa trích dẫn (như Notion quote)
  musicPlaylistTitle?: string; // Tên playlist Spotify widget
  musicTracks?: { title: string; artist: string }[];
  layoutStyle?: 'notion-magazine' | 'classic';
  tag: string;
  postcardsCount: number;
  memoryCount: number;
  notes: string;
  notesJa: string;
  soundtrack: string;
  rating: number;
  isFavorite?: boolean;
}

export interface Place {
  id: string;
  name: string;
  nameJa: string;
  countryId: CountryId;
  cityName: string;
  category: 'temple' | 'nature' | 'cafe' | 'historic' | 'onsen';
  image: string;
  rating: number;
  visited: boolean;
  notes: string;
  tag: string;
  date?: string;
  year?: number;
}

export interface ProfileData {
  authorName: string;
  authorNameJa?: string;
  travelerTitle: string;
  travelerTitleJa: string;
  quoteVi: string;
  quoteJa: string;
  avatarUrl: string;
  facebookUrl?: string;
  instagramUrl?: string;
  notionUrl?: string;
  contactEmail?: string;
}

