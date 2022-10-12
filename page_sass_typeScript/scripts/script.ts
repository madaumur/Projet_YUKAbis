/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                       CONSTANTES / VARIABLES                 */
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

const barcodeField: HTMLInputElement | null =
	document.querySelector<HTMLInputElement>('#barcode-field')

/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                              CLASS                      	    */
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

/**
 * @export
 * @class Product
 * @constructor Create product from Fetch data
 */
class Product {
	//General info ( marque, nom, quantité, image )
	brand: string = 'product brand'
	name: string = 'product name'
	quantity: string = 'product quantity'
	image: string = 'https://via.placeholder.com/350.jpg'

	// Nutrition facts
	nutriscore: string = ''
	novascore: number = 0
	ecoscore: string = ''
	veggie: string = ''

	// Nutrition levels for 100g
	fat_level: string = ''
	fat_qty_100g: number = 0
	saturated_fat_level: string = ''
	saturated_fat_qty_100g: number = 0
	salt_level: string = ''
	salt_qty_100g: number = 0
	sugars_level: string = ''
	sugars_qty_100g: number = 0

	// Nutritonal table
	energy_kcal_100g: number = 0
	energy_kj_100g: number = 0
	carbohydrates_qty_100g: number = 0
	fiber_qty_100g: number = 0
	proteins_qty_100g: number = 0
	alcohol_qty: number = 0
	vegetable_qty_100g: number = 0

	// Ingredient list
	ingredient_list: string = ''

	/**
	 *	Product's constructor
	 * @param {*} data 		Get data from our fetch
	 * @memberof Product
	 */
	constructor(data: any) {
		if (data) {
			this.brand = data.product.brands
			this.name = data.product.product_name
			this.quantity = data.product.quantity
			this.image = data.product.image_front_url

			this.nutriscore = data.product.nutriscore_grade
			this.novascore = data.product.nova_group
			this.ecoscore = data.product.ecoscore_grade
			this.veggie = data.product.ingredients_analysis_tags[2]

			this.fat_level = data.product.nutrient_levels.fat
			this.fat_qty_100g = data.product.nutriments.fat_100g
			this.saturated_fat_level =
				data.product.nutrient_levels['saturated-fat']
			this.saturated_fat_qty_100g =
				data.product.nutriments['saturated-fat_100g']
			this.salt_level = data.product.nutrient_levels.salt
			this.salt_qty_100g = data.product.nutriments.salt_100g
			this.sugars_level = data.product.nutrient_levels.sugars
			this.sugars_qty_100g = data.product.nutriments.sugars_100g

			this.energy_kj_100g = data.product.nutriments['energy-kj_100g']
			this.energy_kcal_100g = data.product.nutriments['energy-kcal_100g']
			this.carbohydrates_qty_100g =
				data.product.nutriments.carbohydrates_100g
			this.fiber_qty_100g = data.product.nutriments.fiber_100g
			this.proteins_qty_100g = data.product.nutriments.proteins_100g
			this.alcohol_qty = data.product.nutriments.alcohol_100g
			this.vegetable_qty_100g =
				data.product.nutriments[
					'fruits-vegetables-nuts-estimate-from-ingredients_100g'
				]

			this.ingredient_list = data.product.ingredients_text_with_allergens
		}
	}
}

/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                            FUNCTIONS                      	*/
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

/**
 *		Construction de la requète à partir d'un code barre
 *
 * @param {string} barcode 		Le code barre tapé par l'utilisateur
 * @return {*}  {string} 		La string complète pour faire la requète à l'API
 */
function queryConstructor(barcode: string) {
	return `https://world.openfoodfacts.org/api/v0/product/` + barcode + `.json`
}

/**
 *		Affichage des données du produit sur notre site
 *
 * @param {Product} product		Les données du produit provenant du fetch
 */
function fillProductData(product: Product) {
	const productBrand: HTMLLabelElement | null =
		document.querySelector('#product-brand')
	if (productBrand) {
		productBrand.innerHTML = product.brand
	}

	const productName: HTMLLabelElement | null =
		document.querySelector('#product-name')
	if (productName) {
		productName.innerText = product.name
	}

	const productQuantity: HTMLLabelElement | null =
		document.querySelector('#product-quantity')
	if (productQuantity) {
		productQuantity.innerHTML = product.quantity
	}

	const productImage: HTMLImageElement | null =
		document.querySelector('#front-image')
	if (productImage) {
		productImage.setAttribute('src', product.image)
		productImage.setAttribute('alt', 'Front product image')
		productImage.setAttribute('title', 'Product image')
	}

	// Panel - Nutrition facts
	setNutriscore(product.nutriscore)
	settNovascore(product.novascore)
	setEcoscore(product.ecoscore)
	setVeggieStatus(product.veggie)

	// Panel - Nutrition level for 100g
	setNutrientLevel(product)

	// Panel - Nutritional table
	fillTable(product)

	// Panel - Ingredient list
	const ingreList: HTMLImageElement | null =
		document.querySelector('#ingre-list')
	if (ingreList) {
		ingreList.innerHTML = product.ingredient_list
	}
}

/**
 *		Affichage de l'image du nutriscore correspondant au produit
 *
 * @param {string} param		La valeur du nutriscore du produit
 */
function setNutriscore(param: string) {
	const nutriImage: HTMLImageElement | null =
		document.querySelector('#nutri-image')

	if (nutriImage) {
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
					nutriImage.setAttribute(
						'title',
						'Moderate nutritional quality'
					)
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
}

/**
 *		Affichage de l'image du novascore correspondant au produit
 *
 * @param {number} param		La valeur du novascore du produit
 */
function settNovascore(param: number) {
	const novaImage: HTMLImageElement | null =
		document.querySelector('#nova-image')
	const novaNotice: string[] = [
		'Unprocessed or minimally processed foods',
		'Processed culinary ingredients',
		'Processed foods',
		'Ultra-processed food and drink products',
	]

	if (novaImage) {
		if (param > 0 && param < 5) {
			novaImage.setAttribute(
				'src',
				`/ressources/novascore/novascore-${param}.svg`
			)
			novaImage.setAttribute('alt', `NOVA `)
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
}

/**
 *		Affichage de l'image de l'ecoscore correspondant au produit
 *
 * @param {string} param		La valeur de l'ecoscore du produit
 */
function setEcoscore(param: string) {
	const ecoImage: HTMLImageElement | null =
		document.querySelector('#eco-image')

	if (ecoImage) {
		if (/^[a-e]$/.test(param)) {
			ecoImage.setAttribute(
				'src',
				`/ressources/ecoscore/ecoscore-${param}.svg`
			)
			ecoImage.setAttribute('alt', 'Ecoscore ' + param.toUpperCase())
			switch (param) {
				case 'a':
					ecoImage.setAttribute(
						'title',
						'Very low environmental impacts'
					)
					break
				case 'b':
					ecoImage.setAttribute('title', 'Low environmental impacts')
					break
				case 'c':
					ecoImage.setAttribute(
						'title',
						'Medium environmental impacts'
					)
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
}

/**
 *		Affichage de l'image de statut vegetarien
 *
 * @param {string} param		La valeur du statut vegetarien du produit
 */
function setVeggieStatus(param: string) {
	const veggie: HTMLImageElement | null =
		document.querySelector('#veggie-image')

	if (veggie) {
		param === 'en:vegetarian'
			? veggie.classList.remove('hide')
			: veggie.classList.add('hide')
	}
}

/**
 *		Remplissage de niveau de nutrition pour 100g
 *
 * @param {Product} product		Les données du produit provenant du fetch
 */
function setNutrientLevel(product: any) {
	const nutrientList: string[] = ['fat', 'saturated_fat', 'sugars', 'salt']

	nutrientList.forEach((nutrient: string) => {
		const element: HTMLImageElement | null = document.querySelector(
			`#nutrient-` + nutrient
		)

		if (element && product[`${nutrient}_level`]) {
			element.classList.remove('hide')
			element.innerHTML = `${getNutrientLevelSymbol(
				product[`${nutrient}_level`]
			)} ${nutrient} (${product[`${nutrient}_qty_100g`]} g)`
		} else {
			element?.classList.add('hide')
		}
	})

	function getNutrientLevelSymbol(nutrient_level: string) {
		switch (nutrient_level) {
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
 *		Remplissage du tableau nutritionnel
 *
 * @param {Product} product		Les données du produit provenant du fetch
 */
function fillTable(product: any) {
	// Liste des éléments que l'on affiche dans le tableau
	const nutrientList = [
		'energy',
		'fat',
		'saturated_fat',
		'carbohydrates',
		'sugars',
		'fiber',
		'proteins',
		'salt',
		'alcohol',
		'fruit',
	]

	nutrientList.forEach((nutrient: string) => {
		const element = document.querySelector(
			`#row_${nutrient}`
		) as HTMLImageElement
		let nutrient_100g, value

		switch (nutrient) {
			case 'energy':
				nutrient_100g = 'energy_kj_100g'
				value = `${product[nutrient_100g]} kJ / ${product['energy_kcal_100g']} kcal`
				break
			case 'alcohol':
				nutrient_100g = 'alcohol_qty'
				value = `${product[nutrient_100g]} % vol`
				break
			case 'fruit':
				nutrient_100g = 'vegetable_qty_100g'
				value = `${product[nutrient_100g]} %`
				break
			default:
				nutrient_100g = `${nutrient}_qty_100g`
				value = `${product[nutrient_100g]} g`
				break
		}

		// Remplissage du tableau
		if (product[nutrient_100g] != null) {
			element.classList.remove('hide')
			element.childNodes[3].textContent = value
		} else {
			element.classList.add('hide')
		}
	})
}

/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                         LISTENER FUNCTIONS                 	*/
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

/**
 *		Initialisation de l'input field avec ajout du listener
 */
function initInputFunction(): void {
	barcodeField?.addEventListener('input', listenerInputFunction)
}

/**
 *  	Action du listener sur l'input field
 *
 * @param {HTMLInputElement} this 	L'element auquel on associe le listener ( ici l'input field )
 * @param {Event} ev 				L'evenement
 */
function listenerInputFunction(this: HTMLInputElement, ev: Event): void {
	ev.preventDefault()

	if (/\d{8,13}/.test(this.value.trim())) {
		fetch(queryConstructor(this.value.trim()))
			// On récuère la réponse dans un .JSON
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error, status = ${response.status}`)
				}
				return response.json()
			})
			// On traite les données
			.then((data) => {
				const product: Product = new Product(data)

				fillProductData(product)
			})
	}
}

/**
 *	Initialisation de l'accodeon avec ajout des listeners
 */
function initAccordionFunction(): void {
	const accordion_list = document.getElementsByClassName(
		'accordion'
	) as HTMLCollectionOf<HTMLElement>

	Array.from(accordion_list).forEach((button) => {
		button.addEventListener('click', listenerAccordionFunction)
	})
}

/**
 *		Action des listeners sur les button de l'accordeon
 *
 * @param {HTMLElement} this		- L'element auquel on associe le listener ( ici un bouton de l'accordeon )
 * @param {Event} ev				- L'evenement
 */
function listenerAccordionFunction(this: HTMLElement, ev: Event): void {
	ev.preventDefault()

	this.classList.toggle('active')

	const panel = this.nextElementSibling as HTMLElement
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
