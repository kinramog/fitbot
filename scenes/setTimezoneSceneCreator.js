import { Markup } from "telegraf";
import { BaseScene } from "telegraf/scenes"
import changeTimezone from "../services/changeTimezone.js";

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
        await ctx.reply("Выберите ваш часовой пояс для корректного отслеживания дневного потребления", Markup.inlineKeyboard([
            [Markup.button.callback("Москва (UTC +3)", "Europe/Moscow")],
            [Markup.button.callback("Калининград (GMT+2)", "Europe/Kaliningrad"), Markup.button.callback("Самара (GMT+4)", "Europe/Samara")],
            [Markup.button.callback("Екатеринбург (GMT+5)", "Asia/Yekaterinburg"), Markup.button.callback("Омск (GMT+6)", "Asia/Omsk")],
            [Markup.button.callback("Красноярск (GMT+7)", "Asia/Krasnoyarsk"), Markup.button.callback("Иркутск (GMT+8)", "Asia/Irkutsk")],
            [Markup.button.callback("Якутск (GMT+9)", "Asia/Yakutsk"), Markup.button.callback("Владивосток(GMT+10)", "Asia/Vladivostok")],
            [Markup.button.callback("Магадан (GMT+11)", "Asia/Magadan"), Markup.button.callback("Камчатка (GMT+12)", "Asia/Kamchatka")],
        ]))
    });

    setTimezoneScene.action(timezones, async (ctx) => {
        await ctx.answerCbQuery("Часовой пояс установлен");
        let chosenTimezone = ctx.callbackQuery.data;
        await changeTimezone(ctx.chat.id, chosenTimezone);
        await ctx.scene.leave()
        await ctx.replyWithHTML(
            `Часовой пояс установлен`, Markup.inlineKeyboard([
                [Markup.button.callback("Меню", "menu")],
                [Markup.button.callback("Записать приём воды", "add_water")],
                [Markup.button.callback("Профиль", "profile")],
                [Markup.button.callback("Настройки", "settings")],
            ])
        );
    })

    setTimezoneScene.on("message", ctx => ctx.reply("Пожалуйста, выберите часовой пояс. Если вы не его не знаете, то можно воспользоваться мозгом"));

    return setTimezoneScene;
}
export default setTimezoneSceneCreator;