import { Markup } from "telegraf";
import { message } from "telegraf/filters";
import { BaseScene } from "telegraf/scenes"
import createWaterIntake from "../services/createWaterIntake.js";
import getTodayIntakesSum from "../services/getTodayIntakesSum.js";
import getUser from "../services/getUser.js";
import { keyboards } from "../keyboards.js";

const addWaterIntakeSceneCreator = () => {
    const addWaterIntake = new BaseScene("waterIntake");

    addWaterIntake.enter(ctx => {
        ctx.reply("Напишите числом, сколько воды в мл (миллилитрах) вы выпили")
    });
    addWaterIntake.on(message('text'), async (ctx) => {
        let waterAmount = Number(ctx.message.text);
        console.log(Number.isInteger(waterAmount))
        if (Number.isInteger(waterAmount) & waterAmount > -1) {
            await createWaterIntake(ctx.chat.id, waterAmount);

            let currentAmount = await getTodayIntakesSum(ctx.chat.id);
            let user = await getUser(ctx.chat.id);
            let userWater = user.user.total_water_amount;
            let waterPercentage = (currentAmount * 100 / userWater).toFixed(2);
            let progress = "\n▪️▪️▪️▪️▪️▪️ - -1%";

            if (currentAmount < userWater / 6) {
                progress = `\n▪️▪️▪️▪️▪️▪️ - ${waterPercentage}%`;
            } else if (currentAmount < userWater / 6 * 2) {
                progress = `\n🟩▪️▪️▪️▪️▪️ - ${waterPercentage}%`;
            } else if (currentAmount < userWater / 6 * 3) {
                progress = `\n🟩🟩▪️▪️▪️▪️ - ${waterPercentage}%`;
            } else if (currentAmount < userWater / 6 * 4) {
                progress = `\n🟩🟩🟩▪️▪️▪️ - ${waterPercentage}%`;
            } else if (currentAmount < userWater / 6 * 5) {
                progress = `\n🟩🟩🟩🟩▪️▪️ - ${waterPercentage}%`;
            } else if (currentAmount < userWater) {
                progress = `\n🟩🟩🟩🟩🟩▪️ - ${waterPercentage}%`;
            } else if (currentAmount <= userWater + userWater / 10) {
                progress = `\n🟩🟩🟩🟩🟩🟩 - ${waterPercentage}%`;
            } else {
                progress = `\n🟩🟩🟩🟩🟩🟩🟧 - ${waterPercentage}%`;
            }

            ctx.reply(`Приём воды записан.\nЗа сегодня вы выпили - ${currentAmount / 1000} литра.${progress}`,
                Markup.inlineKeyboard(keyboards.main));

            await ctx.scene.leave();
        } else {
            ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800");
        }
    });
    addWaterIntake.on("message", ctx => ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800"));
    return addWaterIntake;
}
export default addWaterIntakeSceneCreator;