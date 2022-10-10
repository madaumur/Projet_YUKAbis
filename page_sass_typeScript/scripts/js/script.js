/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                            CONSTANTES                        */
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
var barcodeField = document.querySelector('#barcode-field');
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                              CLASS                      	    */
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
var Product = /** @class */ (function () {
    /**
     *	Product's constructor
     * @param {*} data 		Get data from our fetch
     * @memberof Product
     */
    function Product(data) {
        // general infos
        this.brand = 'product brand';
        this.name = 'product name';
        this.quantity = 'product quantity';
        this.image = 'https://via.placeholder.com/350.jpg';
        // nutrition facts
        this.nutriscore = '';
        this.novascore = 0;
        this.ecoscore = '';
        this.veggie = '';
        // nutrition levels for 100g
        this.fat_level = '';
        this.fat_qty_100g = 0;
        this.satured_fat_level = '';
        this.satured_fat_qty_100g = 0;
        this.salt_level = '';
        this.salt_qty_100g = 0;
        this.sugars_level = '';
        this.sugars_qty_100g = 0;
        // nutritonal table
        this.energy_kcal_100g = 0;
        this.energy_kj_100g = 0;
        this.carbohydrates_qty_100g = 0;
        this.fibers_qty_100g = 0;
        this.proteins_qty_100g = 0;
        this.alcohol_qty = 0;
        this.vegetable_qty_100g = 0;
        // ingredient list
        this.ingredient_list = '';
        if (data) {
            // general infos
            this.brand = data.product.brands;
            this.name = data.product.product_name;
            this.quantity = data.product.quantity;
            this.image = data.product.image_front_url;
            // nutrition facts
            this.nutriscore = data.product.nutriscore_grade;
            this.novascore = data.product.nova_group;
            this.ecoscore = data.product.ecoscore_grade;
            this.veggie = data.product.ingredients_analysis_tags[2];
            // nutrition levels for 100g
            this.fat_level = data.product.nutrient_levels.fat;
            this.fat_qty_100g = data.product.nutriments.fat_100g;
            this.satured_fat_level =
                data.product.nutrient_levels['saturated-fat'];
            this.satured_fat_qty_100g =
                data.product.nutriments['saturated-fat_100g'];
            this.salt_level = data.product.nutrient_levels.salt;
            this.salt_qty_100g = data.product.nutriments.salt_100g;
            this.sugars_level = data.product.nutrient_levels.sugars;
            this.sugars_qty_100g = data.product.nutriments.sugars_100g;
            // nutritonal table
            this.energy_kj_100g = data.product.nutriments['energy-kj_100g'];
            this.energy_kcal_100g = data.product.nutriments['energy-kcal_100g'];
            this.carbohydrates_qty_100g =
                data.product.nutriments.carbohydrates_100g;
            this.fibers_qty_100g = data.product.nutriments.fiber_100g;
            this.proteins_qty_100g = data.product.nutriments.proteins_100g;
            this.alcohol_qty = data.product.nutriments.alcohol_100g;
            this.vegetable_qty_100g =
                data.product.nutriments['fruits-vegetables-nuts-estimate-from-ingredients_100g'];
            // ingredient list
            this.ingredient_list = data.product.ingredients_text_with_allergens;
        }
    }
    /**
     *
     * @memberof Product
     */
    Product.prototype.fillProductData = function () {
        var _this = this;
        // Panel - General infos
        var productBrand = document.querySelector('#product-brand');
        productBrand.innerHTML = this.brand;
        var productName = document.querySelector('#product-name');
        productName.innerText = this.name;
        var productQuantity = document.querySelector('#product-quantity');
        productQuantity.innerHTML = this.quantity;
        var productImage = document.querySelector('#front-image');
        productImage.setAttribute('src', this.image);
        productImage.setAttribute('alt', 'Front product image');
        productImage.setAttribute('title', 'Product image');
        // Panel - Nutrition facts
        this.setNutriscore();
        this.settNovascore();
        this.setEcoscore();
        this.setVeggieStatus();
        // Panel - Nutrition level for 100g
        var nutriLevels = ['fat', 'saturated_fat', 'salt', 'sugars'];
        nutriLevels.forEach(function (nutrient) {
            return _this.setNutrientLevel(nutrient);
        });
        // Panel - Nutritional table
        this.fillTable();
        // Panel - Ingredient list
        var ingreList = document.querySelector('#ingre-list');
        ingreList.innerHTML = this.ingredient_list;
    };
    Product.prototype.setNutriscore = function () {
        var nutriImage = document.querySelector('#nutri-image');
        switch (this.nutriscore) {
            case 'a':
                nutriImage.setAttribute('src', '/ressources/nutriscore/nutriscore-a.svg');
                nutriImage.setAttribute('alt', 'NutriScore A');
                nutriImage.setAttribute('title', 'Excellent nutritional quality');
                break;
            case 'b':
                nutriImage.setAttribute('src', '/ressources/nutriscore/nutriscore-b.svg');
                nutriImage.setAttribute('alt', 'NutriScore B');
                nutriImage.setAttribute('title', 'Good nutritional quality');
                break;
            case 'c':
                nutriImage.setAttribute('src', '/ressources/nutriscore/nutriscore-c.svg');
                nutriImage.setAttribute('alt', 'NutriScore C');
                nutriImage.setAttribute('title', 'Moderate nutritional quality');
                break;
            case 'd':
                nutriImage.setAttribute('src', '/ressources/nutriscore/nutriscore-d.svg');
                nutriImage.setAttribute('alt', 'NutriScore D');
                nutriImage.setAttribute('title', 'Poor nutritional quality');
                break;
            case 'e':
                nutriImage.setAttribute('src', '/ressources/nutriscore/nutriscore-e.svg');
                nutriImage.setAttribute('alt', 'NutriScore E');
                nutriImage.setAttribute('title', 'Very poor nutritional quality');
                break;
            default:
                nutriImage.setAttribute('src', '/ressources/nutriscore/nutriscore-default.svg');
                nutriImage.setAttribute('alt', 'Nutriscore unreachable');
                nutriImage.setAttribute('title', "Product's nutriscore");
        }
    };
    Product.prototype.settNovascore = function () {
        var novaImage = document.querySelector('#nova-image');
        switch (this.novascore) {
            case 1:
                novaImage.setAttribute('src', '/ressources/novascore/novascore-1.svg');
                novaImage.setAttribute('alt', 'NOVA 1');
                novaImage.setAttribute('title', 'Unprocessed or minimally processed foods');
                break;
            case 2:
                novaImage.setAttribute('src', '/ressources/novascore/novascore-2.svg');
                novaImage.setAttribute('alt', 'NOVA 2');
                novaImage.setAttribute('title', 'Processed culinary ingredients');
                break;
            case 3:
                novaImage.setAttribute('src', '/ressources/novascore/novascore-3.svg');
                novaImage.setAttribute('alt', 'NOVA 3');
                novaImage.setAttribute('title', 'Processed foods');
                break;
            case 4:
                novaImage.setAttribute('src', '/ressources/novascore/novascore-4.svg');
                novaImage.setAttribute('alt', 'NOVA 4');
                novaImage.setAttribute('title', 'Ultra-processed food and drink products');
                break;
            default:
                novaImage.setAttribute('src', '/ressources/novascore/novascore-default.svg');
                novaImage.setAttribute('alt', 'Novascore unreachable');
                novaImage.setAttribute('title', "Product's novascore");
        }
    };
    Product.prototype.setEcoscore = function () {
        var ecoImage = document.querySelector('#eco-image');
        switch (this.ecoscore) {
            case 'a':
                ecoImage.setAttribute('src', '/ressources/ecoscore/ecoscore-a.svg');
                ecoImage.setAttribute('alt', 'EcoScore A');
                ecoImage.setAttribute('title', 'Very low environmental impacts');
                break;
            case 'b':
                ecoImage.setAttribute('src', '/ressources/ecoscore/ecoscore-b.svg');
                ecoImage.setAttribute('alt', 'EcoScore B');
                ecoImage.setAttribute('title', 'Low environmental impacts');
                break;
            case 'c':
                ecoImage.setAttribute('src', '/ressources/ecoscore/ecoscore-c.svg');
                ecoImage.setAttribute('alt', 'EcoScore C');
                ecoImage.setAttribute('title', 'Medium environmental impacts');
                break;
            case 'd':
                ecoImage.setAttribute('src', '/ressources/ecoscore/ecoscore-d.svg');
                ecoImage.setAttribute('alt', 'EcoScore D');
                ecoImage.setAttribute('title', 'High environmental impacts');
                break;
            case 'e':
                ecoImage.setAttribute('src', '/ressources/ecoscore/ecoscore-e.svg');
                ecoImage.setAttribute('alt', 'EcoScore E');
                ecoImage.setAttribute('title', 'Very high environmental impacts');
                break;
            default:
                ecoImage.setAttribute('src', '/ressources/ecoscore/ecoscore-default.svg');
                ecoImage.setAttribute('alt', 'Ecoscore unreachable');
                ecoImage.setAttribute('title', "Product's ecoscore");
        }
    };
    Product.prototype.setVeggieStatus = function () {
        var veggie = document.querySelector('#veggie-image');
        if (this.veggie === 'en:vegetarian') {
            veggie.classList.remove('hide');
        }
        else {
            veggie.classList.add('hide');
        }
    };
    Product.prototype.setNutrientLevel = function (nutrient) {
        var element = document.querySelector("#nutrient-" + nutrient);
        switch (nutrient) {
            case 'fat':
                if (this.fat_level) {
                    element.classList.remove('hide');
                    element.innerHTML =
                        setNutrientLevelSymbol(this.fat_level) +
                            ' fat (' +
                            this.fat_qty_100g +
                            ' g)';
                }
                else {
                    element.classList.add('hide');
                }
                break;
            case 'saturated_fat':
                if (this.satured_fat_level) {
                    element.classList.remove('hide');
                    element.innerHTML =
                        setNutrientLevelSymbol(this.satured_fat_level) +
                            ' saturated fat (' +
                            this.satured_fat_qty_100g +
                            ' g)';
                }
                else {
                    element.classList.add('hide');
                }
                break;
            case 'sugars':
                if (this.sugars_level) {
                    element.classList.remove('hide');
                    element.innerHTML =
                        setNutrientLevelSymbol(this.sugars_level) +
                            ' sugars (' +
                            this.sugars_qty_100g +
                            ' g)';
                }
                else {
                    element.classList.add('hide');
                }
                break;
            case 'salt':
                if (this.salt_level) {
                    element.classList.remove('hide');
                    element.innerHTML =
                        setNutrientLevelSymbol(this.salt_level) +
                            ' salt (' +
                            this.salt_qty_100g +
                            ' g)';
                }
                else {
                    element.classList.add('hide');
                }
                break;
        }
        function setNutrientLevelSymbol(nutrient_level) {
            switch (nutrient_level) {
                case 'low':
                    return '🟢 low quantity of ';
                case 'moderate':
                    return '🟠 moderate quantity of';
                case 'high':
                    return '🔴 high quantity of';
            }
        }
    };
    Product.prototype.fillTable = function () {
        /* ENERGY */
        var energy = document.querySelector('#row_energy');
        if (this.energy_kcal_100g != null || this.energy_kj_100g != null) {
            energy.classList.remove('hide');
            energy.childNodes[3].textContent =
                this.energy_kcal_100g + ' kcal / ' + this.energy_kj_100g + ' kJ';
        }
        else {
            energy.classList.add('hide');
        }
        /* FAT */
        var fat = document.querySelector('#row_fat');
        if (this.fat_qty_100g != null) {
            fat.classList.remove('hide');
            fat.childNodes[3].textContent = this.fat_qty_100g + ' g';
        }
        else {
            fat.classList.add('hide');
        }
        /* SATURATED FAT */
        var satFat = document.querySelector('#row_saturated-fat');
        if (this.satured_fat_qty_100g != null) {
            satFat.classList.remove('hide');
            satFat.childNodes[3].textContent = this.satured_fat_qty_100g + ' g';
        }
        else {
            satFat.classList.add('hide');
        }
        /* CARBOHYDRATES */
        var carbo = document.querySelector('#row_carbohydrates');
        if (this.carbohydrates_qty_100g != null) {
            carbo.classList.remove('hide');
            carbo.childNodes[3].textContent = this.carbohydrates_qty_100g + ' g';
        }
        else {
            carbo.classList.add('hide');
        }
        /* SUGARS */
        var sugars = document.querySelector('#row_sugars');
        if (this.sugars_qty_100g != null) {
            sugars.classList.remove('hide');
            sugars.childNodes[3].textContent = this.sugars_qty_100g + ' g';
        }
        else {
            sugars.classList.add('hide');
        }
        /* FIBERS */
        var fibers = document.querySelector('#row_fiber');
        if (this.fibers_qty_100g != null) {
            fibers.classList.remove('hide');
            fibers.childNodes[3].textContent = this.fibers_qty_100g + ' g';
        }
        else {
            fibers.classList.add('hide');
        }
        /* PROTEINS */
        var proteins = document.querySelector('#row_proteins');
        if (this.proteins_qty_100g != null) {
            proteins.classList.remove('hide');
            proteins.childNodes[3].textContent = this.proteins_qty_100g + ' g';
        }
        else {
            proteins.classList.add('hide');
        }
        /* SALT */
        var salt = document.querySelector('#row_salt');
        if (this.salt_qty_100g != null) {
            salt.classList.remove('hide');
            salt.childNodes[3].textContent = this.salt_qty_100g + ' g';
        }
        else {
            salt.classList.add('hide');
        }
        /* ALCOHOL */
        var alcohol = document.querySelector('#row_alcohol');
        if (this.alcohol_qty != null) {
            alcohol.classList.remove('hide');
            alcohol.childNodes[3].textContent = this.alcohol_qty + ' % vol';
        }
        else {
            alcohol.classList.add('hide');
        }
        /* FRUIT / VEGETABLE */
        var fruit = document.querySelector('#row_fruit');
        if (this.vegetable_qty_100g != null) {
            fruit.classList.remove('hide');
            fruit.childNodes[3].textContent = this.vegetable_qty_100g + ' %';
        }
        else {
            fruit.classList.add('hide');
        }
    };
    return Product;
}());
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                            FUNCTIONS                      	*/
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/**
 *	Initialisation de l'input field avec ajout du listener
 */
function initInputFunction() {
    barcodeField === null || barcodeField === void 0 ? void 0 : barcodeField.addEventListener('input', listenerInputFunction);
}
/**
 *	Initialisation de l'accodeon avec ajout des listeners
 */
function initAccordionFunction() {
    var accordion_list = document.getElementsByClassName('accordion');
    Array.from(accordion_list).forEach(function (button) {
        button.addEventListener('click', listenerAccordionFunction);
    });
}
function showPanel(boolean) {
    var panel_list = document.getElementsByClassName('panel-body');
    if (boolean === false) {
        Array.from(panel_list).forEach(function (element) {
            element.classList.add('hide');
        });
    }
    else {
        Array.from(panel_list).forEach(function (element) {
            element.classList.remove('hide');
        });
    }
}
/**
 *	Construction de la requète à partir d'un code barre
 *
 * @param {string} barcode 	- Le code barre tapé par l'utilisateur
 * @return {*}  {string}	- La string complète pour faire la requète à l'API
 */
function queryConstructor(barcode) {
    return "https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json";
}
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                         LISTENER FUNCTIONS                 	*/
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/**
 * @param {HTMLInputElement} this 	- L'element auquel on associe le listener ( ici l'input field )
 * @param {Event} ev 				- L'evenement
 */
function listenerInputFunction(ev) {
    ev.preventDefault();
    var barcode = barcodeField.value.trim();
    if (/\d{8,13}/.test(barcode)) {
        fetch(queryConstructor(barcode))
            // On récuère la réponse dans un .JSON
            .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.json();
        })
            // On traite les données
            .then(function (data) {
            var product = new Product(data);
            showPanel(true);
            product.fillProductData();
        });
    }
    else {
        showPanel(false);
    }
}
/**
 * @param {HTMLElement} this		- L'element auquel on associe le listener ( ici un bouton de l'accordeon )
 * @param {Event} ev				- L'evenement
 */
function listenerAccordionFunction(ev) {
    ev.preventDefault();
    this.classList.toggle('active');
    var panel = this.nextElementSibling;
    if (panel)
        if (panel.style.display === 'flex') {
            panel.style.display = 'none';
        }
        else {
            panel.style.display = 'flex';
        }
}
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                            INITIALIZE                        */
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
initInputFunction();
initAccordionFunction();
showPanel(false);
