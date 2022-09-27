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
		product_image.setAttribute("src", data.product.image_front_url);

		// Panel - Nutrition facts
		get_veggie_status(data);
		get_nutriscore(data);
		get_novascore(data);
		get_ecoscore(data);

		// Panel - Nutrition level for 100g
		var nutri_levels = ["fat", "saturated-fat", "sugars", "salt"];
		nutri_levels.forEach((element) => get_nutrient_level(data, element));

		// Panel - Nutritional table
		fill_table(data);

		var ingr_list = document.querySelector("#ingre-list");
		ingr_list.innerHTML = data.product.ingredients_text_with_allergens;
	}

	function get_product_name(data) {
		if (data.product.product_name != "") {
			product_name.innerHTML = data.product.product_name;
		} else if (data.product.product_name_en != "") {
			product_name.innerHTML = data.product.product_name_en;
		} else if (data.product.generic_name != "") {
			product_name.innerHTML = data.product.generic_name;
		} else if (data.product.generic_name_en != "") {
			product_name.innerHTML = data.product.generic_name_en;
		} else if (data.product.product_name_fr != "") {
			product_name.innerHTML = data.product.product_name_fr;
		} else if (data.product.generic_name_fr != "") {
			product_name.innerHTML = data.product.generic_name_fr;
		}
	}

	function get_veggie_status(data) {
		var veggie = document.querySelector("#veggie-image");

		if (data.product.ingredients_analysis_tags[2] == "en:vegetarian") {
			veggie.style.display = "flex";
		} else {
			veggie.style.display = "none";
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

	function get_nutrient_level(data, item) {
		var element = document.querySelector(`#nutrient-${item}`);

		switch (item) {
			case "fat":
				element.innerHTML =
					get_nutrient_level_symbol(
						data.product.nutrient_levels["fat"]
					) +
					" " +
					data.product.nutriments.fat_100g +
					data.product.nutriments.fat_unit +
					" of Fat";
				break;

			case "saturated-fat":
				element.innerHTML =
					get_nutrient_level_symbol(
						data.product.nutrient_levels["saturated-fat"]
					) +
					" " +
					data.product.nutriments["saturated-fat_100g"] +
					data.product.nutriments["saturated-fat_unit"] +
					" of Saturated Fat";
				break;
			case "sugars":
				element.innerHTML =
					get_nutrient_level_symbol(
						data.product.nutrient_levels.sugars
					) +
					" " +
					data.product.nutriments.sugars_100g +
					data.product.nutriments.sugars_unit +
					" of Sugars";
				break;
			case "salt":
				element.innerHTML =
					get_nutrient_level_symbol(
						data.product.nutrient_levels.salt
					) +
					" " +
					data.product.nutriments.salt_100g +
					data.product.nutriments.salt_unit +
					" of Salt";
				break;
		}
	}

	function get_nutrient_level_symbol(data) {
		switch (data) {
			case "low":
				return "🟢";
				break;
			case "moderate":
				return "🟠";
				break;
			case "high":
				return "🔴";
				break;
		}
	}

	function fill_table(data) {
		/* ENERGY */
		var energy = document.querySelector("#row_energy");

		if (data.product.nutriments["energy-kj_100g"] != null) {
			energy.childNodes[3].innerHTML =
				data.product.nutriments["energy-kj_100g"] +
				" " +
				data.product.nutriments["energy-kj_unit"] +
				" (" +
				data.product.nutriments["energy-kcal_100g"] +
				" " +
				data.product.nutriments["energy-kcal_unit"] +
				")";
		}

		/* FAT */
		var fat = document.querySelector("#row_fat");

		if (data.product.nutriments["fat_100g"] != null) {
			fat.childNodes[3].innerHTML =
				data.product.nutriments["fat_100g"] +
				" " +
				data.product.nutriments["fat_unit"];
		}

		/* SATURATED FAT */
		var sat_fat = document.querySelector("#row_saturated-fat");

		if (data.product.nutriments["saturated-fat_100g"] != null) {
			sat_fat.childNodes[3].innerHTML =
				data.product.nutriments["saturated-fat_100g"] +
				" " +
				data.product.nutriments["saturated-fat_unit"];
		} else {
			sat_fat.style.display = "none";
		}

		/* CARBOHYDRATES */
		var carbo = document.querySelector("#row_carbohydrates");

		if (data.product.nutriments["carbohydrates_100g"] != null) {
			carbo.childNodes[3].innerHTML =
				data.product.nutriments["carbohydrates_100g"] +
				" " +
				data.product.nutriments["carbohydrates_unit"];
		}

		/* SUGARS */
		var sugars = document.querySelector("#row_sugars");

		if (data.product.nutriments["sugars_100g"] != null) {
			sugars.childNodes[3].innerHTML =
				data.product.nutriments["sugars_100g"] +
				" " +
				data.product.nutriments["sugars_unit"];
		} else {
			sugars.style.display = "none";
		}

		/* FIBERS */
		var fibers = document.querySelector("#row_fiber");

		if (data.product.nutriments["fiber_100g"] != null) {
			fibers.childNodes[3].innerHTML =
				data.product.nutriments["fiber_100g"] +
				" " +
				data.product.nutriments["fiber_unit"];
		}

		/* PROTEINS */
		var proteins = document.querySelector("#row_proteins");

		if (data.product.nutriments["proteins_100g"] != null) {
			proteins.childNodes[3].innerHTML =
				data.product.nutriments["proteins_100g"] +
				" " +
				data.product.nutriments["proteins_unit"];
		}

		/* SALT */
		var salt = document.querySelector("#row_salt");

		if (data.product.nutriments["salt_100g"] != null) {
			salt.childNodes[3].innerHTML =
				data.product.nutriments["salt_100g"] +
				" " +
				data.product.nutriments["salt_unit"];
		}

		/* ALCOHOL */
		var alcohol = document.querySelector("#row_alcohol");

		if (data.product.nutriments["alcohol_100g"] != null) {
			alcohol.childNodes[3].innerHTML =
				data.product.nutriments["alcohol_100g"] +
				" " +
				data.product.nutriments["alcohol_unit"];
		} else {
			alcohol.style.display = "none";
		}

		/* FRUIT / VEGETABLE */
		var fruit = document.querySelector("#row_fruit");

		if (
			data.product.nutriments[
				"fruits-vegetables-nuts-estimate-from-ingredients_100g"
			] != null
		) {
			fruit.childNodes[3].innerHTML =
				data.product.nutriments[
					"fruits-vegetables-nuts-estimate-from-ingredients_100g"
				] + " %";
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

	var accordeon = document.getElementsByClassName("accordeon");
	var i;

	for (i = 0; i < accordeon.length; i++) {
		accordeon[i].addEventListener("click", function () {
			this.classList.toggle("active");

			var panel = this.nextElementSibling;
			if (panel.style.display === "flex") {
				panel.style.display = "none";
			} else {
				panel.style.display = "flex";
			}
		});
	}
})();
