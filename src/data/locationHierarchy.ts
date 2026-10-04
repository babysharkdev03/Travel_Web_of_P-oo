import { CountryId } from '../types';

export interface LocationItem {
  id: string;
  name: string;
  nameJa?: string;
  emoji?: string;
  suggestedSpots?: string[];
}

export interface RegionHierarchy {
  id: string;
  name: string;
  nameJa: string;
  countryId: CountryId;
  locations: LocationItem[];
}

export const locationHierarchyData: Record<CountryId, RegionHierarchy[]> = {
  JP: [
    {
      id: 'kanto',
      name: 'Kanto (Vùng Kanto)',
      nameJa: '関東地方',
      countryId: 'JP',
      locations: [
        { id: 'tokyo', name: 'Tokyo (Thủ đô Tokyo)', nameJa: '東京都', emoji: '🗼', suggestedSpots: ['Shibuya Crossing', 'Asakusa Sensoji', 'Shinjuku Gyoen', 'Tháp Tokyo', 'Akihabara'] },
        { id: 'kanagawa', name: 'Kanagawa (Yokohama & Kamakura)', nameJa: '神奈川県', emoji: '⚓', suggestedSpots: ['Tượng Đại Phật Kamakura', 'Đảo Enoshima', 'Cảng Yokohama Minato Mirai'] },
        { id: 'chiba', name: 'Chiba', nameJa: '千葉県', emoji: '🥜', suggestedSpots: ['Chùa Naritasan Shinshoji', 'Núi Nokogiriyama'] },
        { id: 'saitama', name: 'Saitama', nameJa: '埼玉県', emoji: '🎐', suggestedSpots: ['Phố cổ Kawagoe Koedo', 'Vùng núi Chichibu'] },
        { id: 'tochigi', name: 'Tochigi (Nikko)', nameJa: '栃木県', emoji: '⛩️', suggestedSpots: ['Đền Nikko Toshogu', 'Thác Kegon', 'Hồ Chuzenji'] },
        { id: 'gunma', name: 'Gunma', nameJa: '群馬県', emoji: '♨️', suggestedSpots: ['Suối nước nóng Kusatsu Onsen', 'Ikaho Onsen'] },
        { id: 'ibaraki', name: 'Ibaraki', nameJa: '茨城県', emoji: '🌸', suggestedSpots: ['Công viên Hitachi Seaside', 'Vườn Kairakuen'] },
      ],
    },
    {
      id: 'kansai',
      name: 'Kansai (Vùng Kansai)',
      nameJa: '関西地方',
      countryId: 'JP',
      locations: [
        { id: 'kyoto', name: 'Kyoto (Cố đô Kyoto)', nameJa: '京都府', emoji: '⛩️', suggestedSpots: ['Cổng Torii Fushimi Inari', 'Rừng trúc Arashiyama', 'Chùa Vàng Kinkaku-ji', 'Chùa Thanh Thủy Kiyomizu-dera'] },
        { id: 'osaka', name: 'Osaka', nameJa: '大阪府', emoji: '🐙', suggestedSpots: ['Phố ẩm thực Dotonbori', 'Lâu đài Osaka', 'Khu Shinsekai', 'Tòa nhà Umeda Sky'] },
        { id: 'nara', name: 'Nara', nameJa: '奈良県', emoji: '🦌', suggestedSpots: ['Công viên hươu Nara', 'Chùa Todai-ji', 'Đền Kasuga Taisha'] },
        { id: 'hyogo', name: 'Hyogo (Kobe & Himeji)', nameJa: '兵庫県', emoji: '🏰', suggestedSpots: ['Lâu đài Himeji Hạc Trắng', 'Kobe Harborland', 'Cảng Kobe'] },
        { id: 'shiga', name: 'Shiga', nameJa: '滋賀県', emoji: '⛵', suggestedSpots: ['Hồ Biwa', 'Lâu đài Hikone'] },
        { id: 'mie', name: 'Mie', nameJa: '三重県', emoji: '🐚', suggestedSpots: ['Đền thiêng Ise Jingu', 'Cung đường Kumano Kodo'] },
        { id: 'wakayama', name: 'Wakayama', nameJa: '和歌山県', emoji: '🍊', suggestedSpots: ['Thánh địa Núi Koya (Koyasan)', 'Thác Nachi'] },
      ],
    },
    {
      id: 'chubu',
      name: 'Chubu (Vùng Chubu & Núi Phú Sĩ)',
      nameJa: '中部地方',
      countryId: 'JP',
      locations: [
        { id: 'yamanashi', name: 'Yamanashi (Núi Phú Sĩ)', nameJa: '山梨県', emoji: '🗻', suggestedSpots: ['Hồ Kawaguchiko ngắm Phú Sĩ', 'Chùa Chureito Pagoda', 'Làng cổ Oshino Hakkai'] },
        { id: 'nagano', name: 'Nagano', nameJa: '長野県', emoji: '🏔️', suggestedSpots: ['Thung lũng Kamikochi', 'Chùa Zenko-ji', 'Công viên Khỉ tuyết Jigokudani'] },
        { id: 'shizuoka', name: 'Shizuoka', nameJa: '静岡県', emoji: '🍵', suggestedSpots: ['Bán đảo Izu Onsen', 'Đồi chè xanh Nihondaira'] },
        { id: 'gifu', name: 'Gifu', nameJa: '岐阜県', emoji: '🛖', suggestedSpots: ['Làng cổ Shirakawa-go', 'Phố cổ Takayama Sanmachi'] },
        { id: 'ishikawa', name: 'Ishikawa (Kanazawa)', nameJa: '石川県', emoji: '✨', suggestedSpots: ['Vườn Kenrokuen', 'Phố Geisha Higashi Chaya'] },
        { id: 'aichi', name: 'Aichi (Nagoya)', nameJa: '愛知県', emoji: '🏯', suggestedSpots: ['Lâu đài Nagoya', 'Công viên Ghibli Park'] },
        { id: 'toyama', name: 'Toyama', nameJa: '富山県', emoji: '❄️', suggestedSpots: ['Cung đường tuyết Tateyama Kurobe'] },
        { id: 'niigata', name: 'Niigata', nameJa: '新潟県', emoji: '🌾', suggestedSpots: ['Hẻm núi Kiyotsu', 'Đảo Sado'] },
        { id: 'fukui', name: 'Fukui', nameJa: '福井県', emoji: '🦖', suggestedSpots: ['Vách đá Tojinbo', 'Chùa Eihei-ji'] },
      ],
    },
    {
      id: 'hokkaido',
      name: 'Hokkaido (Bắc Hải Đạo)',
      nameJa: '北海道',
      countryId: 'JP',
      locations: [
        { id: 'sapporo', name: 'Sapporo', nameJa: '札幌', emoji: '❄️', suggestedSpots: ['Công viên Odori', 'Tháp truyền hình Sapporo', 'Phố Susukino'] },
        { id: 'otaru', name: 'Otaru (Kênh đào Otaru)', nameJa: '小樽', emoji: '🏮', suggestedSpots: ['Kênh đào Otaru', 'Bảo tàng Hộp nhạc Otaru'] },
        { id: 'furano', name: 'Furano & Biei', nameJa: '富良野・美瑛', emoji: '🪻', suggestedSpots: ['Cánh đồng hoa oải hương Tomita', 'Hồ Xanh Biei (Blue Pond)'] },
        { id: 'hakodate', name: 'Hakodate', nameJa: '函館', emoji: '✨', suggestedSpots: ['Cảnh đêm đỉnh núi Hakodate', 'Pháo đài Goryokaku'] },
        { id: 'niseko', name: 'Niseko', nameJa: 'ニセコ', emoji: '⛷️', suggestedSpots: ['Khu trượt tuyết Niseko', 'Suối nước nóng Niseko Onsen'] },
      ],
    },
    {
      id: 'tohoku',
      name: 'Tohoku (Vùng Đông Bắc)',
      nameJa: '東北地方',
      countryId: 'JP',
      locations: [
        { id: 'miyagi', name: 'Miyagi (Sendai)', nameJa: '宮城県', emoji: '🌊', suggestedSpots: ['Vịnh Matsushima', 'Làng cáo Zao Fox Village'] },
        { id: 'yamagata', name: 'Yamagata', nameJa: '山形県', emoji: '♨️', suggestedSpots: ['Phố suối nước nóng Ginzan Onsen', 'Quái vật tuyết Zao'] },
        { id: 'aomori', name: 'Aomori', nameJa: '青森県', emoji: '🍎', suggestedSpots: ['Lễ hội Nebuta', 'Dãy núi tuyết Hakkoda'] },
        { id: 'fukushima', name: 'Fukushima', nameJa: '福島県', emoji: '🏮', suggestedSpots: ['Làng cổ Ouchi-juku', 'Hồ Inawashiro'] },
        { id: 'akita', name: 'Akita', nameJa: '秋田県', emoji: '🐕', suggestedSpots: ['Suối nước nóng Nyuto Onsen', 'Hồ Tazawa'] },
        { id: 'iwate', name: 'Iwate', nameJa: '岩手県', emoji: '🌲', suggestedSpots: ['Chùa Chuson-ji', 'Hẻm núi Geibikei'] },
      ],
    },
    {
      id: 'chugoku',
      name: 'Chugoku (Vùng Chugoku)',
      nameJa: '中国地方',
      countryId: 'JP',
      locations: [
        { id: 'hiroshima', name: 'Hiroshima (Miyajima)', nameJa: '広島県', emoji: '⛩️', suggestedSpots: ['Đền nổi Itsukushima Đảo Miyajima', 'Công viên Hòa bình Peace Park'] },
        { id: 'okayama', name: 'Okayama & Kurashiki', nameJa: '岡山県', emoji: '🍑', suggestedSpots: ['Phố cổ kênh nước Kurashiki Bikan', 'Vườn Korakuen'] },
        { id: 'tottori', name: 'Tottori', nameJa: '鳥取県', emoji: '🐫', suggestedSpots: ['Đồi cát Tottori Sand Dunes', 'Bảo tàng Cát'] },
        { id: 'shimane', name: 'Shimane', nameJa: '島根県', emoji: '🌿', suggestedSpots: ['Đền Thần Đạo Izumo Taisha', 'Lâu đài Matsue'] },
        { id: 'yamaguchi', name: 'Yamaguchi', nameJa: '山口県', emoji: '🌉', suggestedSpots: ['Đền ven biển Motonosumi', 'Cầu Tsunoshima'] },
      ],
    },
    {
      id: 'shikoku',
      name: 'Shikoku (Vùng Tứ Quốc)',
      nameJa: '四国地方',
      countryId: 'JP',
      locations: [
        { id: 'kagawa', name: 'Kagawa', nameJa: '香川県', emoji: '🍜', suggestedSpots: ['Vườn Ritsurin', 'Đảo nghệ thuật Naoshima'] },
        { id: 'ehime', name: 'Ehime (Matsuyama)', nameJa: '愛媛県', emoji: '♨️', suggestedSpots: ['Suối Dogo Onsen cổ nhất Nhật Bản', 'Lâu đài Matsuyama'] },
        { id: 'tokushima', name: 'Tokushima', nameJa: '徳島県', emoji: '🌀', suggestedSpots: ['Xoáy nước Naruto', 'Thung lũng Iya'] },
        { id: 'kochi', name: 'Kochi', nameJa: '高知県', emoji: '🐟', suggestedSpots: ['Bãi biển Katsurahama', 'Chợ Hirome'] },
      ],
    },
    {
      id: 'kyushu',
      name: 'Kyushu & Okinawa (Cửu Châu & Okinawa)',
      nameJa: '九州・沖縄地方',
      countryId: 'JP',
      locations: [
        { id: 'fukuoka', name: 'Fukuoka (Hakata)', nameJa: '福岡県', emoji: '🍜', suggestedSpots: ['Quán ăn đường phố Hakata Yatai', 'Đền Dazaifu Tenmangu'] },
        { id: 'oita', name: 'Oita (Beppu & Yufuin)', nameJa: '大分県', emoji: '♨️', suggestedSpots: ['Địa ngục suối khoáng Beppu Hells', 'Thị trấn Yufuin'] },
        { id: 'kumamoto', name: 'Kumamoto', nameJa: '熊本県', emoji: '🌋', suggestedSpots: ['Lâu đài Kumamoto', 'Miệng núi lửa Aso'] },
        { id: 'nagasaki', name: 'Nagasaki', nameJa: '長崎県', emoji: '⛪', suggestedSpots: ['Vườn Glover Garden', 'Đảo chiến hạm Gunkanjima'] },
        { id: 'kagoshima', name: 'Kagoshima & Yakushima', nameJa: '鹿児島県', emoji: '🌋', suggestedSpots: ['Núi lửa Sakurajima', 'Rừng tuyết tùng nguyên sinh Yakushima'] },
        { id: 'okinawa', name: 'Okinawa', nameJa: '沖縄県', emoji: '🌺', suggestedSpots: ['Lâu đài Shuri Castle', 'Thủy cung Churaumi', 'Đảo Miyakojima'] },
        { id: 'saga', name: 'Saga', nameJa: '佐賀県', emoji: '🏺', suggestedSpots: ['Làng gốm Arita', 'Ureshino Onsen'] },
        { id: 'miyazaki', name: 'Miyazaki', nameJa: '宮崎県', emoji: '🌴', suggestedSpots: ['Hẻm núi Takachiho Gorge', 'Sun Messe Nichinan'] },
      ],
    },
  ],

  VN: [
    {
      id: 'dong-bang-song-hong',
      name: 'Đồng bằng sông Hồng',
      nameJa: '紅河デルタ地方',
      countryId: 'VN',
      locations: [
        { id: 'hanoi', name: 'Hà Nội (Thủ đô Hà Nội)', nameJa: 'ハノイ', emoji: '🏮', suggestedSpots: ['Hồ Hoàn Kiếm & Cầu Thê Húc', 'Phố Cổ 36 Phố Phường', 'Chùa Một Cột', 'Văn Miếu Quốc Tử Giám', 'Hồ Tây'] },
        { id: 'quangninh', name: 'Quảng Ninh (Vịnh Hạ Long)', nameJa: 'クアンニン (ハロン湾)', emoji: '⛵', suggestedSpots: ['Kỳ quan Vịnh Hạ Long', 'Đảo Ti Tốp', 'Đảo Cô Tô', 'Yên Tử'] },
        { id: 'ninhbinh', name: 'Ninh Bình (Tràng An & Tam Cốc)', nameJa: 'ニンビン', emoji: '🛶', suggestedSpots: ['Quần thể danh thắng Tràng An', 'Tam Cốc - Bích Động', 'Hang Múa', 'Chùa Bái Đính'] },
        { id: 'haiphong', name: 'Hải Phòng (Cát Bà)', nameJa: 'ハイフォン', emoji: '⚓', suggestedSpots: ['Quần đảo Cát Bà', 'Vịnh Lan Hạ', 'Bãi biển Đồ Sơn', 'Food tour Hải Phòng'] },
        { id: 'vinhphuc', name: 'Vĩnh Phúc (Tam Đảo)', nameJa: 'ヴィンフック', emoji: '☁️', suggestedSpots: ['Thị trấn trong sương Tam Đảo', 'Thiền viện Trúc Lâm Tây Thiên'] },
        { id: 'bacninh', name: 'Bắc Ninh', nameJa: 'バクニン', emoji: '🎵', suggestedSpots: ['Chùa Dâu', 'Chùa Phật Tích', 'Làng tranh Đông Hồ'] },
        { id: 'hungyen', name: 'Hưng Yên', nameJa: 'フンイエン', emoji: '🏛️', suggestedSpots: ['Phố Hiến cổ kính', 'Đền Chử Đồng Tử'] },
        { id: 'haiduong', name: 'Hải Dương', nameJa: 'ハイズオン', emoji: '🌿', suggestedSpots: ['Khu di tích Côn Sơn - Kiếp Bạc', 'Đảo Cò Chi Lăng Nam'] },
        { id: 'namdinh', name: 'Nam Định', nameJa: 'ナムディン', emoji: '⛪', suggestedSpots: ['Nhà thờ Đổ Hải Lý', 'Đền Trần'] },
        { id: 'thaibinh', name: 'Thái Bình', nameJa: 'タイビン', emoji: '🌾', suggestedSpots: ['Chùa Keo', 'Biển Cồn Vành'] },
        { id: 'hanam', name: 'Hà Nam', nameJa: 'ハナム', emoji: '🪷', suggestedSpots: ['Chùa Tam Chúc'] },
      ],
    },
    {
      id: 'trung-du-mien-nui-bac',
      name: 'Trung du và miền núi phía Bắc',
      nameJa: '北部山岳地方',
      countryId: 'VN',
      locations: [
        { id: 'laocai', name: 'Lào Cai (Sa Pa & Fansipan)', nameJa: 'ラオカイ (サパ)', emoji: '🏔️', suggestedSpots: ['Đỉnh Fansipan nóc nhà Đông Dương', 'Bản Cát Cát', 'Thung lũng Mường Hoa', 'Đèo Ô Quy Hồ'] },
        { id: 'hagiang', name: 'Hà Giang (Cao nguyên đá)', nameJa: 'ハザン', emoji: '🏍️', suggestedSpots: ['Đèo Mã Pí Lèng', 'Sông Nho Quế hẻm Tu Sản', 'Cột cờ Lũng Cú', 'Dinh Vua Mèo', 'Phố cổ Đồng Văn'] },
        { id: 'caobang', name: 'Cao Bằng (Thác Bản Giốc)', nameJa: 'カオバン', emoji: '🌊', suggestedSpots: ['Thác Bản Giốc hùng vĩ', 'Động Ngườm Ngao', 'Suối Lê-nin Pác Bó'] },
        { id: 'yenbai', name: 'Yên Bái (Mù Cang Chải)', nameJa: 'イエンバイ', emoji: '🌾', suggestedSpots: ['Ruộng bậc thang Mù Cang Chải', 'Đèo Khau Phạ', 'Đồi Mâm Xôi'] },
        { id: 'sonla', name: 'Sơn La (Mộc Châu)', nameJa: 'ソンラ (モクチャウ)', emoji: '🌸', suggestedSpots: ['Cao nguyên Mộc Châu', 'Thung lũng mận Nà Ka', 'Đồi chè Trái Tim'] },
        { id: 'dienbien', name: 'Điện Biên', nameJa: 'ディエンビエン', emoji: '🎖️', suggestedSpots: ['Di tích Đồi A1 Điện Biên Phủ', 'Hầm Đờ-cát', 'Đèo Pha Đin'] },
        { id: 'hoabinh', name: 'Hòa Bình (Mai Châu)', nameJa: 'ホアビン', emoji: '🛖', suggestedSpots: ['Thung lũng Mai Châu', 'Bản Lác', 'Hồ Hòa Bình'] },
        { id: 'backan', name: 'Bắc Kạn (Hồ Ba Bể)', nameJa: 'バッカン', emoji: '🛶', suggestedSpots: ['Hồ Ba Bể', 'Động Puông'] },
        { id: 'langson', name: 'Lạng Sơn', nameJa: 'ランソン', emoji: '⛰️', suggestedSpots: ['Động Nhị Thanh - Tam Thanh', 'Cửa khẩu Hữu Nghị'] },
        { id: 'thainguyen', name: 'Thái Nguyên', nameJa: 'タイグエン', emoji: '🍵', suggestedSpots: ['Đồi chè Tân Cương', 'Hồ Núi Cốc'] },
        { id: 'phutho', name: 'Phú Thọ (Đền Hùng)', nameJa: 'フート', emoji: '⛩️', suggestedSpots: ['Khu di tích lịch sử Đền Hùng', 'Vườn quốc gia Xuân Sơn'] },
        { id: 'laichau', name: 'Lai Châu', nameJa: 'ライチャウ', emoji: '☁️', suggestedSpots: ['Cầu kính Rồng Mây', 'Bản Sin Suối Hồ'] },
        { id: 'tuyenquang', name: 'Tuyên Quang', nameJa: 'トゥエンクアン', emoji: '🌳', suggestedSpots: ['Khu bảo tồn Na Hang', 'Cây đa Tân Trào'] },
      ],
    },
    {
      id: 'bac-trung-bo',
      name: 'Bắc Trung Bộ',
      nameJa: '北中部地方',
      countryId: 'VN',
      locations: [
        { id: 'hue', name: 'Thừa Thiên Huế (Cố đô Huế)', nameJa: 'フエ', emoji: '🏯', suggestedSpots: ['Đại Nội Hoàng Thành Huế', 'Chùa Thiên Mụ bờ sông Hương', 'Lăng Tự Đức & Lăng Khải Định', 'Cầu Tràng Tiền'] },
        { id: 'quangbinh', name: 'Quảng Bình (Phong Nha)', nameJa: 'クアンビン', emoji: '🦇', suggestedSpots: ['Vườn quốc gia Phong Nha - Kẻ Bàng', 'Động Thiên Đường', 'Sông Chày Hang Tối', 'Suối Moọc'] },
        { id: 'quangtri', name: 'Quảng Trị', nameJa: 'クアントリ', emoji: '🕊️', suggestedSpots: ['Thành cổ Quảng Trị', 'Cầu Hiền Lương - Sông Bến Hải', 'Địa đạo Vịnh Mốc'] },
        { id: 'hatinh', name: 'Hà Tĩnh', nameJa: 'ハティン', emoji: '🌊', suggestedSpots: ['Bãi biển Thiên Cầm', 'Ngã ba Đồng Lộc'] },
        { id: 'nghean', name: 'Nghệ An', nameJa: 'ゲアン', emoji: '🌻', suggestedSpots: ['Khu di tích Kim Liên Nam Đàn', 'Biển Cửa Lò', 'Đồi chè Thanh Chương'] },
        { id: 'thanhhoa', name: 'Thanh Hóa', nameJa: 'タインホア', emoji: '🏕️', suggestedSpots: ['Khu bảo tồn thiên nhiên Pù Luông', 'Thành Nhà Hồ', 'Biển Sầm Sơn'] },
      ],
    },
    {
      id: 'nam-trung-bo-tay-nguyen',
      name: 'Duyên hải Nam Trung Bộ và Tây Nguyên',
      nameJa: '中南部沿岸・中南部高原地方',
      countryId: 'VN',
      locations: [
        { id: 'danang', name: 'Đà Nẵng (Thành phố biển)', nameJa: 'ダナン', emoji: '🌉', suggestedSpots: ['Cầu Vàng Bà Nà Hills', 'Bán đảo Sơn Trà & Chùa Linh Ứng', 'Cầu Rồng phun lửa', 'Bãi biển Mỹ Khê'] },
        { id: 'quangnam', name: 'Quảng Nam (Phố cổ Hội An)', nameJa: 'クアンナム (ホイアン)', emoji: '🏮', suggestedSpots: ['Phố cổ Hội An bên sông Hoài', 'Chùa Cầu Nhật Bản', 'Thánh địa Mỹ Sơn', 'Rừng dừa Bảy Mẫu'] },
        { id: 'lamdong', name: 'Lâm Đồng (Đà Lạt ngàn hoa)', nameJa: 'ラムドン (ダラット)', emoji: '🌲', suggestedSpots: ['Hồ Xuân Hương & Quảng trường Lâm Viên', 'Thung lũng Tình Yêu', 'Đồi chè Cầu Đất', 'Thác Datanla', 'Chợ đêm Đà Lạt'] },
        { id: 'khanhhoa', name: 'Khánh Hòa (Nha Trang)', nameJa: 'カインホア (ニャチャン)', emoji: '🏖️', suggestedSpots: ['Vịnh Nha Trang', 'Tháp Bà Ponagar', 'VinWonders Hòn Tre', 'Bình Ba & Bình Lập'] },
        { id: 'phuyen', name: 'Phú Yên (Xứ hoa vàng cỏ xanh)', nameJa: 'フーイエン', emoji: '🌾', suggestedSpots: ['Ghềnh Đá Đĩa độc nhất vô nhị', 'Bãi Xép', 'Hải đăng Mũi Điện - Mũi Đại Lãnh'] },
        { id: 'binhdinh', name: 'Bình Định (Quy Nhơn)', nameJa: 'ビンディン (クイニョン)', emoji: '🌊', suggestedSpots: ['Eo Gió kỳ vĩ', 'Kỳ Co', 'Khu dã ngoại Trung Lương', 'Tháp Bánh Ít'] },
        { id: 'ninhthuan', name: 'Ninh Thuận', nameJa: 'ニンホアン', emoji: '🍇', suggestedSpots: ['Vịnh Vĩnh Hy', 'Đồi cừu An Hòa', 'Vườn nho Ba Mọi', 'Tháp Chàm Po Klong Garai'] },
        { id: 'binhthuan', name: 'Bình Thuận (Mũi Né)', nameJa: 'ビンホアン (ムイネー)', emoji: '🏜️', suggestedSpots: ['Đồi Cát Bay Mũi Né', 'Bàu Trắng', 'Suối Tiên', 'Hải đăng Kê Gà'] },
        { id: 'quangngai', name: 'Quảng Ngãi (Đảo Lý Sơn)', nameJa: 'クアンガイ (リーソン)', emoji: '🌋', suggestedSpots: ['Đảo ngọc Lý Sơn', 'Cổng Tò Vò', 'Đỉnh Thới Lới'] },
        { id: 'daklak', name: 'Đắk Lắk (Buôn Ma Thuột)', nameJa: 'ダクラク', emoji: '🐘', suggestedSpots: ['Hồ Lắk', 'Bảo tàng Thế giới Cà phê', 'Thác Dray Nur'] },
        { id: 'gialai', name: 'Gia Lai (Pleiku)', nameJa: 'ザライ', emoji: '🌋', suggestedSpots: ['Biển Hồ T’nưng mắt ngọc Gia Lai', 'Núi lửa Chư Đăng Ya'] },
        { id: 'kontum', name: 'Kon Tum (Măng Đen)', nameJa: 'コントゥム (マンデン)', emoji: '🌲', suggestedSpots: ['Thị trấn Măng Đen mù sương', 'Nhà thờ Gỗ Kon Tum', 'Cầu treo Kon Klor'] },
        { id: 'daknong', name: 'Đắk Nông (Tà Đùng)', nameJa: 'ダクノン', emoji: '🏝️', suggestedSpots: ['Hồ Tà Đùng - Vịnh Hạ Long trên cạn', 'Hang động núi lửa Chư Blúk'] },
      ],
    },
    {
      id: 'dong-nam-bo',
      name: 'Đông Nam Bộ',
      nameJa: '東南部地方',
      countryId: 'VN',
      locations: [
        { id: 'tphcm', name: 'TP. Hồ Chí Minh (Sài Gòn)', nameJa: 'ホーチミン市', emoji: '☕', suggestedSpots: ['Nhà thờ Đức Bà & Bưu điện Trung tâm', 'Chợ Bến Thành', 'Phố đi bộ Nguyễn Huệ', 'Tòa nhà Landmark 81', 'Dinh Độc Lập'] },
        { id: 'vungtau', name: 'Bà Rịa - Vũng Tàu', nameJa: 'ブンタウ', emoji: '🏖️', suggestedSpots: ['Bãi Sau & Bãi Trước', 'Tượng Chúa Kito Vua', 'Mũi Nghinh Phong', 'Quần đảo Côn Đảo'] },
        { id: 'tayninh', name: 'Tây Ninh (Núi Bà Đen)', nameJa: 'タイニン', emoji: '⛰️', suggestedSpots: ['Đỉnh Núi Bà Đen nóc nhà Đông Nam Bộ', 'Tòa thánh Tây Ninh'] },
        { id: 'dongnai', name: 'Đồng Nai', nameJa: 'ドンナイ', emoji: '🌳', suggestedSpots: ['Vườn quốc gia Cát Tiên', 'Khu du lịch Bửu Long', 'Thác Đá Hàn'] },
        { id: 'binhduong', name: 'Bình Dương', nameJa: 'ビンズオン', emoji: '🪴', suggestedSpots: ['Chùa Châu Thới', 'Làng tre Phú An', 'Khu du lịch Đại Nam'] },
        { id: 'binhphuoc', name: 'Bình Phước', nameJa: 'ビンフオック', emoji: '🍃', suggestedSpots: ['Trảng cỏ Bù Lạch', 'Núi Bà Rá'] },
      ],
    },
    {
      id: 'dong-bang-song-cuu-long',
      name: 'Đồng bằng sông Cửu Long',
      nameJa: 'メコンデルタ地方',
      countryId: 'VN',
      locations: [
        { id: 'cantho', name: 'Cần Thơ (Tây Đô)', nameJa: 'カントー', emoji: '🛶', suggestedSpots: ['Chợ nổi Cái Răng', 'Bến Ninh Kiều', 'Nhà cổ Bình Thủy', 'Cồn Sơn'] },
        { id: 'kiengiang', name: 'Kiên Giang (Phú Quốc & Hà Tiên)', nameJa: 'キエンザン (フーコック)', emoji: '🏝️', suggestedSpots: ['Đảo ngọc Phú Quốc', 'Bãi Sao & Bãi Khem', 'Sunset Town Thị trấn Hoàng Hôn', 'Quần đảo Nam Du'] },
        { id: 'angiang', name: 'An Giang (Châu Đốc)', nameJa: 'アンザン', emoji: '🌿', suggestedSpots: ['Rừng tràm Trà Sư', 'Miếu Bà Chúa Xứ Núi Sam', 'Hồ Tà Pạ'] },
        { id: 'dongthap', name: 'Đồng Tháp (Sa Đéc)', nameJa: 'ドンタップ', emoji: '🪷', suggestedSpots: ['Làng hoa Sa Đéc', 'Vườn quốc gia Tràm Chim', 'Khu di tích Xẻo Quýt'] },
        { id: 'camau', name: 'Cà Mau (Đất Mũi)', nameJa: 'カマウ', emoji: '🦀', suggestedSpots: ['Mốc tọa độ quốc gia Đất Mũi', 'Rừng ngập mặn U Minh Hạ'] },
        { id: 'bentre', name: 'Bến Tre (Xứ Dừa)', nameJa: 'ベンチェ', emoji: '🥥', suggestedSpots: ['Cồn Phụng', 'Khu du lịch Lan Vương', 'Cung đường rợp bóng dừa'] },
        { id: 'vinhlong', name: 'Vĩnh Long', nameJa: 'ビンロン', emoji: '🍊', suggestedSpots: ['Cù lao An Bình', 'Lò gạch Mang Thít'] },
        { id: 'tiengiang', name: 'Tiền Giang (Mỹ Tho)', nameJa: 'ティエンザン', emoji: '🚣', suggestedSpots: ['Chùa Vĩnh Tràng', 'Cù lao Thới Sơn'] },
        { id: 'baclieu', name: 'Bạc Liêu', nameJa: 'バクリエウ', emoji: '⚡', suggestedSpots: ['Cánh đồng điện gió Bạc Liêu', 'Nhà Công tử Bạc Liêu'] },
        { id: 'soctrang', name: 'Sóc Trăng', nameJa: 'ソクチャン', emoji: '🛕', suggestedSpots: ['Chùa Dơi', 'Chùa Chén Kiểu (Sro Lôn)'] },
        { id: 'travinh', name: 'Trà Vinh', nameJa: 'トラヴィン', emoji: '🪷', suggestedSpots: ['Ao Bà Om', 'Chùa Âng'] },
        { id: 'longan', name: 'Long An', nameJa: 'ロンアン', emoji: '🌾', suggestedSpots: ['Làng nổi Tân Lập', 'Cánh đồng sen'] },
        { id: 'haugiang', name: 'Hậu Giang', nameJa: 'ハウザン', emoji: '🌾', suggestedSpots: ['Chợ nổi Ngã Bảy', 'Khu bảo tồn Lung Ngọc Hoàng'] },
      ],
    },
  ],
};
