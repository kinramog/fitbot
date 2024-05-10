import { Markup } from "telegraf";
import { message } from "telegraf/filters";
import { BaseScene } from "telegraf/scenes"
import { keyboards } from "../utils/keyboards.js";
import changeUser from "../services/changeUser.js";

const editUserParamsSceneCreator = () => {
    const editUserParamsScene = new BaseScene("editUser");
    const params = {
        "height": "Рост",
        "weight": "Вес",
        "gender": "Пол",
        "age": "Возраст",
        "total_calories": "Калории",
        "total_proteins": "Белки",
        "total_fat": "Жиры",
        "total_carbohydrates": "Углеводы",
    }

    editUserParamsScene.enter(async (ctx) => {
        const paramName = ctx.session.param;
        await ctx.reply(`Введите новое значение параметра - ${params[paramName]}:`);
    });
    editUserParamsScene.on(message('text'), async (ctx) => {
        let paramValue = Number(ctx.message.text);
        if (Number.isInteger(paramValue) & paramValue > -1) {
            const paramName = ctx.session.param;
            console.log(paramName)
            let chat_id = ctx.chat.id;
            let query = {};
            query[paramName] = paramValue
            const user = await changeUser(chat_id, query);
            await ctx.reply("Новое значение параметра установлено.")
            await ctx.scene.leave()
            delete ctx.session.param;
            let timezone = user.user.timezone;
            let waterBalance = user.user.total_water_amount;
            let height = user.user.height;
            let weight = user.user.weight;
            let age = user.user.age;
            let gender = user.user.gender;
            let calories = user.user.total_calories;
            let proteins = user.user.total_proteins;
            let fat = user.user.total_fat;
            let carbohydrate = user.user.total_carbohydrate;
            await ctx.replyWithHTML(
                `<b>Ваш профиль</b>, ${ctx.chat.username}\n` +
                `~~~~~~~~~~~~~~~~~~~~~~~~~~\n` +
                `<b>Рост:</b> ${height} см\n` +
                `<b>Вес:</b> ${weight} кг\n` +
                `<b>Возраст:</b> ${age}\n` +
                `<b>Пол:</b> ${gender}\n` +
                `~~~~~~~~~~~~~~~~~~~~~~~~~~\n` +
                `<b>Норма воды в день:</b> ${waterBalance} мл\n` +
                `<b>Суточная норма калорий:</b> ${calories} ккал\n` +
                `<b>Суточная норма\nБелков/Жиров/Углеводов:</b>\n` +
                `${proteins}/${fat}/${carbohydrate}\n` +
                `<b>Часовой пояс:</b> ${timezone}\n` +
                `~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
                Markup.inlineKeyboard(keyboards.profile_and_settings)
            )
        } else {
            await ctx.reply("Пожалуйста, введите только число без иных символов.")
        }
    });
    editUserParamsScene.on("message", async ctx =>
        await ctx.reply("Пожалуйста, введите только число без иных символов.")
    );
    return editUserParamsScene;
}
export default editUserParamsSceneCreator;