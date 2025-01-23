from pydantic import BaseModel, Field
import json

# Pydantic
class CharacterAttribute(BaseModel):
    """Assigns an attribute value to a character"""
    character: str = Field(description="The character to assign a color to")
    attrVal: str = Field(description="The value of the attribute to assign to the character")
    explanation: str = Field(description="Explanation of why the character was assigned this attribute value")

class CharacterAttributes(BaseModel):
    """List of attributes for all characters"""
    characters: list[CharacterAttribute] = Field(description="List of characters and their attributes")

class ThemeAttribute(BaseModel):
    """Assigns an attribute value to a theme"""
    character: str = Field(description="The theme to assign a color to")
    attrVal: str = Field(description="The value of the attribute to assign to the theme")
    explanation: str = Field(description="Explanation of why the theme was assigned this attribute value")

class ThemeAttributes(BaseModel):
    """List of attributes for all themes"""
    characters: list[CharacterAttribute] = Field(description="List of themes and their attributes")

class ColorAssignment(BaseModel):
    """Assigns a color for each unique attribute value"""
    attrVal: str = Field(description="The value of the attribute to assign a color to")
    color: str = Field(description="Unique RGB color string that represents this attribute value (e.g., rgb(118, 185, 71)). Every attribute value should have a different color. Don't use white and make sure the color is visible against a white background.")

class ColorAssignments(BaseModel):
    """List of colors for each attribute value"""
    colors: list[ColorAssignment] = Field(description="List of colors for each attribute value. Make sure there is exactly one entry per attribute value in the provided list and no additional attribute values are added. Choose a different color for each attribute value.")

MAX_CHARS_PER_ROUND = 30

# Assign values to characters for the given attribute
def assign_character_attributes(llm, charData, attr, story_type):
    char_llm = llm.with_structured_output(CharacterAttributes if story_type == "character" else ThemeAttributes)

    # convert charData to JSON if string
    if isinstance(charData, str):
        print("Converting charData to JSON...")
        charData = json.loads(charData)

    char_attrs = []
    unique_attrs = []
    
    # split the characters into groups of MAX_CHARS_PER_ROUND
    split_charData = [charData[i:i + MAX_CHARS_PER_ROUND] for i in range(0, len(charData), MAX_CHARS_PER_ROUND)]
    for i, charData in enumerate(split_charData):
        print(f"Round {i + 1} of {len(split_charData)}")
        prompt = f"""
                Assign each {story_type} in this list a value for the attribute: "{attr}".
                If the attribute is categorical, assign a single value to each {story_type}.
                But limit the total number of unique values; pick categories that multiple {story_type}s could fall into.
                (e.g., "male", "female", "n/a" or "happy", "sad", "angry", "tired", etc.).

                If the attribute is continuous, assign a range of values that multiple {story_type}s
                could fall into instead of a single value. 
                But limit the total number of unique ranges and make sure the ranges don't overlap.
                Pick ranges that multiple {story_type}s could fall into.
                (e.g., "low", "medium", "high" or "0-10", "11-20", "21-30", "31-40", etc.).

                {story_type}s:
                {charData}
                """
        results = char_llm.invoke(prompt)
        results_list = results.characters

        # format as JSON and add to char_attrs
        for char in results_list:
            attr_val = char.attrVal
            if attr_val not in unique_attrs:
                unique_attrs.append(attr_val)
            char_attrs.append({"character": char.character, "val": attr_val, "exp": char.explanation})
        # print(char_attrs)

    # generate colors for each unique attribute value
    color_llm = llm.with_structured_output(ColorAssignments)
    color_prompt = f"""
            Assign a color for each unique value of the attribute: "{attr}".

            Unique attribute values:
            {unique_attrs}
            """
    colors = color_llm.invoke(color_prompt)

    # format as JSON
    color_assignments = []
    for color in colors.colors:
        color_assignments.append({"val": color.attrVal, "color": color.color})
    # print(color_assignments)

    return char_attrs, color_assignments
