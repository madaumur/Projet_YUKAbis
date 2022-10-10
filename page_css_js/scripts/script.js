;(function () {
	;('use strict')

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                            CONSTANTES                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	const accordionList = document.getElementsByClassName('accordion')
	const barcodeField = document.querySelector('#barcode-field')

	const productBrand = document.querySelector('#product-brand')
	const productName = document.querySelector('#product-name')
	const productQuantity = document.querySelector('#product-quantity')
	const productImage = document.querySelector('#front-image')

	const nutriImage = document.querySelector('#nutri-image')
	const novaImage = document.querySelector('#nova-image')
	const ecoimage = document.querySelector('#eco-image')
	const veggie = document.querySelector('#veggie-image')

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
		productName.innerHTML = data.product.product_name
		productQuantity.innerHTML = data.product.quantity
		productImage.setAttribute('src', data.product.image_front_url)

		// Panel - Nutrition facts
		setVeggieStatus(data)
		setNutriscore(data)
		setNovascore(data)
		setEcoscore(data)

		// Panel - Nutrition level for 100g
		const nutriLevels = ['fat', 'saturated-fat', 'sugars', 'salt']
		nutriLevels.forEach((element) => getNutrientLevel(data, element))

		// Panel - Nutritional table
		fillTable(data)

		const ingreList = document.querySelector('#ingre-list')
		ingreList.innerHTML = data.product.ingredients_text_with_allergens
	}

	function setVeggieStatus(data) {
		if (data.product.ingredients_analysis_tags[2] === 'en:vegetarian') {
			veggie.classList.remove('hide')
		} else {
			veggie.classList.add('hide')
		}
	}

	function setNutriscore(data) {
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

	function setNovascore(data) {
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

	function setEcoscore(data) {
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
				if (data.product.nutrient_levels.fat) {
					element.classList.remove('hide')
					element.innerHTML =
						getNutrientLevelSymbol(
							data.product.nutrient_levels.fat
						) +
						' ' +
						data.product.nutriments.fat_100g +
						' g of Fat'
				} else {
					element.classList.add('hide')
				}
				break
			case 'saturated-fat':
				if (data.product.nutrient_levels['saturated-fat']) {
					element.classList.remove('hide')
					element.innerHTML =
						getNutrientLevelSymbol(
							data.product.nutrient_levels['saturated-fat']
						) +
						' ' +
						data.product.nutriments['saturated-fat_100g'] +
						' g of Saturated Fat'
				} else {
					element.classList.add('hide')
				}
				break
			case 'sugars':
				if (data.product.nutrient_levels.sugars) {
					element.classList.remove('hide')
					element.innerHTML =
						getNutrientLevelSymbol(
							data.product.nutrient_levels.sugars
						) +
						' ' +
						data.product.nutriments.sugars_100g +
						' g of Sugars'
				} else {
					element.classList.add('hide')
				}
				break
			case 'salt':
				if (data.product.nutrient_levels.salt) {
					element.classList.remove('hide')
					element.innerHTML =
						getNutrientLevelSymbol(
							data.product.nutrient_levels.salt
						) +
						' ' +
						data.product.nutriments.salt_100g +
						' g of Salt'
				} else {
					element.classList.add('hide')
				}
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
			energy.classList.remove('hide')
			energy.childNodes[3].innerHTML =
				data.product.nutriments['energy-kj_100g'] +
				' kJ / ' +
				data.product.nutriments['energy-kcal_100g'] +
				' kcal'
		} else {
			energy.classList.add('hide')
		}

		/* FAT */
		const fat = document.querySelector('#row_fat')

		if (data.product.nutriments.fat_100g != null) {
			fat.classList.remove('hide')
			fat.childNodes[3].innerHTML =
				data.product.nutriments.fat_100g + ' g'
		} else {
			fat.classList.add('hide')
		}

		/* SATURATED FAT */
		const satFat = document.querySelector('#row_saturated-fat')

		if (data.product.nutriments['saturated-fat_100g'] != null) {
			satFat.classList.remove('hide')
			satFat.childNodes[3].innerHTML =
				data.product.nutriments['saturated-fat_100g'] + ' g'
		} else {
			satFat.classList.remove('hide')
		}

		/* CARBOHYDRATES */
		const carbo = document.querySelector('#row_carbohydrates')

		if (data.product.nutriments.carbohydrates_100g != null) {
			carbo.classList.remove('hide')
			carbo.childNodes[3].innerHTML =
				data.product.nutriments.carbohydrates_100g + ' g'
		} else {
			carbo.classList.add('hide')
		}

		/* SUGARS */
		const sugars = document.querySelector('#row_sugars')

		if (data.product.nutriments.sugars_100g != null) {
			sugars.classList.remove('hide')
			sugars.childNodes[3].innerHTML =
				data.product.nutriments.sugars_100g + ' g'
		} else {
			carbo.classList.add('hide')
		}

		/* FIBERS */
		const fibers = document.querySelector('#row_fiber')

		if (data.product.nutriments.fiber_100g != null) {
			fibers.classList.remove('hide')
			fibers.childNodes[3].innerHTML =
				data.product.nutriments.fiber_100g + ' g'
		} else {
			fibers.classList.add('hide')
		}

		/* PROTEINS */
		const proteins = document.querySelector('#row_proteins')

		if (data.product.nutriments.proteins_100g != null) {
			proteins.classList.remove('hide')
			proteins.childNodes[3].innerHTML =
				data.product.nutriments.proteins_100g + ' g'
		} else {
			proteins.classList.add('hide')
		}

		/* SALT */
		const salt = document.querySelector('#row_salt')

		if (data.product.nutriments.salt_100g != null) {
			salt.classList.remove('hide')
			salt.childNodes[3].innerHTML =
				data.product.nutriments.salt_100g + ' g'
		} else {
			salt.classList.add('hide')
		}

		/* ALCOHOL */
		const alcohol = document.querySelector('#row_alcohol')

		if (data.product.nutriments.alcohol_100g != null) {
			alcohol.classList.remove('hide')
			alcohol.childNodes[3].innerHTML =
				data.product.nutriments.alcohol_100g + ' % vol'
		} else {
			alcohol.classList.add('hide')
		}

		/* FRUIT / VEGETABLE */
		const fruit = document.querySelector('#row_fruit')

		if (
			data.product.nutriments[
				'fruits-vegetables-nuts-estimate-from-ingredients_100g'
			] != null
		) {
			fruit.classList.remove('hide')
			fruit.childNodes[3].innerHTML =
				data.product.nutriments[
					'fruits-vegetables-nuts-estimate-from-ingredients_100g'
				] + ' %'
		} else {
			fruit.classList.add('hide')
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

	veggie.classList.toggle('hide')

	/**
	 *	Initialisation de l'accodeon avec ajout des listeners
	 */
	Array.from(accordionList).forEach((button) => {
		button.addEventListener('click', function () {
			this.classList.toggle('active')

			const panel = this.nextElementSibling
			if (panel.style.display === 'flex') {
				panel.style.display = 'none'
			} else {
				panel.style.display = 'flex'
			}
		})
	})
})()
