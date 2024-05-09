import { Markup } from "telegraf";
import { BaseScene } from "telegraf/scenes"
import { keyboards } from "../keyboards.js";
import createUser from "../services/createUser.js";
import { message } from "telegraf/filters";

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
    ];

    const REG_STEPS = {
        START: 'start',
        TIMEZONE: 'timezone',
        HEIGHT: 'height',
        WEIGHT: 'weight',
        AGE: 'age',
        GENDER: 'gender',
        CONFIRM: 'confirm',
    };

    createUserScene.enter(async (ctx) => {
        ctx.session.next_step = REG_STEPS.START;
        await ctx.replyWithHTML(`Добро пожаловать, <b>${ctx.chat.first_name}</b>!\nЭтот бот поможет вам выработать правильные привычки и наладить своё питание.`)
        await ctx.replyWithHTML(`Для начала заполним ваш профиль: `);
        await ctx.reply("Выберите ваш часовой пояс для корректного отслеживания дневного потребления", Markup.inlineKeyboard(keyboards.timezones));
    });

    createUserScene.action(timezones, async (ctx) => {
        await ctx.answerCbQuery("Часовой пояс установлен");
        ctx.session.next_step = REG_STEPS.TIMEZONE;
        ctx.session.timezone = ctx.callbackQuery.data;
        await ctx.reply("Часовой пояс установлен!");
        await ctx.reply("Введите свой рост: ");
    })

    createUserScene.on(message("text"), async (ctx) => {
        switch (ctx.session.next_step) {
            case REG_STEPS.START:
                await ctx.reply("Сначала выберите часовой пояс!");
                break;

            case REG_STEPS.TIMEZONE:
                let height = Number(ctx.message.text);
                if (Number.isInteger(height) & height > -1) {
                    ctx.session.next_step = REG_STEPS.HEIGHT;
                    ctx.session.height = height;
                    await ctx.reply("Введите свой вес: ");
                } else {
                    await ctx.reply("Введите рост только числом! Без иных символов.");
                }
                break;

            case REG_STEPS.HEIGHT:
                let weight = Number(ctx.message.text);
                if (Number.isInteger(weight) & weight > -1) {
                    ctx.session.next_step = REG_STEPS.WEIGHT;
                    ctx.session.weight = weight;
                    await ctx.reply("Введите свой возраст: ");
                } else {
                    await ctx.reply("Введите вес только числом! Без иных символов.");
                }
                break;

            case REG_STEPS.WEIGHT:
                let age = Number(ctx.message.text);
                if (Number.isInteger(age) & age > -1) {
                    ctx.session.next_step = REG_STEPS.AGE;
                    ctx.session.age = age;
                    await ctx.reply("Выберите свой пол: ", Markup.inlineKeyboard([
                        Markup.button.callback("Мужской", "man"), Markup.button.callback("Женский", "woman")
                    ]));
                } else {
                    await ctx.editMessageText("Введите возраст только числом! Без иных символов.");
                }
                break;

            case REG_STEPS.AGE:
                await ctx.reply("Выберите пол!");
                break;
        }
    });
    createUserScene.action(["man", "woman"], async (ctx) => {
        await ctx.answerCbQuery("");
        let gender = ctx.callbackQuery.data == "man" ? "Мужской" : "Женский";
        ctx.session.next_step = REG_STEPS.CONFIRM;
        ctx.session.gender = gender;
        let timezone = ctx.session.timezone;
        let height = ctx.session.height;
        let weight = ctx.session.weight;
        let age = ctx.session.age;
        await ctx.reply(
            `Ваши данные успешно записаны!` +
            `<b>Часовой пояс:</b> ${timezone}\n` +
            `<b>Рост:</b> ${height} см\n` +
            `<b>Вес:</b> ${weight} кг\n` +
            `<b>Возраст:</b> ${age}\n` +
            `<b>Пол:</b> ${gender}\n`,
            { parse_mode: "HTML" }
        );

        await createUser(ctx.chat.id, timezone, height, weight, age, gender);
        await ctx.scene.leave();

        await ctx.reply("Если вы захотите изменить данные, это можно будет сделать в настройках профиля.");
        await ctx.replyWithHTML(
            `Благодаря этому боту можно многое поменять в себе и своей жизни, какой-то текст, который я потом заменю` +
            `\nНапиши /help, чтобы ознакомиться со всеми возможностями`,
            Markup.inlineKeyboard(keyboards.main)
        );


        // await ctx.reply("Все данные верны?", Markup.inlineKeyboard([
        //     Markup.button.callback("Да", "yes"), Markup.button.callback("Нет", "no")
        // ]));
    });

    // createUserScene.action(["yes", "no"], async (ctx) => {
    //     await ctx.answerCbQuery("");
    //     let answer = ctx.callbackQuery.data;
    //     if (answer == "yes") {
    //         // createUser()
    //         console.log("yes");
    //     }
    //     else {
    //         console.log("no");
    //     }
    // });

    return createUserScene;
}
export default createUserSceneCreator;