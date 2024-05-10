import { Markup } from "telegraf";
import { BaseScene } from "telegraf/scenes"
import { keyboards } from "../utils/keyboards.js";
import changeUser from "../services/changeUser.js";

const setTimezoneSceneCreator = () => {
    const setTimezoneScene = new BaseScene("setTimezone");

    const timezones = [
        "Europe/Moscow",
        "Europe/Kaliningrad",
        "Europe/Samara",
        "Asia/Yekaterinburg",
        "Asia/Omsk",
        "Asia/Krasnoyarsk",
        "Asia/Irkutsk",
        "Asia/Yakutsk",
        "Asia/Vladivostok",
        "Asia/Magadan",
        "Asia/Kamchatka",
    ]

    setTimezoneScene.enter(async (ctx) => {
        await ctx.reply("Выберите ваш часовой пояс для корректного отслеживания дневного потребления",
            Markup.inlineKeyboard(keyboards.timezones))
    });

    setTimezoneScene.action(timezones, async (ctx) => {
        await ctx.answerCbQuery("Часовой пояс установлен");
        let chosenTimezone = ctx.callbackQuery.data;
        await changeUser(ctx.chat.id, { "timezone": chosenTimezone });
        await ctx.scene.leave()
        await ctx.replyWithHTML(
            `Часовой пояс установлен`, Markup.inlineKeyboard(keyboards.main)
        );
    })
    setTimezoneScene.on("message", ctx => ctx.reply("Пожалуйста, выберите часовой пояс. Если вы не его не знаете, то можно воспользоваться мозгом"));

    return setTimezoneScene;
}
export default setTimezoneSceneCreator;