const btnSearch = document.querySelector('.btn-search');
const userInput = document.getElementById('user-input');
const main = document.querySelector('main');
const cards = document.querySelector('.cards');
const errorRequest = document.querySelector('.error-request');
const headerTitle = document.querySelector('.header-wrapper__title');
const basket = document.querySelector('.basket');
const recommendations = document.querySelector('.recommendations');
const discount = document.querySelector('.discount');
const newBooks = document.querySelector('.new');
const footer = document.querySelector('footer');

const patternUrl = /^https:\/\/covers\.openlibrary\.org\/b\/isbn\/([a-z0-9]+)-([A-Z])\.jpg/i;

const max = 300;
const min = 100;


//Общая сумма к оплате
const getTotalSum = (newPrice, oldPrice) => Number(newPrice) + Number(oldPrice);

//Отображение html-страницы корзины
function displayBasket(url, title, author, price) {
    const basketWrapper = document.querySelector('.basket-wrapper');
    const totalSum = document.querySelector('.total-sum');
    
    const number = getTotalSum(price, totalSum.textContent);
    
    const basketCard = document.createElement('div');
    const basketBookPoster = document.createElement('img');
    const basketBookInfo = document.createElement('div');
    const basketBookTitle = document.createElement('h3');
    const basketBookAuthor = document.createElement('div');
    const basketBookPrice = document.createElement('div');

    basketCard.classList.add('basket-card');
    basketBookPoster.classList.add('basket-poster');
    basketBookInfo.classList.add('basket-info')
    basketBookPrice.classList.add('basket-price');

    basketBookPoster.setAttribute('src', url);

    basketBookTitle.textContent = title;
    basketBookAuthor.innerHTML = '<span class="highlight">Автор: </span>' + author;
    basketBookPrice.innerHTML = 'Цена: ' + price + ' $';
    totalSum.textContent = number;

    basketBookInfo.appendChild(basketBookTitle);
    basketBookInfo.appendChild(basketBookAuthor);
    basketCard.appendChild(basketBookPoster);
    basketCard.appendChild(basketBookInfo);
    basketCard.appendChild(basketBookPrice);

    basketWrapper.appendChild(basketCard);
}

//Отображение html-страницы отфильтрованных книг
async function displayFilterBooks(title, author, publishYyear, publishPlace, urlPoster, price) {
    const bookCard = document.createElement('div');
    const bookTitle = document.createElement('h3');
    const bookAuthor = document.createElement('div');
    const bookPublish = document.createElement('div');
    const bookPoster = document.createElement('img');
    const bookPrice = document.createElement('div');
    const btnBuy = document.createElement('button');

    bookCard.classList.add('card');
    bookPoster.classList.add('img-poster');
    bookPrice.classList.add('book-price');
    btnBuy.classList.add('btn-buy');

    //Обработчик события для кнопки 'В корзину'
    btnBuy.addEventListener('click', () => {
        displayBasket(bookPoster.src, title, author, price)
    })

    bookTitle.textContent = title;
    bookAuthor.innerHTML = '<span class="highlight">Автор: </span>' + author;
    bookPublish.innerHTML = '<span class="highlight">Публикация: </span>' + (!publishPlace ? publishYyear + ' г.' : [publishYyear + ' г.' + ' ' + publishPlace]);
    bookPrice.textContent = 'Цена: ' + price + '$';
    btnBuy.textContent = 'Купить';

    //Если в urlPoster приходит null - беру дефолтную обложку
    if (!urlPoster) {
        bookPoster.setAttribute('src', './assets/images/default-cover.jpg')
    } else {
        bookPoster.setAttribute('src', urlPoster)
    }

    bookTitle.textContent = title;
    bookAuthor.innerHTML = '<span class="highlight">Автор: </span>' + author;
    bookPublish.innerHTML = '<span class="highlight">Публикация: </span>' + (!publishPlace ? publishYyear + ' г.' : [publishYyear + ' г.'  + ' ' + publishPlace]);
    bookPrice.textContent = 'Цена: ' + price + '$';
    btnBuy.textContent = 'В корзину';

    bookCard.appendChild(bookPoster);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(bookPublish);
    bookCard.appendChild(bookPrice);
    bookCard.appendChild(btnBuy);

    cards.appendChild(bookCard);
}

//Получаю рендомную цену
const getPrice = () => Math.floor(Math.random() * (max - min + 1) + min);

//Получаю url обложки или null (делаю проверку на соответствие региксу)
async function getURLPoster(number) {
    const response = await fetch(`https://covers.openlibrary.org/b/isbn/${number}-M.jpg`)
    return !patternUrl.test(response.url) ? response.url : null
}

//Событие по клику на кнопку "Поиск"
btnSearch.addEventListener('click', async function () {
    const loader = document.querySelector('.loader');
    
    basket.classList.add('basket-hidden');
    loader.classList.remove('loader-hidden');
    recommendations.classList.add('hidden');
    discount.classList.add('hidden');
    newBooks.classList.add('hidden');
    footer.classList.add('hidden');

    cards.innerHTML = '';
    errorRequest.innerHTML = '';

    try {
        const response = await fetch('https://openlibrary.org/search.json?author=' + userInput.value + '&sort=new');
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        const data = await response.json();
        const dataArray = data.docs;

        if (dataArray.length === 0) {
            throw new Error('Нет результатов для данного автора');
        }

        let count = 0;
        for (let book of dataArray) {
            if (count > 19) break;

            //проверка на то что ключ isbn есть в объекте book
            const urlPoster = 'isbn' in book ? await getURLPoster(book.isbn[0]) : null;

            const price = getPrice()

            loader.classList.add('loader-hidden');
            main.classList.remove('main-hidden');
            footer.classList.remove('hidden');

            await displayFilterBooks(
                book.title, book.author_name, book.publish_year, 
                book.publish_place, urlPoster, price)

            count++;
        }
    }
    catch (error) {
        console.log('Ошибка при получении данных:', error.message);

        loader.classList.add('loader-hidden');
        main.classList.remove('main-hidden');
        errorRequest.classList.remove('error-request-hidden');
        errorRequest.textContent = 'Сервер временно не доступен/ такого автора нет';
    }
    finally {
        console.log('>>>', 'Процесс завершен');
    }
})

//Событие по клику на вкладку "Корзина"
document.querySelector('.item-basket').addEventListener('click', () => {
    main.classList.add('main-hidden');
    basket.classList.remove('basket-hidden');
    recommendations.classList.add('hidden');
    discount.classList.add('hidden');
    newBooks.classList.add('hidden');
    footer.classList.remove('hidden');
})

//Функция переключения видимости блоков, находясь во вкладке "Фильтр"/"Корзина"
function toggleVisibility() {
    main.classList.add('main-hidden');
    basket.classList.add('basket-hidden');
    recommendations.classList.remove('hidden');
    discount.classList.remove('hidden');
    newBooks.classList.remove('hidden');
    footer.classList.remove('hidden');
}

//Событие по клику на вкладку "Новинки"
document.querySelector('.item-new').addEventListener('click', () => {
    toggleVisibility();
})

//Событие по клику на вкладку "Рекомендации"
document.querySelector('.item-recommendation').addEventListener('click', () => {
    toggleVisibility();
})

//Событие по клику на вкладку "Контакты"
document.querySelector('.item-contact').addEventListener('click', () => {
    toggleVisibility();
})

//Клик на Лого bookBazaar в header возвращат на основную страницу
headerTitle.addEventListener('click', function () {
    userInput.value = '';
    cards.innerHTML = '';
    errorRequest.innerHTML = '';

    main.classList.add('main-hidden');
    basket.classList.add('basket-hidden');
    recommendations.classList.remove('hidden');
    discount.classList.remove('hidden');
    newBooks.classList.remove('hidden');
})

// Recomendations
document.addEventListener('DOMContentLoaded', function () {
    const recommendationsApiUrl = 'https://www.googleapis.com/books/v1/volumes?q=subject:fiction';
    const discountsApiUrl = 'https://www.googleapis.com/books/v1/volumes?q=subject:fiction';
    const newsApiUrl = 'https://www.googleapis.com/books/v1/volumes?q=subject:fiction';

    const fetchBooks = (url, carouselId) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const carousel = document.getElementById(carouselId);
                const booksHtml = data.items.map(item => {
                    const book = item.volumeInfo;
                    const coverImage = book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x192.png?text=No+Image';
                    return `
                  <div class="carousel-item" data-id="${item.id}" data-carousel="${carouselId}">
                      <img src="${coverImage}" alt="${book.title}">
                      <div class="book-info">
                          <h5>${book.title}</h5>
                          <p>${book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
                      </div>
                  </div>
              `;
                }).join('');
                carousel.innerHTML = booksHtml;
                addCarouselEventListeners(carouselId); // Adding event listeners after the books are loaded
            })
            .catch(error => console.error('Error fetching books:', error));
    };

    const addCarouselEventListeners = (carouselId) => {
        const carousel = document.getElementById(carouselId);
        carousel.querySelectorAll('.carousel-item').forEach(item => {
            item.addEventListener('click', () => {
                showBookDetails(item.dataset.id, carouselId); // Passing carouselId to showBookDetails
            });
        });
    };

    const showBookDetails = (bookId, carouselId) => {
        const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const book = data.volumeInfo;
                const coverImage = book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x192.png?text=No+Image';
                const bookDetailsHtml = `
                  <div class="book-details">
                      <img src="${coverImage}" alt="${book.title}">
                      <div class="info">
                          <h2>${book.title}</h2>
                          <p>${book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
                          <p>${book.description}</p>
                          <button onclick="addToCart('${bookId}')">В корзину</button>
                      </div>
                  </div>
              `;
                const detailsContainer = document.createElement('div');
                detailsContainer.innerHTML = bookDetailsHtml;
                const carouselContainer = document.getElementById(carouselId).parentElement;
                carouselContainer.innerHTML = ''; // Clear the carousel
                carouselContainer.appendChild(detailsContainer); // Display the book details
            })
            .catch(error => console.error('Error fetching book details:', error));
    };

    const addToCart = (bookId) => {
        // Logic to add the book to the cart and store in local storage
        console.log(`Adding book with ID ${bookId} to cart`);
    };

    const setupCarouselControls = (prevBtnId, nextBtnId, carouselId) => {
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const carousel = document.getElementById(carouselId);

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
        });
    };

    fetchBooks(recommendationsApiUrl, 'bookCarousel');
    fetchBooks(discountsApiUrl, 'discountCarousel');
    fetchBooks(newsApiUrl, 'newCarousel');

    setupCarouselControls('prevBtn', 'nextBtn', 'bookCarousel');
    setupCarouselControls('discountPrevBtn', 'discountNextBtn', 'discountCarousel');
    setupCarouselControls('newPrevBtn', 'newNextBtn', 'newCarousel');
});
