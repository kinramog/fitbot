import { Markup } from "telegraf";
import { message } from "telegraf/filters";
import { BaseScene } from "telegraf/scenes"
import createWaterIntake from "../services/createWaterIntake.js";
import getTodayIntakesSum from "../services/getTodayIntakesSum.js";

const addWaterIntakeSceneCreator = () => {
    const addWaterIntake = new BaseScene("waterIntake");

    addWaterIntake.enter(ctx => {
        ctx.reply("Напишите числом, сколько воды в мл (миллилитрах) вы выпили")
    });
    addWaterIntake.on(message('text'), async (ctx) => {

        let waterAmount = Number(ctx.message.text);
        if (waterAmount) {
            await createWaterIntake(ctx.chat.id, waterAmount);
            
            let day_amount = await getTodayIntakesSum(ctx.chat.id);
            ctx.reply(`Приём воды записан.\nЗа сегодня вы выпили - ${day_amount/1000} литра`, Markup.inlineKeyboard([
                [Markup.button.callback("Меню", "menu")],
                [Markup.button.callback("Записать приём воды", "add_water")],
            ]))

            ctx.scene.leave();
        } else {
            ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800");
        }
    });
    addWaterIntake.on("message", ctx => ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800"));
    return addWaterIntake;
}
export default addWaterIntakeSceneCreator;