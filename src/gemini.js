const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAbeQ3aHZJkpEJ8cLW8oIzQsPLckUwtAYg";

export async function generateResponse(params) {
    // Ensure params exists and contains a valid prompt
    if (!params || !params.prompt) {
        console.error("Error: Missing 'prompt' in params");
        return ""; // Return empty response instead of breaking
    }

    let requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "contents": [{
                "parts": [
                    { "text": params.prompt }, // Ensured this exists
                    ...(params.data ? [{
                        "inline_data": {
                            "mime_type": params.mime_type || "text/plain",
                            "data": params.data
                        }
                    }] : [])
                ]
            }]
        })
    };

    try {
        let response = await fetch(Api_Url, requestOptions);
        let data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            let apiResponse = data.candidates[0].content.parts[0].text
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .trim();
            
            console.log("API Response:", apiResponse);
            return apiResponse;
        } else {
            console.error("No valid response from API", data);
            return "";
        }
    } catch (error) {
        console.error("Error fetching response:", error);
        return "";
    }
}
