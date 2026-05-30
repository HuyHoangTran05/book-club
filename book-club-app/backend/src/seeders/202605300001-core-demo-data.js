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
        full_name: "Nguyen Van An",
        email: "an@example.com",
        password_hash: passwordHash,
        phone: "0901000001",
        address: "Cau Giay, Ha Noi",
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
        full_name: "Tran Thi Binh",
        email: "binh@example.com",
        password_hash: passwordHash,
        phone: "0901000002",
        address: "Thanh Xuan, Ha Noi",
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
        full_name: "Le Minh Chi",
        email: "chi@example.com",
        password_hash: passwordHash,
        phone: "0901000003",
        address: "Dong Da, Ha Noi",
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
        title: "Nha Gia Kim",
        author: "Paulo Coelho",
        category: "Tieu thuyet",
        publisher: "NXB Van Hoc",
        publication_year: 2020,
        isbn: "9786043071111",
        language: "Vietnamese",
        description: "Cau chuyen ve hanh trinh tim kho bau va uoc mo ca nhan.",
        created_at: now,
        updated_at: now,
      },
      {
        book_id: ids.books.toiThayHoaVang,
        title: "Toi Thay Hoa Vang Tren Co Xanh",
        author: "Nguyen Nhat Anh",
        category: "Van hoc Viet Nam",
        publisher: "NXB Tre",
        publication_year: 2018,
        isbn: "9786041002222",
        language: "Vietnamese",
        description: "Truyen dai ve tuoi tho, tinh ban va gia dinh.",
        created_at: now,
        updated_at: now,
      },
      {
        book_id: ids.books.dacNhanTam,
        title: "Dac Nhan Tam",
        author: "Dale Carnegie",
        category: "Ky nang song",
        publisher: "NXB Tong Hop",
        publication_year: 2021,
        isbn: "9786045883333",
        language: "Vietnamese",
        description: "Sach kinh dien ve giao tiep va ung xu.",
        created_at: now,
        updated_at: now,
      },
      {
        book_id: ids.books.cleanCode,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Cong nghe",
        publisher: "Prentice Hall",
        publication_year: 2008,
        isbn: "9780132350884",
        language: "English",
        description: "Nguyen tac viet ma nguon ro rang, de bao tri.",
        created_at: now,
        updated_at: now,
      },
      {
        book_id: ids.books.tuDuyNhanhCham,
        title: "Tu Duy Nhanh Va Cham",
        author: "Daniel Kahneman",
        category: "Tam ly hoc",
        publisher: "NXB The Gioi",
        publication_year: 2019,
        isbn: "9786047764444",
        language: "Vietnamese",
        description: "Phan tich hai he thong tu duy trong ra quyet dinh.",
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
        note: "Bia hoi cu, ruot sach sach.",
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
        note: "Muon toi da 14 ngay.",
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
        note: "San sang trao doi vinh vien.",
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
        note: "Sach tieng Anh, can giu sach can than.",
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
        note: "Co the hen giao trong khu vuc Dong Da.",
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
