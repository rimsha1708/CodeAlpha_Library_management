const addBook = () => {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const category = document.getElementById('bookCategory').value;

    if (title && author && category) {
        const book = { title, author, category, borrowed: false };
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
        displayBooks();
        clearInputs();
    } else {
        alert('Please fill out all fields');
    }
};

const searchBooks = () => {
    const query = document.getElementById('searchQuery').value.toLowerCase();
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
    );
    displayBooks(filteredBooks);

    if (filteredBooks.length === 0) {
        const bookList = document.getElementById('bookList');
        bookList.innerHTML = '<li class="no-books">No books found</li>';
    }
};

const displayBooks = (books = JSON.parse(localStorage.getItem('books')) || []) => {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    books.forEach((book, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${book.title} by ${book.author} - ${book.category} 
            ${book.borrowed ? '(Borrowed)' : '<button onclick="openBorrowModal(' + index + ')">Borrow</button>'}`;
        bookList.appendChild(li);
    });
};

const openBorrowModal = (index) => {
    const modal = document.getElementById('borrowModal');
    const borrowButton = document.getElementById('confirmBorrow');
    borrowButton.setAttribute('data-index', index);
    modal.style.display = 'block';
};

const closeBorrowModal = () => {
    const modal = document.getElementById('borrowModal');
    modal.style.display = 'none';
};

const confirmBorrow = () => {
    const index = document.getElementById('confirmBorrow').getAttribute('data-index');
    let books = JSON.parse(localStorage.getItem('books')) || [];
    if (!books[index].borrowed) {
        const borrowerName = document.getElementById('borrowerName').value;
        const borrowerPhone = document.getElementById('borrowerPhone').value;
        const borrowerEmail = document.getElementById('borrowerEmail').value;
        const borrowDate = document.getElementById('borrowDate').value;

        if (borrowerName && borrowerPhone && borrowerEmail && borrowDate) {
            books[index].borrowed = true;
            books[index].borrowerName = borrowerName;
            books[index].borrowerPhone = borrowerPhone;
            books[index].borrowerEmail = borrowerEmail;
            books[index].borrowDate = borrowDate;

            // Calculate return date (example: 14 days from borrow date)
            const returnDate = new Date(borrowDate);
            returnDate.setDate(returnDate.getDate() + 14); // 14 days return period
            books[index].returnDate = returnDate.toISOString().split('T')[0];

            let borrowingHistory = JSON.parse(localStorage.getItem('borrowingHistory')) || [];
            borrowingHistory.push(books[index]);
            localStorage.setItem('books', JSON.stringify(books));
            localStorage.setItem('borrowingHistory', JSON.stringify(borrowingHistory));
            displayBooks();
            displayBorrowingHistory();
            closeBorrowModal();
            alert(`Book borrowed successfully. Return by: ${books[index].returnDate}`);
        } else {
            alert('Please fill out all fields');
        }
    } else {
        alert('This book is already borrowed.');
    }
};

const displayBorrowingHistory = () => {
    const borrowingHistory = JSON.parse(localStorage.getItem('borrowingHistory')) || [];
    const borrowingHistoryList = document.getElementById('borrowingHistory');
    borrowingHistoryList.innerHTML = '';
    borrowingHistory.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${book.title} by ${book.author} - ${book.category} 
            (Borrowed by: ${book.borrowerName}, Return by: ${book.returnDate})`;
        borrowingHistoryList.appendChild(li);
    });
};

const clearInputs = () => {
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
    document.getElementById('bookCategory').value = '';
};

const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        searchBooks();
    }
};

const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
};

document.addEventListener('DOMContentLoaded', () => {
    displayBooks();
    displayBorrowingHistory();
});

window.onclick = function (event) {
    const modal = document.getElementById('borrowModal');
    if (event.target == modal) {
        closeBorrowModal();
    }
};
