import { config } from "./config.js";

export const getCat = async (ctx) => {
    const response = await fetch(config.cat_url)
    const jsonData = await response.json();
    return jsonData[0].url
}