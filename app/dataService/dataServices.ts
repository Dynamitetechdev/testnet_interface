import axios from "axios";

const cache = {};
interface DataType {
  isLoading: boolean;
  data: any; // You can replace `any` with a more specific type if you know the structure of the data
  error: any; // You can replace `any` with a more specific type if you know the structure of the error
}
export async function GetAPY(apiURL: string): Promise<DataType> {
  try {
    let data = {
      isLoading: true,
      data: null,
      error: null,
    };

    const response = await axios.get(apiURL);
    data.isLoading = false;
    data.data = response.data;


    return {data, isLoading: data.isLoading, error:data.error};
  } catch (error) {
    console.error(error);
    return {
      isLoading: false,
      data: null,
      error: error,
    };
  }
}

export async function ActivateQuote(contractAddress: string): Promise<DataType> {
  try {
    let data: DataType = {
      isLoading: true,
      data: null,
      error: null,
    };

    const response = await axios.post("https://bondexecution.onrender.com/monitoring/updateOracle", 
      {
        contractAddress,
        secretKey: ""
      },
      {
        headers: {
          'password': 'R7w8I99BjTJuhbBPaFtk6Jb82wn7un'
        }
      }
    );
    data.isLoading = false;
    data.data = response.data;

    return { data: data.data, isLoading: data.isLoading, error: data.error };
  } catch (error) {
    console.error(error);
    return {
      isLoading: false,
      data: null,
      error: error,
    };
  }
}


