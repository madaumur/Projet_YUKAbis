;(function () {
	;('use strict')

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                            CONSTANTES                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	const barcodeField = document.querySelector('#barcode-field')

	const productBrand = document.querySelector('#product-brand')
	const productName = document.querySelector('#product-name')
	const productQuantity = document.querySelector('#product-quantity')
	const productImage = document.querySelector('#product-image')

	const nutriImage = document.querySelector('#nutri-image')
	const novaImage = document.querySelector('#nova-image')
	const ecoimage = document.querySelector('#eco-image')

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
	function fetchProductByBC(barcode) {
		// fetch - demande à l'API des infos produit correspondant au code barre
		fetch(queryConstructor(barcode), { method: 'GET' })
			// On récuère la réponse dans un .JSON
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error, status = ${response.status}`)
				}
				return response.json()
			})

			// On traite les données
			.then((data) => {
				fillProductData(data)
			})

			// Gestion des erreurs
			.catch(console.error)
	}

	function fillProductData(data) {
		productBrand.innerHTML = data.product.brands
		// Gestion du nom du produit
		getProductName(data)
		productQuantity.innerHTML = data.product.quantity
		productImage.setAttribute('src', data.product.image_front_url)

		// Panel - Nutrition facts
		getVeggieStatus(data)
		getNutriscore(data)
		getNovascore(data)
		getEcoscore(data)

		// Panel - Nutrition level for 100g
		const nutriLevels = ['fat', 'saturated-fat', 'sugars', 'salt']
		nutriLevels.forEach((element) => getNutrientLevel(data, element))

		// Panel - Nutritional table
		fillTable(data)

		const ingreList = document.querySelector('#ingre-list')
		ingreList.innerHTML = data.product.ingredients_text_with_allergens
	}

	function getProductName(data) {
		if (data.product.product_name !== '') {
			productName.innerHTML = data.product.product_name
		} else if (data.product.product_name_en !== '') {
			productName.innerHTML = data.product.product_name_en
		} else if (data.product.generic_name !== '') {
			productName.innerHTML = data.product.generic_name
		} else if (data.product.generic_name_en !== '') {
			productName.innerHTML = data.product.generic_name_en
		} else if (data.product.product_name_fr !== '') {
			productName.innerHTML = data.product.product_name_fr
		} else if (data.product.generic_name_fr !== '') {
			productName.innerHTML = data.product.generic_name_fr
		}
	}

	function getVeggieStatus(data) {
		const veggie = document.querySelector('#veggie-image')

		if (data.product.ingredients_analysis_tags[2] === 'en:vegetarian') {
			veggie.style.display = 'flex'
		} else {
			veggie.style.display = 'none'
		}
	}
	function getNutriscore(data) {
		switch (data.product.nutriscore_grade) {
			case 'a':
				nutriImage.setAttribute(
					'src',
					'/ressources/nutriscore/nutriscore-a.svg'
				)
				nutriImage.setAttribute('alt', 'NutriScore A')
				nutriImage.setAttribute(
					'title',
					'Excellent nutritional quality'
				)
				break
			case 'b':
				nutriImage.setAttribute(
					'src',
					'/ressources/nutriscore/nutriscore-b.svg'
				)
				nutriImage.setAttribute('alt', 'NutriScore B')
				nutriImage.setAttribute('title', 'Good nutritional quality')
				break
			case 'c':
				nutriImage.setAttribute(
					'src',
					'/ressources/nutriscore/nutriscore-c.svg'
				)
				nutriImage.setAttribute('alt', 'NutriScore C')
				nutriImage.setAttribute('title', 'Moderate nutritional quality')
				break
			case 'd':
				nutriImage.setAttribute(
					'src',
					'/ressources/nutriscore/nutriscore-d.svg'
				)
				nutriImage.setAttribute('alt', 'NutriScore D')
				nutriImage.setAttribute('title', 'Poor nutritional quality')
				break
			case 'e':
				nutriImage.setAttribute(
					'src',
					'/ressources/nutriscore/nutriscore-e.svg'
				)
				nutriImage.setAttribute('alt', 'NutriScore E')
				nutriImage.setAttribute(
					'title',
					'Very poor nutritional quality'
				)
				break
		}
	}

	function getNovascore(data) {
		switch (data.product.nova_group) {
			case 1:
				novaImage.setAttribute(
					'src',
					'/ressources/novascore/novascore-1.svg'
				)
				novaImage.setAttribute('alt', 'NOVA 1')
				novaImage.setAttribute(
					'title',
					'Unprocessed or minimally processed foods'
				)
				break
			case 2:
				novaImage.setAttribute(
					'src',
					'/ressources/novascore/novascore-2.svg'
				)
				novaImage.setAttribute('alt', 'NOVA 2')
				novaImage.setAttribute(
					'title',
					'Processed culinary ingredients'
				)
				break
			case 3:
				novaImage.setAttribute(
					'src',
					'/ressources/novascore/novascore-3.svg'
				)
				novaImage.setAttribute('alt', 'NOVA 3')
				novaImage.setAttribute('title', 'Processed foods')
				break
			case 4:
				novaImage.setAttribute(
					'src',
					'/ressources/novascore/novascore-4.svg'
				)
				novaImage.setAttribute('alt', 'NOVA 4')
				novaImage.setAttribute(
					'title',
					'Ultra-processed food and drink products'
				)
				break
		}
	}

	function getEcoscore(data) {
		switch (data.product.ecoscore_grade) {
			case 'a':
				ecoimage.setAttribute(
					'src',
					'/ressources/ecoscore/ecoscore-a.svg'
				)
				ecoimage.setAttribute('alt', 'EcoScore A')
				ecoimage.setAttribute('title', 'Very low environmental impacts')
				break
			case 'b':
				ecoimage.setAttribute(
					'src',
					'/ressources/ecoscore/ecoscore-b.svg'
				)
				ecoimage.setAttribute('alt', 'EcoScore B')
				ecoimage.setAttribute('title', 'Low environmental impacts')
				break
			case 'c':
				ecoimage.setAttribute(
					'src',
					'/ressources/ecoscore/ecoscore-c.svg'
				)
				ecoimage.setAttribute('alt', 'EcoScore C')
				ecoimage.setAttribute('title', 'Medium environmental impacts')
				break
			case 'd':
				ecoimage.setAttribute(
					'src',
					'/ressources/ecoscore/ecoscore-d.svg'
				)
				ecoimage.setAttribute('alt', 'EcoScore D')
				ecoimage.setAttribute('title', 'High environmental impacts')
				break
			case 'e':
				ecoimage.setAttribute(
					'src',
					'/ressources/ecoscore/ecoscore-e.svg'
				)
				ecoimage.setAttribute('alt', 'EcoScore E')
				ecoimage.setAttribute(
					'title',
					'Very high environmental impacts'
				)
				break
		}
	}

	function getNutrientLevel(data, item) {
		const element = document.querySelector(`#nutrient-${item}`)

		switch (item) {
			case 'fat':
				element.innerHTML =
					getNutrientLevelSymbol(data.product.nutrient_levels.fat) +
					' ' +
					data.product.nutriments.fat_100g +
					data.product.nutriments.fat_unit +
					' of Fat'
				break

			case 'saturated-fat':
				element.innerHTML =
					getNutrientLevelSymbol(
						data.product.nutrient_levels['saturated-fat']
					) +
					' ' +
					data.product.nutriments['saturated-fat_100g'] +
					data.product.nutriments['saturated-fat_unit'] +
					' of Saturated Fat'
				break
			case 'sugars':
				element.innerHTML =
					getNutrientLevelSymbol(
						data.product.nutrient_levels.sugars
					) +
					' ' +
					data.product.nutriments.sugars_100g +
					data.product.nutriments.sugars_unit +
					' of Sugars'
				break
			case 'salt':
				element.innerHTML =
					getNutrientLevelSymbol(data.product.nutrient_levels.salt) +
					' ' +
					data.product.nutriments.salt_100g +
					data.product.nutriments.salt_unit +
					' of Salt'
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
		const energy = document.querySelector('#row_energy')

		if (data.product.nutriments['energy-kj_100g'] != null) {
			energy.childNodes[3].innerHTML =
				data.product.nutriments['energy-kj_100g'] +
				' ' +
				data.product.nutriments['energy-kj_unit'] +
				' (' +
				data.product.nutriments['energy-kcal_100g'] +
				' ' +
				data.product.nutriments['energy-kcal_unit'] +
				')'
		}

		/* FAT */
		const fat = document.querySelector('#row_fat')

		if (data.product.nutriments.fat_100g != null) {
			fat.childNodes[3].innerHTML =
				data.product.nutriments.fat_100g +
				' ' +
				data.product.nutriments.fat_unit
		}

		/* SATURATED FAT */
		const satFat = document.querySelector('#row_saturated-fat')

		if (data.product.nutriments['saturated-fat_100g'] != null) {
			satFat.childNodes[3].innerHTML =
				data.product.nutriments['saturated-fat_100g'] +
				' ' +
				data.product.nutriments['saturated-fat_unit']
		} else {
			satFat.style.display = 'none'
		}

		/* CARBOHYDRATES */
		const carbo = document.querySelector('#row_carbohydrates')

		if (data.product.nutriments.carbohydrates_100g != null) {
			carbo.childNodes[3].innerHTML =
				data.product.nutriments.carbohydrates_100g +
				' ' +
				data.product.nutriments.carbohydrates_unit
		}

		/* SUGARS */
		const sugars = document.querySelector('#row_sugars')

		if (data.product.nutriments.sugars_100g != null) {
			sugars.childNodes[3].innerHTML =
				data.product.nutriments.sugars_100g +
				' ' +
				data.product.nutriments.sugars_unit
		} else {
			sugars.style.display = 'none'
		}

		/* FIBERS */
		const fibers = document.querySelector('#row_fiber')

		if (data.product.nutriments.fiber_100g != null) {
			fibers.childNodes[3].innerHTML =
				data.product.nutriments.fiber_100g +
				' ' +
				data.product.nutriments.fiber_unit
		}

		/* PROTEINS */
		const proteins = document.querySelector('#row_proteins')

		if (data.product.nutriments.proteins_100g != null) {
			proteins.childNodes[3].innerHTML =
				data.product.nutriments.proteins_100g +
				' ' +
				data.product.nutriments.proteins_unit
		}

		/* SALT */
		const salt = document.querySelector('#row_salt')

		if (data.product.nutriments.salt_100g != null) {
			salt.childNodes[3].innerHTML =
				data.product.nutriments.salt_100g +
				' ' +
				data.product.nutriments.salt_unit
		}

		/* ALCOHOL */
		const alcohol = document.querySelector('#row_alcohol')

		if (data.product.nutriments.alcohol_100g != null) {
			alcohol.childNodes[3].innerHTML =
				data.product.nutriments.alcohol_100g +
				' ' +
				data.product.nutriments.alcohol_unit
		} else {
			alcohol.style.display = 'none'
		}

		/* FRUIT / VEGETABLE */
		const fruit = document.querySelector('#row_fruit')

		if (
			data.product.nutriments[
				'fruits-vegetables-nuts-estimate-from-ingredients_100g'
			] != null
		) {
			fruit.childNodes[3].innerHTML =
				data.product.nutriments[
					'fruits-vegetables-nuts-estimate-from-ingredients_100g'
				] + ' %'
		}
	}

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                            LISTENERS                      	*/
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	// Listener sur le champs de recherche de code barre
	barcodeField.addEventListener('input', () => {
		if (barcodeField.value.trim().length === 13) {
			fetchProductByBC(barcodeField.value.trim())
		}
	})

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                            INITIALIZE                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	const accordeon = document.getElementsByClassName('accordeon')
	let i

	for (i = 0; i < accordeon.length; i++) {
		accordeon[i].addEventListener('click', function () {
			this.classList.toggle('active')

			const panel = this.nextElementSibling
			if (panel.style.display === 'flex') {
				panel.style.display = 'none'
			} else {
				panel.style.display = 'flex'
			}
		})
	}
})()
