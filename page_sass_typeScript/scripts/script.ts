/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                            CONSTANTES                        */
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

const barcodeField = document.querySelector<HTMLInputElement>(
	'#barcode-field'
) as HTMLInputElement

/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                              CLASS                      	    */
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
class Product {
	// general infos
	brand: string = 'product brand'
	name: string = 'product name'
	quantity: string = 'product quantity'
	image: string = 'https://via.placeholder.com/350.jpg'

	// nutrition facts
	nutriscore: string = ''
	novascore: number = 0
	ecoscore: string = ''
	veggie: string = ''

	// nutrition levels for 100g
	fat_level: string = ''
	fat_qty_100g: number = 0
	satured_fat_level: string = ''
	satured_fat_qty_100g: number = 0
	salt_level: string = ''
	salt_qty_100g: number = 0
	sugars_level: string = ''
	sugars_qty_100g: number = 0

	// nutritonal table
	energy_kcal_100g: number = 0
	energy_kj_100g: number = 0
	carbohydrates_qty_100g: number = 0
	fibers_qty_100g: number = 0
	proteins_qty_100g: number = 0
	alcohol_qty: number = 0
	vagetable_qty_100g: number = 0

	// ingredient list
	ingredient_list: string = ''

	/**
	 *	Product's constructor
	 * @param {*} data 		Get data from our fetch
	 * @memberof Product
	 */
	constructor(data: any) {
		if (data) {
			// general infos
			this.brand = data.product.brands
			this.name = data.product.product_name
			this.quantity = data.product.quantity
			this.image = data.product.image_front_url

			// nutrition facts
			this.nutriscore = data.product.nutriscore_grade
			this.novascore = data.product.nova_group
			this.ecoscore = data.product.ecoscore_grade
			this.veggie = data.product.ingredients_analysis_tags[2]

			// nutrition levels for 100g
			this.fat_level = data.product.nutrient_levels.fat
			this.fat_qty_100g = data.product.nutriments.fat_100g
			this.satured_fat_level =
				data.product.nutrient_levels['saturated-fat']
			this.satured_fat_qty_100g =
				data.product.nutriments['saturated-fat_100g']
			this.salt_level = data.product.nutrient_levels.salt
			this.salt_qty_100g = data.product.nutriments.salt_100g
			this.sugars_level = data.product.nutrient_levels.sugars
			this.sugars_qty_100g = data.product.nutriments.sugars_100g

			// nutritonal table
			this.energy_kj_100g = data.product.nutriments['energy-kj_100g']
			this.energy_kcal_100g = data.product.nutriments['energy-kcal_100g']
			this.carbohydrates_qty_100g =
				data.product.nutriments.carbohydrates_100g
			this.fibers_qty_100g = data.product.nutriments.fiber_100g
			this.proteins_qty_100g = data.product.nutriments.proteins_100g
			this.alcohol_qty = data.product.nutriments.alcohol_100g
			this.vagetable_qty_100g =
				data.product.nutriments[
					'fruits-vegetables-nuts-estimate-from-ingredients_100g'
				]
			// ingredient list
			this.ingredient_list = data.product.ingredients_text_with_allergens
		}
	}

	/**
	 *
	 * @memberof Product
	 */
	fillProductData(): void {
		// Panel - General infos
		const productBrand = document.querySelector(
			'#product-brand'
		) as HTMLLabelElement
		productBrand.innerHTML = this.brand

		const productName = document.querySelector(
			'#product-name'
		) as HTMLLabelElement
		productName.innerText = this.name

		const productQuantity = document.querySelector(
			'#product-quantity'
		) as HTMLLabelElement
		productQuantity.innerHTML = this.quantity

		const productImage = document.querySelector(
			'#front-image'
		) as HTMLImageElement

		productImage.setAttribute('src', this.image)
		productImage.setAttribute('alt', 'Front product image')
		productImage.setAttribute('title', 'Product image')

		// Panel - Nutrition facts
		this.setNutriscore()
		this.settNovascore()
		this.setEcoscore()
		this.setVeggieStatus()

		// Panel - Nutrition level for 100g
		const nutriLevels = ['fat', 'saturated_fat', 'salt', 'sugars']
		nutriLevels.forEach((nutrient: string) =>
			this.setNutrientLevel(nutrient)
		)

		// Panel - Nutritional table
		this.fillTable()

		// Panel - Ingredient list
		const ingreList = document.querySelector('#ingre-list') as HTMLElement
		ingreList.innerHTML = this.ingredient_list
	}

	setNutriscore(): void {
		const nutriImage = document.querySelector(
			'#nutri-image'
		) as HTMLImageElement

		switch (this.nutriscore) {
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
			default:
				nutriImage.setAttribute(
					'src',
					'/ressources/nutriscore/nutriscore-default.svg'
				)
				nutriImage.setAttribute('alt', 'Nutriscore unreachable')
				nutriImage.setAttribute('title', "Product's nutriscore")
		}
	}

	settNovascore(): void {
		const novaImage = document.querySelector(
			'#nova-image'
		) as HTMLImageElement

		switch (this.novascore) {
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
			default:
				novaImage.setAttribute(
					'src',
					'/ressources/novascore/novascore-default.svg'
				)
				novaImage.setAttribute('alt', 'Novascore unreachable')
				novaImage.setAttribute('title', "Product's novascore")
		}
	}

	setEcoscore(): void {
		const ecoImage = document.querySelector(
			'#eco-image'
		) as HTMLImageElement

		switch (this.ecoscore) {
			case 'a':
				ecoImage.setAttribute(
					'src',
					'/ressources/ecoscore/ecoscore-a.svg'
				)
				ecoImage.setAttribute('alt', 'EcoScore A')
				ecoImage.setAttribute('title', 'Very low environmental impacts')
				break
			case 'b':
				ecoImage.setAttribute(
					'src',
					'/ressources/ecoscore/ecoscore-b.svg'
				)
				ecoImage.setAttribute('alt', 'EcoScore B')
				ecoImage.setAttribute('title', 'Low environmental impacts')
				break
			case 'c':
				ecoImage.setAttribute(
					'src',
					'/ressources/ecoscore/ecoscore-c.svg'
				)
				ecoImage.setAttribute('alt', 'EcoScore C')
				ecoImage.setAttribute('title', 'Medium environmental impacts')
				break
			case 'd':
				ecoImage.setAttribute(
					'src',
					'/ressources/ecoscore/ecoscore-d.svg'
				)
				ecoImage.setAttribute('alt', 'EcoScore D')
				ecoImage.setAttribute('title', 'High environmental impacts')
				break
			case 'e':
				ecoImage.setAttribute(
					'src',
					'/ressources/ecoscore/ecoscore-e.svg'
				)
				ecoImage.setAttribute('alt', 'EcoScore E')
				ecoImage.setAttribute(
					'title',
					'Very high environmental impacts'
				)
				break
			default:
				ecoImage.setAttribute(
					'src',
					'/ressources/ecoscore/ecoscore-default.svg'
				)
				ecoImage.setAttribute('alt', 'Ecoscore unreachable')
				ecoImage.setAttribute('title', "Product's ecoscore")
		}
	}

	setVeggieStatus(): void {
		const veggie = document.querySelector(
			'#veggie-image'
		) as HTMLImageElement

		if (this.veggie === 'en:vegetarian') {
			veggie.style.display = 'flex'
		} else {
			veggie.style.display = 'none'
		}
	}

	setNutrientLevel(nutrient: string): void {
		const element = document.querySelector(
			`#nutrient-` + nutrient
		) as HTMLImageElement

		switch (nutrient) {
			case 'fat':
				element.innerHTML =
					setNutrientLevelSymbol(this.fat_level) +
					' fat (' +
					this.fat_qty_100g +
					' g)'
				break
			case 'saturated_fat':
				element.innerHTML =
					setNutrientLevelSymbol(this.satured_fat_level) +
					' saturated fat (' +
					this.satured_fat_qty_100g +
					' g)'
				break
			case 'sugars':
				element.innerHTML =
					setNutrientLevelSymbol(this.sugars_level) +
					' sugars (' +
					this.sugars_qty_100g +
					' g)'
				break
			case 'salt':
				element.innerHTML =
					setNutrientLevelSymbol(this.salt_level) +
					' salt (' +
					this.salt_qty_100g +
					' g)'
				break
		}

		function setNutrientLevelSymbol(nutrient_level: string) {
			switch (nutrient_level) {
				case 'low':
					return '🟢 - a low quantity of '
				case 'moderate':
					return '🟠 - a moderate quantity of'
				case 'high':
					return '🔴 - a high quantity of'
			}
		}
	}

	fillTable(): void {
		/* ENERGY */
		const energy = document.querySelector('#row_energy') as HTMLElement

		energy.childNodes[3].textContent =
			this.energy_kcal_100g + ' kcal / ' + this.energy_kj_100g
		;(' kJ')

		/* FAT */
		const fat = document.querySelector('#row_fat') as HTMLElement

		fat.childNodes[3].textContent = this.fat_qty_100g + ' g'

		/* SATURATED FAT */
		const satFat = document.querySelector(
			'#row_saturated-fat'
		) as HTMLElement

		satFat.childNodes[3].textContent = this.satured_fat_qty_100g + ' g'

		/* CARBOHYDRATES */
		const carbo = document.querySelector(
			'#row_carbohydrates'
		) as HTMLElement

		carbo.childNodes[3].textContent = this.carbohydrates_qty_100g + ' g'

		/* SUGARS */
		const sugars = document.querySelector('#row_sugars') as HTMLElement

		sugars.childNodes[3].textContent = this.sugars_qty_100g + ' g'

		/* FIBERS */
		const fibers = document.querySelector('#row_fiber') as HTMLElement

		fibers.childNodes[3].textContent = this.fibers_qty_100g + ' g'

		/* PROTEINS */
		const proteins = document.querySelector('#row_proteins') as HTMLElement

		proteins.childNodes[3].textContent = this.fibers_qty_100g + ' g'

		/* SALT */
		const salt = document.querySelector('#row_salt') as HTMLElement

		salt.childNodes[3].textContent = this.salt_qty_100g + ' g'

		/* ALCOHOL */
		const alcohol = document.querySelector('#row_alcohol') as HTMLElement

		if (this.alcohol_qty != null) {
			alcohol.childNodes[3].textContent = this.alcohol_qty + ' %'
		} else {
			alcohol.style.display = 'none'
		}

		/* FRUIT / VEGETABLE */
		const fruit = document.querySelector('#row_fruit') as HTMLElement

		fruit.childNodes[3].textContent = this.vagetable_qty_100g + ' g'
	}
}

/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                            FUNCTIONS                      	*/
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

/**
 *	Initialisation de l'input field avec ajout du listener
 */
function initInputFunction(): void {
	barcodeField?.addEventListener('input', listenerInputFunction)
}

/**
 *	Initialisation de l'accodeon avec ajout des listeners
 */
function initAccordionFunction(): void {
	const accordion = document.getElementsByClassName(
		'accordion'
	) as HTMLCollectionOf<HTMLElement>

	Array.from(accordion).forEach((button) => {
		button.addEventListener('click', listenerAccordionFunction)
	})
}

/**
 *	Construction de la requète à partir d'un code barre
 *
 * @param {string} barcode 	- Le code barre tapé par l'utilisateur
 * @return {*}  {string}	- La string complète pour faire la requète à l'API
 */
function queryConstructor(barcode: string): string {
	return `https://world.openfoodfacts.org/api/v0/product/` + barcode + `.json`
}

/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
/*                         LISTENER FUNCTIONS                 	*/
/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

/**
 * @param {HTMLInputElement} this 	- L'element auquel on associe le listener ( ici l'input field )
 * @param {Event} ev 				- L'evenement
 */
function listenerInputFunction(this: HTMLInputElement, ev: Event): void {
	ev.preventDefault()

	let barcode: string = barcodeField.value.trim()

	if (/\d{8,13}/.test(barcode)) {
		fetch(queryConstructor(barcode))
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
				product.fillProductData()
			})
	}
}

/**
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
