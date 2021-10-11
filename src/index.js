import './sass/main.scss';
import { fetchPictures } from './js/fetchPictures';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});
let num = 1;

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';
const getSearchedResults = async e => {
  const requestName = searchForm.elements['searchQuery'].value;
  const result = await fetchPictures(requestName, num);
  if (result.hits.length === 0) {
    loadMoreBtn.style.display = 'none';
    return Notify.failure("We're sorry, but you've reached the end of search results.");
  }
  if (result.total === 0) {
    loadMoreBtn.style.display = 'none';
    return console.log('Sorry, there are no images matching your search query. Please try again.');
  }
  console.log(result);

  renderPictureListItems(result);
};

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  num = 1;
  loadMoreBtn.style.display = 'inline-block';
  getSearchedResults();
});
const renderPictureListItems = async ({ hits }) => {
  let render = '';
  for (let i = 0; i < hits.length; i++) {
    render += `<div class="photo-card">
   <a href="${hits[i].webformatURL}"> <img src="${hits[i].largeImageURL}" alt="${hits[i].tags}" loading="lazy" /><a>
    <div class="info">
      <p class="info-item">
        <b>Likes <span>${hits[i].likes}</span></b>
      </p>
      <p class="info-item">
        <b>Views <span>${hits[i].views}</span></b>
      </p>
      <p class="info-item">
        <b>Comments <span>${hits[i].comments}</span></b>
      </p>
      <p class="info-item">
        <b>Downloads <span>${hits[i].downloads}</span></b>
      </p>
    </div>
  </div>`;
  }
  gallery.insertAdjacentHTML('beforeend', render);
};
loadMoreBtn.addEventListener('click', async e => {
  ++num;
  await getSearchedResults();
  console.log(num);
});
