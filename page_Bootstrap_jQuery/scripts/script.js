$(document).ready(function () {
	;('use strict')

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                            CONSTANTES                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	const barcodeField = $('#product-searchfield')

	const productBrand = $('#product-brand')
	const productName = $('#product-name')
	const productQuantity = $('#product-quantity')
	const productImage = $('#product_icon')

	const nutriImage = $('#nutri-image')
	const novaImage = $('#nova-image')
	const ecoimage = $('#eco-image')

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                             VARIABLES                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                             FONCTIONS                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	// Construction de la requète à partir d'un code barre
	function queryConstructor(barcode) {
		return `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
	}

	// Aqcuisition des données à partir de l'api
	function getProductData(barcode) {
		$.getJSON(queryConstructor(barcode), (data) => {
			fillProductData(data)
		})
	}

	function fillProductData(data) {
		// Section general infos
		// @TODO : penser aux vérif des champs du produit comme pour le nom
		productBrand.html(data.product.brands)

		data.productName === ''
			? productName.html(data.product.generic_name)
			: productName.html(data.product.product_name)

		productQuantity.html(data.product.quantity)
		productImage.attr('src', data.product.image_url)

		// Section nutrition facts
		getVeggieStatus(data)
		getNutriscore(data)
		getNovascore(data)
		getEcoscore(data)

		// Section nutrient levels
		const nutriLevels = ['fat', 'saturated-fat', 'sugars', 'salt']
		nutriLevels.forEach((element) => getNutrientLevel(data, element))

		// Section nutrient table
		fillTable(data)
	}

	function getVeggieStatus(data) {
		const veggie = $('#veggie-image')

		data.product.ingredients_analysis_tags[2] === 'en:vegetarian'
			? veggie.removeClass('d-none')
			: veggie.addClass('d-none')
	}

	function getNutriscore(data) {
		switch (data.product.nutriscore_grade) {
			case 'a':
				nutriImage.attr(
					'src',
					'/ressources/nutriscore/nutriscore-a.svg'
				)
				nutriImage.attr('alt', 'NutriScore A')
				nutriImage.attr('title', 'Excellent nutritional quality')
				break
			case 'b':
				nutriImage.attr(
					'src',
					'/ressources/nutriscore/nutriscore-b.svg'
				)
				nutriImage.attr('alt', 'NutriScore B')
				nutriImage.attr('title', 'Good nutritional quality')
				break
			case 'c':
				nutriImage.attr(
					'src',
					'/ressources/nutriscore/nutriscore-c.svg'
				)
				nutriImage.attr('alt', 'NutriScore C')
				nutriImage.attr('title', 'Moderate nutritional quality')
				break
			case 'd':
				nutriImage.attr(
					'src',
					'/ressources/nutriscore/nutriscore-d.svg'
				)
				nutriImage.attr('alt', 'NutriScore D')
				nutriImage.attr('title', 'Poor nutritional quality')
				break
			case 'e':
				nutriImage.attr(
					'src',
					'/ressources/nutriscore/nutriscore-e.svg'
				)
				nutriImage.attr('alt', 'NutriScore E')
				nutriImage.attr('title', 'Very poor nutritional quality')
				break
		}
	}

	function getNovascore(data) {
		switch (data.product.nova_group) {
			case 1:
				novaImage.attr('src', '/ressources/novascore/novascore-1.svg')
				novaImage.attr('alt', 'NOVA 1')
				novaImage.attr(
					'title',
					'Unprocessed or minimally processed foods'
				)
				break
			case 2:
				novaImage.attr('src', '/ressources/novascore/novascore-2.svg')
				novaImage.attr('alt', 'NOVA 2')
				novaImage.attr('title', 'Processed culinary ingredients')
				break
			case 3:
				novaImage.attr('src', '/ressources/novascore/novascore-3.svg')
				novaImage.attr('alt', 'NOVA 3')
				novaImage.attr('title', 'Processed foods')
				break
			case 4:
				novaImage.attr('src', '/ressources/novascore/novascore-4.svg')
				novaImage.attr('alt', 'NOVA 4')
				novaImage.attr(
					'title',
					'Ultra-processed food and drink products'
				)
				break
		}
	}

	function getEcoscore(data) {
		switch (data.product.ecoscore_grade) {
			case 'a':
				ecoimage.attr('src', '/ressources/ecoscore/ecoscore-a.svg')
				ecoimage.attr('alt', 'EcoScore A')
				ecoimage.attr('title', 'Very low environmental impacts')
				break
			case 'b':
				ecoimage.attr('src', '/ressources/ecoscore/ecoscore-b.svg')
				ecoimage.attr('alt', 'EcoScore B')
				ecoimage.attr('title', 'Low environmental impacts')
				break
			case 'c':
				ecoimage.attr('src', '/ressources/ecoscore/ecoscore-c.svg')
				ecoimage.attr('alt', 'EcoScore C')
				ecoimage.attr('title', 'Medium environmental impacts')
				break
			case 'd':
				ecoimage.attr('src', '/ressources/ecoscore/ecoscore-d.svg')
				ecoimage.attr('alt', 'EcoScore D')
				ecoimage.attr('title', 'High environmental impacts')
				break
			case 'e':
				ecoimage.attr('src', '/ressources/ecoscore/ecoscore-e.svg')
				ecoimage.attr('alt', 'EcoScore E')
				ecoimage.attr('title', 'Very high environmental impacts')
				break
		}
	}

	function getNutrientLevel(data, item) {
		const element = $(`#nutrient-${item}`)

		switch (item) {
			case 'fat':
				element.html(
					getNutrientLevelSymbol(data.product.nutrient_levels.fat) +
						' ' +
						data.product.nutriments.fat_100g +
						data.product.nutriments.fat_unit +
						' of Fat'
				)
				break
			case 'saturated-fat':
				element.html(
					getNutrientLevelSymbol(
						data.product.nutrient_levels['saturated-fat']
					) +
						' ' +
						data.product.nutriments['saturated-fat_100g'] +
						data.product.nutriments['saturated-fat_unit'] +
						' of Saturated Fat'
				)
				break
			case 'sugars':
				element.html(
					getNutrientLevelSymbol(
						data.product.nutrient_levels.sugars
					) +
						' ' +
						data.product.nutriments.sugars_100g +
						data.product.nutriments.sugars_unit +
						' of Sugars'
				)
				break
			case 'salt':
				element.html(
					getNutrientLevelSymbol(data.product.nutrient_levels.salt) +
						' ' +
						data.product.nutriments.salt_100g +
						data.product.nutriments.salt_unit +
						' of Salt'
				)
				break
		}
	}

	function getNutrientLevelSymbol(data) {
		switch (data) {
			case 'low':
				return '🟢'
			case 'moderate':
				return '🟠'
			case 'high':
				return '🔴'
		}
	}

	function fillTable(data) {
		/* ENERGY */
		const energy = $('#row_energy')

		if (data.product.nutriments['energy-kj_100g'] != null) {
			energy
				.children()
				.next()
				.html(
					data.product.nutriments['energy-kj_100g'] +
						' ' +
						data.product.nutriments['energy-kj_unit'] +
						' (' +
						data.product.nutriments['energy-kcal_100g'] +
						' ' +
						data.product.nutriments['energy-kcal_unit'] +
						')'
				)
		}

		/* FAT */
		const fat = $('#row_fat')

		if (data.product.nutriments.fat_100g != null) {
			fat.children()
				.next()
				.html(
					data.product.nutriments.fat_100g +
						' ' +
						data.product.nutriments.fat_unit
				)
		}

		/* SATURATED FAT */
		const satFat = $('#row_saturated-fat')

		if (data.product.nutriments['saturated-fat_100g'] != null) {
			satFat
				.children()
				.next()
				.html(
					data.product.nutriments['saturated-fat_100g'] +
						' ' +
						data.product.nutriments['saturated-fat_unit']
				)
		}

		/* CARBOHYDRATES */
		const carbo = $('#row_carbohydrates')

		if (data.product.nutriments.carbohydrates_100g != null) {
			carbo
				.children()
				.next()
				.html(
					data.product.nutriments.carbohydrates_100g +
						' ' +
						data.product.nutriments.carbohydrates_unit
				)
		}

		/* SUGARS */
		const sugars = $('#row_sugars')

		if (data.product.nutriments.sugars_100g != null) {
			sugars
				.children()
				.next()
				.html(
					data.product.nutriments.sugars_100g +
						' ' +
						data.product.nutriments.sugars_unit
				)
		}

		/* FIBERS */
		const fibers = $('#row_fiber')

		if (data.product.nutriments.fiber_100g != null) {
			fibers
				.children()
				.next()
				.html(
					data.product.nutriments.fiber_100g +
						' ' +
						data.product.nutriments.fiber_unit
				)
		}

		/* PROTEINS */
		const proteins = $('#row_proteins')

		if (data.product.nutriments.proteins_100g != null) {
			proteins
				.children()
				.next()
				.html(
					data.product.nutriments.proteins_100g +
						' ' +
						data.product.nutriments.proteins_unit
				)
		}

		/* SALT */
		const salt = $('#row_salt')

		if (data.product.nutriments.salt_100g != null) {
			salt.children()
				.next()
				.html(
					data.product.nutriments.salt_100g +
						' ' +
						data.product.nutriments.salt_unit
				)
		}

		/* ALCOHOL */
		const alcohol = $('#row_alcohol')

		if (data.product.nutriments.alcohol_100g != null) {
			alcohol
				.children()
				.next()
				.html(
					data.product.nutriments.alcohol_100g +
						' ' +
						data.product.nutriments.alcohol_unit
				)
		}

		/* FRUIT / VEGETABLE */
		const fruit = $('#row_fruit')

		if (
			data.product.nutriments[
				'fruits-vegetables-nuts-estimate-from-ingredients_100g'
			] != null
		) {
			fruit
				.children()
				.next()
				.html(
					data.product.nutriments[
						'fruits-vegetables-nuts-estimate-from-ingredients_100g'
					] + ' %'
				)
		}
	}

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                            LISTENERS                      	*/
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	// Listener sur le champs de recherche de code barre
	$(barcodeField).keyup(() => {
		if ($(barcodeField).val().trim().length === 13) {
			getProductData($(barcodeField).val())
		}
	})
})
