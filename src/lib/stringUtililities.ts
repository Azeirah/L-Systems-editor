export const unique_characters_in_string = (input: string) => {
    const chars = new Set();

    for (let char of input) {
        chars.add(char);
    }

    return Array.from(chars).join("");
}