/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                       CONSTANTES / VARIABLES                 */
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                             FONCTIONS                        */
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

/**
 * 	Construction de la requète à partir d'un code barre
 * @param {*} barcode	Le code barre à rechercher
 * @returns				La requete complete pour le fetch
 */
function queryConstructor(barcode) {
	return `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
}

/**
 * 	Aqcuisition des données à partir de l'api
 * @param {*} barcode	Le code barre du produit à rechercher
 */
function fetchProduct(barcode) {
	fetch(queryConstructor(barcode), { method: 'GET' })
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error, status = ${response.status}`)
			}
			return response.json()
		})
		.then((data) => {
			fillProductData(data)
		})
		.catch(console.error)
}

/**
 * 	Affichage des données du produit sur notre site
 * @param {*} data 		Les données du produit provenant du fetch
 */
function fillProductData(data) {
	// Panel - General info ( marque, nom, quantité, image )
	document.querySelector('#product-brand').innerHTML = data.product.brands
	document.querySelector('#product-name').innerHTML =
		data.product.product_name
	document.querySelector('#product-quantity').innerHTML =
		data.product.quantity
	document
		.querySelector('#front-image')
		.setAttribute('src', data.product.image_front_url)

	// Panel - Nutrition facts
	setNutriscore(data.product.nutriscore_grade)
	setNovascore(data.product.nova_group)
	setEcoscore(data.product.ecoscore_grade)
	setVeggieStatus(data.product.ingredients_analysis_tags[2])

	// Panel - Nutrition level for 100g
	setNutrientLevels(data)

	// Panel - Nutritional table
	fillTable(data)

	// Panel - Ingredients
	const ingreList = document.querySelector('#ingre-list')
	ingreList.innerHTML = data.product.ingredients_text_with_allergens
}

/**
 *	Affichage de l'image du nutriscore correspondant au produit
 * @param {*} param		La valeur du nutriscore du produit
 */
function setNutriscore(param) {
	const nutriImage = document.querySelector('#nutri-image')

	if (/^[a-e]$/.test(param)) {
		nutriImage.setAttribute(
			'src',
			`/ressources/nutriscore/nutriscore-${param}.svg`
		)
		nutriImage.setAttribute('alt', 'Nutriscore ' + param.toUpperCase())
		switch (param) {
			case 'a':
				nutriImage.setAttribute(
					'title',
					'Excellent nutritional quality'
				)
				break
			case 'b':
				nutriImage.setAttribute('title', 'Good nutritional quality')
				break
			case 'c':
				nutriImage.setAttribute('title', 'Moderate nutritional quality')
				break
			case 'd':
				nutriImage.setAttribute('title', 'Poor nutritional quality')
				break
			case 'e':
				nutriImage.setAttribute(
					'title',
					'Very poor nutritional quality'
				)
				break
		}
	} else {
		nutriImage.setAttribute(
			'src',
			'/ressources/nutriscore/nutriscore-default.svg'
		)
		nutriImage.setAttribute('alt', 'Nutriscore unreachable')
		nutriImage.setAttribute('title', 'Nutriscore unreachable')
	}
}

/**
 * 	Affichage de l'image du novascore correspondant au produit
 * @param {*} param 	La valeur du novascore du produit
 */
function setNovascore(param) {
	const novaImage = document.querySelector('#nova-image')
	const novaNotice = [
		'Unprocessed or minimally processed foods',
		'Processed culinary ingredients',
		'Processed foods',
		'Ultra-processed food and drink products',
	]

	if (/^[1-4]$/.test(param)) {
		novaImage.setAttribute(
			'src',
			`/ressources/novascore/novascore-${param}.svg`
		)
		novaImage.setAttribute('alt', `NOVA ${param}`)
		novaImage.setAttribute('title', novaNotice[param - 1])
	} else {
		novaImage.setAttribute(
			'src',
			'/ressources/novascore/novascore-default.svg'
		)
		novaImage.setAttribute('alt', 'Novascore unreachable')
		novaImage.setAttribute('title', 'Novascore unreachable')
	}
}

/**
 * 	Affichage de l'image de l'ecoscore correspondant au produit
 * @param {*} param 	La valeur de l'ecoscore du produit
 */
function setEcoscore(param) {
	const ecoImage = document.querySelector('#eco-image')

	if (/^[a-e]$/.test(param)) {
		ecoImage.setAttribute(
			'src',
			`/ressources/ecoscore/ecoscore-${param}.svg`
		)
		ecoImage.setAttribute('alt', 'Ecoscore ' + param.toUpperCase())
		switch (param) {
			case 'a':
				ecoImage.setAttribute('title', 'Very low environmental impacts')
				break
			case 'b':
				ecoImage.setAttribute('title', 'Low environmental impacts')
				break
			case 'c':
				ecoImage.setAttribute('title', 'Medium environmental impacts')
				break
			case 'd':
				ecoImage.setAttribute('title', 'High environmental impacts')
				break
			case 'e':
				ecoImage.setAttribute(
					'title',
					'Very high environmental impacts'
				)
				break
		}
	} else {
		ecoImage.setAttribute(
			'src',
			'/ressources/ecoscore/ecoscore-default.svg'
		)
		ecoImage.setAttribute('alt', 'EcoScore unreachable')
		ecoImage.setAttribute('title', 'EcoScore unreachable')
	}
}

/**
 * 	Affichage de l'image de statut vegetarien
 * @param {*} param 	La valeur du statut vegetarien du produit
 */
function setVeggieStatus(param) {
	const veggie = document.querySelector('#veggie-image')

	param === 'en:vegetarian'
		? veggie.classList.remove('hide')
		: veggie.classList.add('hide')
}

/**
 * 	Remplissage de niveau de nutrition pour 100g
 * @param {*} data 		Les données du produit provenant du fetch
 */
function setNutrientLevels(data) {
	// Liste des éléments dont on affiche les indicateurs pour 100g
	const nutrientList = ['fat', 'saturated-fat', 'sugars', 'salt']

	nutrientList.forEach((nutrient) => {
		const element = document.querySelector(`#nutrient-${nutrient}`)
		const nutrient_100g = `${nutrient}_100g`

		if (data.product.nutrient_levels[nutrient]) {
			element.classList.remove('hide')
			element.innerHTML = `${getNutrientLevelSymbol(
				data.product.nutrient_levels[nutrient]
			)} ${nutrient} (${data.product.nutriments[nutrient_100g]} g)`
		} else {
			element.classList.add('hide')
		}
	})

	function getNutrientLevelSymbol(param) {
		switch (param) {
			case 'low':
				return '🟢 low quantity of'
			case 'moderate':
				return '🟠 moderate quantity of'
			case 'high':
				return '🔴 high quantity of'
		}
	}
}

/**
 * 	Remplissage du tableau nutritionnel
 * @param {*} data 		Les données du produit provenant du fetch
 */
function fillTable(data) {
	// Liste des éléments que l'on affiche dans le tableau
	const nutrientList = [
		'energy',
		'fat',
		'saturated-fat',
		'carbohydrates',
		'sugars',
		'fiber',
		'proteins',
		'salt',
		'alcohol',
		'fruit',
	]

	nutrientList.forEach((nutrient) => {
		const element = document.querySelector(`#row_${nutrient}`)
		let nutrient_100g, value

		switch (nutrient) {
			case 'energy':
				nutrient_100g = 'energy-kj_100g'
				value = `${data.product.nutriments['energy-kj_100g']} kJ / ${data.product.nutriments['energy-kcal_100g']} kcal`
				break
			case 'alcohol':
				nutrient_100g = 'alcohol_100g'
				value = data.product.nutriments['alcohol_100g'] + ' % vol'
				break
			case 'fruits':
				nutrient_100g =
					'fruits-vegetables-nuts-estimate-from-ingredients_100g'
				value = `${data.product.nutriments['fruits-vegetables-nuts-estimate-from-ingredients_100g']} %`
				break
			default:
				nutrient_100g = `${nutrient}_100g`
				value = `${data.product.nutriments[nutrient_100g]} g`
				break
		}

		// Remplissage du tableau
		if (data.product.nutriments[nutrient_100g] != null) {
			element.classList.remove('hide')
			element.childNodes[3].innerHTML = value
		} else {
			element.classList.add('hide')
		}
	})
}

/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                            LISTENERS                      	*/
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

/**
 *	Initialisation de l'input field avec ajout du listener
 */
function initInputFunction() {
	const barcodeField = document.querySelector('#barcode-field')

	barcodeField.addEventListener('input', listenerInputFunction)
}

/**
 *  Action du listener sur l'input field
 */
function listenerInputFunction() {
	if (/^(\d{8,13})$/.test(this.value.trim())) {
		fetchProduct(this.value.trim())
	}
}

/**
 *	Initialisation de l'accodeon avec ajout des listeners
 */
function initAccordionFunction() {
	const accordionList = document.getElementsByClassName('accordion')

	Array.from(accordionList).forEach((button) => {
		button.addEventListener('click', listenerAccordionFunction)
	})
}

/**
 *  Action des listeners sur les button de l'accordeon
 */
function listenerAccordionFunction() {
	this.classList.toggle('active')

	const panel = this.nextElementSibling
	if (panel)
		if (panel.style.display === 'flex') {
			panel.style.display = 'none'
		} else {
			panel.style.display = 'flex'
		}
}

/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                            INITIALIZE                        */
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

initInputFunction()
initAccordionFunction()
