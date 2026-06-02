// This file must be saved as UTF-8.
import bcrypt from "bcrypt";

const now = () => new Date();
const password = "manhdung123123";

const ids = {
  members: {
    manhDung: "10000000-0000-4000-8000-000000000001",
    bachKhoa: "10000000-0000-4000-8000-000000000002",
    minhChi: "10000000-0000-4000-8000-000000000003",
    hoangAn: "10000000-0000-4000-8000-000000000004",
    giaHuy: "10000000-0000-4000-8000-000000000005",
  },
  profiles: {
    minhChi: "50000000-0000-4000-8000-000000000001",
  },
  books: {
    nhaGiaKim: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    dacNhanTam: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    toiThayHoaVang: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    tuoiTreDangGia: "20000000-0000-4000-8000-000000000004",
    cleanCode: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    introductionAlgorithms: "20000000-0000-4000-8000-000000000006",
    databaseSystem: "20000000-0000-4000-8000-000000000007",
    atomicHabits: "20000000-0000-4000-8000-000000000008",
    sapiens: "20000000-0000-4000-8000-000000000009",
    pragmaticProgrammer: "20000000-0000-4000-8000-000000000010",
    harryPotter1: "20000000-0000-4000-8000-000000000011",
    khongGiaDinh: "20000000-0000-4000-8000-000000000012",
    trietHocMacLenin: "20000000-0000-4000-8000-000000000013",
    lapTrinhC: "20000000-0000-4000-8000-000000000014",
    marketingCanBan: "20000000-0000-4000-8000-000000000015",
    deMenPhieuLuuKy: "20000000-0000-4000-8000-000000000016",
  },
  copies: {
    nhaGiaKim: "a1111111-1111-4111-8111-111111111111",
    dacNhanTam: "c3333333-3333-4333-8333-333333333333",
    toiThayHoaVang: "b2222222-2222-4222-8222-222222222222",
    tuoiTreDangGia: "30000000-0000-4000-8000-000000000004",
    cleanCode: "d4444444-4444-4444-8444-444444444444",
    introductionAlgorithms: "30000000-0000-4000-8000-000000000006",
    databaseSystem: "30000000-0000-4000-8000-000000000007",
    atomicHabits: "30000000-0000-4000-8000-000000000008",
    sapiens: "30000000-0000-4000-8000-000000000009",
    pragmaticProgrammer: "30000000-0000-4000-8000-000000000010",
    harryPotter1: "30000000-0000-4000-8000-000000000011",
    khongGiaDinh: "30000000-0000-4000-8000-000000000012",
    trietHocMacLenin: "30000000-0000-4000-8000-000000000013",
    lapTrinhC: "30000000-0000-4000-8000-000000000014",
    marketingCanBan: "30000000-0000-4000-8000-000000000015",
    deMenPhieuLuuKy: "30000000-0000-4000-8000-000000000016",
  },
  pointHistories: {
    manhDungInitial: "40000000-0000-4000-8000-000000000001",
    manhDungBonus: "40000000-0000-4000-8000-000000000002",
    bachKhoaInitial: "40000000-0000-4000-8000-000000000003",
    bachKhoaBonus: "40000000-0000-4000-8000-000000000004",
    minhChiInitial: "40000000-0000-4000-8000-000000000005",
    minhChiBonus: "40000000-0000-4000-8000-000000000006",
    hoangAnInitial: "40000000-0000-4000-8000-000000000007",
    hoangAnBonus: "40000000-0000-4000-8000-000000000008",
    giaHuyInitial: "40000000-0000-4000-8000-000000000009",
    giaHuyBonus: "40000000-0000-4000-8000-000000000010",
  },
  conversation: "60000000-0000-4000-8000-000000000001",
  messages: [
    "70000000-0000-4000-8000-000000000001",
    "70000000-0000-4000-8000-000000000002",
    "70000000-0000-4000-8000-000000000003",
  ],
};

const demoMembers = [
  {
    member_id: ids.members.manhDung,
    full_name: "Nguyễn Mạnh Dũng",
    email: "manhdung05072005@gmail.com",
    phone: "0984305191",
    address: "Bắc Từ Liêm, Hà Nội",
    point_balance: 40,
    is_deliverer: false,
  },
  {
    member_id: ids.members.bachKhoa,
    full_name: "Sinh viên Bách Khoa",
    email: "23020520@vnu.edu.vn",
    phone: "0912345678",
    address: "Cầu Giấy, Hà Nội",
    point_balance: 40,
    is_deliverer: false,
  },
  {
    member_id: ids.members.minhChi,
    full_name: "Lê Minh Chi",
    email: "deliverer@example.com",
    phone: "0901111222",
    address: "Cầu Giấy, Hà Nội",
    point_balance: 25,
    is_deliverer: true,
  },
  {
    member_id: ids.members.hoangAn,
    full_name: "Trần Hoàng An",
    email: "owner2@example.com",
    phone: "0902222333",
    address: "Thanh Xuân, Hà Nội",
    point_balance: 30,
    is_deliverer: false,
  },
  {
    member_id: ids.members.giaHuy,
    full_name: "Phạm Gia Huy",
    email: "receiver2@example.com",
    phone: "0903333444",
    address: "Đống Đa, Hà Nội",
    point_balance: 25,
    is_deliverer: false,
  },
];

const demoBooks = [
  {
    key: "nhaGiaKim",
    book_id: ids.books.nhaGiaKim,
    copy_id: ids.copies.nhaGiaKim,
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    category: "Tiểu thuyết",
    publisher: "NXB Văn Học",
    publication_year: 1988,
    isbn: "9786043071111",
    language: "Vietnamese",
    condition: "good",
    status: "available",
    exchange_type: "both",
    owner_email: "manhdung05072005@gmail.com",
    cover_url: "https://picsum.photos/seed/nha-gia-kim/300/420",
    description: "Cuốn tiểu thuyết nổi tiếng về hành trình theo đuổi ước mơ và khám phá ý nghĩa cuộc sống.",
    note: "Bìa hơi cũ, ruột sách sạch.",
  },
  {
    key: "dacNhanTam",
    book_id: ids.books.dacNhanTam,
    copy_id: ids.copies.dacNhanTam,
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    category: "Kỹ năng sống",
    publisher: "NXB Tổng Hợp",
    publication_year: 1936,
    isbn: "9786045883333",
    language: "Vietnamese",
    condition: "good",
    status: "available",
    exchange_type: "permanent",
    owner_email: "manhdung05072005@gmail.com",
    cover_url: "https://picsum.photos/seed/dac-nhan-tam/300/420",
    description: "Sách kinh điển về nghệ thuật giao tiếp, thuyết phục và xây dựng quan hệ.",
    note: "Sẵn sàng trao đổi vĩnh viễn.",
  },
  {
    key: "toiThayHoaVang",
    book_id: ids.books.toiThayHoaVang,
    copy_id: ids.copies.toiThayHoaVang,
    title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    author: "Nguyễn Nhật Ánh",
    category: "Văn học Việt Nam",
    publisher: "NXB Trẻ",
    publication_year: 2010,
    isbn: "9786041002222",
    language: "Vietnamese",
    condition: "like_new",
    status: "available",
    exchange_type: "lending",
    owner_email: "manhdung05072005@gmail.com",
    cover_url: "https://picsum.photos/seed/toi-thay-hoa-vang/300/420",
    description: "Câu chuyện tuổi thơ trong trẻo, giàu cảm xúc của Nguyễn Nhật Ánh.",
    note: "Mượn tối đa 14 ngày.",
  },
  {
    key: "tuoiTreDangGia",
    book_id: ids.books.tuoiTreDangGia,
    copy_id: ids.copies.tuoiTreDangGia,
    title: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    author: "Rosie Nguyễn",
    category: "Kỹ năng sống",
    publisher: "NXB Hội Nhà Văn",
    publication_year: 2016,
    isbn: "9786047788885",
    language: "Vietnamese",
    condition: "good",
    status: "available",
    exchange_type: "both",
    owner_email: "owner2@example.com",
    cover_url: "https://picsum.photos/seed/tuoi-tre-dang-gia/300/420",
    description: "Cuốn sách truyền cảm hứng cho sinh viên về học tập, trải nghiệm và phát triển bản thân.",
    note: "Có ghi chú nhẹ bằng bút chì ở vài trang.",
  },
  {
    key: "cleanCode",
    book_id: ids.books.cleanCode,
    copy_id: ids.copies.cleanCode,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Công nghệ thông tin",
    publisher: "Prentice Hall",
    publication_year: 2008,
    isbn: "9780132350884",
    language: "English",
    condition: "good",
    status: "available",
    exchange_type: "lending",
    owner_email: "owner2@example.com",
    cover_url: "https://picsum.photos/seed/clean-code/300/420",
    description: "Sách nền tảng về cách viết mã sạch, dễ đọc và dễ bảo trì.",
    note: "Sách tiếng Anh, cần giữ sách cẩn thận.",
  },
  {
    key: "introductionAlgorithms",
    book_id: ids.books.introductionAlgorithms,
    copy_id: ids.copies.introductionAlgorithms,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Công nghệ thông tin",
    publisher: "MIT Press",
    publication_year: 2009,
    isbn: "9780262033848",
    language: "English",
    condition: "fair",
    status: "available",
    exchange_type: "lending",
    owner_email: "manhdung05072005@gmail.com",
    cover_url: "https://picsum.photos/seed/algorithm-book/300/420",
    description: "Giáo trình kinh điển về thuật toán và cấu trúc dữ liệu.",
    note: "Sách dày, có vài trang đánh dấu.",
  },
  {
    key: "databaseSystem",
    book_id: ids.books.databaseSystem,
    copy_id: ids.copies.databaseSystem,
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    category: "Cơ sở dữ liệu",
    publisher: "McGraw-Hill",
    publication_year: 2019,
    isbn: "9780078022159",
    language: "English",
    condition: "good",
    status: "available",
    exchange_type: "lending",
    owner_email: "owner2@example.com",
    cover_url: "https://picsum.photos/seed/database-system/300/420",
    description: "Tài liệu học cơ sở dữ liệu, SQL, transaction và thiết kế hệ quản trị cơ sở dữ liệu.",
    note: "Phù hợp cho môn cơ sở dữ liệu.",
  },
  {
    key: "atomicHabits",
    book_id: ids.books.atomicHabits,
    copy_id: ids.copies.atomicHabits,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Phát triển bản thân",
    publisher: "Avery",
    publication_year: 2018,
    isbn: "9780735211292",
    language: "English",
    condition: "like_new",
    status: "available",
    exchange_type: "permanent",
    owner_email: "manhdung05072005@gmail.com",
    cover_url: "https://picsum.photos/seed/atomic-habits/300/420",
    description: "Cuốn sách về xây dựng thói quen nhỏ để tạo thay đổi lớn.",
    note: "Sách gần như mới.",
  },
  {
    key: "sapiens",
    book_id: ids.books.sapiens,
    copy_id: ids.copies.sapiens,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "Lịch sử",
    publisher: "Harvill Secker",
    publication_year: 2011,
    isbn: "9780062316097",
    language: "English",
    condition: "good",
    status: "available",
    exchange_type: "both",
    owner_email: "owner2@example.com",
    cover_url: "https://picsum.photos/seed/sapiens/300/420",
    description: "Lược sử loài người từ thời tiền sử đến xã hội hiện đại.",
    note: "Có thể trao đổi hoặc cho mượn.",
  },
  {
    key: "pragmaticProgrammer",
    book_id: ids.books.pragmaticProgrammer,
    copy_id: ids.copies.pragmaticProgrammer,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Công nghệ thông tin",
    publisher: "Addison-Wesley",
    publication_year: 1999,
    isbn: "9780201616224",
    language: "English",
    condition: "good",
    status: "available",
    exchange_type: "lending",
    owner_email: "manhdung05072005@gmail.com",
    cover_url: "https://picsum.photos/seed/pragmatic-programmer/300/420",
    description: "Sách thực hành quan trọng dành cho lập trình viên muốn nâng cao tư duy nghề nghiệp.",
    note: "Có một vài sticky note ở chương đầu.",
  },
  {
    key: "harryPotter1",
    book_id: ids.books.harryPotter1,
    copy_id: ids.copies.harryPotter1,
    title: "Harry Potter và Hòn Đá Phù Thủy",
    author: "J.K. Rowling",
    category: "Tiểu thuyết",
    publisher: "NXB Trẻ",
    publication_year: 1997,
    isbn: "9786041011118",
    language: "Vietnamese",
    condition: "fair",
    status: "available",
    exchange_type: "permanent",
    owner_email: "owner2@example.com",
    cover_url: "https://picsum.photos/seed/harry-potter-1/300/420",
    description: "Tập đầu tiên trong series Harry Potter, phù hợp cho độc giả yêu thích fantasy.",
    note: "Bìa đã cũ nhưng ruột sách còn tốt.",
  },
  {
    key: "khongGiaDinh",
    book_id: ids.books.khongGiaDinh,
    copy_id: ids.copies.khongGiaDinh,
    title: "Không Gia Đình",
    author: "Hector Malot",
    category: "Văn học nước ngoài",
    publisher: "NXB Văn Học",
    publication_year: 1878,
    isbn: "9786043456785",
    language: "Vietnamese",
    condition: "good",
    status: "available",
    exchange_type: "both",
    owner_email: "manhdung05072005@gmail.com",
    cover_url: "https://picsum.photos/seed/khong-gia-dinh/300/420",
    description: "Tác phẩm văn học cảm động về hành trình trưởng thành và tình người.",
    note: "Sách phù hợp đọc nhóm.",
  },
  {
    key: "trietHocMacLenin",
    book_id: ids.books.trietHocMacLenin,
    copy_id: ids.copies.trietHocMacLenin,
    title: "Giáo Trình Triết Học Mác - Lênin",
    author: "Bộ Giáo dục và Đào tạo",
    category: "Giáo trình",
    publisher: "NXB Chính Trị Quốc Gia",
    publication_year: 2021,
    isbn: "9786045767896",
    language: "Vietnamese",
    condition: "good",
    status: "available",
    exchange_type: "lending",
    owner_email: "owner2@example.com",
    cover_url: "https://picsum.photos/seed/triet-hoc-mac-lenin/300/420",
    description: "Tài liệu học tập môn Triết học Mác - Lênin dành cho sinh viên đại học.",
    note: "Có thể mượn trong kỳ học.",
  },
  {
    key: "lapTrinhC",
    book_id: ids.books.lapTrinhC,
    copy_id: ids.copies.lapTrinhC,
    title: "Kỹ Thuật Lập Trình C",
    author: "Phạm Văn Ất",
    category: "Công nghệ thông tin",
    publisher: "NXB Bách Khoa",
    publication_year: 2015,
    isbn: "9786049501236",
    language: "Vietnamese",
    condition: "fair",
    status: "available",
    exchange_type: "both",
    owner_email: "manhdung05072005@gmail.com",
    cover_url: "https://picsum.photos/seed/lap-trinh-c/300/420",
    description: "Sách nhập môn lập trình C với nhiều ví dụ thực hành.",
    note: "Phù hợp sinh viên năm nhất.",
  },
  {
    key: "marketingCanBan",
    book_id: ids.books.marketingCanBan,
    copy_id: ids.copies.marketingCanBan,
    title: "Marketing Căn Bản",
    author: "Philip Kotler",
    category: "Kinh tế",
    publisher: "NXB Lao Động",
    publication_year: 2017,
    isbn: "9786045998765",
    language: "Vietnamese",
    condition: "good",
    status: "reserved",
    exchange_type: "lending",
    owner_email: "owner2@example.com",
    cover_url: "https://picsum.photos/seed/marketing-basic/300/420",
    description: "Tài liệu nền tảng về marketing, hành vi khách hàng và chiến lược thị trường.",
    note: "Đang được giữ chỗ.",
  },
  {
    key: "deMenPhieuLuuKy",
    book_id: ids.books.deMenPhieuLuuKy,
    copy_id: ids.copies.deMenPhieuLuuKy,
    title: "Dế Mèn Phiêu Lưu Ký",
    author: "Tô Hoài",
    category: "Văn học Việt Nam",
    publisher: "NXB Kim Đồng",
    publication_year: 1941,
    isbn: "9786042112342",
    language: "Vietnamese",
    condition: "good",
    status: "borrowed",
    exchange_type: "permanent",
    owner_email: "manhdung05072005@gmail.com",
    cover_url: "https://picsum.photos/seed/de-men-phieu-luu-ky/300/420",
    description: "Tác phẩm thiếu nhi kinh điển của văn học Việt Nam.",
    note: "Đang có người mượn.",
  },
];

const pointHistories = [
  {
    point_history_id: ids.pointHistories.manhDungInitial,
    email: "manhdung05072005@gmail.com",
    point_change: 20,
    reason: "initial_register",
  },
  {
    point_history_id: ids.pointHistories.manhDungBonus,
    email: "manhdung05072005@gmail.com",
    point_change: 20,
    reason: "admin_adjustment",
  },
  {
    point_history_id: ids.pointHistories.bachKhoaInitial,
    email: "23020520@vnu.edu.vn",
    point_change: 20,
    reason: "initial_register",
  },
  {
    point_history_id: ids.pointHistories.bachKhoaBonus,
    email: "23020520@vnu.edu.vn",
    point_change: 20,
    reason: "admin_adjustment",
  },
  {
    point_history_id: ids.pointHistories.minhChiInitial,
    email: "deliverer@example.com",
    point_change: 20,
    reason: "initial_register",
  },
  {
    point_history_id: ids.pointHistories.minhChiBonus,
    email: "deliverer@example.com",
    point_change: 5,
    reason: "delivery_bonus",
  },
  {
    point_history_id: ids.pointHistories.hoangAnInitial,
    email: "owner2@example.com",
    point_change: 20,
    reason: "initial_register",
  },
  {
    point_history_id: ids.pointHistories.hoangAnBonus,
    email: "owner2@example.com",
    point_change: 10,
    reason: "admin_adjustment",
  },
  {
    point_history_id: ids.pointHistories.giaHuyInitial,
    email: "receiver2@example.com",
    point_change: 20,
    reason: "initial_register",
  },
  {
    point_history_id: ids.pointHistories.giaHuyBonus,
    email: "receiver2@example.com",
    point_change: 5,
    reason: "admin_adjustment",
  },
];

const hasTable = async (queryInterface, tableName, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });

  return tables.some((table) => {
    if (typeof table === "string") {
      return table === tableName;
    }

    return table.tableName === tableName || table.table_name === tableName;
  });
};

const neutralizeLegacyCoreDemoData = async (queryInterface, transaction) => {
  await queryInterface.sequelize.query(`
    UPDATE members
    SET
      is_deliverer = false,
      account_status = 'inactive',
      updated_at = :updated_at
    WHERE email IN ('an@example.com', 'binh@example.com', 'chi@example.com');
  `, {
    replacements: { updated_at: now() },
    transaction,
  });

  await queryInterface.sequelize.query(`
    UPDATE book_copies
    SET
      status = 'unavailable',
      updated_at = :updated_at
    WHERE copy_id = 'e5555555-5555-4555-8555-555555555555';
  `, {
    replacements: { updated_at: now() },
    transaction,
  });
};

const upsertMember = async (queryInterface, Sequelize, member, passwordHash, transaction) => {
  const rows = await queryInterface.sequelize.query(`
    INSERT INTO members (
      member_id,
      full_name,
      email,
      password_hash,
      phone,
      address,
      point_balance,
      role,
      is_deliverer,
      account_status,
      email_verified,
      created_at,
      updated_at
    )
    VALUES (
      :member_id,
      :full_name,
      :email,
      :password_hash,
      :phone,
      :address,
      :point_balance,
      'member',
      :is_deliverer,
      'active',
      true,
      :created_at,
      :updated_at
    )
    ON CONFLICT (email) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      password_hash = EXCLUDED.password_hash,
      phone = EXCLUDED.phone,
      address = EXCLUDED.address,
      point_balance = EXCLUDED.point_balance,
      role = EXCLUDED.role,
      is_deliverer = EXCLUDED.is_deliverer,
      account_status = EXCLUDED.account_status,
      email_verified = EXCLUDED.email_verified,
      updated_at = EXCLUDED.updated_at
    RETURNING member_id, email;
  `, {
    replacements: {
      ...member,
      password_hash: passwordHash,
      created_at: now(),
      updated_at: now(),
    },
    transaction,
    type: Sequelize.QueryTypes.SELECT,
  });

  return rows[0];
};

const upsertBookTitle = async (queryInterface, Sequelize, book, transaction) => {
  const rows = await queryInterface.sequelize.query(`
    INSERT INTO book_titles (
      book_id,
      title,
      author,
      category,
      publisher,
      publication_year,
      isbn,
      language,
      description,
      cover_url,
      created_at,
      updated_at
    )
    VALUES (
      :book_id,
      :title,
      :author,
      :category,
      :publisher,
      :publication_year,
      :isbn,
      :language,
      :description,
      :cover_url,
      :created_at,
      :updated_at
    )
    ON CONFLICT (isbn) DO UPDATE SET
      title = EXCLUDED.title,
      author = EXCLUDED.author,
      category = EXCLUDED.category,
      publisher = EXCLUDED.publisher,
      publication_year = EXCLUDED.publication_year,
      language = EXCLUDED.language,
      description = EXCLUDED.description,
      cover_url = EXCLUDED.cover_url,
      updated_at = EXCLUDED.updated_at
    RETURNING book_id, isbn;
  `, {
    replacements: {
      ...book,
      created_at: now(),
      updated_at: now(),
    },
    transaction,
    type: Sequelize.QueryTypes.SELECT,
  });

  return rows[0];
};

const upsertBookCopy = async (queryInterface, book, bookId, ownerId, transaction) => {
  await queryInterface.sequelize.query(`
    INSERT INTO book_copies (
      copy_id,
      book_id,
      owner_id,
      condition,
      status,
      exchange_type,
      note,
      created_at,
      updated_at
    )
    VALUES (
      :copy_id,
      :book_id,
      :owner_id,
      :condition,
      :status,
      :exchange_type,
      :note,
      :created_at,
      :updated_at
    )
    ON CONFLICT (copy_id) DO UPDATE SET
      book_id = EXCLUDED.book_id,
      owner_id = EXCLUDED.owner_id,
      condition = EXCLUDED.condition,
      status = EXCLUDED.status,
      exchange_type = EXCLUDED.exchange_type,
      note = EXCLUDED.note,
      updated_at = EXCLUDED.updated_at;
  `, {
    replacements: {
      copy_id: book.copy_id,
      book_id: bookId,
      owner_id: ownerId,
      condition: book.condition === "like_new" ? "new" : book.condition,
      status: book.status,
      exchange_type: book.exchange_type,
      note: book.note,
      created_at: now(),
      updated_at: now(),
    },
    transaction,
  });
};

const upsertPointHistory = async (queryInterface, history, memberId, transaction) => {
  await queryInterface.sequelize.query(`
    INSERT INTO point_histories (
      point_history_id,
      member_id,
      transaction_id,
      point_change,
      reason,
      created_at,
      updated_at
    )
    VALUES (
      :point_history_id,
      :member_id,
      null,
      :point_change,
      :reason,
      :created_at,
      :updated_at
    )
    ON CONFLICT (point_history_id) DO UPDATE SET
      member_id = EXCLUDED.member_id,
      point_change = EXCLUDED.point_change,
      reason = EXCLUDED.reason,
      updated_at = EXCLUDED.updated_at;
  `, {
    replacements: {
      ...history,
      member_id: memberId,
      created_at: now(),
      updated_at: now(),
    },
    transaction,
  });
};

const upsertDelivererProfile = async (queryInterface, memberId, transaction) => {
  if (!(await hasTable(queryInterface, "deliverer_profiles", transaction))) {
    return;
  }

  await queryInterface.sequelize.query(`
    INSERT INTO deliverer_profiles (
      profile_id,
      member_id,
      service_area,
      available_hours,
      total_deliveries,
      is_active,
      created_at,
      updated_at
    )
    VALUES (
      :profile_id,
      :member_id,
      :service_area,
      :available_hours,
      3,
      true,
      :created_at,
      :updated_at
    )
    ON CONFLICT (member_id) DO UPDATE SET
      service_area = EXCLUDED.service_area,
      available_hours = EXCLUDED.available_hours,
      total_deliveries = EXCLUDED.total_deliveries,
      is_active = EXCLUDED.is_active,
      updated_at = EXCLUDED.updated_at;
  `, {
    replacements: {
      profile_id: ids.profiles.minhChi,
      member_id: memberId,
      service_area: "Cầu Giấy, Bắc Từ Liêm, Nam Từ Liêm",
      available_hours: "18:00 - 21:30 các ngày trong tuần, 8:00 - 17:00 cuối tuần",
      created_at: now(),
      updated_at: now(),
    },
    transaction,
  });
};

const seedConversation = async (queryInterface, Sequelize, memberIdsByEmail, transaction) => {
  if (
    !(await hasTable(queryInterface, "conversations", transaction)) ||
    !(await hasTable(queryInterface, "messages", transaction))
  ) {
    return;
  }

  const memberIds = [
    memberIdsByEmail.get("manhdung05072005@gmail.com"),
    memberIdsByEmail.get("23020520@vnu.edu.vn"),
  ].sort();

  const conversationRows = await queryInterface.sequelize.query(`
    INSERT INTO conversations (
      conversation_id,
      member1_id,
      member2_id,
      created_at,
      updated_at
    )
    VALUES (
      :conversation_id,
      :member1_id,
      :member2_id,
      :created_at,
      :updated_at
    )
    ON CONFLICT (member1_id, member2_id) DO UPDATE SET
      updated_at = EXCLUDED.updated_at
    RETURNING conversation_id;
  `, {
    replacements: {
      conversation_id: ids.conversation,
      member1_id: memberIds[0],
      member2_id: memberIds[1],
      created_at: now(),
      updated_at: now(),
    },
    transaction,
    type: Sequelize.QueryTypes.SELECT,
  });

  const conversationId = conversationRows[0].conversation_id;
  const messages = [
    {
      message_id: ids.messages[0],
      sender_id: memberIdsByEmail.get("23020520@vnu.edu.vn"),
      content: "Chào bạn, mình muốn hỏi về cuốn Nhà Giả Kim.",
      is_read: true,
    },
    {
      message_id: ids.messages[1],
      sender_id: memberIdsByEmail.get("manhdung05072005@gmail.com"),
      content: "Chào bạn, sách vẫn còn mới và có thể trao đổi được nhé.",
      is_read: true,
    },
    {
      message_id: ids.messages[2],
      sender_id: memberIdsByEmail.get("23020520@vnu.edu.vn"),
      content: "Mình có thể nhận sách ở khu vực Cầu Giấy không?",
      is_read: false,
    },
  ];

  for (const message of messages) {
    await queryInterface.sequelize.query(`
      INSERT INTO messages (
        message_id,
        conversation_id,
        sender_id,
        content,
        is_read,
        created_at,
        updated_at
      )
      VALUES (
        :message_id,
        :conversation_id,
        :sender_id,
        :content,
        :is_read,
        :created_at,
        :updated_at
      )
      ON CONFLICT (message_id) DO UPDATE SET
        conversation_id = EXCLUDED.conversation_id,
        sender_id = EXCLUDED.sender_id,
        content = EXCLUDED.content,
        is_read = EXCLUDED.is_read,
        updated_at = EXCLUDED.updated_at;
    `, {
      replacements: {
        ...message,
        conversation_id: conversationId,
        created_at: now(),
        updated_at: now(),
      },
      transaction,
    });
  }
};

export default {
  name: "202606020003-rich-demo-data",

  async up(queryInterface, Sequelize, transaction) {
    const passwordHash = await bcrypt.hash(password, 10);
    const memberIdsByEmail = new Map();
    const bookIdsByIsbn = new Map();

    await neutralizeLegacyCoreDemoData(queryInterface, transaction);

    for (const member of demoMembers) {
      const row = await upsertMember(queryInterface, Sequelize, member, passwordHash, transaction);
      memberIdsByEmail.set(row.email, row.member_id);
    }

    for (const book of demoBooks) {
      const row = await upsertBookTitle(queryInterface, Sequelize, book, transaction);
      bookIdsByIsbn.set(row.isbn, row.book_id);
    }

    for (const book of demoBooks) {
      await upsertBookCopy(
        queryInterface,
        book,
        bookIdsByIsbn.get(book.isbn),
        memberIdsByEmail.get(book.owner_email),
        transaction,
      );
    }

    for (const history of pointHistories) {
      await upsertPointHistory(
        queryInterface,
        history,
        memberIdsByEmail.get(history.email),
        transaction,
      );
    }

    await upsertDelivererProfile(
      queryInterface,
      memberIdsByEmail.get("deliverer@example.com"),
      transaction,
    );
    await seedConversation(queryInterface, Sequelize, memberIdsByEmail, transaction);
  },

  async down(queryInterface, _Sequelize, transaction) {
    const options = { transaction };

    if (await hasTable(queryInterface, "messages", transaction)) {
      await queryInterface.bulkDelete("messages", {
        message_id: ids.messages,
      }, options);
    }

    if (await hasTable(queryInterface, "conversations", transaction)) {
      await queryInterface.bulkDelete("conversations", {
        conversation_id: ids.conversation,
      }, options);
    }

    if (await hasTable(queryInterface, "deliverer_profiles", transaction)) {
      await queryInterface.bulkDelete("deliverer_profiles", {
        profile_id: Object.values(ids.profiles),
      }, options);
    }

    await queryInterface.bulkDelete("point_histories", {
      point_history_id: Object.values(ids.pointHistories),
    }, options);
    await queryInterface.bulkDelete("book_copies", {
      copy_id: Object.values(ids.copies),
    }, options);
    await queryInterface.bulkDelete("book_titles", {
      book_id: Object.values(ids.books),
    }, options);
    await queryInterface.bulkDelete("members", {
      email: demoMembers.map((member) => member.email),
    }, options);
  },
};
