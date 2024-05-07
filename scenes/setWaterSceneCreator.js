import { Markup } from "telegraf";
import { message } from "telegraf/filters";
import { BaseScene } from "telegraf/scenes"
import changeWaterAmount from "../services/changeWaterAmount.js";
import { keyboards } from "../keyboards.js";

const setWaterSceneCreator = () => {
    const setWaterScene = new BaseScene("setWater");

    setWaterScene.enter(ctx => {
        ctx.reply("Напишите числом, какое количество воды в мл (миллилитрах) вы хотели бы выпивать в день");
    });
    setWaterScene.on(message('text'), (ctx) => {
        let waterAmount = Number(ctx.message.text);
        if (waterAmount) {
            let chat_id = ctx.chat.id;
            let water_amount = ctx.message.text;
            changeWaterAmount(chat_id, water_amount)

            ctx.reply("Количество воды в день установлено", Markup.inlineKeyboard(keyboards.main))
            ctx.scene.leave()
        } else {
            ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800")
        }
    });
    setWaterScene.on("message", ctx => ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800"));
    return setWaterScene;
}
export default setWaterSceneCreator;