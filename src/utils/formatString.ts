export const formatString = (input: string): string => {
    return input
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
        .join(" ");
};
