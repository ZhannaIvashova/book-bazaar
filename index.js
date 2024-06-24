// Recomendations
const booksAPI = 'https://api.example.com/books'; // Замените на реальный URL API
const carousel = document.getElementById('bookCarousel');
let currentIndex = 0;
let books = [];

// Функция для получения данных с API
async function fetchBooks() {
    try {
        const response = await fetch(booksAPI);
        books = await response.json();
        displayBooks();
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Функция для отображения книг в карусели
function displayBooks() {
    carousel.innerHTML = '';
    books.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('carousel-item');
        bookItem.innerHTML = `
            <div class="card" data-index="${index}">
                <img src="${book.cover}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">${book.author}</p>
                </div>
            </div>
        `;
        carousel.appendChild(bookItem);
    });
}

// Функции для управления каруселью
function showPrevBooks() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
}

function showNextBooks() {
    if (currentIndex < books.length - 3) {
        currentIndex++;
        updateCarousel();
    }
}

function updateCarousel() {
    const offset = -currentIndex * 33.33;
    carousel.style.transform = `translateX(${offset}%)`;
}

// События для кнопок управления
document.getElementById('prevBtn').addEventListener('click', showPrevBooks);
document.getElementById('nextBtn').addEventListener('click', showNextBooks);

// Событие для клика на книгу
carousel.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (card) {
        const index = card.dataset.index;
        showBookDetails(index);
    }
});

// Функция для отображения подробной информации о книге
function showBookDetails(index) {
    const book = books[index];
    // Логика для отображения страницы книги
    alert(`Title: ${book.title}\nAuthor: ${book.author}\nPrice: ${book.price}`);
}

// Инициализация
fetchBooks();
