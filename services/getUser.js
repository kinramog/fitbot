const getUser = async (chat_id) => {
    const url = `http://127.0.0.1:8000/api/get-user/${chat_id}`;
    let data = await fetch(url);
    let jsonData = await data.json();
    return jsonData;
}

export default getUser;
