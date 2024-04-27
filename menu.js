import { Markup } from "telegraf";

export const showMenu = (bot, chat_id) => {
    // bot.telegram.sendMessage(chat_id, "окэй", {
    //     reply_markup: {
    //         keyboard: [
    //             ["Привет", "Пока"],
    //             ["Бадум"]
    //         ],
    //         resize_keyboard: true
    //     }
    // });
    bot.telegram.sendMessage(chat_id, "окэй", Markup.inlineKeyboard([[Markup.button.callback("Пупу", "aboba")]]));

    // ctx.reply(
    //     `Добро пожаловать, ${ctx.chat.first_name}! Этот бот поможет вам выработать правильную привычку пить нужное количество воды в день.`,
    //     {
    //         reply_markup: {
    //             inline_keyboard: [
    //                 [{ text: "Привет", callback_data: "zhopa" }],
    //             ],
    //             resize_keyboard: true
    //         }
    //     }
    // );
}
export const closeMenu = (bot, chat_id) => {
    bot.telegram.sendMessage(chat_id, "Клавиатура закрыта", {
        reply_markup: {
            remove_keyboard: true
        }
    });
}