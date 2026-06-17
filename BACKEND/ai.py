import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(
    api_key=GROQ_API_KEY
)

def extract_worklog(user_message):

    prompt = f"""
    Extract the following into JSON format only.

    Required fields:
    - task
    - hours
    - issue
    - status

    Message:
    {user_message}

    Return ONLY pure JSON.
    Do not add explanations.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    result = response.choices[0].message.content.strip()

    print("AI RESPONSE:", result)

    # Extract JSON safely
    start = result.find("{")
    end = result.rfind("}") + 1

    json_string = result[start:end]

    return json.loads(json_string)