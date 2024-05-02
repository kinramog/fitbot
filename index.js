import { Telegraf, Markup, session } from "telegraf";
import { config } from "./config.js";
import { getCat } from "./cat.js";
import { showMenu, closeMenu } from "./menu.js";
import { Stage } from "telegraf/scenes";
import setWaterSceneCreator from "./scenes/setWaterSceneCreator.js";
import addWaterIntakeSceneCreator from "./scenes/addWaterIntakeSceneCreator.js";
import getUser from "./services/getUser.js";
import createUser from "./services/createUser.js";


const bot = new Telegraf(config.telegram_token, {});
bot.use(session());

const setWaterScene = setWaterSceneCreator()
const addWaterIntakeScene = addWaterIntakeSceneCreator()
const stage = new Stage([setWaterScene, addWaterIntakeScene]);
bot.use(stage.middleware());

bot.start(async (ctx) => {
    let userExist = await getUser(ctx.chat.id);
    if (userExist.success) {
        await ctx.replyWithHTML(
            `Добро пожаловать, <b>${ctx.chat.first_name}</b>!\nЭтот бот поможет вам выработать правильные привычки и наладить своё питание.`,
            Markup.inlineKeyboard([
                [Markup.button.callback("Меню", "menu")],
                [Markup.button.callback("Записать приём воды", "add_water")],
            ])
        );
    } else {
        createUser(ctx.chat.id);
        await ctx.replyWithHTML(
            `Добро пожаловать, <b>${ctx.chat.first_name}</b>!\nЭтот бот поможет вам выработать правильные привычки и наладить своё питание.` +
            `\nНапиши /help, чтобы ознакомиться со всеми возможностями`,
            Markup.inlineKeyboard([
                [Markup.button.callback("Меню", "menu")],
            ])
        );
    }


    // ctx.reply(
    //     `Сколько миллилитров воды вы планируете выпивать в день?`,
    // {
    //     reply_markup: {
    //         inline_keyboard: [
    //             [{ text: "Ввести число", callback_data: "zhopa" }],
    //         ],
    //     }
    // }
    // );
    // ctx.scene.enter("waterChange")
})

bot.action("main", async (ctx) => {
    await ctx.editMessageReplyMarkup({
        inline_keyboard: [
            [Markup.button.callback("Меню", "menu")],
            [Markup.button.callback("Записать приём воды", "add_water")],
            [Markup.button.callback("Профиль", "profile")],
        ],
    })
})
bot.action("menu", async (ctx) => {
    await ctx.editMessageText(`Добро пожаловать, <b>${ctx.chat.first_name}</b>!\nЭтот бот поможет вам выработать правильные привычки и наладить своё питание.`, { parse_mode: "HTML" })
    await ctx.editMessageReplyMarkup({
        inline_keyboard: [
            [Markup.button.callback("Отслеживание водного баланса", "water_balance")],
            [Markup.button.callback("Дневник питания (в разработке)", "food")],
            [Markup.button.callback("Назад", "main")],
        ],
    })
})
bot.action("water_balance", async (ctx) => {
    await ctx.editMessageText("Отслеживание водного баланса")
    await ctx.editMessageReplyMarkup({
        inline_keyboard: [
            [Markup.button.callback("Установить норму воды на день", "set_total_water")],
            [Markup.button.callback("Настроить напоминания", "set_remainders")],
            [Markup.button.callback("Назад", "menu")]
        ],
    }) 
})
bot.action("set_total_water", async (ctx) => {
    await ctx.scene.enter("setWater")
})
bot.action("add_water", async (ctx) => {
    await ctx.scene.enter("waterIntake")
})




bot.help(ctx => {
    ctx.reply(`Пользоваться ботом очень просто. Включи мозг.`,
        Markup.inlineKeyboard([[Markup.button.callback("Пупу", "aboba")]])
    )

    ctx.reply(
        `Сколько литров воды вы планируете выпивать в день?`,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Ввести число", callback_data: "zhopa" }],
                ],
            }
        }
    );
})

// bot.on("message", async (ctx) => {
//     const chat_id = ctx.chat.id;

//     if (ctx.message.text == "меню") {
//         showMenu(bot, chat_id)
//     } else if (ctx.message.text == "кот") {
//         let cat = await getCat(ctx);
//         ctx.reply(cat);
//         console.log(chat_id + " " + ctx.chat.username)
//     } else if (ctx.message.text == "амогус") {
//         console.log('aмогус')
//     } else {
//         closeMenu(bot, chat_id)
//     }
// })

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))