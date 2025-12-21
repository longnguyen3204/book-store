const img = (file) => new URL(`../assets/images/${file}`, import.meta.url).href

export const heroSlides = [
  {
    title: 'Life of the Wild',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu feugiat amet, libero ipsum enim pharetra hac. Urna commodo, lacus ut magna velit eleifend. Amet, quis urna, a eu.',
    image: img('main-banner1.jpg'),
  },
  {
    title: 'Birds gonna be Happy',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu feugiat amet, libero ipsum enim pharetra hac. Urna commodo, lacus ut magna velit eleifend. Amet, quis urna, a eu.',
    image: img('main-banner2.jpg'),
  },
]

export const clientLogos = [
  img('client-image1.png'),
  img('client-image2.png'),
  img('client-image3.png'),
  img('client-image4.png'),
  img('client-image5.png'),
]

export const featuredBooks = [
  {
     id: 1,
    title: 'Simple way of piece life',
    author: 'Armor Ramsey',
    price: '$ 40.00',
    image: img('product-item1.jpg'),
  },
  {
     id: 2,
    title: 'Great travel at desert',
    author: 'Sanchit Howdy',
    price: '$ 38.00',
    image: img('product-item2.jpg'),
  },
  {
     id: 3,
    title: 'The lady beauty Scarlett',
    author: 'Arthur Doyle',
    price: '$ 45.00',
    image: img('product-item3.jpg'),
  },
  {
     id: 4,
    title: 'Once upon a time',
    author: 'Klien Marry',
    price: '$ 35.00',
    image: img('product-item4.jpg'),
  },
]

export const bestSelling = {
  title: 'Best Selling Book',
  author: 'By Timbur Hood',
  bookTitle: 'Birds gonna be happy',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu feugiat amet, libero ipsum enim pharetra hac.',
  price: '$ 45.00',
  image: img('single-image.jpg'),
}

export const popularBooks = {
  'all-genre': [
    { id:10, title: 'Portrait photography', author: 'Adam Silber', price: '$ 40.00', image: img('tab-item1.jpg') },
    { id:11, title: 'Once upon a time', author: 'Klien Marry', price: '$ 35.00', image: img('tab-item2.jpg') },
    { id:12, title: 'Tips of simple lifestyle', author: 'Bratt Smith', price: '$ 40.00', image: img('tab-item3.jpg') },
    { id:13, title: 'Just felt from outside', author: 'Nicole Wilson', price: '$ 40.00', image: img('tab-item4.jpg') },
    { id:14, title: 'Peaceful Enlightment', author: 'Marmik Lama', price: '$ 40.00', image: img('tab-item5.jpg') },
    { id:15, title: 'Great travel at desert', author: 'Sanchit Howdy', price: '$ 40.00', image: img('tab-item6.jpg') },
    { id:16, title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item7.jpg') },
    { id:17, title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item8.jpg') },
  ],
  business: [
    { id:18, title: 'Peaceful Enlightment', author: 'Marmik Lama', price: '$ 40.00', image: img('tab-item2.jpg') },
    { id:19, title: 'Great travel at desert', author: 'Sanchit Howdy', price: '$ 40.00', image: img('tab-item4.jpg') },
    { id:20, title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item6.jpg') },
    { id:21, title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item8.jpg') },
  ],
  technology: [
    { id:22, title: 'Peaceful Enlightment', author: 'Marmik Lama', price: '$ 40.00', image: img('tab-item1.jpg') },
    { id:23, title: 'Great travel at desert', author: 'Sanchit Howdy', price: '$ 40.00', image: img('tab-item3.jpg') },
    { id:24, title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item5.jpg') },
    { id:25, title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item7.jpg') },
  ],
  romantic: [
    { id:26, title: 'Peaceful Enlightment', author: 'Marmik Lama', price: '$ 40.00', image: img('tab-item1.jpg') },
    { id:27, title: 'Great travel at desert', author: 'Sanchit Howdy', price: '$ 40.00', image: img('tab-item3.jpg') },
    { id:28, title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item5.jpg') },
    { id:29, title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item7.jpg') },
  ],
  adventure: [
    { id:30, title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item5.jpg') },
    { id:31, title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item7.jpg') },
  ],
  fictional: [
    { id:32, title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item5.jpg') },
    { id:33, title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item7.jpg') },
  ],
}

export const specialOffers = [
  {
     id: 5,
    title: 'Simple way of piece life',
    author: 'Armor Ramsey',
    price: '$ 40.00',
    prevPrice: '$ 50.00',
    image: img('product-item5.jpg'),
  },
  {
     id: 6,
    title: 'Great travel at desert',
    author: 'Sanchit Howdy',
    price: '$ 38.00',
    prevPrice: '$ 30.00',
    image: img('product-item6.jpg'),
  },
  { id: 7,
    title: 'The lady beauty Scarlett',
    author: 'Arthur Doyle',
    price: '$ 45.00',
    prevPrice: '$ 35.00',
    image: img('product-item7.jpg'),
  },
  { id: 8,
    title: 'Once upon a time',
    author: 'Klien Marry',
    price: '$ 35.00',
    prevPrice: '$ 25.00',
    image: img('product-item8.jpg'),
  },
  { id: 9,
    title: 'Simple way of piece life',
    author: 'Armor Ramsey',
    price: '$ 40.00',
    image: img('product-item2.jpg'),
  },
]

export const blogPosts = [
  {
    title: 'Reading books always makes the moments happy',
    date: 'Mar 30, 2021',
    category: 'inspiration',
    image: img('post-img1.jpg'),
  },
  {
    title: 'Reading books always makes the moments happy',
    date: 'Mar 29, 2021',
    category: 'inspiration',
    image: img('post-img2.jpg'),
  },
  {
    title: 'Reading books always makes the moments happy',
    date: 'Feb 27, 2021',
    category: 'inspiration',
    image: img('post-img3.jpg'),
  },
]

export const brandAssets = {
  logo: img('main-logo.png'),
  defaultAuthor: img('default.png'),
}
export const allBooks = [
  ...featuredBooks,
  ...specialOffers,
  ...popularBooks['all-genre'],
]

