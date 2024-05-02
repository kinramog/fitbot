const getUser = async (chat_id) => {
    const url = `http://127.0.0.1:8000/api/get-user`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ chat_id })
    }

    let data = await fetch(url, requestOptions);
    let jsonData = await data.json();
    return jsonData;
}

export default getUser;
