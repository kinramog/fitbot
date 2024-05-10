const getUser = async (chat_id) => {
    try {
        const url = `http://127.0.0.1:8000/api/get-user/${chat_id}`;
        let data = await fetch(url);
        let jsonData = await data.json();
        console.log(jsonData);
        return jsonData;
    } catch (error) {
        console.error("Ошибка в getUser.js\n", error);
    }
}

export default getUser;
