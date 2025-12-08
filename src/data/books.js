import { AVAILABILITY_STATUS } from "../utils/constants";

export const books = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    isbn: "978-0525559474",
    publisher: "Viking",
    publicationYear: 2020,
    pageCount: 304,
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    description:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
    totalCopies: 5,
    availableCopies: 3,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.5,
    reviews: [
      {
        id: "r1",
        user: "BookLover42",
        rating: 5,
        comment:
          "A beautiful exploration of life choices and regrets. Absolutely loved it!",
        date: "2024-01-15",
      },
      {
        id: "r2",
        user: "ReaderJane",
        rating: 4,
        comment: "Thought-provoking and emotional. A must-read!",
        date: "2024-02-20",
      },
    ],
    isFeatured: true,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    isbn: "978-0735211292",
    publisher: "Avery",
    publicationYear: 2018,
    pageCount: 320,
    coverImage:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
    description:
      "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    totalCopies: 8,
    availableCopies: 5,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.8,
    reviews: [
      {
        id: "r3",
        user: "ProductivityGuru",
        rating: 5,
        comment: "Life-changing! The 1% improvement concept is brilliant.",
        date: "2024-03-10",
      },
      {
        id: "r4",
        user: "SelfImprover",
        rating: 5,
        comment: "Clear, actionable advice. Highly recommend!",
        date: "2024-03-15",
      },
    ],
    isFeatured: true,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Science",
    isbn: "978-0593135204",
    publisher: "Ballantine Books",
    publicationYear: 2021,
    pageCount: 496,
    coverImage:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop",
    description:
      "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the Earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.",
    totalCopies: 4,
    availableCopies: 1,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.9,
    reviews: [
      {
        id: "r5",
        user: "SciFiFan",
        rating: 5,
        comment: "Even better than The Martian! Incredible story.",
        date: "2024-02-28",
      },
    ],
    isFeatured: true,
    isNewArrival: true,
    expectedReturnDate: null,
  },
  {
    id: "4",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Non-Fiction",
    isbn: "978-0857197689",
    publisher: "Harriman House",
    publicationYear: 2020,
    pageCount: 256,
    coverImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
    description:
      "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Money—investing, personal finance, and business decisions—is typically taught as a math-based field. But the author shares 19 short stories exploring the strange ways people think about money.",
    totalCopies: 6,
    availableCopies: 4,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.6,
    reviews: [
      {
        id: "r6",
        user: "FinanceNerd",
        rating: 5,
        comment: "A fresh perspective on wealth and money management.",
        date: "2024-01-25",
      },
      {
        id: "r7",
        user: "InvestorMike",
        rating: 4,
        comment: "Great insights, easy to read.",
        date: "2024-02-10",
      },
    ],
    isFeatured: false,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "5",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Fantasy",
    isbn: "978-0441172719",
    publisher: "Ace",
    publicationYear: 1965,
    pageCount: 688,
    coverImage:
      "https://images.unsplash.com/photo-1509266272358-7701da638078?w=400&h=600&fit=crop",
    description:
      'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
    totalCopies: 3,
    availableCopies: 0,
    status: AVAILABILITY_STATUS.BORROWED,
    rating: 4.7,
    reviews: [
      {
        id: "r8",
        user: "ClassicReader",
        rating: 5,
        comment: "A masterpiece of science fiction!",
        date: "2024-03-01",
      },
    ],
    isFeatured: true,
    isNewArrival: false,
    expectedReturnDate: "2024-12-15",
  },
  {
    id: "6",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Mystery",
    isbn: "978-1250301697",
    publisher: "Celadon Books",
    publicationYear: 2019,
    pageCount: 336,
    coverImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    description:
      "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
    totalCopies: 5,
    availableCopies: 2,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.4,
    reviews: [
      {
        id: "r9",
        user: "ThrillerLover",
        rating: 5,
        comment: "Couldn't put it down! The twist at the end is incredible.",
        date: "2024-02-05",
      },
      {
        id: "r10",
        user: "MysteryFan",
        rating: 4,
        comment: "Gripping psychological thriller.",
        date: "2024-02-18",
      },
    ],
    isFeatured: false,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "7",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "Science",
    isbn: "978-0553380163",
    publisher: "Bantam",
    publicationYear: 1988,
    pageCount: 212,
    coverImage:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop",
    description:
      "A landmark volume in science writing by one of the great minds of our time, Stephen Hawking's book explores such profound questions as: How did the universe begin—and what made its start possible? Does time always flow forward? Is the universe unending—or are there boundaries?",
    totalCopies: 4,
    availableCopies: 3,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.5,
    reviews: [
      {
        id: "r11",
        user: "ScienceGeek",
        rating: 5,
        comment: "Makes complex concepts accessible. Brilliant!",
        date: "2024-01-30",
      },
    ],
    isFeatured: false,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "8",
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Technology",
    isbn: "978-0132350884",
    publisher: "Prentice Hall",
    publicationYear: 2008,
    pageCount: 464,
    coverImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=600&fit=crop",
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way.",
    totalCopies: 6,
    availableCopies: 4,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.6,
    reviews: [
      {
        id: "r12",
        user: "DevMaster",
        rating: 5,
        comment: "Essential reading for every programmer!",
        date: "2024-03-05",
      },
      {
        id: "r13",
        user: "CodeNinja",
        rating: 4,
        comment: "Great principles, though some examples are dated.",
        date: "2024-03-12",
      },
    ],
    isFeatured: true,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "9",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "History",
    isbn: "978-0062316097",
    publisher: "Harper",
    publicationYear: 2015,
    pageCount: 464,
    coverImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
    description:
      'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be "human."',
    totalCopies: 5,
    availableCopies: 2,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.7,
    reviews: [
      {
        id: "r14",
        user: "HistoryBuff",
        rating: 5,
        comment: "A fascinating journey through human history!",
        date: "2024-02-22",
      },
    ],
    isFeatured: false,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "10",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    isbn: "978-0743273565",
    publisher: "Scribner",
    publicationYear: 1925,
    pageCount: 180,
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    description:
      "The Great Gatsby, F. Scott Fitzgerald's third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    totalCopies: 7,
    availableCopies: 5,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.4,
    reviews: [
      {
        id: "r15",
        user: "ClassicsLover",
        rating: 5,
        comment: "Timeless classic. Beautiful prose.",
        date: "2024-01-18",
      },
      {
        id: "r16",
        user: "LitStudent",
        rating: 4,
        comment: "Required reading that's actually good!",
        date: "2024-02-08",
      },
    ],
    isFeatured: false,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "11",
    title: "Becoming",
    author: "Michelle Obama",
    genre: "Biography",
    isbn: "978-1524763138",
    publisher: "Crown",
    publicationYear: 2018,
    pageCount: 448,
    coverImage:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    description:
      "In a life filled with meaning and accomplishment, Michelle Obama has emerged as one of the most iconic and compelling women of our era. As First Lady of the United States of America, she helped create the most welcoming and inclusive White House in history.",
    totalCopies: 4,
    availableCopies: 1,
    status: AVAILABILITY_STATUS.RESERVED,
    rating: 4.8,
    reviews: [
      {
        id: "r17",
        user: "InspiredReader",
        rating: 5,
        comment: "Inspiring and beautifully written memoir.",
        date: "2024-03-08",
      },
    ],
    isFeatured: false,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "12",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    genre: "Fiction",
    isbn: "978-0735219090",
    publisher: "G.P. Putnam's Sons",
    publicationYear: 2018,
    pageCount: 384,
    coverImage:
      "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
    description:
      'For years, rumors of the "Marsh Girl" haunted Barkley Cove, a quiet fishing village. Kya Clark is barefoot and wild; unfit for polite society. So in late 1969, when the popular Chase Andrews is found dead, locals immediately suspect her.',
    totalCopies: 6,
    availableCopies: 3,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.6,
    reviews: [
      {
        id: "r18",
        user: "NatureLover",
        rating: 5,
        comment: "Beautiful story with vivid nature descriptions.",
        date: "2024-02-14",
      },
      {
        id: "r19",
        user: "BookClubMember",
        rating: 4,
        comment: "Perfect for book club discussions!",
        date: "2024-02-25",
      },
    ],
    isFeatured: true,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "13",
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    genre: "Technology",
    isbn: "978-0135957059",
    publisher: "Addison-Wesley",
    publicationYear: 2019,
    pageCount: 352,
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=600&fit=crop",
    description:
      "The Pragmatic Programmer is one of those rare tech books you'll read, re-read, and read again over the years. Whether you're new to the field or an experienced practitioner, you'll come away with fresh insights each and every time.",
    totalCopies: 3,
    availableCopies: 2,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.7,
    reviews: [
      {
        id: "r20",
        user: "SeniorDev",
        rating: 5,
        comment: "Timeless wisdom for software developers.",
        date: "2024-03-18",
      },
    ],
    isFeatured: false,
    isNewArrival: true,
    expectedReturnDate: null,
  },
  {
    id: "14",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    isbn: "978-0141439518",
    publisher: "Penguin Classics",
    publicationYear: 1813,
    pageCount: 432,
    coverImage:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
    description:
      'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work "her own darling child" and its vivacious heroine, Elizabeth Bennet, "as delightful a creature as ever appeared in print."',
    totalCopies: 5,
    availableCopies: 4,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.8,
    reviews: [
      {
        id: "r21",
        user: "RomanceReader",
        rating: 5,
        comment: "The original enemies-to-lovers! Timeless.",
        date: "2024-01-22",
      },
      {
        id: "r22",
        user: "AustenFan",
        rating: 5,
        comment: "Perfect wit and social commentary.",
        date: "2024-02-12",
      },
    ],
    isFeatured: false,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "15",
    title: "The Very Hungry Caterpillar",
    author: "Eric Carle",
    genre: "Children",
    isbn: "978-0399226908",
    publisher: "Philomel Books",
    publicationYear: 1969,
    pageCount: 26,
    coverImage:
      "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400&h=600&fit=crop",
    description:
      "THE all-time classic picture book, from generation to generation, sold somewhere in the world every 30 seconds! A beautiful story of transformation, growth, and the wonder of nature.",
    totalCopies: 8,
    availableCopies: 6,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.9,
    reviews: [
      {
        id: "r23",
        user: "ParentReader",
        rating: 5,
        comment: "My kids love this book! We read it every night.",
        date: "2024-03-02",
      },
    ],
    isFeatured: false,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "16",
    title: "Educated",
    author: "Tara Westover",
    genre: "Biography",
    isbn: "978-0399590504",
    publisher: "Random House",
    publicationYear: 2018,
    pageCount: 352,
    coverImage:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    description:
      "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education.",
    totalCopies: 4,
    availableCopies: 2,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.7,
    reviews: [
      {
        id: "r24",
        user: "MemoirLover",
        rating: 5,
        comment: "Incredible story of resilience and self-discovery.",
        date: "2024-02-28",
      },
    ],
    isFeatured: false,
    isNewArrival: true,
    expectedReturnDate: null,
  },
  {
    id: "17",
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    isbn: "978-0062315007",
    publisher: "HarperOne",
    publicationYear: 1988,
    pageCount: 208,
    coverImage:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined.",
    totalCopies: 6,
    availableCopies: 4,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.5,
    reviews: [
      {
        id: "r25",
        user: "Dreamer",
        rating: 5,
        comment: "A beautiful journey of self-discovery.",
        date: "2024-01-28",
      },
      {
        id: "r26",
        user: "Philosopher",
        rating: 4,
        comment: "Thought-provoking with timeless wisdom.",
        date: "2024-02-15",
      },
    ],
    isFeatured: true,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "18",
    title: "Design Patterns",
    author: "Gang of Four",
    genre: "Technology",
    isbn: "978-0201633610",
    publisher: "Addison-Wesley",
    publicationYear: 1994,
    pageCount: 416,
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=600&fit=crop",
    description:
      "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.",
    totalCopies: 3,
    availableCopies: 1,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.4,
    reviews: [
      {
        id: "r27",
        user: "ArchitectDev",
        rating: 5,
        comment: "The bible of software design patterns.",
        date: "2024-03-10",
      },
    ],
    isFeatured: false,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "19",
    title: "1984",
    author: "George Orwell",
    genre: "Fiction",
    isbn: "978-0451524935",
    publisher: "Signet Classic",
    publicationYear: 1949,
    pageCount: 328,
    coverImage:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    description:
      "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real. Published in 1949, the book offers political satirist George Orwell's nightmarish vision of a totalitarian, bureaucratic world.",
    totalCopies: 5,
    availableCopies: 3,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.6,
    reviews: [
      {
        id: "r28",
        user: "DystopiaFan",
        rating: 5,
        comment: "More relevant today than ever.",
        date: "2024-02-20",
      },
      {
        id: "r29",
        user: "ClassicReader",
        rating: 5,
        comment: "A chilling masterpiece.",
        date: "2024-03-05",
      },
    ],
    isFeatured: false,
    isNewArrival: false,
    expectedReturnDate: null,
  },
  {
    id: "20",
    title: "The Art of War",
    author: "Sun Tzu",
    genre: "History",
    isbn: "978-1590302255",
    publisher: "Shambhala",
    publicationYear: -500,
    pageCount: 273,
    coverImage:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=600&fit=crop",
    description:
      "The Art of War is an ancient Chinese military treatise dating from the Late Spring and Autumn Period. The work, which is attributed to the ancient Chinese military strategist Sun Tzu, is composed of 13 chapters.",
    totalCopies: 4,
    availableCopies: 3,
    status: AVAILABILITY_STATUS.AVAILABLE,
    rating: 4.5,
    reviews: [
      {
        id: "r30",
        user: "StrategyBuff",
        rating: 5,
        comment: "Timeless principles applicable to business and life.",
        date: "2024-01-15",
      },
    ],
    isFeatured: false,
    isNewArrival: true,
    expectedReturnDate: null,
  },
];

export const getBookById = (id) => books.find((book) => book.id === id);

export const getBooksByGenre = (genre) => {
  if (genre === "All") return books;
  return books.filter((book) => book.genre === genre);
};

export const searchBooks = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery)
  );
};

export const getFeaturedBooks = () => books.filter((book) => book.isFeatured);

export const getNewArrivals = () => books.filter((book) => book.isNewArrival);

export const getAvailableBooks = () =>
  books.filter(
    (book) =>
      book.status === AVAILABILITY_STATUS.AVAILABLE && book.availableCopies > 0
  );
