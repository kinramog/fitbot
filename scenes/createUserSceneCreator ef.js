import { Markup } from "telegraf";
import { BaseScene } from "telegraf/scenes"
import { keyboards } from "../keyboards.js";
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
        await ctx.reply("Выберите ваш часовой пояс для корректного отслеживания дневного потребления", Markup.inlineKeyboard(keyboards.timezones))
    });

    createUserScene.action(timezones, async (ctx) => {
        await ctx.answerCbQuery("Часовой пояс установлен");
        let chosenTimezone = ctx.callbackQuery.data;
        await createUser(ctx.chat.id, chosenTimezone);
        await ctx.scene.leave();

        await ctx.reply("Часовой пояс установлен!");
        await ctx.replyWithHTML(
            `Благодаря этому боту можно многое поменять в себе и своей жизни, какой-то текст, который я потом заменю` +
            `\nНапиши /help, чтобы ознакомиться со всеми возможностями`,
            Markup.inlineKeyboard(keyboards.main)
        );
    })

    createUserScene.on("message", ctx => ctx.reply("Пожалуйста, выберите часовой пояс. Если вы не его не знаете, то можно воспользоваться мозгом"));
    return createUserScene;
}
export default createUserSceneCreator;