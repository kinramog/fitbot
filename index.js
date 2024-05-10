import { Telegraf, Markup, session } from "telegraf";
import { config } from "./config.js";
import { Stage } from "telegraf/scenes";
import getUser from "./services/getUser.js";
import changeUser from "./services/changeUser.js";
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
const editUserParamsScene = editUserParamsSceneCreator()
const stage = new Stage([setWaterScene, addWaterIntakeScene, createUserScene, setTimezoneScene, editUserParamsScene]);
bot.use(stage.middleware());

bot.start(async (ctx) => {
    try {
        let userExist = await getUser(ctx.chat.id);
        if (userExist.success) {
            await ctx.replyWithHTML(
                `Добро пожаловать, <b>${ctx.chat.first_name}</b>!\nЭтот бот поможет вам выработать правильные привычки и наладить своё питание.`,
                Markup.inlineKeyboard(keyboards.main)
            );
        } else {
            await ctx.scene.enter("createUser")
        }
    } catch (error) {
        console.error("Ошибка в /start\n", error);
        await ctx.reply("⚠❗Произошла непредвиденная ошибка❗⚠\nМы уже работаем над её исправлением!");
    }
})

bot.action("main", async (ctx) => {
    await ctx.editMessageText(
        `Добро пожаловать, <b>${ctx.chat.first_name}</b>!\nЭтот бот поможет вам выработать правильные привычки и наладить своё питание.`,
        { parse_mode: "HTML" }
    )
    await ctx.editMessageReplyMarkup({
        inline_keyboard: keyboards.main,
    })
})
bot.action("add_water", async (ctx) => {
    await ctx.scene.enter("waterIntake");
})

bot.action("profile_and_settings", async (ctx) => {
    const user = await getUser(ctx.chat.id);
    let timezone = user.user.timezone;
    let waterBalance = user.user.total_water_amount;
    let height = user.user.height;
    let weight = user.user.weight;
    let age = user.user.age;
    let gender = user.user.gender;
    let calories = user.user.total_calories;
    let proteins = user.user.total_proteins;
    let fat = user.user.total_fat;
    let carbohydrate = user.user.total_carbohydrate;

    await ctx.editMessageText(
        `<b>Ваш профиль</b>, ${ctx.chat.username}\n` +
        `~~~~~~~~~~~~~~~~~~~~~~~~~~\n` +
        `<b>Рост:</b> ${height} см\n` +
        `<b>Вес:</b> ${weight} кг\n` +
        `<b>Возраст:</b> ${age}\n` +
        `<b>Пол:</b> ${gender}\n` +
        `~~~~~~~~~~~~~~~~~~~~~~~~~~\n` +
        `<b>Норма воды в день:</b> ${waterBalance} мл\n` +
        `<b>Суточная норма калорий:</b> ${calories} ккал\n` +
        `<b>Суточная норма\nБелков/Жиров/Углеводов:</b>\n` +
        `${proteins}/${fat}/${carbohydrate}\n` +
        `<b>Часовой пояс:</b> ${timezone}\n` +
        `~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
        { parse_mode: "HTML" }
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
        `Выберите параметр для изменения`
    )
    await ctx.editMessageReplyMarkup({
        inline_keyboard: keyboards.settings
    });
})
bot.action("changeTimezone", async (ctx) => {
    await ctx.scene.enter("setTimezone");
})
bot.action("setTotalWater", async (ctx) => {
    await ctx.scene.enter("setWater");
})

bot.action("statistics", async (ctx) => {
    const user = await getUser(ctx.chat.id);
    let todayWaterAmount = await getTodayIntakesSum(ctx.chat.id);

    await ctx.editMessageText(
        `За сегодня вы выпили: ${todayWaterAmount} мл`,
        { parse_mode: "HTML" }
    )
    await ctx.editMessageReplyMarkup({
        inline_keyboard: keyboards.statistics
    })
})

bot.action([
    "height", "weight", "gender", "age",
    "total_calories", "total_proteins", "total_fat",
    "total_carbohydrates"],
    async (ctx) => {
        ctx.session.param = ctx.callbackQuery.data;
        await ctx.scene.enter("editUser");
        await ctx.answerCbQuery("");
    })




import translate from "translate";
import { keyboards } from "./keyboards.js";
import getTodayIntakesSum from "./services/getTodayIntakesSum.js";
import editUserParamsSceneCreator from "./scenes/editUserParamsSceneCreator.js";

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