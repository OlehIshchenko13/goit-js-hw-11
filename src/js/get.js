import Notiflix from 'notiflix';


const axios = require('axios').default;
const KEY = '29841815-11a861cc71d343152543274bc';

export async function fetchIMG(search, pageNumber) {
  const url = `https://pixabay.com/api/?key=${KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`;
  const imgs = await axios.get(url);
  if (!imgs.data.totalHits) {
    Notiflix.Notify.warning(
      'There are no images matching your search query.Try again.'
    );
    if (pageNumber === 1) {
      refs.gallery.innerHTML = '';
    }
    return;
  }
  if (imgs.data.totalHits / 40 < pageNumber) {
    Notiflix.Notify.warning(
      "You've reached the end of search results."
    );
    refs.gallery.removeEventListener('scroll', scrollEnd);
    return;
  }
  return imgs.data;
}