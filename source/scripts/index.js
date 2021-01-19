import data from '../test/data.json'

const contentContainer = document.querySelector('.product-configuration__container');

const addConfigItem = (element) => {
    return `<li class="product-configuration__block">
                <h2 class="product-configuration__title">${element.title}:</h2>
                <button type="button" class="product-configuration__row-btn">zzzz</button>
                 <div class="product-configuration__row">
                        ${addConfigRow(element.code, element.config)}      
                </div>
            </li>`;
};

const addConfigRow = (name, elem) => {
    let row = '';

    elem.forEach((item, index) => {
        row = row + '<div class="product-configuration__item">';

        if (item.bundle && item.add) {
            row = row + `<input type="radio" name="${name}" value="${name}-${item.id}" id="${name}-${item.id}" data-add="${item.add}" data-bundle="${item.bundle}">`;
        } else {
            row = row + `<input type="radio" name="${name}" value="" id="${name}-${item.id}">`;
        }

        row = row + `<label for="${name}-${item.id}" class="product-configuration__label">
            <p class="product-configuration__text">${item.text}</p>`;

        if (item.extend) {
            row = row + `<span class="product-configuration__extend">${item.extend}</span>`;
        }

        row = row + '</label></div>';
    });

    return row;
};

const openRow = () => {
    const blocks = Array.from(document.querySelectorAll('.product-configuration__block'));

    blocks.forEach((block) => {
        const btn = block.querySelector('.product-configuration__row-btn');

        btn.addEventListener('click', (event) => {
            const item = event.target;
            item.nextElementSibling.classList.toggle('is-open');
        });
    });
};

data.forEach((item) => {
    contentContainer.insertAdjacentHTML('beforeend', addConfigItem(item));
    openRow();
});


