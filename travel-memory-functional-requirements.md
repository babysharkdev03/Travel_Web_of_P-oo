# Travel Memory Website — Functional Requirements

> **Purpose:** This document is the single source of truth for implementing the Travel Memory website.  
> AI coding agents should read and follow **all requirements in this file**. Do not re-introduce features explicitly marked as removed/deprecated.

---

# EPIC 1 — BẢN ĐỒ THẾ GIỚI

## UC1 — Hiển thị thông tin tác giả

User có thể nhìn thấy thông tin cơ bản của tác giả trên màn mở đầu của bản đồ thế giới.

### Requirements

- Hiển thị icon/avatar của tác giả.
- Hiển thị tên tác giả.
- Hỗ trợ hiển thị tên theo hai ngôn ngữ:
  - Tiếng Việt: `Phạm Thanh Thư`
  - Tiếng Nhật: `ファム　タイン　トゥー`
- Hiển thị tổng số ký ức mà tác giả đã viết.

### Demo

```text
Tác giả:
Phạm Thanh Thư

Tên tiếng Nhật:
ファム　タイン　トゥー

Tổng số ký ức:
N
```

---

## UC2 — Xem thông tin quốc gia

User có thể click vào icon của một quốc gia trên bản đồ thế giới để xem thông tin cơ bản về quốc gia đó.

### Requirements

Khi user click vào icon của một quốc gia, hiển thị:

- Tổng số ký ức của tác giả tại quốc gia đó.
- Ký ức gần nhất tại quốc gia đó.
- Dòng cảm nghĩ của tác giả về quốc gia đó.

---

## UC3 — Hiển thị các ký ức vừa ghi dấu

User có thể nhìn thấy các ký ức mới nhất ngay trên màn hình bản đồ thế giới.

### Requirements

- Không hiển thị bài viết ở kích thước lớn.
- Hiển thị khoảng `3` ký ức gần nhất.
- Mỗi ký ức được hiển thị dưới dạng card/ô vuông nhỏ.
- User có thể click vào card để đọc trực tiếp ký ức.
- Có nút `Xem tất cả`.
- Khi click `Xem tất cả`, navigate tới phần **Ký ức**.

---

# EPIC 2 — BẢN ĐỒ VƯƠNG QUỐC

## UC1 — Chuyển đổi giữa Việt Nam và Nhật Bản

User có thể sử dụng toggle để lựa chọn quốc gia muốn xem:

- Việt Nam
- Nhật Bản

### Requirements

Khi user chuyển toggle:

- Hiển thị bản đồ của quốc gia tương ứng.
- Hiển thị thông tin vùng/tỉnh tương ứng với quốc gia đang được chọn.
- Tên địa danh phải thay đổi theo ngôn ngữ/context tương ứng.

### Removed Requirement

Tính năng:

> Khi đang ở toggle Nhật thì bản đồ 3D phải hiển thị tiếng Nhật và ngược lại.

**Bỏ tính năng này.**

---

## UC2 — Hiển thị thống kê quốc gia

User có thể nhìn thấy các thông tin tổng quan của quốc gia đang được chọn.

### Requirements

Hiển thị:

- Tổng số ký ức.
- Tổng số vùng/tỉnh đã ghé.
- Tổng số địa điểm nằm trong danh sách ước mơ.

---

## UC3 — Xem chi tiết phân vùng

User có thể xem thông tin chi tiết của từng vùng/tỉnh trên bản đồ.

### Requirements

- Hiển thị bản đồ quốc gia.
- Hiển thị các vùng/tỉnh trên bản đồ.
- Có chức năng tìm kiếm tỉnh/thành phố.
- Search phải hỗ trợ tìm kiếm bằng cả tiếng Việt và tiếng Nhật.

### Search — Việt Nam

Khi đang xem Việt Nam, user có thể nhập:

```text
Hà Nội
```

hoặc:

```text
ハノイ
```

Cả hai đều phải trả về đúng địa điểm Hà Nội.

### Search — Nhật Bản

Khi đang xem Nhật Bản, user có thể nhập:

```text
Tokyo
```

hoặc:

```text
東京
```

Cả hai đều phải trả về đúng địa điểm Tokyo.

---

## UC4 — Liên kết tỉnh/thành phố với ký ức

User có thể click vào tỉnh/thành phố đã từng đi để xem các ký ức liên quan tới tỉnh/thành phố đó.

### Requirements

#### Trường hợp 1 — Đã đi và có ký ức

Không hiển thị đơn giản:

```text
Đã đi
```

Thay vào đó, hiển thị **số lượng ký ức**.

Ví dụ:

```text
Tokyo
12 ký ức
```

Khi user click:

```text
Bản đồ
  ↓
Tokyo
  ↓
Ký ức Tokyo
```

Trang Ký ức phải tự động filter để chỉ hiển thị các ký ức liên quan tới Tokyo.

#### Trường hợp 2 — Đã đi nhưng chưa có ký ức

Nếu tỉnh/thành phố đã từng đi nhưng chưa có bài viết:

- Vẫn hiển thị trạng thái `Đã đi`.
- Không hiển thị số lượng ký ức.
- Không hiển thị link sang phần Ký ức.
- User không thể navigate sang Ký ức từ địa điểm này.

---

## UC5 — Tương tác với bản đồ quốc gia

User có thể tương tác trực tiếp với bản đồ quốc gia.

### Requirements

Bản đồ phải:

- Hiển thị tên các vùng của quốc gia.
- Hiển thị tên các tỉnh/thành phố.
- Tên tỉnh/thành phố được hiển thị dưới dạng button/clickable element để tạo cảm giác có thể tương tác.

### Khi click vào tỉnh/thành phố

Khi user click vào một tỉnh/thành phố:

- Hệ thống tự động di chuyển/scroll tới phần nội dung tương ứng bên dưới.
- Phần nội dung bên dưới hiển thị thông tin của vùng/tỉnh được chọn.

### Mobile Interaction

Trên mobile, user có thể thao tác trực tiếp với bản đồ bằng tay:

- Pinch để zoom in.
- Pinch để zoom out.
- Drag để di chuyển bản đồ.

Không cần hiển thị các button `Zoom in`, `Zoom out`, `Reset`.

---

## Requirements bổ sung — Bản đồ Việt Nam

### Thay đổi

- Xóa phần chọn vùng dùng để xem tỉnh.
- Thay đổi hiệu ứng của button tỉnh/thành phố.
- Giữ lại phần nội dung vùng ở bên dưới bản đồ.

### Xóa

Xóa:

```text
Xem trong tab chi tiết
```

---

# EPIC 3 — ĐỊA ĐIỂM

## UC1 — Hiển thị timeline hành trình

User có thể xem timeline theo chiều dọc thể hiện các địa điểm mà tác giả đã đi.

### Requirements

Timeline hiển thị:

- Tên tỉnh/thành phố đã tới.
- Địa điểm cụ thể nếu có.

Ví dụ:

```text
Tokyo
  └── Kichijoji

Osaka
  └── Dotonbori

Hà Nội
  └── Hoàn Kiếm
```

### Không hiển thị

Timeline **không hiển thị toàn bộ bài viết ký ức**.

Chỉ hiển thị:

- Tỉnh/thành phố.
- Địa điểm cụ thể nếu có.

Mục tiêu là timeline phải ngắn gọn và dễ nhìn.

### Sorting

User có thể thay đổi thứ tự:

- Mới nhất → Cũ nhất.
- Cũ nhất → Mới nhất.

### UI/UX

Timeline không được chứa quá nhiều thông tin trong mỗi item.

Ưu tiên:

- Dễ đọc.
- Dễ quét thông tin.
- Không gây rối mắt.

---

## UC2 — Tìm kiếm địa điểm

User có thể tìm kiếm trong danh sách địa điểm.

### Search by City

Có một thanh tìm kiếm theo tên thành phố/tỉnh.

Đây là **search**, không phải filter.

### Search by Year

User có thể tìm kiếm theo năm.

Ví dụ:

```text
2024
```

→ Hiển thị các địa điểm mà tác giả đã đi trong năm 2024.

---

# EPIC 4 — KÝ ỨC

## UC1 — Hiển thị các bài viết ký ức

User có thể xem các bài viết/ký ức của tác giả.

### Requirements

User có thể tìm kiếm bài viết thông qua:

- Search.
- Filter.

### Country Filter

Có các lựa chọn:

```text
Tất cả
Nhật Bản
Việt Nam
```

### Multiple Memories per City

Một thành phố có thể có nhiều ký ức.

Ví dụ:

```text
Tokyo
├── Ký ức tại Shibuya
├── Ký ức tại Kichijoji
├── Ký ức tại Shinjuku
└── Ký ức tại Tokyo Disneyland
```

Không được giới hạn một thành phố chỉ có một bài viết.

---

## UC2 — Timeline ký ức

User có thể xem các bài viết theo timeline dọc.

### Requirements

Timeline hỗ trợ:

- Mới nhất → Cũ nhất.
- Cũ nhất → Mới nhất.

Mỗi timeline item chỉ nên hiển thị thông tin cần thiết để user nhận biết bài viết.

---

## UC3 — Đọc bài viết

User có thể đọc bài viết từ:

- Timeline.
- Search result.
- Các ký ức được liên kết từ bản đồ.

### Requirements

Khi user click `Đọc thêm`:

- Bài viết phải hiển thị **toàn màn hình**.
- Không hiển thị bài viết dưới dạng card/modal nhỏ ở giữa màn hình.
- User có thể đọc toàn bộ nội dung bài viết trong một reading experience riêng.

---

## UC4 — Điều hướng từ bản đồ tới ký ức

Liên kết với:

> EPIC 2 — UC4: Liên kết tỉnh/thành phố với ký ức.

### Requirements

Khi user click vào một tỉnh/thành phố có ký ức:

```text
Bản đồ
  ↓
Tỉnh/thành phố
  ↓
Ký ức
```

Trang Ký ức phải tự động filter theo địa điểm tương ứng.

### Ví dụ

```text
Tokyo — 12 ký ức
```

Click vào:

```text
↓
Ký ức Tokyo
```

Kết quả:

```text
Hiển thị 12 bài viết liên quan tới Tokyo
```

### Back Navigation

Khi user navigate từ Bản đồ → Ký ức:

- Màn hình Ký ức phải có nút `Back`.
- Khi click `Back`, user quay lại đúng màn hình trước đó.
- Không đưa user về trang chủ một cách mặc định.
- Nếu có thể, giữ nguyên context/filter của màn hình trước đó.

---

# EPIC 5 — ADMIN SITE

## UC1 — Quản lý bài viết / ký ức

Admin có thể quản lý toàn bộ bài viết/ký ức.

### Create — Thêm bài viết

Admin có thể:

- Thêm bài viết mới.
- Nhập nội dung bài viết.
- Gắn địa điểm.
- Gắn quốc gia.
- Gắn tỉnh/thành phố.
- Gắn hashtag.

### Read — Xem bài viết

Admin có thể:

- Xem danh sách toàn bộ bài viết.
- Xem nội dung chi tiết của từng bài viết.

### Update — Sửa bài viết

Admin có thể:

- Sửa nội dung bài viết.
- Sửa thông tin địa điểm.
- Sửa quốc gia.
- Sửa tỉnh/thành phố.
- Sửa hashtag.
- Chỉnh sửa các thông tin liên quan khác.

### Delete — Xóa bài viết

Admin có thể xóa bài viết.

Khi click `Xóa`, hệ thống phải hiển thị confirmation popup:

```text
Bạn có chắc chắn muốn xóa ký ức này không?

[ Hủy ] [ Xóa ]
```

Chỉ thực hiện xóa sau khi admin xác nhận.

### Search — Tìm kiếm bài viết

Admin có thể tìm kiếm bài viết dựa trên:

- Thời gian.
- Từ khóa.
- Hashtag.

---

## UC2 — Quản lý trạng thái tỉnh/thành phố

Admin có thể quản lý trạng thái của các tỉnh/thành phố.

### Status

Mỗi tỉnh/thành phố có một trong ba trạng thái:

```text
Đã đi
Ước mơ
Chưa đi
```

### UI

UI quản lý tỉnh/thành phố phải dựa trên UI danh sách tỉnh/thành phố được hiển thị trong phần Bản đồ.

Ví dụ:

```text
Việt Nam
  ▼

Hà Nội
Đà Nẵng
TP. Hồ Chí Minh
...

Nhật Bản
  ▼

Tokyo
Osaka
Kyoto
...
```

### Interaction

- Có mũi tên để expand/collapse danh sách.
- Admin có thể mở danh sách tỉnh/thành phố.
- Admin có thể chọn từng tỉnh/thành phố.
- Admin có thể thay đổi trạng thái.

### Filter

Admin có thể filter theo trạng thái:

```text
Tất cả
Đã đi
Ước mơ
Chưa đi
```

Mục đích:

- Xem các tỉnh đã đi.
- Xem các tỉnh chưa đi.
- Xem các tỉnh nằm trong danh sách ước mơ.
- Chỉnh sửa trạng thái nhanh chóng.

---

## UC3 — Quản lý hồ sơ tác giả

Admin có thể chỉnh sửa thông tin hồ sơ tác giả.

### Personal Information

Admin có thể chỉnh sửa:

- Họ tên.
- Ảnh avatar.

### Multilingual Introduction

Admin có thể chỉnh sửa lời tựa/profile introduction theo từng ngôn ngữ.

#### Tiếng Việt

```text
Vietnamese Introduction
```

#### Tiếng Nhật

```text
Japanese Introduction
```

Khi user chuyển đổi ngôn ngữ:

```text
VI ↔ JP
```

Website phải hiển thị đúng lời tựa tương ứng.

### Social & Contact Links

Admin có thể chỉnh sửa các link mạng xã hội và thông tin liên hệ của tác giả.

Ví dụ:

- Facebook.
- Instagram.
- Các mạng xã hội khác.
- Email.
- Các link liên hệ khác.

---

# EPIC 6 — TOGGLE VIỆT NAM / NHẬT BẢN & NGÔN NGỮ

## UC1 — Chuyển đổi ngôn ngữ

Website hỗ trợ:

```text
VI — Tiếng Việt
JP — 日本語
```

### Requirements

Khi user chuyển đổi ngôn ngữ:

- Tên tác giả thay đổi theo ngôn ngữ.
- Lời tựa/profile thay đổi theo ngôn ngữ.
- Tên tỉnh/thành phố thay đổi theo ngôn ngữ.
- Text/UI của website thay đổi theo ngôn ngữ.

---

## UC2 — Search đa ngôn ngữ

Search phải hỗ trợ tìm kiếm chéo giữa tiếng Việt và tiếng Nhật.

### Ví dụ

User đang sử dụng tiếng Nhật nhưng nhập:

```text
Hà Nội
```

Hệ thống phải đề xuất:

```text
ハノイ
```

Ngược lại, user nhập:

```text
東京
```

Hệ thống phải tìm được:

```text
Tokyo
```

### Requirement

Tên địa danh phải có mapping giữa:

```text
Vietnamese Name
        ↕
Japanese Name
```

Search không được phụ thuộc hoàn toàn vào ngôn ngữ UI hiện tại.

---

# EPIC 7 — NAVIGATION & CROSS-LINKING

## UC1 — Điều hướng giữa các khu vực

Các khu vực chính của Public Site:

```text
Bản đồ thế giới
      ↓
Bản đồ vương quốc
      ↓
Địa điểm
      ↓
Ký ức
```

Admin Site hoạt động như một khu vực quản trị riêng.

---

## UC2 — Deep Linking từ bản đồ tới ký ức

Các tỉnh/thành phố có ký ức phải có thể navigate trực tiếp tới danh sách ký ức tương ứng.

### Ví dụ

```text
Tokyo
12 ký ức
```

Click:

```text
↓
Ký ức Tokyo
```

Trang Ký ức phải tự động filter:

```text
Location = Tokyo
```

---

## UC3 — Back Navigation

Khi user đi từ một context cụ thể sang context khác, hệ thống phải cho phép quay lại context trước đó.

### Example

```text
Bản đồ thế giới
      ↓
Nhật Bản
      ↓
Tokyo
      ↓
Ký ức Tokyo
      ↓
Chi tiết ký ức
```

Khi user quay lại:

```text
Chi tiết ký ức
      ↑
Ký ức Tokyo
      ↑
Tokyo
      ↑
Bản đồ Nhật Bản
```

Không nên luôn đưa user về trang chủ.

---

# EPIC 8 — DATA MODEL & RELATIONSHIP

## UC1 — Quan hệ giữa địa điểm và ký ức

Một Memory có thể thuộc về một cấu trúc địa lý:

```text
Country
   ↓
Region
   ↓
Province / Prefecture
   ↓
City
   ↓
Specific Location
```

### Multiple Memories

Một địa điểm có thể có nhiều Memory.

Ví dụ:

```text
Japan
└── Tokyo
    ├── Shibuya
    │   ├── Memory #01
    │   └── Memory #05
    │
    ├── Kichijoji
    │   ├── Memory #02
    │   └── Memory #08
    │
    └── Shinjuku
        └── Memory #03
```

---

## UC2 — Trạng thái địa điểm

Mỗi tỉnh/thành phố có thể có một trong ba trạng thái:

```text
visited
dream
not_visited
```

### Meaning

| Status | Ý nghĩa |
|---|---|
| `visited` | Tác giả đã từng tới |
| `dream` | Địa điểm tác giả mong muốn tới |
| `not_visited` | Chưa từng tới và không nằm trong danh sách ước mơ |

### Important Rule

Một địa điểm có trạng thái:

```text
visited
```

**không nhất thiết phải có Memory.**

Ví dụ:

```text
Kyoto

status = visited
memory_count = 0
```

Trong trường hợp này:

- Hiển thị Kyoto là địa điểm đã đi.
- Không hiển thị link sang Ký ức.
- Khi `memory_count > 0`, hiển thị số lượng ký ức.
- Khi `memory_count > 0`, cho phép navigate tới danh sách Ký ức tương ứng.

---

# WEBSITE STRUCTURE

## Public Site

```text
World Map
│
├── Author Information
│
├── Country Information
│
├── Recent Memories
│
└── Kingdom / Country Map
    │
    ├── Vietnam
    │   ├── Regions
    │   ├── Provinces
    │   └── Memories
    │
    └── Japan
        ├── Regions
        ├── Prefectures
        └── Memories


Places
│
├── Timeline
├── Search by City
└── Search by Year


Memories
│
├── All
├── Japan
├── Vietnam
├── Search
├── Filter
├── Timeline
└── Memory Detail
```

---

# ADMIN SITE STRUCTURE

```text
Admin Dashboard
│
├── Memories
│   ├── Create
│   ├── Read
│   ├── Update
│   ├── Delete
│   └── Search
│
├── Locations
│   ├── Vietnam
│   ├── Japan
│   ├── Visited
│   ├── Dream
│   └── Not Visited
│
└── Author Profile
    ├── Name
    ├── Avatar
    ├── Vietnamese Introduction
    ├── Japanese Introduction
    └── Social / Contact Links
```

---

# CORE BUSINESS RULES

## Rule 1 — Một thành phố có thể có nhiều ký ức

Không được thiết kế database/UI theo mô hình:

```text
City → 1 Memory
```

Mà phải hỗ trợ:

```text
City → N Memories
```

---

## Rule 2 — Đã đi không đồng nghĩa với có bài viết

Có thể tồn tại:

```text
Location.status = visited
Location.memory_count = 0
```

Trong trường hợp này địa điểm vẫn được hiển thị là đã đi nhưng không có link tới Ký ức.

---

## Rule 3 — Chỉ địa điểm có ký ức mới link sang Ký ức

```text
memory_count > 0
        ↓
Clickable
        ↓
Memory List
```

Ngược lại:

```text
memory_count = 0
        ↓
Không có Memory Link
```

---

## Rule 4 — Search địa danh phải hỗ trợ song ngữ

Search phải tìm được địa danh bằng cả:

```text
Tên tiếng Việt
        ↕
Tên tiếng Nhật
```

Bất kể UI hiện tại đang ở ngôn ngữ nào.

---

## Rule 5 — Back phải giữ context

Nếu user đi:

```text
Map
 ↓
Tokyo
 ↓
Memories
```

thì khi Back:

```text
Memories
 ↓
Tokyo
```

Không được reset về Home.

---

## Rule 6 — Memory Detail là một reading experience riêng

Khi mở bài viết:

- Hiển thị toàn màn hình.
- Không hiển thị dưới dạng modal nhỏ.
- Ưu tiên trải nghiệm đọc nội dung dài.
- Có navigation để quay lại context trước đó.

---

# REMOVED / DEPRECATED FEATURES

Các tính năng sau **không còn được triển khai**:

1. Thay đổi ngôn ngữ hiển thị trên bản đồ 3D dựa trên toggle Việt Nam/Nhật Bản.
2. Phần lựa chọn vùng để xem tỉnh trong bản đồ Việt Nam.
3. Chức năng/nút `Xem trong tab chi tiết`.
4. Các control zoom riêng trên mobile:
   - Zoom in.
   - Zoom out.
   - Reset zoom.

   Thay bằng gesture trực tiếp trên bản đồ.

---

# UX PRINCIPLES

Website cần ưu tiên:

- Trải nghiệm khám phá.
- Tính trực quan của bản đồ.
- Timeline đơn giản.
- Nội dung ký ức là trọng tâm.
- Không đưa quá nhiều thông tin lên cùng một màn hình.
- Các địa điểm có thể click phải tạo cảm giác rõ ràng là interactive.
- Navigation giữa Map → Location → Memory phải tự nhiên.
- Hỗ trợ tốt cả desktop và mobile.
- Mobile map phải hỗ trợ gesture tự nhiên.
- Nội dung song ngữ Việt Nam / Nhật Bản phải nhất quán.

---

# IMPLEMENTATION INSTRUCTION FOR AI CODING AGENTS

## Source of Truth

This document is the authoritative functional requirement for the project.

When implementing or modifying the website:

1. Read this entire document before making architectural or UI changes.
2. Follow all active requirements.
3. Do not re-introduce features listed under `REMOVED / DEPRECATED FEATURES`.
4. Preserve existing functionality unless it conflicts with an explicit requirement in this document.
5. When requirements concern navigation, preserve the user's current context whenever possible.
6. When requirements concern locations and memories, respect the one-to-many relationship between locations and memories.
7. Do not assume that every visited location has a memory.
8. Keep Vietnamese/Japanese location mapping independent from the current UI language.
9. Prioritize responsive behavior for both desktop and mobile.
10. Avoid adding unnecessary UI controls when the requirements explicitly call for direct interaction/gesture.
11. Do not simplify away requirements merely because a simpler implementation is easier.
12. Before changing an existing feature, verify whether the change conflicts with another requirement in this document.
