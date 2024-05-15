import { Markup } from "telegraf";
import { message } from "telegraf/filters";
import { BaseScene } from "telegraf/scenes"
import getUser from "../services/getUser.js";
import { keyboards } from "../utils/keyboards.js";
import getNutrients from "../services/getNutrients.js";
import translate from "translate";
import createMeal from "../services/createMeal.js";
import createProducts from "../services/createProducts.js";
import getTodayMealsSum from "../services/getTodayMealsSum.js";
import { msg } from "../utils/messageGenerator.js";

const addMealSceneCreator = () => {
    const STATE = {
        ROBOT: "robot",
        MANUAL: "manual",
    }

    const addMealScene = new BaseScene("addMeal");

    let foodData = {};
    let userMeal = "";

    addMealScene.enter(async (ctx) => {
        await ctx.reply(`Введите продукты, которые вы съели, например "200 грамм гречки и 100 грамм курицы": `);
        ctx.session.state = STATE.ROBOT;
    });
    addMealScene.on(message('text'), async (ctx) => {
        userMeal = ctx.message.text;
        switch (ctx.session.state) {
            case STATE.ROBOT:
                let translatedMeal = await translate(userMeal, { to: "English", from: "Russian" });
                foodData = await getNutrients(translatedMeal);
                foodData["userMeal"] = userMeal;

                console.log(foodData);

                if (foodData.success) {
                    await ctx.replyWithHTML(foodData.food_msg + "\n\nВсё верно?", Markup.inlineKeyboard(keyboards.yes_no));

                } else {
                    await ctx.replyWithHTML("Не удалось распознать продукты. Попробовать снова?",
                        Markup.inlineKeyboard([
                            [Markup.button.callback("Да", "try_again")],
                            [Markup.button.callback("Впишу самостоятельно", "write_by_yourself")]
                        ]));
                }
                break;

            case STATE.MANUAL:
                let splittedUserQuery = userMeal.split("\n");
                let queryLen = splittedUserQuery.length;
                let products = [];
                let userMealName = [];
                let foodMsg = "";
                if (queryLen % 4 == 0) {
                    for (let i = 0; i < queryLen; i += 4) {
                        if (
                            !isNaN((Number(splittedUserQuery[i + 1]))) &
                            !isNaN((Number(splittedUserQuery[i + 2]))) &
                            !isNaN((Number(splittedUserQuery[i + 3])))
                        ) {
                            userMealName.push(splittedUserQuery[i]);
                            let proteins = Number(splittedUserQuery[i + 1]);
                            let fat = Number(splittedUserQuery[i + 2]);
                            let carbohydrates = Number(splittedUserQuery[i + 3]);
                            let calories = proteins * 4 + fat * 9 + carbohydrates * 4;

                            products.push({
                                "name": splittedUserQuery[i + 0],
                                "calories": calories,
                                "proteins": proteins,
                                "fat": fat,
                                "carbohydrates": carbohydrates,
                            });

                            foodMsg +=
                                `<b>${splittedUserQuery[i]}</b> ${(calories).toFixed(2)} ккал\n` +
                                `БЖУ: ${(proteins).toFixed(2)}/${(fat).toFixed(2)}/${(carbohydrates).toFixed(2)}\n`;

                        } else {
                            ctx.reply("Кажется, вы ввели текст в БЖУ. Попробуйте снова.");
                            break;
                        }
                    }

                    foodData["userMeal"] = userMealName.join(", ")
                    foodData["products"] = products;
                    foodData["total_calories"] = products.reduce((sum, item) => sum + item.calories, 0);
                    foodData["total_proteins"] = products.reduce((sum, item) => sum + item.proteins, 0);
                    foodData["total_fat"] = products.reduce((sum, item) => sum + item.fat, 0);
                    foodData["total_carbohydrates"] = products.reduce((sum, item) => sum + item.carbohydrates, 0);

                    foodMsg +=
                        `\nВсего КБЖУ за приём:\n` +
                        `${(foodData.total_calories).toFixed(2)}/${(foodData.total_proteins).toFixed(2)}/` +
                        `${(foodData.total_fat).toFixed(2)}/${(foodData.total_carbohydrates).toFixed(2)}`

                    await ctx.replyWithHTML(foodMsg + "\n\nВсё верно?", Markup.inlineKeyboard(keyboards.yes_no));

                } else {
                    ctx.reply("Неправильная структура запроса. Попробуйте еще раз.");
                }

                console.log(foodData);
                break;
        }
    });

    addMealScene.action("yes", async (ctx) => {
        let mealData = await createMeal(
            ctx.chat.id, foodData.userMeal, foodData.total_calories,
            foodData.total_proteins, foodData.total_fat, foodData.total_carbohydrates
        );
        if (foodData.products.length > 1) {
            await createProducts(mealData.meal.id, foodData.products);
        }

        let user = await getUser(ctx.chat.id);

        let todayMeals = await getTodayMealsSum(ctx.chat.id)
        let caloriesProgress = msg.vizual_percentage(user.user.total_calories, todayMeals.calories_sum);
        let proteinsProgress = msg.vizual_percentage(user.user.total_proteins, todayMeals.proteins_sum);
        let fatProgress = msg.vizual_percentage(user.user.total_fat, todayMeals.fat_sum);
        let carbohydratesProgress = msg.vizual_percentage(user.user.total_carbohydrates, todayMeals.carbohydrates_sum);

        await ctx.scene.leave();
        if (mealData.success) {
            await ctx.replyWithHTML(
                `Приём пищи записан!\n\n` +
                `Статистика за сегодня:\n` +
                `<b>Калории:</b> ${todayMeals.calories_sum}\n${caloriesProgress}\n\n` +
                `<b>Белки:</b> ${todayMeals.proteins_sum}\n${proteinsProgress}\n\n` +
                `<b>Жиры:</b> ${todayMeals.fat_sum}\n${fatProgress}\n\n` +
                `<b>Углеводы:</b> ${todayMeals.carbohydrates_sum}\n${carbohydratesProgress}\n\n`,
                Markup.inlineKeyboard(keyboards.main));
            await ctx.answerCbQuery("Данные записаны");
        } else {
            await ctx.reply("Что-то пошло не так. Попробуйте ещё раз.", Markup.inlineKeyboard(keyboards.main));
            await ctx.answerCbQuery("Ошибка");
        }
    });

    addMealScene.action("no", async (ctx) => {
        await ctx.replyWithHTML("Прошу прощения за ошибку. Попробовать распознать снова?",
            Markup.inlineKeyboard([
                [Markup.button.callback("Да", "try_again")],
                [Markup.button.callback("Впишу самостоятельно", "write_by_yourself")]
            ]));
        await ctx.answerCbQuery("");
    });

    addMealScene.action("try_again", async (ctx) => {
        await ctx.scene.enter("addMeal");
        await ctx.answerCbQuery("");
    });

    addMealScene.action("write_by_yourself", async (ctx) => {
        await ctx.answerCbQuery("");
        ctx.session.state = STATE.MANUAL;
        await ctx.replyWithHTML(
            `Напишите название продукта и его БЖУ в столбик.\n` +
            `Вы можете указать продукты отдельно с указанием БЖУ ` +
            `для каждого, либо записать полное название блюда и ` +
            `указать суммарное БЖУ.\n\n` +
            `<b>Например:</b>\n` +
            `Гречка\n` +
            `16.2\n` +
            `4.8\n` +
            `84\n` +
            `Курица\n` +
            `36.4\n` +
            `36.8\n` +
            `0\n`
        );
    });

    addMealScene.on("message", ctx => ctx.reply("Не разобрал. Попробуйте ещё раз"));

    return addMealScene;
}
export default addMealSceneCreator;