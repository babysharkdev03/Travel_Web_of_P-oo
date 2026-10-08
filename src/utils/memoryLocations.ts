import { CountryId, Language, Memory, Prefecture } from '../types';
import { allJapanPrefectures, allVietnamProvinces } from '../data/regionsData';

const provinces: Record<CountryId, Prefecture[]> = {
  JP: allJapanPrefectures,
  VN: allVietnamProvinces,
};

const aliases: Record<string, string[]> = {
  osaka: ['sakai'],
  quangnam: ['hội an', 'hoi an'],
  tphcm: ['sài gòn', 'saigon', 'ho chi minh'],
  hanoi: ['ha noi'],
};

export const normalizePlace = (value: string) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .trim();

export const provinceNames = (province: Prefecture) => [
  province.name,
  province.nameJa,
  province.capital,
  ...(aliases[province.id] || []),
];

export const resolveProvinceId = (country: CountryId, location: string, preferredId?: string): string | undefined => {
  const options = provinces[country];
  if (preferredId && options.some((province) => province.id === preferredId)) {
    return preferredId;
  }
  const normalized = normalizePlace(location);
  return options.find((province) =>
    provinceNames(province).some((name) => name && normalized.includes(normalizePlace(name)))
  )?.id;
};

export const memoryProvinceId = (memory: Memory) =>
  resolveProvinceId(memory.countryId, `${memory.locationName} ${memory.specificSpot || ''}`, memory.provinceId);

export const memoriesAtProvince = (memories: Memory[], country: CountryId, provinceId: string) =>
  memories.filter((memory) => memory.countryId === country && memoryProvinceId(memory) === provinceId);

export const placeLabel = (country: CountryId, location: string, lang: Language, preferredId?: string) => {
  if (lang === 'VI') return location;
  const provinceId = resolveProvinceId(country, location, preferredId);
  return provinces[country].find((province) => province.id === provinceId)?.nameJa || location;
};

export const memoryLocationLabel = (memory: Memory, lang: Language) =>
  placeLabel(memory.countryId, memory.locationName, lang, memoryProvinceId(memory));

export const findProvince = (country: CountryId, query: string) => {
  const normalized = normalizePlace(query);
  if (!normalized) return undefined;
  return provinces[country].find((province) =>
    provinceNames(province).some((name) => name && normalizePlace(name).includes(normalized))
  );
};
