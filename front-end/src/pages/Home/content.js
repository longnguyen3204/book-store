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
    title: 'Simple way of piece life',
    author: 'Armor Ramsey',
    price: '$ 40.00',
    image: img('product-item1.jpg'),
  },
  {
    title: 'Great travel at desert',
    author: 'Sanchit Howdy',
    price: '$ 38.00',
    image: img('product-item2.jpg'),
  },
  {
    title: 'The lady beauty Scarlett',
    author: 'Arthur Doyle',
    price: '$ 45.00',
    image: img('product-item3.jpg'),
  },
  {
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
    { title: 'Portrait photography', author: 'Adam Silber', price: '$ 40.00', image: img('tab-item1.jpg') },
    { title: 'Once upon a time', author: 'Klien Marry', price: '$ 35.00', image: img('tab-item2.jpg') },
    { title: 'Tips of simple lifestyle', author: 'Bratt Smith', price: '$ 40.00', image: img('tab-item3.jpg') },
    { title: 'Just felt from outside', author: 'Nicole Wilson', price: '$ 40.00', image: img('tab-item4.jpg') },
    { title: 'Peaceful Enlightment', author: 'Marmik Lama', price: '$ 40.00', image: img('tab-item5.jpg') },
    { title: 'Great travel at desert', author: 'Sanchit Howdy', price: '$ 40.00', image: img('tab-item6.jpg') },
    { title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item7.jpg') },
    { title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item8.jpg') },
  ],
  business: [
    { title: 'Peaceful Enlightment', author: 'Marmik Lama', price: '$ 40.00', image: img('tab-item2.jpg') },
    { title: 'Great travel at desert', author: 'Sanchit Howdy', price: '$ 40.00', image: img('tab-item4.jpg') },
    { title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item6.jpg') },
    { title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item8.jpg') },
  ],
  technology: [
    { title: 'Peaceful Enlightment', author: 'Marmik Lama', price: '$ 40.00', image: img('tab-item1.jpg') },
    { title: 'Great travel at desert', author: 'Sanchit Howdy', price: '$ 40.00', image: img('tab-item3.jpg') },
    { title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item5.jpg') },
    { title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item7.jpg') },
  ],
  romantic: [
    { title: 'Peaceful Enlightment', author: 'Marmik Lama', price: '$ 40.00', image: img('tab-item1.jpg') },
    { title: 'Great travel at desert', author: 'Sanchit Howdy', price: '$ 40.00', image: img('tab-item3.jpg') },
    { title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item5.jpg') },
    { title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item7.jpg') },
  ],
  adventure: [
    { title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item5.jpg') },
    { title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item7.jpg') },
  ],
  fictional: [
    { title: 'Life among the pirates', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item5.jpg') },
    { title: 'Simple way of piece life', author: 'Armor Ramsey', price: '$ 40.00', image: img('tab-item7.jpg') },
  ],
}

export const specialOffers = [
  {
    title: 'Simple way of piece life',
    author: 'Armor Ramsey',
    price: '$ 40.00',
    prevPrice: '$ 50.00',
    image: img('product-item5.jpg'),
  },
  {
    title: 'Great travel at desert',
    author: 'Sanchit Howdy',
    price: '$ 38.00',
    prevPrice: '$ 30.00',
    image: img('product-item6.jpg'),
  },
  {
    title: 'The lady beauty Scarlett',
    author: 'Arthur Doyle',
    price: '$ 45.00',
    prevPrice: '$ 35.00',
    image: img('product-item7.jpg'),
  },
  {
    title: 'Once upon a time',
    author: 'Klien Marry',
    price: '$ 35.00',
    prevPrice: '$ 25.00',
    image: img('product-item8.jpg'),
  },
  {
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

