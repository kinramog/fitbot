const changeUser = async (chat_id, params) => {
    const url = `http://127.0.0.1:8000/api/change-user`;
    params["chat_id"] = chat_id;
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    }

    let data = await fetch(url, requestOptions);
    let jsonData = await data.json();
    console.log(jsonData);
    return jsonData;
}

export default changeUser;
