from helpers import load_model
from prompts import assign_character_attributes
import json

# start main method
def main():
    # load the model
    llm = load_model()

    # story
    story = "gatsby"
    print(f"Running prompts for {story}...\n")

    # load data
    with open(f"../src/data/{story}.json") as f:
        data = json.load(f)

    # get character data
    charData = data["characters"]

    # color
    color = "gender"

    # convert charData to JSON string
    charData = json.dumps(charData)

    # test assinging character attributes + colors
    char_attrs, color_assignments = assign_character_attributes(llm, charData, color, "character")

    print("Character attributes:")
    print(char_attrs)
    print("\nColor assignments:")
    print(color_assignments)

if __name__ == "__main__":
    main()
