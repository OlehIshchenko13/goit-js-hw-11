import './css/styles.css';
import { Gallery } from './js/get';
//LIB
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const lightbox = new SimpleLightbox('.gallery a', { });
const images = new Gallery();


const refs ={
    searchForm : document.querySelector("#search-form"),
    loadMoreBtn : document.querySelector('.load-more-btn'),
    theEndOfCollection : document.querySelector('.the-end'),
}


const gallery = document.querySelector('.gallery');


refs.searchForm.addEventListener("submit", onSubmit)
refs.loadMoreBtn.addEventListener('click', onloadMoreBtnClick);

function onSubmit(e) {
	e.preventDefault();

	images.searchQueryInput = e.target.elements.searchQuery.value.trim();

	images.page = 1;
	refs.loadMoreBtn.setAttribute('hidden', true);
	gallery.innerHTML = '';
	refs.theEndOfCollection.classList.add('is-hidden')

	

	images.getImages(images.searchQueryInput)
		.then(gallery => {

			if (!gallery) {
				throw new Error();
			}

			if (gallery.data.hits.length < 1) {
				gallery.innerHTML = '';
				return Notiflix.Notify.failure('There are no images matching your search query. Please try again.');
			}

			Notiflix.Notify.success(`Cooll! We found ${gallery.data.totalHits} images.`);
			getRendering(gallery.data.hits)
			lightbox.refresh();
			refs.loadMoreBtn.removeAttribute('hidden', false)
		}
		).catch(err => console.log(err));

	refs.searchForm.reset()
}


function getRendering(arr) {
	const murkap = arr.map(arr => {
		return `<div class="photo-card">
		<a href="${arr.largeImageURL}">
<img src="${arr.webformatURL}" alt="${arr.tags}" loading="lazy" width="300" height="150"/></a>
<div class="info">
  <p class="info-item">
  <b>Likes</b>
	${arr.likes}
  </p>
  <p class="info-item">
  <b>Views </b>
	 ${arr.views}
  </p>
  <p class="info-item">
  <b>Comments </b>
	 ${arr.comments}
  </p>
  <p class="info-item">
  <b>Downloads </b>
	 ${arr.downloads}
  </p>
</div>
</div>`
	}).join('');
	gallery.insertAdjacentHTML('beforeend', murkap)
}

function onloadMoreBtnClick() {
    
	images.pageIncrement();

	images.getImages(images.searchQueryInput)
		.then(gallery => {

			if (!gallery) {
				throw new Error();
			}

			if (images.page >= Math.ceil(gallery.data.totalHits / gallery.data.hits.length)) {
				refs.loadMoreBtn.setAttribute('hidden', true)
				refs.theEndOfCollection.classList.remove('is-hidden')
			}

			getRendering(gallery.data.hits)
			lightbox.refresh();
		}
		).catch(err => console.log(err));

}