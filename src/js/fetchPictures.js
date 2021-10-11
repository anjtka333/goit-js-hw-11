import { num } from '../index';
export const fetchPictures = async (requestName, num) => {
  num = num;
  const response = await fetch(
    `https://pixabay.com/api/?key=23779410-abe809331958b49ace969e642&q=${requestName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${num}`,
  );
  if (response.status >= 200 && response.status < 300) {
    const users = await response.json();
    return users;
  } else return Promise.reject('Requst error');
};

// fetchPictures().then(requestName => console.log(requestName));