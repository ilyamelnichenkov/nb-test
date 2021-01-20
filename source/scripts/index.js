import data from '../test/data.json'

class Configurator {
    init(container) {
        this.contentContainer = container;

        data.forEach((item) => {
            this.contentContainer.insertAdjacentHTML('beforeend', this._addConfigItem(item));
        });

        this._openRow();
        this._defaultCheck();
        this._bindEvents();
    }

    _bindEvents() {
        this.inputs = Array.from(container.querySelectorAll('input'));

        this.inputs.forEach((input) => {
            input.addEventListener('change', () => {
                this._resultConfiguration();
            })
        });
    }

    _addConfigItem(element) {
        return `<li class="product-configuration__block">
                <h2 class="product-configuration__title">${element.title}:</h2>
                <button type="button" class="product-configuration__row-btn"></button>
                 <div class="product-configuration__row">
                        ${this._addConfigRow(element.code, element.config)}   
                </div>
            </li>`;
    };

    _addConfigRow(name, elem) {
        let row = '';

        elem.forEach((item) => {
            row = row + '<div class="product-configuration__item">';

            if (item.bundle) {
                row = row + `<input type="radio" name="${name}" value="${name}-${item.id}" id="${name}-${item.id}" data-add="${item.add}" data-bundle="${item.bundle}">`;
            } else {
                row = row + `<input type="radio" name="${name}" value="${name}-${item.id}" id="${name}-${item.id}">`;
            }

            row = row + `<label for="${name}-${item.id}" class="product-configuration__label">
            <p class="product-configuration__text">${item.text}</p>`;

            if (item.extend) {
                row = row + `<span class="product-configuration__extend">${item.extend}</span>`;
            }

            row = row + '</label></div>';
        });

        return row;
    }

    _openRow() {
        const blocks = Array.from(document.querySelectorAll('.product-configuration__block'));

        blocks.forEach((block) => {
            const btn = block.querySelector('.product-configuration__row-btn');

            btn.addEventListener('click', (event) => {
                const item = event.target;
                item.classList.toggle('is-active');
                item.nextElementSibling.classList.toggle('is-open');
            });
        });
    }

    _defaultCheck() {
        const rows = Array.from(document.querySelectorAll('.product-configuration__row'));

        rows.forEach((row) => {
            const firstInput = row.querySelector('input');
            firstInput.checked = true;
        });

        this._resultConfiguration();
    }

    _resultConfiguration() {
        const activeItems = Array.from(document.querySelectorAll('input:checked'));
        const configBlock = document.querySelector('.product-result__configuration-text');
        const equipmentBlock = document.querySelector('.product-result__equipment-text');
        let configArr = [];
        let equipmentArr = [];

        activeItems.forEach((item, i, array) => {
            const activeText = item.nextElementSibling.querySelector('.product-configuration__text').innerHTML;

            if (!item.hasAttribute('data-bundle')) {
                configArr.push(activeText);
            } else {
                if (item.getAttribute('data-add') !== 'false') {
                    equipmentArr.push(activeText);
                }
            }
        });

        configBlock.innerHTML = configArr.join(', ');
        equipmentBlock.innerHTML = equipmentArr.length !== 0 ? equipmentArr.join(', ') : '-';
    }
}

const container = document.querySelector('.product-configuration__container')

if (container) {
    const configInit = new Configurator;
    configInit.init(container);
}


