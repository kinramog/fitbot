import { Telegraf, Markup, session } from "telegraf";
import { config } from "./config.js";
import { Stage } from "telegraf/scenes";
import getUser from "./services/getUser.js";
import setWaterSceneCreator from "./scenes/setWaterSceneCreator.js";
import addWaterIntakeSceneCreator from "./scenes/addWaterIntakeSceneCreator.js";
import createUserSceneCreator from "./scenes/createUserSceneCreator.js";
import setTimezoneSceneCreator from "./scenes/setTimezoneSceneCreator.js";

const bot = new Telegraf(config.telegram_token, {});
bot.use(session());

const setWaterScene = setWaterSceneCreator()
const addWaterIntakeScene = addWaterIntakeSceneCreator()
const createUserScene = createUserSceneCreator()
const setTimezoneScene = setTimezoneSceneCreator()
const stage = new Stage([setWaterScene, addWaterIntakeScene, createUserScene, setTimezoneScene]);
bot.use(stage.middleware());

bot.start(async (ctx) => {
    let userExist = await getUser(ctx.chat.id);
    if (userExist.success) {
        await ctx.replyWithHTML(
            `Добро пожаловать, <b>${ctx.chat.first_name}</b>!\nЭтот бот поможет вам выработать правильные привычки и наладить своё питание.`,
            Markup.inlineKeyboard(keyboards.main)

            // Markup.inlineKeyboard([
            //     [Markup.button.callback("Меню", "menu")],
            //     [Markup.button.callback("Записать приём воды", "add_water")],
            //     [Markup.button.callback("Профиль", "profile")],
            //     [Markup.button.callback("Настройки", "settings")],
            // ])
        );
    } else {
        await ctx.scene.enter("createUser")
    }
})

bot.action("main", async (ctx) => {
    await ctx.editMessageText(
        `Добро пожаловать, <b>${ctx.chat.first_name}</b>!\nЭтот бот поможет вам выработать правильные привычки и наладить своё питание.`,
        { parse_mode: "HTML" }
    )
    await ctx.editMessageReplyMarkup({
        // inline_keyboard: [
        //     [Markup.button.callback("Меню", "menu")],
        //     [Markup.button.callback("Записать приём воды", "add_water")],
        //     [Markup.button.callback("Профиль", "profile")],
        //     [Markup.button.callback("Настройки", "settings")],
        // ],
        inline_keyboard: keyboards.main,
    })
})
bot.action("add_water", async (ctx) => {
    await ctx.scene.enter("waterIntake");
})

// bot.action("menu", async (ctx) => {
//     await ctx.editMessageText(
//         `Добро пожаловать, <b>${ctx.chat.first_name}</b>!\nЭтот бот поможет вам выработать правильные привычки и наладить своё питание.`,
//         { parse_mode: "HTML" }
//     )
//     await ctx.editMessageReplyMarkup({
//         inline_keyboard: [
//             [Markup.button.callback("Отслеживание водного баланса", "water_balance")],
//             [Markup.button.callback("Дневник питания (в разработке)", "food")],
//             [Markup.button.callback("Назад", "main")],
//         ],
//     })
// })
// bot.action("water_balance", async (ctx) => {
//     await ctx.editMessageText("Отслеживание водного баланса")
//     await ctx.editMessageReplyMarkup({
//         inline_keyboard: [
//             [Markup.button.callback("Установить норму воды на день", "set_total_water")],
//             [Markup.button.callback("Настроить напоминания", "set_reminders")],
//             [Markup.button.callback("Назад", "menu")]
//         ],
//     })
// })

bot.action("profile_and_settings", async (ctx) => {
    let timezone = "ЧОТА +3";
    let waterBalance = 2000;
    let todayWaterAmount = 1150;

    await ctx.editMessageText(
        "Ваш личный профиль\n" +
        `Количество воды в день - ${waterBalance} мл\n` +
        `Часовой пояс ${timezone}\n` +
        `Рост вес другие параметры бла бла бла ${timezone}\n` +
        `--------------------------\n` +
        `За сегодня вы выпили: ${todayWaterAmount}`
    )
    await ctx.editMessageReplyMarkup({
        inline_keyboard: keyboards.profile_and_settings
    })
})
bot.action("change_profile", async (ctx) => {
    await ctx.editMessageText(
        `Выберите параметр для изменения`
    )
    await ctx.editMessageReplyMarkup({
        inline_keyboard: keyboards.change_profile
    });
})
bot.action("settings", async (ctx) => {
    await ctx.editMessageText(
        `Настройка дневных норм и чего-то еще`
    )
    await ctx.editMessageReplyMarkup({
        inline_keyboard: keyboards.settings
    });
})
bot.action("changeTimezone", async (ctx) => {
    await ctx.scene.enter("setTimezone");
})
bot.action("set_total_water", async (ctx) => {
    await ctx.scene.enter("setWater");
})






import translate from "translate";
import { keyboards } from "./keyboards.js";

bot.help(async ctx => {
    await ctx.reply(`Пользоваться ботом очень просто. Включи мозг.`,
        Markup.inlineKeyboard([[Markup.button.callback("Пупу", "main")]])
    )

    let text = await translate("Два кабочка, стакан кефира и 200 грамм апельсинов", { to: "English", from: "Russian" });
    console.log(text);
    text = await translate(text, { to: "Russian", from: "English" });
    console.log(text);

})


bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))