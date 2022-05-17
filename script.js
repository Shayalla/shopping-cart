function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const sumTotal = async () => {
  const totalPrice = document.querySelector('.total-price');
  const items = document.querySelectorAll('.cart__item');
  const total = [...items]
    .map((element) => element.innerText.match(/([0-9.]){1,}$/))
    .reduce((acc, curr) => acc + parseFloat(curr), 0);
  totalPrice.innerHTML = Math.floor(total * 100) / 100;
  const result = totalPrice;
  return result;
};

function cartItemClickListener(event) {
  event.target.remove();
  sumTotal();
}

function createCartItemElement(sku, name, salePrice) {
  const olPai = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return olPai.appendChild(li);
}

const setStorage = () => {
  const li = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.price');
  localStorage.setItem('price', totalPrice.innerHTML);
  for (let index = 0; index <= li.length; index += 1) {
    localStorage.setItem(index + 1, li[index].innerHTML);
  }
};

const createCart = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((data) => {
      const { id, title, price } = data;
      return createCartItemElement(id, title, price);
    })
    .then((_item) => {
      sumTotal();
      setStorage();
    });
};

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section
    .appendChild(
      createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
    )
    .addEventListener('click', () => createCart(sku));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const fetchApi = (api) =>
  fetch(`https://api.mercadolibre.com/${api}`).then((response) =>
    response.json());

const listItem = () => {
  fetchApi('sites/MLB/search?q=computador')
    .then((data) => {
      data.results.map((element) => {
        const { id, title, thumbnail } = element;
        const sectionPai = document.querySelector('.items');
        return sectionPai.appendChild(
          createProductItemElement(id, title, thumbnail),
        );
      });
    })
    .then(() => document.querySelector('.loading').remove());
  const clearButton = document.querySelector('.empty-cart');
  const ol = document.querySelector('.ol');
  clearButton.addEventListener('click', () => {
    ol.innerHTML = '';
  });
};

window.onload = function onload() {
  listItem();
  const ol = document.querySelector('.cart__items');
  const price = document.querySelector('.total-price');
  if (localStorage.length !== 0) {
    for (let index = 0; index < localStorage.length - 1; index += 1) {
      const li = document.createElement('li');
      ol.appendChild(li);
      li.innerHTML = localStorage.getItem(index + 1);
    }
    price.innerHTML = localStorage.getItem('price');
  }
};
