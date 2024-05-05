import { Markup } from "telegraf";
import { message } from "telegraf/filters";
import { BaseScene } from "telegraf/scenes"
import createWaterIntake from "../services/createWaterIntake.js";
import getTodayIntakesSum from "../services/getTodayIntakesSum.js";
import getUser from "../services/getUser.js";

const addWaterIntakeSceneCreator = () => {
    const addWaterIntake = new BaseScene("waterIntake");

    addWaterIntake.enter(ctx => {
        ctx.reply("Напишите числом, сколько воды в мл (миллилитрах) вы выпили")
    });
    addWaterIntake.on(message('text'), async (ctx) => {

        let waterAmount = Number(ctx.message.text);
        if (waterAmount) {
            await createWaterIntake(ctx.chat.id, waterAmount);

            let currentAmount = await getTodayIntakesSum(ctx.chat.id);
            let user = await getUser(ctx.chat.id);
            let userWater = user.user.total_water_amount;

            let progress = "\n▪️▪️▪️▪️▪️▪️ - -1%";
            if (currentAmount < userWater / 6) {
                progress = `\n▪️▪️▪️▪️▪️▪️ - ${currentAmount * 100 / userWater}%`;
            } else if (currentAmount < userWater / 6 * 2) {
                progress = `\n🟩▪️▪️▪️▪️▪️ - ${currentAmount * 100 / userWater}%`;
            } else if (currentAmount < userWater / 6 * 3) {
                progress = `\n🟩🟩▪️▪️▪️▪️ - ${currentAmount * 100 / userWater}%`;
            } else if (currentAmount < userWater / 6 * 4) {
                progress = `\n🟩🟩🟩▪️▪️▪️ - ${currentAmount * 100 / userWater}%`;
            } else if (currentAmount < userWater / 6 * 5) {
                progress = `\n🟩🟩🟩🟩▪️▪️ - ${currentAmount * 100 / userWater}%`;
            } else if (currentAmount < userWater) {
                progress = `\n🟩🟩🟩🟩🟩▪️ - ${currentAmount * 100 / userWater}%`;
            } else if (currentAmount <= userWater + userWater / 10) {
                progress = `\n🟩🟩🟩🟩🟩🟩 - ${currentAmount * 100 / userWater}%`;
            } else {
                progress = `\n🟩🟩🟩🟩🟩🟩🟧 - ${currentAmount * 100 / userWater}%`;
            }

            ctx.reply(`Приём воды записан.\nЗа сегодня вы выпили - ${currentAmount / 1000} литра.${progress}`, Markup.inlineKeyboard([
                [Markup.button.callback("Меню", "menu")],
                [Markup.button.callback("Записать приём воды", "add_water")],
                [Markup.button.callback("Профиль", "profile")],
                [Markup.button.callback("Настройки", "settings")],
            ]));

            ctx.scene.leave();
        } else {
            ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800");
        }
    });
    addWaterIntake.on("message", ctx => ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800"));
    return addWaterIntake;
}
export default addWaterIntakeSceneCreator;