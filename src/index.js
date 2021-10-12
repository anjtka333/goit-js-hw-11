import './sass/main.scss';
import { fetchPictures } from './js/fetchPictures';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InfiniteScroll } from '../node_modules/infinite-scroll/js/index';

const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});
const axios = require('axios');
let num = 1;

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';
// let elem = document.querySelector('.container');
// let infScroll = new InfiniteScroll(elem, {
//   // options
//   path: '.pagination__next',
//   append: '.post',
//   history: false,
// });
const getSearchedResults = async e => {
  const requestName = searchForm.elements['searchQuery'].value;
  const result = await fetchPictures(requestName, num);
  if (result.hits.length === 0) {
    loadMoreBtn.style.display = 'none';
    return Notify.failure("We're sorry, but you've reached the end of search results.");
  } else {
    loadMoreBtn.style.display = 'inline-block';
  }
  if (result.total === 0) {
    loadMoreBtn.style.display = 'none';
    return console.log('Sorry, there are no images matching your search query. Please try again.');
  }
  if (num >= 2) {
    Notify.success(`Hooray! We found ${result.totalHits} images.`);
  }
  console.log(result);
  renderPictureListItems(result);
};

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  num = 1;
  getSearchedResults();
});

const slowScroll = () => {
  const { height: cardHeight } = document.querySelector('.gallery');
  console.log(document.querySelector('.gallery').offsetHeight);
  window.scrollBy({
    top: document.querySelector('.gallery').offsetHeight,
    behavior: 'smooth',
  });
};
const renderPictureListItems = async ({ hits }) => {
  let render = '';
  let sweecher = false;
  let counter = 0;
  for (let i = 0; i < hits.length; i++) {
    if (i % 4 === 0 && sweecher === true) {
      render += `</div>`;
      sweecher = false;
    }
    if (i % 4 === 0 && sweecher === false) {
      render += `<div class="row ">`;
      sweecher = true;
    }
    render += `<div class="photo-card card col-3 m-1 shadow-sm p-3 mb-5 bg-white rounded" style="width: 16rem;">
   <a class='card-img-top' href="${hits[i].largeImageURL}"> <img style="height: 200px;" 
   class='img-fluid img-thumbnail' src="${hits[i].webformatURL}" alt="${hits[i].tags}" loading="lazy" /></a>
    <div class="info card-body">
      <p class="info-item card-title">
        <b class= "card-text">Likes <span>${hits[i].likes}</span></b>
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
  // document.querySelectorAll('.img-thumbnail').style.height = "200px";
  lightbox.refresh();
  slowScroll();
};
loadMoreBtn.addEventListener('click', async e => {
  ++num;
  await getSearchedResults();
  console.log(num);
});
// document.addEventListener('scroll', () => {

// });
