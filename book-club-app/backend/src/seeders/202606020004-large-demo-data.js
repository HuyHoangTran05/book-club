// This file must be saved as UTF-8.
import bcrypt from "bcrypt";

const password = "manhdung123123";
const now = () => new Date();

const uuid = (prefix, index) => `${prefix}-0000-4000-8000-${String(index).padStart(12, "0")}`;

const firstBookIds = {
  1: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  2: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  3: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  4: "20000000-0000-4000-8000-000000000004",
  5: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
  6: "20000000-0000-4000-8000-000000000006",
  7: "20000000-0000-4000-8000-000000000007",
  8: "20000000-0000-4000-8000-000000000008",
  9: "20000000-0000-4000-8000-000000000009",
  10: "20000000-0000-4000-8000-000000000010",
  11: "20000000-0000-4000-8000-000000000011",
  12: "20000000-0000-4000-8000-000000000012",
  13: "20000000-0000-4000-8000-000000000013",
  14: "20000000-0000-4000-8000-000000000014",
  15: "20000000-0000-4000-8000-000000000015",
  16: "20000000-0000-4000-8000-000000000016",
};

const firstCopyIds = {
  1: "a1111111-1111-4111-8111-111111111111",
  2: "c3333333-3333-4333-8333-333333333333",
  3: "b2222222-2222-4222-8222-222222222222",
  4: "30000000-0000-4000-8000-000000000004",
  5: "d4444444-4444-4444-8444-444444444444",
  6: "30000000-0000-4000-8000-000000000006",
  7: "30000000-0000-4000-8000-000000000007",
  8: "30000000-0000-4000-8000-000000000008",
  9: "30000000-0000-4000-8000-000000000009",
  10: "30000000-0000-4000-8000-000000000010",
  11: "30000000-0000-4000-8000-000000000011",
  12: "30000000-0000-4000-8000-000000000012",
  13: "30000000-0000-4000-8000-000000000013",
  14: "30000000-0000-4000-8000-000000000014",
  15: "30000000-0000-4000-8000-000000000015",
  16: "30000000-0000-4000-8000-000000000016",
  20: "e5555555-5555-4555-8555-555555555555",
};

const demoMembers = [
  ["10000000-0000-4000-8000-000000000001", "Nguyễn Mạnh Dũng", "manhdung05072005@gmail.com", "0984305191", "Bắc Từ Liêm, Hà Nội", 60, false],
  ["10000000-0000-4000-8000-000000000002", "Sinh viên Bách Khoa", "23020520@vnu.edu.vn", "0912345678", "Cầu Giấy, Hà Nội", 60, false],
  ["10000000-0000-4000-8000-000000000003", "Lê Minh Chi", "deliverer@example.com", "0901111222", "Cầu Giấy, Hà Nội", 40, true],
  ["10000000-0000-4000-8000-000000000004", "Trần Hoàng An", "owner2@example.com", "0902222333", "Thanh Xuân, Hà Nội", 50, false],
  ["10000000-0000-4000-8000-000000000005", "Phạm Gia Huy", "receiver2@example.com", "0903333444", "Đống Đa, Hà Nội", 45, true],
  ["11111111-1111-4111-8111-111111111111", "Nguyễn Văn An", "an@example.com", "0901000001", "Nam Từ Liêm, Hà Nội", 40, false],
  ["22222222-2222-4222-8222-222222222222", "Trần Thị Bình", "binh@example.com", "0901000002", "Hà Đông, Hà Nội", 40, false],
  [uuid("10000000", 8), "Hoàng Minh Quân", "quan@example.com", "0901000003", "Cầu Giấy, Hà Nội", 45, true],
  [uuid("10000000", 9), "Vũ Thu Hà", "ha@example.com", "0901000004", "Hai Bà Trưng, Hà Nội", 35, false],
  [uuid("10000000", 10), "Đỗ Việt Anh", "vietanh@example.com", "0901000005", "Hoàng Mai, Hà Nội", 35, false],
  [uuid("10000000", 11), "Bùi Khánh Linh", "linh@example.com", "0901000006", "Ba Đình, Hà Nội", 45, true],
  [uuid("10000000", 12), "Phạm Đức Long", "long@example.com", "0901000007", "Tây Hồ, Hà Nội", 30, false],
  [uuid("10000000", 13), "Nguyễn Hải Nam", "hainam@example.com", "0901000008", "Gia Lâm, Hà Nội", 35, false],
  [uuid("10000000", 14), "Lương Minh Anh", "minhanh@example.com", "0901000009", "Long Biên, Hà Nội", 50, true],
  [uuid("10000000", 15), "Trịnh Ngọc Mai", "mai@example.com", "0901000010", "Thanh Xuân, Hà Nội", 35, false],
  [uuid("10000000", 16), "Đặng Quốc Huy", "huy@example.com", "0901000011", "Đống Đa, Hà Nội", 40, false],
  [uuid("10000000", 17), "Phan Thảo Nguyên", "nguyen@example.com", "0901000012", "Cầu Giấy, Hà Nội", 45, false],
  [uuid("10000000", 18), "Lê Tuấn Kiệt", "tuankiet@example.com", "0901000013", "Bắc Từ Liêm, Hà Nội", 50, true],
  [uuid("10000000", 19), "Trần Gia Bảo", "giabao@example.com", "0901000014", "Nam Từ Liêm, Hà Nội", 30, false],
  [uuid("10000000", 20), "Nguyễn Phương Vy", "phuongvy@example.com", "0901000015", "Hoàn Kiếm, Hà Nội", 40, false],
].map(([member_id, full_name, email, phone, address, point_balance, is_deliverer]) => ({
  member_id,
  full_name,
  email,
  phone,
  address,
  point_balance,
  is_deliverer,
}));

const delivererProfiles = [
  ["deliverer@example.com", "50000000-0000-4000-8000-000000000001", "Cầu Giấy, Bắc Từ Liêm, Nam Từ Liêm", "18:00 - 21:30 các ngày trong tuần, 8:00 - 17:00 cuối tuần", 8],
  ["receiver2@example.com", uuid("50000000", 5), "Đống Đa, Thanh Xuân", "Buổi tối và cuối tuần", 4],
  ["quan@example.com", uuid("50000000", 8), "Cầu Giấy, Ba Đình, Tây Hồ", "17:30 - 21:00 từ thứ 2 đến thứ 6", 6],
  ["linh@example.com", uuid("50000000", 11), "Hai Bà Trưng, Hoàn Kiếm, Đống Đa", "Sáng thứ 7 và Chủ nhật", 5],
  ["minhanh@example.com", uuid("50000000", 14), "Long Biên, Gia Lâm", "8:00 - 18:00 cuối tuần", 3],
  ["tuankiet@example.com", uuid("50000000", 18), "Bắc Từ Liêm, Nam Từ Liêm, Cầu Giấy", "Buổi chiều các ngày trong tuần", 7],
].map(([email, profile_id, service_area, available_hours, total_deliveries]) => ({
  email,
  profile_id,
  service_area,
  available_hours,
  total_deliveries,
}));

const requiredBooks = [
  ["Nhà Giả Kim", "Paulo Coelho", "Tiểu thuyết", 1988, "good", "both", "available", "manhdung05072005@gmail.com", "nha-gia-kim", "9786043071111"],
  ["Đắc Nhân Tâm", "Dale Carnegie", "Kỹ năng sống", 1936, "good", "permanent", "available", "manhdung05072005@gmail.com", "dac-nhan-tam", "9786045883333"],
  ["Tôi Thấy Hoa Vàng Trên Cỏ Xanh", "Nguyễn Nhật Ánh", "Văn học Việt Nam", 2010, "like_new", "lending", "available", "manhdung05072005@gmail.com", "toi-thay-hoa-vang", "9786041002222"],
  ["Tuổi Trẻ Đáng Giá Bao Nhiêu", "Rosie Nguyễn", "Kỹ năng sống", 2016, "good", "both", "available", "owner2@example.com", "tuoi-tre-dang-gia", "9786047788885"],
  ["Clean Code", "Robert C. Martin", "Công nghệ thông tin", 2008, "good", "lending", "available", "owner2@example.com", "clean-code", "9780132350884"],
  ["Introduction to Algorithms", "Thomas H. Cormen", "Công nghệ thông tin", 2009, "fair", "lending", "available", "manhdung05072005@gmail.com", "algorithm-book", "9780262033848"],
  ["Database System Concepts", "Abraham Silberschatz", "Cơ sở dữ liệu", 2019, "good", "lending", "available", "owner2@example.com", "database-system", "9780078022159"],
  ["Atomic Habits", "James Clear", "Phát triển bản thân", 2018, "like_new", "permanent", "available", "manhdung05072005@gmail.com", "atomic-habits", "9780735211292"],
  ["Sapiens", "Yuval Noah Harari", "Lịch sử", 2011, "good", "both", "available", "owner2@example.com", "sapiens", "9780062316097"],
  ["The Pragmatic Programmer", "Andrew Hunt", "Công nghệ thông tin", 1999, "good", "lending", "available", "manhdung05072005@gmail.com", "pragmatic-programmer", "9780201616224"],
  ["Harry Potter và Hòn Đá Phù Thủy", "J.K. Rowling", "Tiểu thuyết", 1997, "fair", "permanent", "available", "owner2@example.com", "harry-potter-1", "9786041011118"],
  ["Không Gia Đình", "Hector Malot", "Văn học nước ngoài", 1878, "good", "both", "available", "manhdung05072005@gmail.com", "khong-gia-dinh", "9786043456785"],
  ["Giáo Trình Triết Học Mác - Lênin", "Bộ Giáo dục và Đào tạo", "Giáo trình", 2021, "good", "lending", "available", "owner2@example.com", "triet-hoc-mac-lenin", "9786045767896"],
  ["Kỹ Thuật Lập Trình C", "Phạm Văn Ất", "Công nghệ thông tin", 2015, "fair", "both", "available", "manhdung05072005@gmail.com", "lap-trinh-c", "9786049501236"],
  ["Marketing Căn Bản", "Philip Kotler", "Marketing", 2017, "good", "lending", "reserved", "owner2@example.com", "marketing-basic", "9786045998765"],
  ["Dế Mèn Phiêu Lưu Ký", "Tô Hoài", "Văn học Việt Nam", 1941, "good", "permanent", "borrowed", "manhdung05072005@gmail.com", "de-men-phieu-luu-ky", "9786042112342"],
  ["Deep Learning", "Ian Goodfellow", "Trí tuệ nhân tạo", 2016, "good", "lending", "available", "quan@example.com", "deep-learning", "9780262035613"],
  ["Python Crash Course", "Eric Matthes", "Công nghệ thông tin", 2019, "like_new", "both", "available", "linh@example.com", "python-crash-course", "9781593279288"],
  ["English Grammar in Use", "Raymond Murphy", "Ngoại ngữ", 2019, "good", "lending", "available", "minhanh@example.com", "english-grammar-in-use", "9781108457651"],
  ["Tư Duy Nhanh Và Chậm", "Daniel Kahneman", "Tâm lý học", 2011, "good", "permanent", "available", "receiver2@example.com", "thinking-fast-slow", "9786047764444"],
];

const additionalBookMeta = [
  ["Bố Già", "Mario Puzo", "Tiểu thuyết", 1969],
  ["Rừng Na Uy", "Haruki Murakami", "Văn học nước ngoài", 1987],
  ["Kafka Bên Bờ Biển", "Haruki Murakami", "Văn học nước ngoài", 2002],
  ["Người Đua Diều", "Khaled Hosseini", "Văn học nước ngoài", 2003],
  ["Sherlock Holmes", "Arthur Conan Doyle", "Tiểu thuyết", 1892],
  ["1984", "George Orwell", "Tiểu thuyết", 1949],
  ["Animal Farm", "George Orwell", "Tiểu thuyết", 1945],
  ["The Great Gatsby", "F. Scott Fitzgerald", "Văn học nước ngoài", 1925],
  ["To Kill a Mockingbird", "Harper Lee", "Văn học nước ngoài", 1960],
  ["The Catcher in the Rye", "J.D. Salinger", "Văn học nước ngoài", 1951],
  ["Pride and Prejudice", "Jane Austen", "Văn học nước ngoài", 1813],
  ["The Alchemist English Edition", "Paulo Coelho", "Tiểu thuyết", 1988],
  ["Start With Why", "Simon Sinek", "Khởi nghiệp", 2009],
  ["Zero to One", "Peter Thiel", "Khởi nghiệp", 2014],
  ["The Lean Startup", "Eric Ries", "Khởi nghiệp", 2011],
  ["Hooked", "Nir Eyal", "Marketing", 2014],
  ["Made to Stick", "Chip Heath", "Marketing", 2007],
  ["Good to Great", "Jim Collins", "Kinh tế", 2001],
  ["Thinking in Systems", "Donella Meadows", "Khoa học", 2008],
  ["The Design of Everyday Things", "Don Norman", "Tâm lý học", 1988],
  ["Don't Make Me Think", "Steve Krug", "Công nghệ thông tin", 2000],
  ["Refactoring", "Martin Fowler", "Công nghệ thông tin", 1999],
  ["Code Complete", "Steve McConnell", "Công nghệ thông tin", 1993],
  ["Design Patterns", "Erich Gamma", "Công nghệ thông tin", 1994],
  ["Head First Design Patterns", "Eric Freeman", "Công nghệ thông tin", 2004],
  ["Computer Networking: A Top-Down Approach", "James Kurose", "Công nghệ thông tin", 2000],
  ["Operating System Concepts", "Abraham Silberschatz", "Công nghệ thông tin", 2018],
  ["Artificial Intelligence: A Modern Approach", "Stuart Russell", "Trí tuệ nhân tạo", 2020],
  ["Pattern Recognition and Machine Learning", "Christopher Bishop", "Trí tuệ nhân tạo", 2006],
  ["Hands-On Machine Learning", "Aurélien Géron", "Trí tuệ nhân tạo", 2019],
  ["Data Science from Scratch", "Joel Grus", "Trí tuệ nhân tạo", 2015],
  ["Fluent Python", "Luciano Ramalho", "Công nghệ thông tin", 2015],
  ["Effective Java", "Joshua Bloch", "Công nghệ thông tin", 2018],
  ["JavaScript: The Good Parts", "Douglas Crockford", "Công nghệ thông tin", 2008],
  ["You Don't Know JS", "Kyle Simpson", "Công nghệ thông tin", 2015],
  ["Eloquent JavaScript", "Marijn Haverbeke", "Công nghệ thông tin", 2018],
  ["Learning React", "Alex Banks", "Công nghệ thông tin", 2020],
  ["Node.js Design Patterns", "Mario Casciaro", "Công nghệ thông tin", 2020],
  ["SQL Antipatterns", "Bill Karwin", "Cơ sở dữ liệu", 2010],
  ["Designing Data-Intensive Applications", "Martin Kleppmann", "Cơ sở dữ liệu", 2017],
  ["Fundamentals of Database Systems", "Ramez Elmasri", "Cơ sở dữ liệu", 2016],
  ["Data Warehouse Toolkit", "Ralph Kimball", "Cơ sở dữ liệu", 2013],
  ["The Phoenix Project", "Gene Kim", "Công nghệ thông tin", 2013],
  ["The DevOps Handbook", "Gene Kim", "Công nghệ thông tin", 2016],
  ["Site Reliability Engineering", "Betsy Beyer", "Công nghệ thông tin", 2016],
  ["Cloud Native Patterns", "Cornelia Davis", "Công nghệ thông tin", 2019],
  ["Kubernetes in Action", "Marko Luksa", "Công nghệ thông tin", 2017],
  ["Docker Deep Dive", "Nigel Poulton", "Công nghệ thông tin", 2023],
  ["Machine Learning Yearning", "Andrew Ng", "Trí tuệ nhân tạo", 2018],
  ["Grokking Algorithms", "Aditya Bhargava", "Công nghệ thông tin", 2016],
  ["Algorithms", "Robert Sedgewick", "Công nghệ thông tin", 2011],
  ["Competitive Programming", "Steven Halim", "Công nghệ thông tin", 2020],
  ["Giáo Trình Cơ Sở Dữ Liệu", "Nguyễn Kim Anh", "Cơ sở dữ liệu", 2021],
  ["Giáo Trình Hệ Điều Hành", "Hà Quang Thụy", "Giáo trình", 2020],
  ["Giáo Trình Mạng Máy Tính", "Nguyễn Đình Việt", "Giáo trình", 2022],
  ["Giáo Trình Công Nghệ Phần Mềm", "Trần Đình Quế", "Giáo trình", 2021],
  ["Giáo Trình Trí Tuệ Nhân Tạo", "Nguyễn Thanh Thủy", "Trí tuệ nhân tạo", 2022],
  ["Giáo Trình Xác Suất Thống Kê", "Đặng Hấn", "Giáo trình", 2019],
  ["Giáo Trình Đại Số Tuyến Tính", "Nguyễn Hữu Việt Hưng", "Giáo trình", 2018],
  ["Giáo Trình Giải Tích", "Nguyễn Đình Trí", "Giáo trình", 2017],
  ["Lược Sử Thời Gian", "Stephen Hawking", "Khoa học", 1988],
  ["Vũ Trụ Trong Vỏ Hạt Dẻ", "Stephen Hawking", "Khoa học", 2001],
  ["Cosmos", "Carl Sagan", "Khoa học", 1980],
  ["Brief Answers to the Big Questions", "Stephen Hawking", "Khoa học", 2018],
  ["Súng, Vi Trùng Và Thép", "Jared Diamond", "Lịch sử", 1997],
  ["Homo Deus", "Yuval Noah Harari", "Lịch sử", 2015],
  ["21 Lessons for the 21st Century", "Yuval Noah Harari", "Lịch sử", 2018],
  ["Việt Nam Sử Lược", "Trần Trọng Kim", "Lịch sử", 1920],
  ["Đại Việt Sử Ký Toàn Thư", "Ngô Sĩ Liên", "Lịch sử", 1697],
  ["Đường Xưa Mây Trắng", "Thích Nhất Hạnh", "Triết học", 1991],
  ["Nhật Ký Đặng Thùy Trâm", "Đặng Thùy Trâm", "Văn học Việt Nam", 2005],
  ["Mắt Biếc", "Nguyễn Nhật Ánh", "Văn học Việt Nam", 1990],
  ["Cho Tôi Xin Một Vé Đi Tuổi Thơ", "Nguyễn Nhật Ánh", "Văn học Việt Nam", 2008],
  ["Cánh Đồng Bất Tận", "Nguyễn Ngọc Tư", "Văn học Việt Nam", 2005],
  ["Nỗi Buồn Chiến Tranh", "Bảo Ninh", "Văn học Việt Nam", 1990],
  ["Số Đỏ", "Vũ Trọng Phụng", "Văn học Việt Nam", 1936],
  ["Tắt Đèn", "Ngô Tất Tố", "Văn học Việt Nam", 1939],
  ["Chí Phèo", "Nam Cao", "Văn học Việt Nam", 1941],
  ["Lão Hạc", "Nam Cao", "Văn học Việt Nam", 1943],
  ["Vợ Nhặt", "Kim Lân", "Văn học Việt Nam", 1962],
];

const reservedIndexes = new Set([15, 21, 33, 44, 55, 66, 77, 88, 99]);
const borrowedIndexes = new Set([16, 24, 36, 48, 60, 72, 84]);
const exchangedIndexes = new Set([28, 40, 52, 64, 76]);
const unavailableIndexes = new Set([92, 96, 100]);
const exchangeTypes = ["both", "lending", "permanent"];
const conditions = ["good", "new", "fair", "worn"];

const slugify = (value) => value
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const statusForIndex = (index, fallback) => {
  if (fallback) return fallback;
  if (reservedIndexes.has(index)) return "reserved";
  if (borrowedIndexes.has(index)) return "borrowed";
  if (exchangedIndexes.has(index)) return "exchanged";
  if (unavailableIndexes.has(index)) return "unavailable";
  return "available";
};

const ownerForIndex = (index, fallback) => {
  if (fallback) return fallback;
  return demoMembers[(index - 1) % demoMembers.length].email;
};

const bookDescriptions = new Map([
  ["Nhà Giả Kim", "Cuốn tiểu thuyết nổi tiếng về hành trình theo đuổi ước mơ, lắng nghe trái tim và khám phá ý nghĩa cuộc sống."],
  ["Đắc Nhân Tâm", "Sách kinh điển về nghệ thuật giao tiếp, thấu hiểu người khác và xây dựng các mối quan hệ tích cực."],
  ["Tôi Thấy Hoa Vàng Trên Cỏ Xanh", "Câu chuyện trong trẻo về tuổi thơ, tình anh em và những rung động đầu đời qua giọng văn nhẹ nhàng của Nguyễn Nhật Ánh."],
  ["Tuổi Trẻ Đáng Giá Bao Nhiêu", "Những chia sẻ gần gũi về học tập, trải nghiệm và tự lập, phù hợp với bạn trẻ đang tìm hướng đi cho mình."],
  ["Clean Code", "Cuốn sách hướng dẫn lập trình viên viết mã rõ ràng, dễ bảo trì và có tư duy chuyên nghiệp trong phát triển phần mềm."],
  ["Introduction to Algorithms", "Giáo trình nền tảng về thuật toán và cấu trúc dữ liệu, bao quát phân tích độ phức tạp, đồ thị và quy hoạch động."],
  ["Database System Concepts", "Tài liệu hệ thống về cơ sở dữ liệu, SQL, giao dịch và thiết kế hệ quản trị dữ liệu cho sinh viên công nghệ."],
  ["Atomic Habits", "Cuốn sách thực tế về cách xây dựng thói quen nhỏ, cải thiện từng ngày và duy trì thay đổi tích cực lâu dài."],
  ["Sapiens", "Lược sử loài người từ thời săn bắt hái lượm đến xã hội hiện đại, đặt nhiều câu hỏi về văn minh và quyền lực."],
  ["The Pragmatic Programmer", "Tập hợp lời khuyên thực hành giúp lập trình viên rèn tư duy nghề nghiệp, quản lý mã nguồn và làm việc hiệu quả."],
  ["Harry Potter và Hòn Đá Phù Thủy", "Tập mở đầu thế giới phù thủy Hogwarts, kể về tình bạn, lòng dũng cảm và hành trình trưởng thành của Harry Potter."],
  ["Không Gia Đình", "Tác phẩm cảm động về cậu bé Rémi trên đường lưu lạc, giàu tình người và niềm tin vào lòng tốt."],
  ["Giáo Trình Triết Học Mác - Lênin", "Tài liệu nhập môn các nguyên lý triết học Mác - Lênin, hỗ trợ sinh viên hệ thống hóa khái niệm cơ bản."],
  ["Kỹ Thuật Lập Trình C", "Sách nhập môn lập trình C với nhiều ví dụ thực hành, giúp người học nắm chắc biến, hàm, con trỏ và cấu trúc dữ liệu cơ bản."],
  ["Marketing Căn Bản", "Tài liệu giới thiệu tư duy marketing, phân tích thị trường, hành vi khách hàng và xây dựng chiến lược sản phẩm."],
  ["Dế Mèn Phiêu Lưu Ký", "Truyện thiếu nhi kinh điển kể về hành trình trưởng thành của Dế Mèn, giàu trí tưởng tượng và bài học nhân ái."],
  ["Deep Learning", "Tài liệu nền tảng về mạng nơ-ron, tối ưu hóa và các mô hình học sâu, phù hợp cho người học trí tuệ nhân tạo."],
  ["Python Crash Course", "Sách thực hành Python từ cú pháp cơ bản đến dự án nhỏ, phù hợp cho người mới muốn học lập trình nhanh và chắc."],
  ["English Grammar in Use", "Tài liệu ngữ pháp tiếng Anh có bài tập rõ ràng, thích hợp cho người tự học và ôn luyện nền tảng."],
  ["Tư Duy Nhanh Và Chậm", "Daniel Kahneman phân tích hai hệ thống tư duy chi phối quyết định, thiên kiến và cách con người đánh giá rủi ro."],
  ["Bố Già", "Tiểu thuyết về gia đình Corleone, quyền lực và lòng trung thành trong thế giới ngầm Mỹ với nhịp kể cuốn hút."],
  ["Rừng Na Uy", "Câu chuyện u buồn về ký ức, tình yêu và sự cô đơn của tuổi trẻ trong văn phong trầm lắng của Haruki Murakami."],
  ["Kafka Bên Bờ Biển", "Tiểu thuyết pha trộn hiện thực và huyền ảo, theo chân những nhân vật đi tìm bản ngã và lời giải cho quá khứ."],
  ["Người Đua Diều", "Câu chuyện cảm động về tình bạn, lỗi lầm và chuộc lỗi trên nền lịch sử nhiều biến động của Afghanistan."],
  ["Sherlock Holmes", "Tuyển truyện trinh thám kinh điển với những vụ án sắc sảo và khả năng suy luận nổi tiếng của Holmes."],
  ["1984", "Tiểu thuyết phản địa đàng về giám sát, kiểm soát tư tưởng và nỗi sợ trong một xã hội toàn trị."],
  ["Animal Farm", "Truyện ngụ ngôn chính trị sắc bén, phê phán sự tha hóa quyền lực qua câu chuyện về một trang trại nổi loạn."],
  ["The Great Gatsby", "Bức tranh nước Mỹ thập niên 1920 với hào nhoáng, khát vọng giàu sang và bi kịch tình yêu của Gatsby."],
  ["To Kill a Mockingbird", "Tiểu thuyết nhân văn về công lý, định kiến chủng tộc và sự trưởng thành qua góc nhìn trẻ thơ."],
  ["The Catcher in the Rye", "Câu chuyện về tuổi mới lớn, lạc lõng và khát vọng giữ lại sự trong trẻo trong một thế giới nhiều giả tạo."],
  ["Pride and Prejudice", "Tiểu thuyết kinh điển về tình yêu, định kiến và địa vị xã hội qua mối quan hệ giữa Elizabeth và Darcy."],
  ["The Alchemist English Edition", "Bản tiếng Anh của hành trình Santiago đi tìm kho báu, phù hợp cho người muốn đọc văn học nhẹ nhàng bằng ngoại ngữ."],
  ["Start With Why", "Simon Sinek lý giải sức mạnh của mục đích, giúp cá nhân và tổ chức truyền cảm hứng rõ ràng hơn."],
  ["Zero to One", "Peter Thiel chia sẻ tư duy xây dựng startup tạo ra giá trị mới thay vì chỉ cạnh tranh trong thị trường cũ."],
  ["The Lean Startup", "Phương pháp phát triển sản phẩm tinh gọn, thử nghiệm nhanh và học từ phản hồi khách hàng để giảm lãng phí."],
  ["Hooked", "Cuốn sách phân tích cách sản phẩm hình thành thói quen người dùng qua kích hoạt, hành động, phần thưởng và đầu tư."],
  ["Made to Stick", "Chip và Dan Heath trình bày cách tạo thông điệp dễ nhớ, giàu cảm xúc và có khả năng lan truyền."],
  ["Good to Great", "Nghiên cứu về các công ty chuyển mình bền vững, nhấn mạnh kỷ luật, lãnh đạo và lựa chọn đúng trọng tâm."],
  ["Thinking in Systems", "Giới thiệu tư duy hệ thống để hiểu mối liên kết, vòng phản hồi và nguyên nhân sâu xa của vấn đề phức tạp."],
  ["The Design of Everyday Things", "Don Norman giải thích vì sao thiết kế tốt cần dễ hiểu, dễ dùng và đặt trải nghiệm con người ở trung tâm."],
  ["Don't Make Me Think", "Sách kinh điển về usability, giúp người làm web thiết kế giao diện rõ ràng và giảm gánh nặng nhận thức."],
  ["Refactoring", "Martin Fowler trình bày kỹ thuật cải thiện cấu trúc mã hiện có mà vẫn giữ nguyên hành vi của phần mềm."],
  ["Code Complete", "Cẩm nang toàn diện về xây dựng phần mềm, từ đặt tên, thiết kế hàm đến kiểm thử và quản lý chất lượng mã."],
  ["Design Patterns", "Tài liệu kinh điển về các mẫu thiết kế hướng đối tượng, giúp giải quyết những bài toán kiến trúc lặp lại."],
  ["Head First Design Patterns", "Cách tiếp cận trực quan và dễ nhớ về design patterns, phù hợp cho người học qua ví dụ và hình ảnh."],
  ["Computer Networking: A Top-Down Approach", "Giáo trình mạng máy tính đi từ tầng ứng dụng xuống hạ tầng, giúp hiểu Internet bằng các ví dụ thực tế."],
  ["Operating System Concepts", "Tài liệu nền tảng về tiến trình, bộ nhớ, hệ thống tập tin và đồng bộ trong hệ điều hành hiện đại."],
  ["Artificial Intelligence: A Modern Approach", "Giáo trình bao quát tìm kiếm, logic, học máy và tác tử thông minh trong lĩnh vực trí tuệ nhân tạo."],
  ["Pattern Recognition and Machine Learning", "Tài liệu chuyên sâu về xác suất, mô hình học máy và nhận dạng mẫu dành cho người học nâng cao."],
  ["Hands-On Machine Learning", "Sách thực hành học máy với ví dụ Python, từ mô hình cổ điển đến mạng nơ-ron và triển khai pipeline."],
  ["Data Science from Scratch", "Giới thiệu khoa học dữ liệu từ nền tảng toán, thống kê đến thuật toán bằng các ví dụ tự xây dựng."],
  ["Fluent Python", "Cuốn sách giúp lập trình viên Python hiểu sâu data model, iterator, decorator và phong cách viết mã Pythonic."],
  ["Effective Java", "Tập hợp nguyên tắc thực hành giúp viết Java rõ ràng, an toàn và dễ bảo trì trong dự án lớn."],
  ["JavaScript: The Good Parts", "Douglas Crockford chọn lọc những phần tinh gọn của JavaScript để viết mã sáng sủa và tránh bẫy ngôn ngữ."],
  ["You Don't Know JS", "Bộ sách đào sâu cơ chế JavaScript như scope, closure, this và async cho người muốn hiểu bản chất ngôn ngữ."],
  ["Eloquent JavaScript", "Sách học JavaScript qua giải thích mạch lạc và bài tập thực hành, phù hợp từ cơ bản đến trung cấp."],
  ["Learning React", "Tài liệu học React theo hướng component, state và luồng dữ liệu, phù hợp cho người xây dựng giao diện hiện đại."],
  ["Node.js Design Patterns", "Sách trình bày kiến trúc và mẫu thiết kế trong Node.js, từ bất đồng bộ đến tổ chức ứng dụng production."],
  ["SQL Antipatterns", "Cuốn sách chỉ ra các lỗi thiết kế SQL thường gặp và cách sửa để cơ sở dữ liệu dễ mở rộng hơn."],
  ["Designing Data-Intensive Applications", "Martin Kleppmann phân tích hệ thống dữ liệu tin cậy, từ lưu trữ, replication đến stream processing."],
  ["Fundamentals of Database Systems", "Giáo trình bao quát mô hình dữ liệu, chuẩn hóa, SQL và kiến trúc hệ quản trị cơ sở dữ liệu."],
  ["Data Warehouse Toolkit", "Tài liệu thực hành mô hình hóa kho dữ liệu theo Kimball, tập trung vào fact, dimension và phân tích nghiệp vụ."],
  ["The Phoenix Project", "Tiểu thuyết công nghệ về DevOps, bottleneck và cách cải thiện luồng công việc trong tổ chức IT."],
  ["The DevOps Handbook", "Hướng dẫn thực hành DevOps, nhấn mạnh tự động hóa, phản hồi nhanh và văn hóa học hỏi liên tục."],
  ["Site Reliability Engineering", "Tập hợp kinh nghiệm vận hành hệ thống quy mô lớn, cân bằng độ tin cậy, tự động hóa và tốc độ phát triển."],
  ["Cloud Native Patterns", "Sách giới thiệu các mẫu thiết kế ứng dụng cloud-native, phù hợp cho hệ thống phân tán và triển khai linh hoạt."],
  ["Kubernetes in Action", "Tài liệu thực hành Kubernetes, giải thích pod, service, deployment và cách vận hành ứng dụng container."],
  ["Docker Deep Dive", "Sách giúp hiểu Docker từ image, container, network đến workflow triển khai trong môi trường phát triển hiện đại."],
  ["Machine Learning Yearning", "Andrew Ng chia sẻ cách định hướng dự án học máy, phân tích lỗi và ưu tiên cải tiến mô hình hiệu quả."],
  ["Grokking Algorithms", "Sách giải thích thuật toán bằng hình minh họa dễ hiểu, phù hợp cho người mới học cấu trúc dữ liệu."],
  ["Algorithms", "Tài liệu hệ thống về thuật toán sắp xếp, tìm kiếm, đồ thị và xử lý chuỗi cho sinh viên khoa học máy tính."],
  ["Competitive Programming", "Sách luyện tư duy giải thuật thi đấu, bao quát kỹ thuật tối ưu và chiến lược xử lý bài toán khó."],
  ["Giáo Trình Cơ Sở Dữ Liệu", "Tài liệu tiếng Việt về mô hình quan hệ, SQL, chuẩn hóa và thiết kế lược đồ cho môn cơ sở dữ liệu."],
  ["Giáo Trình Hệ Điều Hành", "Giáo trình trình bày tiến trình, lập lịch, quản lý bộ nhớ và hệ thống tập tin trong hệ điều hành."],
  ["Giáo Trình Mạng Máy Tính", "Tài liệu hỗ trợ học giao thức mạng, mô hình phân tầng, định tuyến và các dịch vụ Internet cơ bản."],
  ["Giáo Trình Công Nghệ Phần Mềm", "Giáo trình về quy trình phát triển, phân tích yêu cầu, thiết kế, kiểm thử và quản lý dự án phần mềm."],
  ["Giáo Trình Trí Tuệ Nhân Tạo", "Tài liệu tiếng Việt giới thiệu tìm kiếm, biểu diễn tri thức, suy luận và các phương pháp học máy cơ bản."],
  ["Giáo Trình Xác Suất Thống Kê", "Giáo trình nền tảng về biến cố, phân phối xác suất, ước lượng và kiểm định giả thuyết."],
  ["Giáo Trình Đại Số Tuyến Tính", "Tài liệu hệ thống về ma trận, không gian vector, trị riêng và các phép biến đổi tuyến tính."],
  ["Giáo Trình Giải Tích", "Sách học giải tích với giới hạn, đạo hàm, tích phân và chuỗi, phù hợp cho sinh viên năm đầu."],
  ["Lược Sử Thời Gian", "Stephen Hawking dẫn dắt người đọc qua vũ trụ học, hố đen và nguồn gốc thời gian bằng lối viết phổ thông."],
  ["Vũ Trụ Trong Vỏ Hạt Dẻ", "Cuốn sách phổ biến khoa học về không-thời gian, lượng tử và những ý tưởng lớn trong vật lý hiện đại."],
  ["Cosmos", "Carl Sagan kể câu chuyện về vũ trụ, sự sống và vị trí của con người bằng văn phong giàu cảm hứng."],
  ["Brief Answers to the Big Questions", "Stephen Hawking trả lời những câu hỏi lớn về vũ trụ, trí tuệ nhân tạo và tương lai nhân loại."],
  ["Súng, Vi Trùng Và Thép", "Jared Diamond phân tích vai trò địa lý, sinh học và công nghệ trong sự phát triển khác nhau của các nền văn minh."],
  ["Homo Deus", "Yuval Noah Harari suy ngẫm về tương lai loài người, dữ liệu, công nghệ và khát vọng vượt qua giới hạn sinh học."],
  ["21 Lessons for the 21st Century", "Cuốn sách bàn về những thách thức hiện đại như thông tin, chính trị, giáo dục và ý nghĩa trong thế kỷ 21."],
  ["Việt Nam Sử Lược", "Tác phẩm lịch sử phổ thông trình bày mạch phát triển của Việt Nam từ thời dựng nước đến cận đại."],
  ["Đại Việt Sử Ký Toàn Thư", "Bộ chính sử quan trọng ghi chép các triều đại Việt Nam, phù hợp cho người muốn tìm hiểu sử liệu truyền thống."],
  ["Đường Xưa Mây Trắng", "Thích Nhất Hạnh kể lại cuộc đời Đức Phật bằng văn phong dung dị, giàu chất thiền và lòng từ bi."],
  ["Nhật Ký Đặng Thùy Trâm", "Những trang nhật ký chân thành của nữ bác sĩ trong chiến tranh, thể hiện lý tưởng sống và tình yêu con người."],
  ["Mắt Biếc", "Câu chuyện tình buồn và trong trẻo của Nguyễn Nhật Ánh, gắn với làng quê, ký ức và những tiếc nuối tuổi trẻ."],
  ["Cho Tôi Xin Một Vé Đi Tuổi Thơ", "Tác phẩm dí dỏm và ấm áp đưa người đọc trở lại thế giới trẻ thơ với những trò chơi và suy nghĩ hồn nhiên."],
  ["Cánh Đồng Bất Tận", "Nguyễn Ngọc Tư khắc họa miền Tây sông nước, nỗi đau gia đình và thân phận con người bằng giọng văn ám ảnh."],
  ["Nỗi Buồn Chiến Tranh", "Tác phẩm giàu ám ảnh về ký ức chiến tranh, thân phận con người và những mất mát kéo dài sau hòa bình."],
  ["Số Đỏ", "Tiểu thuyết trào phúng sắc bén của Vũ Trọng Phụng, phơi bày sự lố bịch của xã hội thành thị nửa mùa."],
  ["Tắt Đèn", "Tiểu thuyết phản ánh đời sống nông thôn Việt Nam trước Cách mạng, nổi bật với hình tượng chị Dậu giàu sức chịu đựng."],
  ["Chí Phèo", "Tác phẩm hiện thực nổi bật của Nam Cao, khắc họa số phận bi kịch của người nông dân bị đẩy ra bên lề xã hội."],
  ["Lão Hạc", "Truyện ngắn cảm động về lòng tự trọng, tình phụ tử và nỗi cùng quẫn của người nông dân nghèo trong xã hội cũ."],
  ["Vợ Nhặt", "Kim Lân kể về tình người và hy vọng sống giữa nạn đói, với tình huống truyện giản dị mà giàu sức lay động."],
]);

const copyNoteTemplates = [
  "Bìa còn đẹp, vài trang có ghi chú bút chì nhưng chữ in rõ và dễ đọc.",
  "Sách được bọc plastic, gáy chắc, thích hợp cho mượn ngắn hạn.",
  "Có vài vết gấp nhẹ ở mép trang, nội dung bên trong vẫn sạch.",
  "Bản in còn mới, phù hợp cho bạn cần tài liệu trong học kỳ này.",
  "Sách cũ được giữ gìn cẩn thận, thích hợp để trao đổi lâu dài.",
  "Có dán nhãn tên chủ cũ ở trang đầu, các trang còn nguyên vẹn.",
  "Bìa hơi sờn ở góc nhưng ruột sách phẳng và không thiếu trang.",
  "Một số đoạn được đánh dấu nhẹ, thuận tiện cho người đọc tham khảo.",
  "Sách khổ vừa, dễ mang theo khi đi học hoặc đọc ở quán cà phê.",
  "Gáy sách chắc, bìa sạch, ưu tiên bạn giữ sách cẩn thận khi mượn.",
];

const getBookDescription = (title) => {
  const description = bookDescriptions.get(title);

  if (!description) {
    throw new Error(`Missing seeded book description for ${title}`);
  }

  return description;
};

const getCopyNote = (title, index) => `${copyNoteTemplates[(index - 1) % copyNoteTemplates.length]} Ghi chú riêng cho "${title}".`;

const books = [
  ...requiredBooks.map((book, index) => {
    const itemIndex = index + 1;
    const [title, author, category, publication_year, condition, exchange_type, status, owner_email, seed, isbn] = book;
    return {
      index: itemIndex,
      book_id: firstBookIds[itemIndex] ?? uuid("22000000", itemIndex),
      copy_id: firstCopyIds[itemIndex] ?? uuid("32000000", itemIndex),
      title,
      author,
      category,
      publisher: category === "Công nghệ thông tin" ? "Tech Demo Press" : "BookCommunity Demo",
      publication_year,
      isbn,
      language: /[A-Za-z]/.test(title) && !/[áàâã�]/.test(title) ? "English" : "Vietnamese",
      description: getBookDescription(title),
      cover_url: `https://picsum.photos/seed/${seed}/300/420`,
      condition: condition === "like_new" ? "new" : condition,
      exchange_type,
      status,
      owner_email,
      note: getCopyNote(title, itemIndex),
    };
  }),
  ...additionalBookMeta.map((book, index) => {
    const itemIndex = index + 21;
    const [title, author, category, publication_year] = book;
    return {
      index: itemIndex,
      book_id: uuid("22000000", itemIndex),
      copy_id: uuid("32000000", itemIndex),
      title,
      author,
      category,
      publisher: "BookCommunity Demo",
      publication_year,
      isbn: `978000202606${String(itemIndex).padStart(4, "0")}`,
      language: /[A-Za-z]/.test(title) && !/[áàâã�]/.test(title) ? "English" : "Vietnamese",
      description: getBookDescription(title),
      cover_url: `https://picsum.photos/seed/${slugify(title) || `book-${itemIndex}`}/300/420`,
      condition: conditions[itemIndex % conditions.length],
      exchange_type: exchangeTypes[itemIndex % exchangeTypes.length],
      status: statusForIndex(itemIndex),
      owner_email: ownerForIndex(itemIndex),
      note: getCopyNote(title, itemIndex),
    };
  }),
];

const conversations = [
  {
    conversation_id: "60000000-0000-4000-8000-000000000001",
    members: ["manhdung05072005@gmail.com", "23020520@vnu.edu.vn"],
    messages: [
      ["70000000-0000-4000-8000-000000000001", "23020520@vnu.edu.vn", "Chào bạn, mình muốn hỏi về cuốn Nhà Giả Kim."],
      ["70000000-0000-4000-8000-000000000002", "manhdung05072005@gmail.com", "Chào bạn, sách vẫn còn mới và có thể trao đổi được nhé."],
      ["70000000-0000-4000-8000-000000000003", "23020520@vnu.edu.vn", "Mình có thể nhận sách ở khu vực Cầu Giấy không?"],
    ],
  },
  {
    conversation_id: uuid("60000000", 2),
    members: ["manhdung05072005@gmail.com", "deliverer@example.com"],
    messages: [
      [uuid("70000000", 4), "manhdung05072005@gmail.com", "Chi ỡ khu Bắc Từ Liêm có hỗ trợ giao sách buổi tối không?"],
      [uuid("70000000", 5), "deliverer@example.com", "Có bạn, mình rảnh sau 18:30 và có thể qua Cầu Giấy."],
    ],
  },
  {
    conversation_id: uuid("60000000", 3),
    members: ["owner2@example.com", "receiver2@example.com"],
    messages: [
      [uuid("70000000", 6), "receiver2@example.com", "Mình muốn mượn Clean Code để ôn lại design principle."],
      [uuid("70000000", 7), "owner2@example.com", "Được nhé, sách cần giữ cẩn thận vì là bản gốc tiếng Anh."],
    ],
  },
  {
    conversation_id: uuid("60000000", 4),
    members: ["quan@example.com", "linh@example.com"],
    messages: [
      [uuid("70000000", 8), "quan@example.com", "Linh có thể cho mình hỏi về Python Crash Course không?"],
      [uuid("70000000", 9), "linh@example.com", "Sách mới và có thể trao đổi cả mượn lẫn lấy luôn."],
    ],
  },
];

const transactions = [
  [uuid("80000000", 1), 21, "an@example.com", "23020520@vnu.edu.vn", "deliverer@example.com", "lending", "pending", false, false, false, null],
  [uuid("80000000", 2), 33, "long@example.com", "phuongvy@example.com", "quan@example.com", "permanent", "pending", false, false, false, null],
  [uuid("80000000", 3), 16, "manhdung05072005@gmail.com", "23020520@vnu.edu.vn", "deliverer@example.com", "lending", "completed", true, true, true, "2026-06-01T10:00:00.000Z"],
  [uuid("80000000", 4), 28, "vietanh@example.com", "owner2@example.com", "receiver2@example.com", "permanent", "completed", true, true, true, "2026-05-30T10:00:00.000Z"],
  [uuid("80000000", 5), 92, "linh@example.com", "giabao@example.com", null, "lending", "cancelled", false, false, false, null],
].map(([transaction_id, book_index, giver_email, receiver_email, deliverer_email, transaction_type, status, giver_confirmed, receiver_confirmed, delivery_confirmed, completed_at]) => ({
  transaction_id,
  book_index,
  giver_email,
  receiver_email,
  deliverer_email,
  transaction_type,
  status,
  giver_confirmed,
  receiver_confirmed,
  delivery_confirmed,
  completed_at,
}));

const ratings = [
  [uuid("90000000", 1), uuid("80000000", 3), "23020520@vnu.edu.vn", "manhdung05072005@gmail.com", 5, "Giao dịch nhanh, sách đúng mô tả."],
  [uuid("90000000", 2), uuid("80000000", 3), "manhdung05072005@gmail.com", "23020520@vnu.edu.vn", 5, "Người nhận sách đúng hẹn và phản hồi tốt."],
  [uuid("90000000", 3), uuid("80000000", 4), "owner2@example.com", "vietanh@example.com", 4, "Trao đổi thuận lợi."],
  [uuid("90000000", 4), uuid("80000000", 4), "vietanh@example.com", "owner2@example.com", 5, "Bạn trao đổi rất dễ thống nhất."],
].map(([rating_id, transaction_id, rater_email, rated_member_email, score, comment]) => ({
  rating_id,
  transaction_id,
  rater_email,
  rated_member_email,
  score,
  comment,
}));

const hasTable = async (queryInterface, tableName, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });

  return tables.some((table) => {
    if (typeof table === "string") {
      return table === tableName;
    }

    return table.tableName === tableName || table.table_name === tableName;
  });
};

const upsertMember = async (queryInterface, Sequelize, member, passwordHash, transaction) => {
  const rows = await queryInterface.sequelize.query(`
    INSERT INTO members (
      member_id, full_name, email, password_hash, phone, address, point_balance,
      role, is_deliverer, account_status, email_verified, created_at, updated_at
    )
    VALUES (
      :member_id, :full_name, :email, :password_hash, :phone, :address, :point_balance,
      'member', :is_deliverer, 'active', true, :created_at, :updated_at
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
      book_id, title, author, category, publisher, publication_year, isbn,
      language, description, cover_url, created_at, updated_at
    )
    VALUES (
      :book_id, :title, :author, :category, :publisher, :publication_year, :isbn,
      :language, :description, :cover_url, :created_at, :updated_at
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
      copy_id, book_id, owner_id, condition, status, exchange_type, note, created_at, updated_at
    )
    VALUES (
      :copy_id, :book_id, :owner_id, :condition, :status, :exchange_type, :note, :created_at, :updated_at
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
      condition: book.condition,
      status: book.status,
      exchange_type: book.exchange_type,
      note: book.note,
      created_at: now(),
      updated_at: now(),
    },
    transaction,
  });
};

const upsertDelivererProfile = async (queryInterface, profile, memberId, transaction) => {
  await queryInterface.sequelize.query(`
    INSERT INTO deliverer_profiles (
      profile_id, member_id, service_area, available_hours, total_deliveries,
      is_active, created_at, updated_at
    )
    VALUES (
      :profile_id, :member_id, :service_area, :available_hours, :total_deliveries,
      true, :created_at, :updated_at
    )
    ON CONFLICT (member_id) DO UPDATE SET
      service_area = EXCLUDED.service_area,
      available_hours = EXCLUDED.available_hours,
      total_deliveries = EXCLUDED.total_deliveries,
      is_active = EXCLUDED.is_active,
      updated_at = EXCLUDED.updated_at;
  `, {
    replacements: {
      ...profile,
      member_id: memberId,
      created_at: now(),
      updated_at: now(),
    },
    transaction,
  });
};

const deactivateNonDelivererProfiles = async (queryInterface, transaction) => {
  const nonDelivererEmails = demoMembers
    .filter((member) => !member.is_deliverer)
    .map((member) => member.email);

  await queryInterface.sequelize.query(`
    UPDATE deliverer_profiles
    SET is_active = false, updated_at = :updated_at
    WHERE member_id IN (
      SELECT member_id
      FROM members
      WHERE email IN (:emails)
    );
  `, {
    replacements: {
      emails: nonDelivererEmails,
      updated_at: now(),
    },
    transaction,
  });
};

const insertPointHistoryIfMissing = async (
  queryInterface,
  pointHistoryId,
  memberId,
  transactionId,
  pointChange,
  reason,
  transaction,
) => {
  await queryInterface.sequelize.query(`
    INSERT INTO point_histories (
      point_history_id, member_id, transaction_id, point_change, reason, created_at, updated_at
    )
    SELECT
      :point_history_id, :member_id, :transaction_id, :point_change, :reason, :created_at, :updated_at
    WHERE NOT EXISTS (
      SELECT 1
      FROM point_histories
      WHERE member_id = :member_id
        AND reason = :reason
        AND point_change = :point_change
        AND (
          (:transaction_id::uuid IS NULL AND transaction_id IS NULL)
          OR transaction_id = :transaction_id::uuid
        )
    );
  `, {
    replacements: {
      point_history_id: pointHistoryId,
      member_id: memberId,
      transaction_id: transactionId,
      point_change: pointChange,
      reason,
      created_at: now(),
      updated_at: now(),
    },
    transaction,
  });
};

const seedPointHistories = async (queryInterface, memberIdsByEmail, transaction) => {
  if (!(await hasTable(queryInterface, "point_histories", transaction))) {
    console.log("point_histories table not found, skipped point history seed");
    return;
  }

  const bonusReasons = ["permanent_exchange", "delivery_bonus", "lending", "admin_adjustment"];

  for (const [index, member] of demoMembers.entries()) {
    const memberId = memberIdsByEmail.get(member.email);
    await insertPointHistoryIfMissing(
      queryInterface,
      uuid("91000000", index + 1),
      memberId,
      null,
      20,
      "initial_register",
      transaction,
    );

    let remaining = member.point_balance - 20;
    let part = 0;
    while (remaining > 0 && part < 3) {
      const pointChange = Math.min(remaining, part === 0 ? 20 : 10);
      await insertPointHistoryIfMissing(
        queryInterface,
        uuid("91000000", 1000 + (index + 1) * 10 + part),
        memberId,
        null,
        pointChange,
        bonusReasons[(index + part) % bonusReasons.length],
        transaction,
      );
      remaining -= pointChange;
      part += 1;
    }
  }
};

const seedConversations = async (queryInterface, Sequelize, memberIdsByEmail, transaction) => {
  if (
    !(await hasTable(queryInterface, "conversations", transaction)) ||
    !(await hasTable(queryInterface, "messages", transaction))
  ) {
    console.log("conversations/messages tables not found, skipped conversation seed");
    return;
  }

  for (const conversation of conversations) {
    const memberIds = conversation.members.map((email) => memberIdsByEmail.get(email)).sort();
    const rows = await queryInterface.sequelize.query(`
      INSERT INTO conversations (
        conversation_id, member1_id, member2_id, created_at, updated_at
      )
      VALUES (
        :conversation_id, :member1_id, :member2_id, :created_at, :updated_at
      )
      ON CONFLICT (member1_id, member2_id) DO UPDATE SET
        updated_at = EXCLUDED.updated_at
      RETURNING conversation_id;
    `, {
      replacements: {
        conversation_id: conversation.conversation_id,
        member1_id: memberIds[0],
        member2_id: memberIds[1],
        created_at: now(),
        updated_at: now(),
      },
      transaction,
      type: Sequelize.QueryTypes.SELECT,
    });

    for (const [message_id, senderEmail, content] of conversation.messages) {
      await queryInterface.sequelize.query(`
        INSERT INTO messages (
          message_id, conversation_id, sender_id, content, is_read, created_at, updated_at
        )
        VALUES (
          :message_id, :conversation_id, :sender_id, :content, true, :created_at, :updated_at
        )
        ON CONFLICT (message_id) DO UPDATE SET
          conversation_id = EXCLUDED.conversation_id,
          sender_id = EXCLUDED.sender_id,
          content = EXCLUDED.content,
          is_read = EXCLUDED.is_read,
          updated_at = EXCLUDED.updated_at;
      `, {
        replacements: {
          message_id,
          conversation_id: rows[0].conversation_id,
          sender_id: memberIdsByEmail.get(senderEmail),
          content,
          created_at: now(),
          updated_at: now(),
        },
        transaction,
      });
    }
  }
};

const seedTransactions = async (queryInterface, memberIdsByEmail, copyIdsByIndex, transaction) => {
  if (!(await hasTable(queryInterface, "book_transactions", transaction))) {
    console.log("book_transactions table not found, skipped transaction seed");
    return new Set();
  }

  const completedTransactionIds = new Set();

  for (const item of transactions) {
    const transactionId = item.transaction_id;
    await queryInterface.sequelize.query(`
      INSERT INTO book_transactions (
        transaction_id, copy_id, giver_id, receiver_id, deliverer_id, transaction_type,
        status, giver_confirmed, receiver_confirmed, delivery_confirmed, expected_return_date,
        completed_at, created_at, updated_at
      )
      VALUES (
        :transaction_id, :copy_id, :giver_id, :receiver_id, :deliverer_id, :transaction_type,
        :status, :giver_confirmed, :receiver_confirmed, :delivery_confirmed, :expected_return_date,
        :completed_at, :created_at, :updated_at
      )
      ON CONFLICT (transaction_id) DO UPDATE SET
        copy_id = EXCLUDED.copy_id,
        giver_id = EXCLUDED.giver_id,
        receiver_id = EXCLUDED.receiver_id,
        deliverer_id = EXCLUDED.deliverer_id,
        transaction_type = EXCLUDED.transaction_type,
        status = EXCLUDED.status,
        giver_confirmed = EXCLUDED.giver_confirmed,
        receiver_confirmed = EXCLUDED.receiver_confirmed,
        delivery_confirmed = EXCLUDED.delivery_confirmed,
        expected_return_date = EXCLUDED.expected_return_date,
        completed_at = EXCLUDED.completed_at,
        updated_at = EXCLUDED.updated_at;
    `, {
      replacements: {
        transaction_id: transactionId,
        copy_id: copyIdsByIndex.get(item.book_index),
        giver_id: memberIdsByEmail.get(item.giver_email),
        receiver_id: memberIdsByEmail.get(item.receiver_email),
        deliverer_id: item.deliverer_email ? memberIdsByEmail.get(item.deliverer_email) : null,
        transaction_type: item.transaction_type,
        status: item.status,
        giver_confirmed: item.giver_confirmed,
        receiver_confirmed: item.receiver_confirmed,
        delivery_confirmed: item.delivery_confirmed,
        expected_return_date: item.transaction_type === "lending" ? "2026-06-20" : null,
        completed_at: item.completed_at,
        created_at: now(),
        updated_at: now(),
      },
      transaction,
    });

    if (item.status === "completed") {
      completedTransactionIds.add(transactionId);
    }
  }

  return completedTransactionIds;
};

const seedRatings = async (queryInterface, memberIdsByEmail, completedTransactionIds, transaction) => {
  if (!(await hasTable(queryInterface, "ratings", transaction))) {
    console.log("ratings table not found, skipped rating seed");
    return;
  }

  for (const rating of ratings) {
    if (!completedTransactionIds.has(rating.transaction_id)) {
      continue;
    }

    await queryInterface.sequelize.query(`
      INSERT INTO ratings (
        rating_id, transaction_id, rater_id, rated_member_id, score, comment, created_at, updated_at
      )
      VALUES (
        :rating_id, :transaction_id, :rater_id, :rated_member_id, :score, :comment, :created_at, :updated_at
      )
      ON CONFLICT (transaction_id, rater_id, rated_member_id) DO UPDATE SET
        score = EXCLUDED.score,
        comment = EXCLUDED.comment,
        updated_at = EXCLUDED.updated_at;
    `, {
      replacements: {
        rating_id: rating.rating_id,
        transaction_id: rating.transaction_id,
        rater_id: memberIdsByEmail.get(rating.rater_email),
        rated_member_id: memberIdsByEmail.get(rating.rated_member_email),
        score: rating.score,
        comment: rating.comment,
        created_at: now(),
        updated_at: now(),
      },
      transaction,
    });
  }
};

export default {
  name: "202606020004-large-demo-data",

  async up(queryInterface, Sequelize, transaction) {
    const passwordHash = await bcrypt.hash(password, 10);
    const memberIdsByEmail = new Map();
    const bookIdsByIsbn = new Map();
    const copyIdsByIndex = new Map();

    for (const member of demoMembers) {
      const row = await upsertMember(queryInterface, Sequelize, member, passwordHash, transaction);
      memberIdsByEmail.set(row.email, row.member_id);
    }

    for (const book of books) {
      const row = await upsertBookTitle(queryInterface, Sequelize, book, transaction);
      bookIdsByIsbn.set(row.isbn, row.book_id);
    }

    for (const book of books) {
      const copyId = book.copy_id;
      await upsertBookCopy(
        queryInterface,
        book,
        bookIdsByIsbn.get(book.isbn),
        memberIdsByEmail.get(book.owner_email),
        transaction,
      );
      copyIdsByIndex.set(book.index, copyId);
    }

    if (await hasTable(queryInterface, "deliverer_profiles", transaction)) {
      await deactivateNonDelivererProfiles(queryInterface, transaction);

      for (const profile of delivererProfiles) {
        await upsertDelivererProfile(
          queryInterface,
          profile,
          memberIdsByEmail.get(profile.email),
          transaction,
        );
      }
    } else {
      console.log("deliverer_profiles table not found, skipped deliverer profile seed");
    }

    await seedPointHistories(queryInterface, memberIdsByEmail, transaction);
    await seedConversations(queryInterface, Sequelize, memberIdsByEmail, transaction);
    const completedTransactionIds = await seedTransactions(
      queryInterface,
      memberIdsByEmail,
      copyIdsByIndex,
      transaction,
    );
    await seedRatings(queryInterface, memberIdsByEmail, completedTransactionIds, transaction);
  },

  async down(queryInterface, _Sequelize, transaction) {
    const options = { transaction };

    if (await hasTable(queryInterface, "ratings", transaction)) {
      await queryInterface.bulkDelete("ratings", {
        rating_id: ratings.map((rating) => rating.rating_id),
      }, options);
    }

    if (await hasTable(queryInterface, "book_transactions", transaction)) {
      await queryInterface.bulkDelete("book_transactions", {
        transaction_id: transactions.map((item) => item.transaction_id),
      }, options);
    }

    if (await hasTable(queryInterface, "messages", transaction)) {
      await queryInterface.bulkDelete("messages", {
        message_id: conversations.flatMap((conversation) => conversation.messages.map(([id]) => id)),
      }, options);
    }

    if (await hasTable(queryInterface, "conversations", transaction)) {
      await queryInterface.bulkDelete("conversations", {
        conversation_id: conversations.map((conversation) => conversation.conversation_id),
      }, options);
    }

    if (await hasTable(queryInterface, "deliverer_profiles", transaction)) {
      await queryInterface.bulkDelete("deliverer_profiles", {
        profile_id: delivererProfiles.map((profile) => profile.profile_id),
      }, options);
    }

    if (await hasTable(queryInterface, "point_histories", transaction)) {
      await queryInterface.bulkDelete("point_histories", {
        point_history_id: demoMembers.flatMap((_, index) => [
          uuid("91000000", index + 1),
          uuid("91000000", 1000 + (index + 1) * 10),
          uuid("91000000", 1000 + (index + 1) * 10 + 1),
          uuid("91000000", 1000 + (index + 1) * 10 + 2),
        ]),
      }, options);
    }

    await queryInterface.bulkDelete("book_copies", {
      copy_id: books.map((book) => book.copy_id),
    }, options);
    await queryInterface.bulkDelete("book_titles", {
      isbn: books.map((book) => book.isbn),
    }, options);
    await queryInterface.bulkDelete("members", {
      email: demoMembers.map((member) => member.email),
    }, options);
  },
};
