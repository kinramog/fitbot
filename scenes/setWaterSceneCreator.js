import { Markup } from "telegraf";
import { message } from "telegraf/filters";
import { BaseScene } from "telegraf/scenes"
import { keyboards } from "../keyboards.js";
import changeUser from "../services/changeUser.js";

const setWaterSceneCreator = () => {
    const setWaterScene = new BaseScene("setWater");

    setWaterScene.enter(async (ctx) => {
        await ctx.reply("Напишите числом, какое количество воды в мл (миллилитрах) вы хотели бы выпивать в день");
    });
    setWaterScene.on(message('text'), async (ctx) => {
        let waterAmount = Number(ctx.message.text);
        if (waterAmount) {
            let chat_id = ctx.chat.id;
            let water_amount = ctx.message.text;
            await changeUser(chat_id, { "total_water_amount": water_amount });
            await ctx.reply("Количество воды в день установлено", Markup.inlineKeyboard(keyboards.main))
            await ctx.scene.leave()
        } else {
            await ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800")
        }
    });
    setWaterScene.on("message", async ctx =>
        await ctx.reply("Пожалуйста, введите только число без иных символов. Например: 1800")
    );
    return setWaterScene;
}
export default setWaterSceneCreator;