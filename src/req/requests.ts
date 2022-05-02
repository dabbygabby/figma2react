import axios, * as others from 'axios';

export const postToServer = (payload: Object) => {
    axios
        .post('http://127.0.0.1:8000')
        .then((res) => {
            console.log(res);
            console.log(payload);
        })
        .catch((err) => {
            console.log('my error', err);
        });
};
