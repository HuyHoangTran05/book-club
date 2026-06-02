const mojibakePattern = /(?:\u00c3|\u00c4[\u0080-\u00bf]|\u00c6[\u0080-\u00bf]|\u00c5[\u0080-\u00bf]|\u00e1[\u00ba\u00bb]|\u00ef\u00bf\u00bd)/;

const repairMojibake = (text) => {
  if (!mojibakePattern.test(text)) {
    return text;
  }

  try {
    const repaired = Buffer.from(text, "latin1").toString("utf8");
    return repaired.includes("\uFFFD") ? text : repaired;
  } catch (_error) {
    return text;
  }
};

export const toAsciiTitle = (text, wordLimit = 0) => {
  const ascii = repairMojibake(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[Đđ]/g, (letter) => (letter === "Đ" ? "D" : "d"))
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  if (!wordLimit) {
    return ascii;
  }

  return ascii.split(" ").slice(0, wordLimit).join(" ");
};

export const makeOpenLibraryCover = (isbn) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

const fallbackCoverPalettes = [
  ["0b4f3c", "f6e7c1"],
  ["1f3a5f", "f5d7a1"],
  ["5f243a", "f8d8e8"],
  ["3f3a1f", "f4e7b1"],
  ["263f5f", "dbeafe"],
  ["4b2e83", "ede9fe"],
  ["5f2f1f", "ffe3c2"],
  ["1f4f46", "d7f9e9"],
];

const hashText = (text) => [...text].reduce(
  (hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0,
  0,
);

export const makePlaceholderCover = (title, category = "") => {
  const text = toAsciiTitle(title, 5) || "Book Cover";
  const [background, foreground] = fallbackCoverPalettes[
    hashText(`${title}:${category}`) % fallbackCoverPalettes.length
  ];

  return `https://placehold.co/300x420/${background}/${foreground}?text=${encodeURIComponent(text).replace(/%20/g, "+")}`;
};

const openLibraryCoverIsbnsByTitle = new Map([
  ["Nha Gia Kim", "9780061122415"],
  ["Dac Nhan Tam", "9780671027032"],
  ["Clean Code", "9780132350884"],
  ["The Pragmatic Programmer", "9780201616224"],
  ["Introduction to Algorithms", "9780262033848"],
  ["Database System Concepts", "9780078022159"],
  ["Atomic Habits", "9780735211292"],
  ["Sapiens", "9780062316097"],
  ["Harry Potter va Hon Da Phu Thuy", "9780747532699"],
  ["Deep Learning", "9780262035613"],
  ["Python Crash Course", "9781593279288"],
  ["English Grammar in Use", "9781108457651"],
  ["Tu Duy Nhanh Va Cham", "9780374533557"],
  ["Design Patterns", "9780201633610"],
  ["Refactoring", "9780134757599"],
  ["Computer Networking A Top Down Approach", "9780133594140"],
  ["Operating System Concepts", "9781118063330"],
  ["Artificial Intelligence A Modern Approach", "9780136042594"],
  ["Designing Data Intensive Applications", "9781449373320"],
  ["The Design of Everyday Things", "9780465050659"],
  ["Don t Make Me Think", "9780321965516"],
  ["Zero to One", "9780804139298"],
  ["The Lean Startup", "9780307887894"],
  ["Start With Why", "9781591846444"],
  ["The Alchemist English Edition", "9780061122415"],
]);

const curatedCoverUrlsByTitle = new Map([
  ["1984", "https://covers.openlibrary.org/b/id/8745958-L.jpg"],
  ["Toi Thay Hoa Vang Tren Co Xanh", "https://covers.openlibrary.org/b/id/15095300-L.jpg"],
  ["Khong Gia Dinh", "https://covers.openlibrary.org/b/id/5754078-L.jpg"],
  ["Bo Gia", "https://covers.openlibrary.org/b/id/6507069-L.jpg"],
  ["Kafka Ben Bo Bien", "https://covers.openlibrary.org/b/id/4982600-L.jpg"],
  ["Sherlock Holmes", "https://covers.openlibrary.org/b/id/6717853-L.jpg"],
  ["Animal Farm", "https://covers.openlibrary.org/b/id/11261770-L.jpg"],
  ["The Great Gatsby", "https://covers.openlibrary.org/b/id/10590366-L.jpg"],
  ["To Kill a Mockingbird", "https://covers.openlibrary.org/b/id/14351077-L.jpg"],
  ["The Catcher in the Rye", "https://covers.openlibrary.org/b/id/9273490-L.jpg"],
  ["Pride and Prejudice", "https://covers.openlibrary.org/b/id/14348537-L.jpg"],
  ["Hooked", "https://covers.openlibrary.org/b/id/12511799-L.jpg"],
  ["Made to Stick", "https://covers.openlibrary.org/b/id/7004880-L.jpg"],
  ["Good to Great", "https://covers.openlibrary.org/b/id/53111-L.jpg"],
  ["Thinking in Systems", "https://covers.openlibrary.org/b/id/14420637-L.jpg"],
  ["Code Complete", "https://covers.openlibrary.org/b/id/461500-L.jpg"],
  ["Head First Design Patterns", "https://covers.openlibrary.org/b/id/388950-L.jpg"],
  ["JavaScript The Good Parts", "https://covers.openlibrary.org/b/id/9245523-L.jpg"],
  ["Pattern Recognition and Machine Learning", "https://covers.openlibrary.org/b/id/245089-L.jpg"],
  ["Hands On Machine Learning", "https://covers.openlibrary.org/b/id/9388208-L.jpg"],
  ["Data Science from Scratch", "https://covers.openlibrary.org/b/id/12672936-L.jpg"],
  ["Fluent Python", "https://covers.openlibrary.org/b/id/8743408-L.jpg"],
  ["Effective Java", "https://covers.openlibrary.org/b/id/1176573-L.jpg"],
  ["You Don t Know JS", "https://covers.openlibrary.org/b/id/8117575-L.jpg"],
  ["Eloquent JavaScript", "https://covers.openlibrary.org/b/id/7082166-L.jpg"],
  ["Learning React", "https://covers.openlibrary.org/b/id/10282783-L.jpg"],
  ["Node js Design Patterns", "https://covers.openlibrary.org/b/id/8513336-L.jpg"],
  ["SQL Antipatterns", "https://covers.openlibrary.org/b/id/8722157-L.jpg"],
  ["Fundamentals of Database Systems", "https://covers.openlibrary.org/b/id/3943051-L.jpg"],
  ["Data Warehouse Toolkit", "https://covers.openlibrary.org/b/id/301298-L.jpg"],
  ["The Phoenix Project", "https://covers.openlibrary.org/b/id/9151976-L.jpg"],
  ["The DevOps Handbook", "https://covers.openlibrary.org/b/id/10860557-L.jpg"],
  ["Site Reliability Engineering", "https://covers.openlibrary.org/b/id/9196682-L.jpg"],
  ["Cloud Native Patterns", "https://covers.openlibrary.org/b/id/8799497-L.jpg"],
  ["Kubernetes in Action", "https://covers.openlibrary.org/b/id/8509009-L.jpg"],
  ["Docker Deep Dive", "https://covers.openlibrary.org/b/id/10374157-L.jpg"],
  ["Grokking Algorithms", "https://covers.openlibrary.org/b/id/8512926-L.jpg"],
  ["Algorithms", "https://covers.openlibrary.org/b/id/8351316-L.jpg"],
  ["Competitive Programming", "https://covers.openlibrary.org/b/id/14688536-L.jpg"],
  ["Luoc Su Thoi Gian", "https://covers.openlibrary.org/b/id/6713820-L.jpg"],
  ["Cosmos", "https://covers.openlibrary.org/b/id/8283901-L.jpg"],
  ["Brief Answers to the Big Questions", "https://covers.openlibrary.org/b/id/8815165-L.jpg"],
  ["Homo Deus", "https://covers.openlibrary.org/b/id/8846275-L.jpg"],
  ["21 Lessons for the 21st Century", "https://covers.openlibrary.org/b/id/10108277-L.jpg"],
  ["Viet Nam Su Luoc", "https://covers.openlibrary.org/b/id/14813487-L.jpg"],
  ["Duong Xua May Trang", "https://covers.openlibrary.org/b/id/15207430-L.jpg"],
  ["Nhat Ky Dang Thuy Tram", "https://covers.openlibrary.org/b/id/7916667-L.jpg"],
  ["Mat Biec", "https://covers.openlibrary.org/b/id/13258074-L.jpg"],
  ["Cho Toi Xin Mot Ve Di Tuoi Tho", "https://covers.openlibrary.org/b/id/8967534-L.jpg"],
  ["Noi Buon Chien Tranh", "https://covers.openlibrary.org/b/id/824217-L.jpg"],
  ["Chi Pheo", "https://covers.openlibrary.org/b/id/8484392-L.jpg"],
]);

export const getOpenLibraryCoverIsbn = (title) =>
  openLibraryCoverIsbnsByTitle.get(toAsciiTitle(title));

export const getCuratedCoverUrl = (title) =>
  curatedCoverUrlsByTitle.get(toAsciiTitle(title));

export const makeBookCover = (title, category = "") => {
  const coverIsbn = getOpenLibraryCoverIsbn(title);
  if (coverIsbn) {
    return makeOpenLibraryCover(coverIsbn);
  }

  return getCuratedCoverUrl(title) ?? makePlaceholderCover(title, category);
};
