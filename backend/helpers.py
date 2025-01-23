from langchain_openai import ChatOpenAI
import json
import os

# hyperparameters
OPENAI_MODEL = "gpt-4o-mini"

# load the api keys from the secrets file
# outputs: open_ai_key (str)
def load_api_keys():
    try:
        with open("../secrets.json") as f:
            secrets = json.load(f)
        open_ai_key = secrets["openai"]
        os.environ["OPENAI_API_KEY"] = open_ai_key
        print("API keys loaded.")
    except FileNotFoundError:
        print("Secrets file not found. YOU NEED THEM TO RUN THIS.")

# load the api keys + model
# outputs: llm (ChatOpenAI)
def load_model():
    load_api_keys()
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
    print("Model loaded.")
    return llm