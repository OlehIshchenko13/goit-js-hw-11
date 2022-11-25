import './css/styles.css';
import { fetchIMG } from './js/get';
//LIB
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


let searchParam;
let lightbox;
let pageNumber;

const refs ={
	form :  document.querySelector('#search-form'),
	gallery : document.querySelector('.gallery')
}



refs.form.addEventListener('submit', onSubmit);
refs.gallery.addEventListener('scroll', onScrollEnd);

async function onSubmit(e) {
  pageNumber = 1;
  refs.gallery.addEventListener('scroll', onScrollEnd);
  e.preventDefault();
  let {
    elements: { searchQuery },
  } = e.currentTarget;
  searchParam = searchQuery.value.replaceAll(' ', '+');
  const data = await fetchIMG(searchParam, pageNumber);
  if (data.totalHits) {
    Notiflix.Notify.success(` We found ${data.totalHits} images.`);
  }
  const rendered = await renderGallery(data.hits, pageNumber);
  refs.gallery.innerHTML = rendered.join('');
	 lightbox = new SimpleLightbox('.gallery .gallery-div a');
}

async function loadMore() {
  pageNumber += 1;
  const data = await fetchIMG(searchParam, pageNumber);
  const rendered = await renderGallery(data.hits, pageNumber);
  refs.gallery.innerHTML += rendered.join('');
  lightbox.refresh();
}

function onScrollEnd() {
  if (refs.gallery.scrollTop + refs.gallery.clientHeight >= refs.gallery.scrollHeight - 10) {
    loadMore();
  }
}
function renderGallery(array, pageNumber) {
	return array.map(
	  img =>
		`<div class="photo-card">
			<a class="gallery-link" href="${img.largeImageURL}"><img src="${img.webformatURL}" class="gallery-image" alt="${img.tags}" loading="lazy" /></a>
			<div class="info">
			  <p class="info-item">
				<b>Likes</b> ${img.likes}
			  </p>
			  <p class="info-item">
				<b>Views</b> ${img.views}
			  </p>
			  <p class="info-item">
				<b>Comments</b> ${img.comments}
			  </p>
			  <p class="info-item">
				<b>Downloads</b> ${img.downloads}
			  </p>
			</div>
		  </div>`
	);
  }