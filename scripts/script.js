(function () {
	("use strict");

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                            CONSTANTES                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	let barecode_field = document.querySelector("#barecode-field");

	let product_brand = document.querySelector("#product-brand");
	let product_name = document.querySelector("#product-name");
	let product_quantity = document.querySelector("#product-quantity");
	let product_image = document.querySelector("#product-image");

	let nutri_image = document.querySelector("#nutri-image");
	let nova_image = document.querySelector("#nova-image");
	let eco_image = document.querySelector("#eco-image");

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                             VARIABLES                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                             FONCTIONS                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	// Construction de la requète à partir d'un code barre
	function queryConstructor(barecode) {
		return `https://world.openfoodfacts.org/api/v0/product/${barecode}.json`;
	}

	// Aqcuisition des données à partir de l'api
	function fetch_product_by_bc(barecode) {
		// fetch - demande à l'API des infos produit correspondant au code barre
		fetch(queryConstructor(barecode), { method: "GET" })
			// On récuère la réponse dans un .JSON
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error, status = ${response.status}`);
				}
				return response.json();
			})

			// On traite les données
			.then((data) => {
				fill_product(data);
			})

			// Gestion des erreurs
			.catch(console.error);
	}

	function fill_product(data) {
		product_brand.innerHTML = data.product.brands;
		// Gestion du nom du produit
		get_product_name(data);
		product_quantity.innerHTML = data.product.quantity;
		product_image.setAttribute(
			"src",
			data.product.selected_images.front.small.fr
		);
		get_nutriscore(data);
		get_novascore(data);
		get_ecoscore(data);
	}

	function get_product_name(data) {
		if (data.product.product_name_fr != "") {
			product_name.innerHTML = data.product.product_name_fr;
		} else {
			product_name.innerHTML = data.product.product_name;
		}
	}

	function get_nutriscore(data) {
		switch (data.product.nutriscore_grade) {
			case "a":
				nutri_image.setAttribute(
					"src",
					"/ressources/nutriscore/nutriscore-a.svg"
				);
				nutri_image.setAttribute("alt", "Nutriscore A");
				nutri_image.setAttribute(
					"title",
					"Très bonne qualité nutritionnelle"
				);
				break;
			case "b":
				nutri_image.setAttribute(
					"src",
					"/ressources/nutriscore/nutriscore-b.svg"
				);
				nutri_image.setAttribute("alt", "Nutriscore B");
				nutri_image.setAttribute(
					"title",
					"Bonne qualité nutritionnelle"
				);
				break;
			case "c":
				nutri_image.setAttribute(
					"src",
					"/ressources/nutriscore/nutriscore-c.svg"
				);
				nutri_image.setAttribute("alt", "Nutriscore C");
				nutri_image.setAttribute(
					"title",
					"Qualité nutritionnelle moyenne"
				);
				break;
			case "d":
				nutri_image.setAttribute(
					"src",
					"/ressources/nutriscore/nutriscore-d.svg"
				);
				nutri_image.setAttribute("alt", "Nutriscore D");
				nutri_image.setAttribute(
					"title",
					"Mauvaise qualité nutritionnelle"
				);
				break;
			case "e":
				nutri_image.setAttribute(
					"src",
					"/ressources/nutriscore/nutriscore-e.svg"
				);
				nutri_image.setAttribute("alt", "Nutriscore E");
				nutri_image.setAttribute(
					"title",
					"Mauvaise qualité nutritionnelle"
				);
				break;
		}
	}

	function get_novascore(data) {
		switch (data.product.nova_group) {
			case 1:
				nova_image.setAttribute(
					"src",
					"/ressources/novascore/novascore-1.svg"
				);
				nova_image.setAttribute("alt", "NOVA 1");
				nova_image.setAttribute(
					"title",
					"Aliments non transformés ou minimalement transformés"
				);
				break;
			case 2:
				nova_image.setAttribute(
					"src",
					"/ressources/novascore/novascore-2.svg"
				);
				nova_image.setAttribute("alt", "NOVA 2");
				nova_image.setAttribute(
					"title",
					"Ingrédients culinaires transformés"
				);
				break;
			case 3:
				nova_image.setAttribute(
					"src",
					"/ressources/novascore/novascore-3.svg"
				);
				break;
			case 4:
				nova_image.setAttribute(
					"src",
					"/ressources/novascore/novascore-4.svg"
				);
				break;
		}
	}

	function get_ecoscore(data) {
		switch (data.product.ecoscore_grade) {
			case "a":
				eco_image.setAttribute(
					"src",
					"/ressources/ecoscore/ecoscore-a.svg"
				);
				break;
			case "b":
				eco_image.setAttribute(
					"src",
					"/ressources/ecoscore/ecoscore-b.svg"
				);
				break;
			case "c":
				eco_image.setAttribute(
					"src",
					"/ressources/ecoscore/ecoscore-c.svg"
				);
				break;
			case "d":
				eco_image.setAttribute(
					"src",
					"/ressources/ecoscore/ecoscore-d.svg"
				);
				break;
			case "e":
				eco_image.setAttribute(
					"src",
					"/ressources/nutriscore/ecoscore-e.svg"
				);
				break;
		}
	}

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                            LISTENERS                      	*/
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */

	// Listener sur le champs de recherche de code barre
	barecode_field.addEventListener("input", () => {
		if (barecode_field.value.trim().length == 13) {
			fetch_product_by_bc(barecode_field.value.trim());
		} else {
		}
	});

	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
	/*                            INITIALIZE                        */
	/*  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   */
})();
