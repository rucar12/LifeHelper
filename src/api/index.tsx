export const getMessages = (apiRequestBody: any, API_KEY: string | null) => { // messages is an array of messages

    return fetch("https://api.openai.com/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) => {
        return data.json();
    }).then((data) => {
        return data.choices[0].message.content;
    });
}