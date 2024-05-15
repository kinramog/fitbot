import { Markup } from "telegraf";
import { message } from "telegraf/filters";
import { BaseScene } from "telegraf/scenes"
import createWaterIntake from "../services/createWaterIntake.js";
import getTodayIntakesSum from "../services/getTodayIntakesSum.js";
import getUser from "../services/getUser.js";
import { keyboards } from "../utils/keyboards.js";
import { msg } from "../utils/messageGenerator.js";

const addWaterIntakeSceneCreator = () => {
    const addWaterIntake = new BaseScene("waterIntake");

    addWaterIntake.enter(ctx => {
        ctx.reply("Напишите числом, сколько воды в мл (миллилитрах) вы выпили")
    });
    addWaterIntake.on(message('text'), async (ctx) => {
        let waterAmount = Number(ctx.message.text);

        if (Number.isInteger(waterAmount) & waterAmount >= 0) {
            // Чтобы не записывать нулевые значения в бд, но дать пользователю ввести ноль, если он случайно нажал на запись
            if (waterAmount != 0) {
                await createWaterIntake(ctx.chat.id, waterAmount);
            }
            let user = await getUser(ctx.chat.id);
            let userWater = user.user.total_water_amount;
            let currentAmount = await getTodayIntakesSum(ctx.chat.id);
            let progress = msg.vizual_percentage(userWater, currentAmount);

            await ctx.reply(`Приём воды записан.\nЗа сегодня вы выпили - ${currentAmount / 1000} литра.\n${progress}`,
                Markup.inlineKeyboard(keyboards.main));

            await ctx.scene.leave();
        } else {
            ctx.reply("Пожалуйста, введите только число без иных символов. Например: 250");
        }
    });
    addWaterIntake.on("message", ctx => ctx.reply("Пожалуйста, введите только число без иных символов. Например: 300"));
    return addWaterIntake;
}
export default addWaterIntakeSceneCreator;