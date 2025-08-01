import { AxiosRequestConfig } from "axios";
import apiClient from "./apiClient"

interface PostDataConfig {
    config: AxiosRequestConfig; // Axios configuration
}

interface PostDataArgs {
    data: {
        url: string; // URL endpoint
        payload?: Record<string, any>; // Data to send in the request
    }; // Data object containing URL and payload
    config?: AxiosRequestConfig; // Axios request configuration
    params?: Record<string, any>; // Optional additional parameters
}

// Define the type for the state structure
interface State {
    status: number;
    data: any;
    message: string;
}

const state: State = {
    status: 0,
    data: null,
    message: "",
};

export const postData = async ({
    data,
    config,
    params = {},
  }: PostDataArgs): Promise<State> => {
    await apiClient.post(data.url, data.payload, config)
        .then(res => {
            state.status = res.status
            state.data = res.data.data
            state.message = res.data.message
        })
        .catch(err => {
            const error = err.response;

            if (!err.response) {
                state.message = 'Jaringan bermasalah, silahkan coba beberapa saat lagi.';
                state.status = 500;
            } else {
                state.status = error.status;
                state.message = error.data.message;
            }
        })

    return { ...state };
}

export const getData = async (
    url: string,
    params: Record<string, any> = {}
  ): Promise<State> => {
    await apiClient.get(url, params)
        .then(res => {
            state.status = res.status
            state.data = res.data.data
            state.message = res.data.message
        })
        .catch(err => {
            if (!err.response) {
                state.message = 'Jaringan bermasalah, silahkan coba beberapa saat lagi.';
                state.status = 500;
            } else if (err.response.data.status) {
                const error = err.response.data;
                state.status = error.status;
                state.message = error.data.message;
                state.data = error.data.message;
            } else {
                const error = err.response;
                state.status = error.status;
                state.message = error.data.message;
                state.data = error.data.message;
            }
        })

    return { ...state };
}