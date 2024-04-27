import { Markup } from "telegraf";
import { message } from "telegraf/filters";
import { BaseScene } from "telegraf/scenes"
import changeWaterAmount from "../services/changeWaterAmount.js";

const addWaterIntakeScene = () => {
    const addWaterIntake = new BaseScene("waterIntake");

    addWaterIntake.enter();
    addWaterIntake.on(message('text'), (ctx) => {
        let waterAmount = Number(ctx.message.text);
        if (waterAmount) {
            changeWaterAmount()
            ctx.reply("Приём воды записан.\nЗа сегодня вы выпили - ```N``` литров/литра/литр!", Markup.inlineKeyboard([
                [Markup.button.callback("Меню", "menu")],
                [Markup.button.callback("Записать приём воды", "add_water")],
            ]))
            ctx.scene.leave()
        } else {
            ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800")
        }
    });
    addWaterIntake.on("message", ctx => ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800"));
    return addWaterIntake;
}
export default addWaterIntakeScene;