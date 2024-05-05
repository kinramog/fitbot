import { Markup } from "telegraf";
import { BaseScene } from "telegraf/scenes"
import createUser from "../services/createUser.js";

const createUserSceneCreator = () => {
    const createUserScene = new BaseScene("createUser");
    
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

    createUserScene.enter(async (ctx) => {
        await ctx.replyWithHTML(`Добро пожаловать, <b>${ctx.chat.first_name}</b>!\nЭтот бот поможет вам выработать правильные привычки и наладить своё питание.`)
        await ctx.reply("Выберите ваш часовой пояс для корректного отслеживания дневного потребления", Markup.inlineKeyboard([
            [Markup.button.callback("Москва (UTC +3)", "Europe/Moscow")],
            [Markup.button.callback("Калининград (GMT+2)", "Europe/Kaliningrad"), Markup.button.callback("Самара (GMT+4)", "Europe/Samara")],
            [Markup.button.callback("Екатеринбург (GMT+5)", "Asia/Yekaterinburg"), Markup.button.callback("Омск (GMT+6)", "Asia/Omsk")],
            [Markup.button.callback("Красноярск (GMT+7)", "Asia/Krasnoyarsk"), Markup.button.callback("Иркутск (GMT+8)", "Asia/Irkutsk")],
            [Markup.button.callback("Якутск (GMT+9)", "Asia/Yakutsk"), Markup.button.callback("Владивосток(GMT+10)", "Asia/Vladivostok")],
            [Markup.button.callback("Магадан (GMT+11)", "Asia/Magadan"), Markup.button.callback("Камчатка (GMT+12)", "Asia/Kamchatka")],
        ]))
    });

    createUserScene.action(timezones, async (ctx) => {
        await ctx.answerCbQuery("Часовой пояс установлен");
        let chosenTimezone = ctx.callbackQuery.data;
        await createUser(ctx.chat.id, chosenTimezone);
        await ctx.scene.leave()

        await ctx.reply("Часовой пояс установлен!");
        await ctx.replyWithHTML(
            `Благодаря этому боту можно многое поменять в себе и своей жизни, какой-то текст, который я потом заменю` +
            `\nНапиши /help, чтобы ознакомиться со всеми возможностями`,
            Markup.inlineKeyboard([
                [Markup.button.callback("Меню", "menu")],
                [Markup.button.callback("Профиль", "profile")],
            ])
        );
    })

    createUserScene.on("message", ctx => ctx.reply("Пожалуйста, выберите часовой пояс. Если вы не его не знаете, то можно воспользоваться мозгом"));
    return createUserScene;
}
export default createUserSceneCreator;