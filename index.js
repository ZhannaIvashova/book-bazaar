// Recomendations
document.addEventListener('DOMContentLoaded', function () {
    const recommendationsApiUrl = 'https://www.googleapis.com/books/v1/volumes?q=subject:fiction';
    const discountsApiUrl = 'https://www.googleapis.com/books/v1/volumes?q=subject:fiction';
  
    const fetchBooks = (url, carouselId) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const carousel = document.getElementById(carouselId);
          const booksHtml = data.map(book => `
            <div class="carousel-item">
              <img src="${book.coverImage}" alt="${book.title}">
              <div class="book-info">
                <h5>${book.title}</h5>
                <p>${book.author}</p>
              </div>
            </div>
          `).join('');
          carousel.innerHTML = booksHtml;
        })
        .catch(error => console.error('Error fetching books:', error));
    };
  
    fetchBooks(recommendationsApiUrl, 'bookCarousel');
    fetchBooks(discountsApiUrl, 'discountCarousel');
  
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
  
    setupCarouselControls('prevBtn', 'nextBtn', 'bookCarousel');
    setupCarouselControls('discountPrevBtn', 'discountNextBtn', 'discountCarousel');
  });
  