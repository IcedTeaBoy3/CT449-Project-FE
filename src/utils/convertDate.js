export const convertDate = (date) => {
    if (!date) return "";

    const newDate = new Date(date);
    return newDate.toLocaleDateString("vi-VN");
};
