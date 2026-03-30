// date format like YYYY-MM-DD
export const getYMDFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`; // YYYY-MM-DD
}



export const capitalizeFirstLetter = (value?: string): string =>{
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}
