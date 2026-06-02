// This file must be saved as UTF-8.
import bcrypt from "bcrypt";

const ids = {
  members: {
    an: "11111111-1111-4111-8111-111111111111",
    binh: "22222222-2222-4222-8222-222222222222",
    chi: "33333333-3333-4333-8333-333333333333",
  },
  books: {
    nhaGiaKim: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    toiThayHoaVang: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    dacNhanTam: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    cleanCode: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    tuDuyNhanhCham: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  },
  copies: {
    nhaGiaKimAn: "a1111111-1111-4111-8111-111111111111",
    toiThayHoaVangAn: "b2222222-2222-4222-8222-222222222222",
    dacNhanTamBinh: "c3333333-3333-4333-8333-333333333333",
    cleanCodeBinh: "d4444444-4444-4444-8444-444444444444",
    tuDuyNhanhCham: "e5555555-5555-4555-8555-555555555555",
  },
};

const now = new Date();

export default {
  name: "202605300001-core-demo-data",

  async up(queryInterface, _Sequelize, transaction) {
    const options = { transaction };
    const passwordHash = await bcrypt.hash("Password123", 10);

    await queryInterface.bulkInsert("members", [
      {
        member_id: ids.members.an,
        full_name: "Nguyễn Văn An",
        email: "an@example.com",
        password_hash: passwordHash,
        phone: "0901000001",
        address: "Cầu Giấy, Hà Nội",
        point_balance: 20,
        role: "member",
        is_deliverer: false,
        account_status: "active",
        email_verified: true,
        created_at: now,
        updated_at: now,
      },
      {
        member_id: ids.members.binh,
        full_name: "Trần Thị Bình",
        email: "binh@example.com",
        password_hash: passwordHash,
        phone: "0901000002",
        address: "Thanh Xuân, Hà Nội",
        point_balance: 20,
        role: "member",
        is_deliverer: true,
        account_status: "active",
        email_verified: true,
        created_at: now,
        updated_at: now,
      },
      {
        member_id: ids.members.chi,
        full_name: "Lê Minh Chi",
        email: "chi@example.com",
        password_hash: passwordHash,
        phone: "0901000003",
        address: "Đống Đa, Hà Nội",
        point_balance: 20,
        role: "member",
        is_deliverer: false,
        account_status: "active",
        email_verified: true,
        created_at: now,
        updated_at: now,
      },
    ], options);

    await queryInterface.bulkInsert("book_titles", [
      {
        book_id: ids.books.nhaGiaKim,
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        category: "Tiểu thuyết",
        publisher: "NXB Văn Học",
        publication_year: 2020,
        isbn: "9786043071111",
        language: "Vietnamese",
        description: "Câu chuyện về hành trình tìm kho báu và ước mơ cá nhân.",
        created_at: now,
        updated_at: now,
      },
      {
        book_id: ids.books.toiThayHoaVang,
        title: "Tôi thấy hoa vàng trên cỏ xanh",
        author: "Nguyễn Nhật Ánh",
        category: "Văn học Việt Nam",
        publisher: "NXB Trẻ",
        publication_year: 2018,
        isbn: "9786041002222",
        language: "Vietnamese",
        description: "Truyện dài về tuổi thơ, tình bạn và gia đình.",
        created_at: now,
        updated_at: now,
      },
      {
        book_id: ids.books.dacNhanTam,
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        category: "Kỹ năng",
        publisher: "NXB Tổng Hợp",
        publication_year: 2021,
        isbn: "9786045883333",
        language: "Vietnamese",
        description: "Sách kinh điển về giao tiếp và ứng xử.",
        created_at: now,
        updated_at: now,
      },
      {
        book_id: ids.books.cleanCode,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Công nghệ",
        publisher: "Prentice Hall",
        publication_year: 2008,
        isbn: "9780132350884",
        language: "English",
        description: "Nguyên tắc viết mã nguồn rõ ràng, dễ bảo trì.",
        created_at: now,
        updated_at: now,
      },
      {
        book_id: ids.books.tuDuyNhanhCham,
        title: "Tư Duy Nhanh Và Chậm",
        author: "Daniel Kahneman",
        category: "Tâm lý học",
        publisher: "NXB Thế Giới",
        publication_year: 2019,
        isbn: "9786047764444",
        language: "Vietnamese",
        description: "Phân tích hai hệ thống tư duy trong ra quyết định.",
        created_at: now,
        updated_at: now,
      },
    ], options);

    await queryInterface.bulkInsert("book_copies", [
      {
        copy_id: ids.copies.nhaGiaKimAn,
        book_id: ids.books.nhaGiaKim,
        owner_id: ids.members.an,
        condition: "good",
        status: "available",
        exchange_type: "both",
        note: "Bìa hơi cũ, ruột sách sạch.",
        created_at: now,
        updated_at: now,
      },
      {
        copy_id: ids.copies.toiThayHoaVangAn,
        book_id: ids.books.toiThayHoaVang,
        owner_id: ids.members.an,
        condition: "fair",
        status: "available",
        exchange_type: "lending",
        note: "Mượn tối đa 14 ngày.",
        created_at: now,
        updated_at: now,
      },
      {
        copy_id: ids.copies.dacNhanTamBinh,
        book_id: ids.books.dacNhanTam,
        owner_id: ids.members.binh,
        condition: "good",
        status: "available",
        exchange_type: "permanent",
        note: "Sẵn sàng trao đổi vĩnh viễn.",
        created_at: now,
        updated_at: now,
      },
      {
        copy_id: ids.copies.cleanCodeBinh,
        book_id: ids.books.cleanCode,
        owner_id: ids.members.binh,
        condition: "new",
        status: "available",
        exchange_type: "lending",
        note: "Sách tiếng Anh, cần giữ sách cẩn thận.",
        created_at: now,
        updated_at: now,
      },
      {
        copy_id: ids.copies.tuDuyNhanhCham,
        book_id: ids.books.tuDuyNhanhCham,
        owner_id: ids.members.chi,
        condition: "good",
        status: "available",
        exchange_type: "both",
        note: "Có thể hẹn giao trong khu vực Đống Đa.",
        created_at: now,
        updated_at: now,
      },
    ], options);

    await queryInterface.bulkInsert("point_histories", [
      {
        point_history_id: "f1111111-1111-4111-8111-111111111111",
        member_id: ids.members.an,
        transaction_id: null,
        point_change: 20,
        reason: "initial_register",
        created_at: now,
      },
      {
        point_history_id: "f2222222-2222-4222-8222-222222222222",
        member_id: ids.members.binh,
        transaction_id: null,
        point_change: 20,
        reason: "initial_register",
        created_at: now,
      },
      {
        point_history_id: "f3333333-3333-4333-8333-333333333333",
        member_id: ids.members.chi,
        transaction_id: null,
        point_change: 20,
        reason: "initial_register",
        created_at: now,
      },
    ], options);
  },

  async down(queryInterface, _Sequelize, transaction) {
    const options = { transaction };

    await queryInterface.bulkDelete("point_histories", {
      point_history_id: [
        "f1111111-1111-4111-8111-111111111111",
        "f2222222-2222-4222-8222-222222222222",
        "f3333333-3333-4333-8333-333333333333",
      ],
    }, options);
    await queryInterface.bulkDelete("book_copies", {
      copy_id: Object.values(ids.copies),
    }, options);
    await queryInterface.bulkDelete("book_titles", {
      book_id: Object.values(ids.books),
    }, options);
    await queryInterface.bulkDelete("members", {
      member_id: Object.values(ids.members),
    }, options);
  },
};
