import {
    isConnected,
    getPublicKey,
    signAuthEntry,
    signTransaction,
    signBlob,
    isAllowed,
    setAllowed,
    requestAccess
  } from "@stellar/freighter-api";

const hasPreviouslyAllowed = async () => {
    const isAllowedd = await isAllowed()
    return isAllowedd
}
const hasFreighterInstalled = async () => {
    let status
    try {
        status = await isConnected()
        return status
    } catch (error) {
        console.log({error})
    }
}
const formatBigIntTimestamp = (timestamp: any) => {
    const timestampNumber = Number(timestamp);

    const date = new Date(timestampNumber * 1000);
  
    const dateOptions:any = { month: 'short', day: 'numeric', year: 'numeric' };
    const timeOptions:any = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    
    let formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    return `${formattedDate}, ${formattedTime}`;
  };

export {
    hasPreviouslyAllowed,
    hasFreighterInstalled,
    formatBigIntTimestamp
}