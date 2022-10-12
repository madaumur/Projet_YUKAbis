$(document).ready(function () {
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                       CONSTANTES / VARIABLES                 */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                             FONCTIONS                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	/**
	 * 	Construction de la requète à partir d'un code barre
	 * @param {*} barcode	Le code barre à rechercher
	 * @returns				La requete complete pour le getJSON
	 */
	function queryConstructor(barcode) {
		return `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
	}

	/**
	 * 	Aqcuisition des données à partir de l'api
	 * @param {*} barcode	Le code barre du produit à rechercher
	 */
	function getProductData(barcode) {
		$.getJSON(queryConstructor(barcode), (data) => {
			fillProductData(data)
		})
	}

	/**
	 * 	Affichage des données du produit sur notre site
	 * @param {*} data 		Les données du produit provenant du getJSON
	 */
	function fillProductData(data) {
		// Panel - General info ( marque, nom, quantité, image )
		$('#product-brand').html(data.product.brands)
		$('#product-name').html(data.product.product_name)
		$('#product-quantity').html(data.product.quantity)
		$('#product_icon').attr('src', data.product.image_url)

		// Panel - Nutrition facts
		setNutriscore(data.product.nutriscore_grade)
		setNovascore(data.product.nova_group)
		setEcoscore(data.product.ecoscore_grade)
		setVeggieStatus(data.product.ingredients_analysis_tags[2])

		// Panel - Nutrition level for 100g
		setNutrientLevel(data)

		// Panel - Nutritional table
		fillTable(data)

		// Panel - Ingredients
		const ingreList = $('#ingre-list')
		ingreList.html(data.product.ingredients_text_with_allergens)
	}

	/**
	 *	Affichage de l'image du nutriscore correspondant au produit
	 * @param {*} param		La valeur du nutriscore du produit
	 */
	function setNutriscore(param) {
		const nutriImage = $('#nutri-image')

		if (/^[a-e]$/.test(param)) {
			nutriImage.attr(
				'src',
				`/ressources/nutriscore/nutriscore-${param}.svg`
			)
			nutriImage.attr('alt', 'Nutriscore ' + param.toUpperCase())
			switch (param) {
				case 'a':
					nutriImage.attr('title', 'Excellent nutritional quality')
					break
				case 'b':
					nutriImage.attr('title', 'Good nutritional quality')
					break
				case 'c':
					nutriImage.attr('title', 'Moderate nutritional quality')
					break
				case 'd':
					nutriImage.attr('title', 'Poor nutritional quality')
					break
				case 'e':
					nutriImage.attr('title', 'Very poor nutritional quality')
					break
			}
		} else {
			nutriImage.attr(
				'src',
				'/ressources/nutriscore/nutriscore-default.svg'
			)
			nutriImage.attr('alt', 'Nutriscore unreachable')
			nutriImage.attr('title', 'Nutriscore unreachable')
		}
	}

	/**
	 * 	Affichage de l'image du novascore correspondant au produit
	 * @param {*} param 	La valeur du novascore du produit
	 */
	function setNovascore(param) {
		const novaImage = $('#nova-image')
		const novaNotice = [
			'Unprocessed or minimally processed foods',
			'Processed culinary ingredients',
			'Processed foods',
			'Ultra-processed food and drink products',
		]

		if (/^[1-4]$/.test(param)) {
			novaImage.attr(
				'src',
				`/ressources/novascore/novascore-${param}.svg`
			)
			novaImage.attr('alt', `NOVA ${param}`)
			novaImage.attr('title', novaNotice[param - 1])
		} else {
			novaImage.attr('src', '/ressources/novascore/novascore-default.svg')
			novaImage.attr('alt', 'Novascore unreachable')
			novaImage.attr('title', 'Novascore unreachable')
		}
	}

	/**
	 * 	Affichage de l'image de l'ecoscore correspondant au produit
	 * @param {*} param 	La valeur de l'ecoscore du produit
	 */
	function setEcoscore(param) {
		const ecoImage = $('#eco-image')

		if (/^[a-e]$/.test(param)) {
			ecoImage.attr('src', `/ressources/ecoscore/ecoscore-${param}.svg`)
			ecoImage.attr('alt', 'Ecoscore ' + param.toUpperCase())
			switch (param) {
				case 'a':
					ecoImage.attr('title', 'Very low environmental impacts')
					break
				case 'b':
					ecoImage.attr('title', 'Low environmental impacts')
					break
				case 'c':
					ecoImage.attr('title', 'Medium environmental impacts')
					break
				case 'd':
					ecoImage.attr('title', 'High environmental impacts')
					break
				case 'e':
					ecoImage.attr('title', 'Very high environmental impacts')
					break
			}
		} else {
			ecoImage.attr('src', '/ressources/ecoscore/ecoscore-default.svg')
			ecoImage.attr('alt', 'EcoScore unreachable')
			ecoImage.attr('title', 'EcoScore unreachable')
		}
	}

	/**
	 * 	Affichage de l'image de statut vegetarien
	 * @param {*} param 	La valeur du statut vegetarien du produit
	 */
	function setVeggieStatus(param) {
		const veggie = $('#veggie-image')

		param === 'en:vegetarian'
			? veggie.removeClass('d-none')
			: veggie.addClass('d-none')
	}

	/**
	 * 	Remplissage de niveau de nutrition pour 100g
	 * @param {*} data 		Les données du produit provenant du getJSON
	 */
	function setNutrientLevel(data) {
		// Liste des éléments dont on affiche les indicateurs pour 100g
		const nutrientList = ['fat', 'saturated-fat', 'sugars', 'salt']

		nutrientList.forEach((nutrient) => {
			const element = $(`#nutrient-${nutrient}`)
			const nutrient_100g = `${nutrient}_100g`

			if (data.product.nutrient_levels[nutrient]) {
				element.removeClass('d-none')
				element.html(
					`${getNutrientLevelSymbol(
						data.product.nutrient_levels[nutrient]
					)} ${nutrient} (${
						data.product.nutriments[nutrient_100g]
					} g)`
				)
			} else {
				element.addClass('d-none')
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
	 * @param {*} data 		Les données du produit provenant du getJSON
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
			const element = $(`#row_${nutrient}`)
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
				element.removeClass('d-none')
				element.children().next().html(value)
			} else {
				element.addClass('d-none')
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
		const barcodeField = $('#product-searchfield')

		$(barcodeField).keyup(listenerInputFunction)
	}

	/**
	 *  Action du listener sur l'input field
	 */
	function listenerInputFunction() {
		if (/^(\d{8,13})$/.test(this.value.trim())) {
			getProductData(this.value.trim())
		}
	}

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                            INITIALIZE                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	initInputFunction()
})
