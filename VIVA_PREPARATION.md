# 🎓 VIVA PREPARATION - LIBRARY MANAGEMENT SYSTEM
## 10 Common Questions Your Instructor Will Ask

---

## ✅ QUESTION 1: "Remove the rating stars from the book cards"
**What sir wants:** He wants you to hide/remove the star rating display from BookCard component.

### SOLUTION:
**File:** `src/components/BookCard/BookCard.jsx`

**FIND THIS CODE (around line 97-100):**
```jsx
<div className={styles.footer}>
  <Rating value={book.rating} size="small" />
  <span className={styles.copies}>
```

**CHANGE TO:**
```jsx
<div className={styles.footer}>
  <span className={styles.copies}>
```

**ALSO REMOVE THE IMPORT at top (line 3):**
```jsx
import Rating from "../Rating";
```

---

## ✅ QUESTION 2: "Add a new field showing the book's publication year"
**What sir wants:** Display the year when the book was published on the book card.

### SOLUTION:
**File:** `src/components/BookCard/BookCard.jsx`

**FIND THIS CODE (around line 95-98):**
```jsx
<h3 className={styles.title}>{book.title}</h3>
<p className={styles.author}>by {book.author}</p>
<div className={styles.footer}>
```

**CHANGE TO:**
```jsx
<h3 className={styles.title}>{book.title}</h3>
<p className={styles.author}>by {book.author}</p>
<p className={styles.year}>Published: {book.publishedYear}</p>
<div className={styles.footer}>
```

---

## ✅ QUESTION 3: "Remove the hero section from home page"
**What sir wants:** Remove the entire top banner/hero section with the "Discover Your Next Great Read" heading.

### SOLUTION:
**File:** `src/pages/Home/Home.jsx`

**FIND THIS CODE (around line 46-90):**
```jsx
{/* Hero Section */}
<section className={styles.hero}>
  <div className={styles.heroContent}>
    ...entire hero section...
  </div>
</section>
```

**DELETE THE ENTIRE SECTION** or **COMMENT IT OUT:**
```jsx
{/* 
<section className={styles.hero}>
  ...
</section>
*/}
```

---

## ✅ QUESTION 4: "Change the navbar to show only 3 menu items instead of all"
**What sir wants:** Reduce navigation links in the navbar.

### SOLUTION:
**File:** `src/components/Navbar/Navbar.jsx`

**READ THE FILE FIRST, then find the navigation links section and remove unwanted ones.**

Example - Keep only: Home, Cart, Contact
Remove: Dashboard, About, etc.

---

## ✅ QUESTION 5: "Remove the responsive design - make it fixed width for desktop only"
**What sir wants:** Remove all media queries and make the layout fixed width (not mobile-friendly).

### SOLUTION:
**File:** `src/App.css` or component CSS files

**FIND ALL MEDIA QUERIES like:**
```css
@media (max-width: 768px) {
  /* mobile styles */
}
```

**DELETE or COMMENT OUT all media queries** throughout the CSS files.

**ALTERNATIVELY, set fixed width:**
```css
.app {
  max-width: 1200px;
  margin: 0 auto;
  min-width: 1200px; /* Force desktop width */
}
```

---

## ✅ QUESTION 6: "Show only 4 books in the featured section instead of all"
**What sir wants:** Limit the number of featured books displayed.

### SOLUTION:
**File:** `src/pages/Home/Home.jsx`

**FIND THIS CODE (around line 100-104):**
```jsx
<div className={styles.featuredGrid}>
  {featuredBooks.map((book) => (
    <BookCard key={book.id} book={book} />
  ))}
</div>
```

**CHANGE TO:**
```jsx
<div className={styles.featuredGrid}>
  {featuredBooks.slice(0, 4).map((book) => (
    <BookCard key={book.id} book={book} />
  ))}
</div>
```

---

## ✅ QUESTION 7: "Add a counter showing total books on the homepage"
**What sir wants:** Display the total number of books in the library.

### SOLUTION:
**File:** `src/pages/Home/Home.jsx`

**FIND SECTION HEADER (around line 94):**
```jsx
<div className={styles.sectionHeader}>
  <div className={styles.sectionTitle}>
    <Sparkles className={styles.sectionIcon} size={28} />
    <h2>Featured Books</h2>
  </div>
```

**CHANGE TO:**
```jsx
<div className={styles.sectionHeader}>
  <div className={styles.sectionTitle}>
    <Sparkles className={styles.sectionIcon} size={28} />
    <h2>Featured Books</h2>
    <span style={{marginLeft: '10px', fontSize: '16px', color: '#666'}}>
      (Total: {books.length} books)
    </span>
  </div>
```

---

## ✅ QUESTION 8: "Remove the wishlist (heart) button from book cards"
**What sir wants:** Remove the heart icon that adds books to wishlist.

### SOLUTION:
**File:** `src/components/BookCard/BookCard.jsx`

**FIND THIS CODE (around line 67-75):**
```jsx
<div className={styles.overlay}>
  <button
    className={`${styles.actionBtn} ${inWishlist ? styles.active : ""}`}
    onClick={handleWishlistClick}
    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
  >
    <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
  </button>
  {isAvailable && (
```

**CHANGE TO:**
```jsx
<div className={styles.overlay}>
  {isAvailable && (
```

**ALSO REMOVE the handleWishlistClick function and inWishlist variable (lines 23-30)**

---

## ✅ QUESTION 9: "Change the search to search only by title, not author"
**What sir wants:** Modify the search functionality to search book titles only.

### SOLUTION:
**File:** `src/pages/Home/Home.jsx`

**FIND THIS CODE (around line 27-35):**
```jsx
const filteredBooks = useMemo(() => {
  return books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });
}, [searchQuery, selectedGenre]);
```

**CHANGE TO:**
```jsx
const filteredBooks = useMemo(() => {
  return books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });
}, [searchQuery, selectedGenre]);
```

---

## ✅ QUESTION 10: "Remove the loading spinner and show content immediately"
**What sir wants:** Remove the loading state and display books right away.

### SOLUTION:
**File:** `src/pages/Home/Home.jsx`

**FIND THIS CODE (around line 14-22):**
```jsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  // Simulate loading
  const timer = setTimeout(() => setIsLoading(false), 800);
  return () => clearTimeout(timer);
}, []);
```

**CHANGE TO:**
```jsx
const [isLoading, setIsLoading] = useState(false);

// Remove or comment out the useEffect
// useEffect(() => {
//   const timer = setTimeout(() => setIsLoading(false), 800);
//   return () => clearTimeout(timer);
// }, []);
```

---

## 🎯 VIVA TIPS:

### **WHEN SIR ASKS YOU TO MODIFY:**
1. **Stay calm** - these are easy changes
2. **Ask which file** - if unsure, ask "Should I modify the BookCard component or Home page?"
3. **Use Ctrl+F** - to quickly find the code section
4. **Explain what you're doing** - "I'll open BookCard.jsx and remove the Rating import and component"
5. **Save and show** - Make the change, save (Ctrl+S), and refresh browser to show result

### **COMMON INSTRUCTOR PATTERNS:**
- "Remove this feature" → Usually means comment out or delete specific component/code
- "Add this information" → Add a new line/element displaying data
- "Change the layout" → Modify CSS grid/flex properties
- "Filter/limit the results" → Use `.slice()` or modify `.filter()` conditions
- "Remove responsive design" → Delete media queries in CSS

### **QUICK COMMANDS TO KNOW:**
- **Find in file:** Ctrl+F
- **Find in all files:** Ctrl+Shift+F
- **Save file:** Ctrl+S
- **Comment code:** Ctrl+/ (or Ctrl+K Ctrl+C)
- **Undo:** Ctrl+Z

### **IF YOU GET STUCK:**
- Don't panic - ask sir to clarify which component
- Most changes are in: `Home.jsx`, `BookCard.jsx`, or CSS files
- Look for the visual element he's pointing to
- 90% of changes are just commenting out code or changing a number

---

## 🚀 LAST MINUTE CHECKLIST:

✅ Know where your main files are:
- `src/App.jsx` - Main app structure
- `src/pages/Home/Home.jsx` - Homepage
- `src/components/BookCard/BookCard.jsx` - Book display cards
- `src/components/Navbar/Navbar.jsx` - Navigation

✅ Understand these concepts:
- `.map()` - loops through arrays to display items
- `.filter()` - filters items based on conditions
- `.slice(0, 4)` - limits array to first 4 items
- `useState` - manages component state
- CSS modules - styles are in `.module.css` files

✅ Be ready to:
- Add/remove imports
- Comment out sections
- Change numbers (limits, sizes)
- Modify filter conditions
- Add/remove CSS properties

---

## 💪 YOU GOT THIS!

Remember: Your instructor just wants to see that you understand the code structure and can make basic modifications. These are all simple changes - you just need to stay calm and follow the patterns above!

**GOOD LUCK! 🎓**
