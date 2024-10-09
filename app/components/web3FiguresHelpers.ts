const formatFigures = (number:number, decimal:number) => {
    const thousand = 1e3;
    const million = 1e6;
    const billion = 1e9;
    const trillion = 1e12;
    const quadrillion = 1e15;
    const quintillion = 1e18;

    if (Math.abs(number) >= quintillion) {
        return (number / quintillion).toFixed(decimal) + "Qn";
    } else if (Math.abs(number) >= quadrillion) {
        return (number / quadrillion).toFixed(decimal) + "Q";
    } else if (Math.abs(number) >= trillion) {
        return (number / trillion).toFixed(decimal) + "T";
    } else if (Math.abs(number) >= billion) {
        return (number / billion).toFixed(decimal) + "B";
    } else if (Math.abs(number) >= million) {
        return (number / million).toFixed(decimal) + "M";
    } else if (Math.abs(number) >= thousand) {
        return (number / thousand).toFixed(decimal) + "K";
    } else {
        return Number(number).toFixed(decimal);
    }
};

const floatFigure = (number:number, noToFix:number) => {
    return Number(number).toFixed(noToFix)
}
const formatWithCommas = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const dateFormat = (timestamp: string) => {
 const timestampNum = Number(timestamp);
const date = new Date(timestampNum * 1000);

const day = date.getDate();
const month = date.toLocaleString('en-US', { month: 'short' });
const year = date.getFullYear();

const formattedDate = `${day}, ${month} ${year}`;
return formattedDate
}
export {
    formatFigures,
    floatFigure,
    formatWithCommas,
    dateFormat
}