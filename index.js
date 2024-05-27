import translate from "translate";
import { Telegraf, Markup, session } from "telegraf";
import { config } from "./config.js";
import { Stage } from "telegraf/scenes";
import { keyboards } from "./utils/keyboards.js";
import { msg } from "./utils/messageGenerator.js";
import getUser from "./services/getUser.js";
import changeUser from "./services/changeUser.js";
import setWaterSceneCreator from "./scenes/setWaterSceneCreator.js";
import addWaterIntakeSceneCreator from "./scenes/addWaterIntakeSceneCreator.js";
import createUserSceneCreator from "./scenes/createUserSceneCreator.js";
import setTimezoneSceneCreator from "./scenes/setTimezoneSceneCreator.js";
import getTodayIntakesSum from "./services/getTodayIntakesSum.js";
import editUserParamsSceneCreator from "./scenes/editUserParamsSceneCreator.js";
import addMealSceneCreator from "./scenes/addMealSceneCreator.js";
import getTodayMealsSum from "./services/getTodayMealsSum.js";


const bot = new Telegraf(config.telegram_token, {});
bot.use(session());

const setWaterScene = setWaterSceneCreator()
const addWaterIntakeScene = addWaterIntakeSceneCreator()
const createUserScene = createUserSceneCreator()
const setTimezoneScene = setTimezoneSceneCreator()
const editUserParamsScene = editUserParamsSceneCreator()
const addMealScene = addMealSceneCreator()
const stage = new Stage([setWaterScene, addWaterIntakeScene, createUserScene, setTimezoneScene, editUserParamsScene, addMealScene]);
bot.use(stage.middleware());


bot.command("mew", async ctx => {
    ctx.reply("Зыряй, какая интересная кнопочка снизу!!1!",
        Markup.inlineKeyboard([
            Markup.button.webApp("Буттон", `https://c3fc-109-252-34-170.ngrok-free.app/day-meals/${ctx.chat.id}`)
        ])
    );
})

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
    let waterAmount = user.user.total_water_amount;
    let height = user.user.height;
    let weight = user.user.weight;
    let age = user.user.age;
    let gender = user.user.gender;
    let calories = user.user.total_calories;
    let proteins = user.user.total_proteins;
    let fat = user.user.total_fat;
    let carbohydrate = user.user.total_carbohydrates;

    await ctx.editMessageText(
        msg.user_profile(ctx.chat.username, height, weight, age, gender, waterAmount, calories, proteins, fat, carbohydrate, timezone),
        { parse_mode: "HTML" }
    );
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
    let todayMeals = await getTodayMealsSum(ctx.chat.id)

    let waterProgress = msg.vizual_percentage(user.user.total_water_amount, todayWaterAmount);
    let caloriesProgress = msg.vizual_percentage(user.user.total_calories, todayMeals.calories_sum);
    let proteinsProgress = msg.vizual_percentage(user.user.total_proteins, todayMeals.proteins_sum);
    let fatProgress = msg.vizual_percentage(user.user.total_fat, todayMeals.fat_sum);
    let carbohydratesProgress = msg.vizual_percentage(user.user.total_carbohydrates, todayMeals.carbohydrates_sum);

    await ctx.editMessageText(
        `<b>Статистика за сегодня</b>\n\n` +
        `<b>Выпито воды</b>: ${todayWaterAmount} мл\n${waterProgress}\n\n` +
        `<b>Калории:</b> ${todayMeals.calories_sum}\n${caloriesProgress}\n\n` +
        `<b>Белки:</b> ${todayMeals.proteins_sum}\n${proteinsProgress}\n\n` +
        `<b>Жиры:</b> ${todayMeals.fat_sum}\n${fatProgress}\n\n` +
        `<b>Углеводы:</b> ${todayMeals.carbohydrates_sum}\n${carbohydratesProgress}\n\n`,
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
    }
);
bot.action("recalculate", async (ctx) => {
    await ctx.editMessageText("Выберите примерный уровень своей активности: ");
    await ctx.editMessageReplyMarkup({
        inline_keyboard: keyboards.activity_level
    });
});
bot.action(["1", "1.2", "1.375", "1.55", "1.725", "1.9"], async (ctx) => {
    let rate = Number(ctx.callbackQuery.data);
    const user = await getUser(ctx.chat.id);
    let height = user.user.height;
    let weight = user.user.weight;
    let age = user.user.age;
    let gender = user.user.gender;
    let timezone = user.user.timezone;

    let waterAmount = 25 * weight;
    let calories = 0;
    if (gender == "Мужской") {
        calories = Math.round((10 * weight + 6.25 * height - 5 * age + 5) * rate);
    } else {
        calories = Math.round((10 * weight + 6.25 * height - 5 * age - 161) * rate);
    }
    let proteins = Math.round(calories * 0.3 / 4);
    let fat = Math.round(calories * 0.3 / 9);
    let carbohydrate = Math.round(calories * 0.4 / 4);
    await changeUser(ctx.chat.id, { total_water_amount: waterAmount, total_calories: calories, total_proteins: proteins, total_fat: fat, total_carbohydrate: carbohydrate });
    await ctx.answerCbQuery("Данные обновлены");

    await ctx.editMessageText(
        msg.user_profile(ctx.chat.username, height, weight, age, gender, waterAmount, calories, proteins, fat, carbohydrate, timezone),
        { parse_mode: "HTML" }
    );
    await ctx.editMessageReplyMarkup({
        inline_keyboard: keyboards.profile_and_settings
    });
});

bot.action("add_meal", async (ctx) => {
    await ctx.scene.enter("addMeal");
})

bot.help(async ctx => {
    await ctx.reply(
        `Этот бот поможет вам вести учёт съеденных продуктов и выпитой воды в течение дня.\n` +
        `При первом запуске вы указали свои параметры, на основе которых были рассчитаны ` +
        `примерные нормы воды и КБЖУ для вас на день.` +
        `Суть простая: Вы поели -> Нажали кнопку "Записать приём пищи" -> Ввели съеденные ` +
        `продукты -> Бот записал всё и заполнил шкалу вашего прогресса по КБЖУ на день.\n` +
        `То же самое с водой. Выпили стакан воды -> Нажимаете "Записать приём воды" -> ` +
        `Бот записал всё и также заполнил шкалу прогресса по суточной норме воды.\n` +
        `Любые параметры, заполненные при первом запуске, можно изменить в разделе "Профиль и настройки".\n` +
        `Получить информацию о механизме расчёта норм КБЖУ и воды на день можно подробнее узнать введя команду /about`,
        Markup.inlineKeyboard(keyboards.main)
    )
})

bot.command("menu", async (ctx) => {
    await ctx.replyWithHTML(
        `Добро пожаловать, <b>${ctx.chat.first_name}</b>!\nЭтот бот поможет вам выработать правильные привычки и наладить своё питание.`,
        Markup.inlineKeyboard(keyboards.main)
    );
})
bot.command("about", async (ctx) => {
    await ctx.replyWithHTML(
        `Расчёт нормы калорий на день происходит по формуле Миффлина-Сан Жеора.\n` +
        `Вода рассчитывается из соотношения 25 мл на 1 кг веса.\n` +
        `Однако эти значения могут отличаться для каждого человека в зависимости от индивидуальных особенностей.\n` +
        `Данный бот является учебным проектом и не предназначен для использования в качестве медицинской консультации.` +
        `Все расчеты и рекомендации носят исключительно информативный характер. \n` +
        `Разработчик: @MaSeurzeurSakogaki`,
        Markup.inlineKeyboard(keyboards.main)
    );
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))