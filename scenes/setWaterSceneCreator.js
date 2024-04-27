import { Markup } from "telegraf";
import { message } from "telegraf/filters";
import { BaseScene } from "telegraf/scenes"
import changeWaterAmount from "../services/changeWaterAmount.js";

const setWaterSceneCreator = () => {
    const setWaterScene = new BaseScene("setWater");

    setWaterScene.enter(ctx => {
        ctx.reply("Напишите числом, какое количество воды в мл (миллилитрах) вы хотели бы выпивать в день");
    });
    setWaterScene.on(message('text'), (ctx) => {
        let waterAmount = Number(ctx.message.text);
        if (waterAmount) {
            changeWaterAmount()

            ctx.reply("Количество воды в день установлено", Markup.inlineKeyboard([
                [Markup.button.callback("Меню", "menu")],
                [Markup.button.callback("Записать приём воды", "add_water")],
            ]))
            ctx.reply(ctx.message.text)
            ctx.scene.leave()
        } else {
            ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800")
        }
    });
    setWaterScene.on("message", ctx => ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800"));
    return setWaterScene;
}
export default setWaterSceneCreator;