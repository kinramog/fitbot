import translate from "translate";
import { config } from "../config.js";

const getNutrients = async (query) => {
    const url = `https://trackapi.nutritionix.com/v2/natural/nutrients`;
    try {


        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-app-id": config["x-app-id"],
                "x-app-key": config["x-app-key"],
            },
            body: JSON.stringify({ query })
        }

        let data = await fetch(url, requestOptions);
        let jsonData = await data.json();
        // console.log(jsonData);
        let nutrients = {};
        let products = [];
        let foodMsg = "";
        let food_names = {};
        let total_calories = 0;
        let total_proteins = 0;
        let total_fat = 0;
        let total_carbohydrates = 0;

        if (jsonData.foods) {
            for (const food of jsonData.foods) {
                let food_name_translated = await translate(food.food_name, { to: "Russian", from: "English" });
                food_names[food.food_name] = food_name_translated.charAt(0).toUpperCase() + food_name_translated.slice(1);
                total_calories += food.nf_calories
                total_proteins += food.nf_protein
                total_fat += food.nf_total_fat
                total_carbohydrates += food.nf_total_carbohydrate
                products.push({
                    "name": food_names[food.food_name],
                    "calories": food.nf_calories,
                    "proteins": food.nf_protein,
                    "fat": food.nf_total_fat,
                    "carbohydrates": food.nf_total_carbohydrate,
                })

                foodMsg +=
                    `<b>${food_names[food.food_name]}</b> ${(food.serving_weight_grams).toFixed(2)} г / ${(food.nf_calories).toFixed(2)} ккал\n` +
                    `БЖУ: ${(food.nf_protein).toFixed(2)}/${(food.nf_total_fat).toFixed(2)}/${(food.nf_total_carbohydrate).toFixed(2)}\n`;
            }
            foodMsg +=
                `\nВсего КБЖУ за приём:\n` +
                `${(total_calories).toFixed(2)}/${(total_proteins).toFixed(2)}/${(total_fat).toFixed(2)}/${(total_carbohydrates).toFixed(2)}`

            nutrients = {
                "success": true,
                "food_msg": foodMsg,
                "food_names": food_names,
                "total_calories": (total_calories).toFixed(2),
                "total_proteins": (total_proteins).toFixed(2),
                "total_fat": (total_fat).toFixed(2),
                "total_carbohydrates": (total_carbohydrates).toFixed(2),
                "products": products,
            };

        } else {
            nutrients = {
                "success": false,
            };
        }
        return nutrients
    } catch (error) {
        console.error("Ошибка в getNutrients.js\n", error);
    }
    
    // foods_msg +=
    //     `<b>{food_name}</b> {food.serving_weight_grams} г / {int(calories)} ккал\n` +
    //     `БЖУ: {protein}/{fat}/{carbohydrate}`
    // foods_msg += `\nВсего КБЖУ: {int(total_calories)}/{int(total_protein)}/{int(total_fat)}/{int(total_carbohydrate)}`
    // foods_msg += '\nВсе верно?'
}

export default getNutrients;
