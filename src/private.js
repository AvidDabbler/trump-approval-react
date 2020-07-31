const p = () => {
    return {
        nyt: 'vfnq95NgVWgHNcN04Hds02ezuzCyOcAn',
        cors: ''
    }


    
};


const cors = (url) => {
    return 'https://mysterious-cove-5444667116.herokuapp.com/' + url + new Date().time;
}
const cors_noDate = (url) => {
    return 'https://mysterious-cove-5444667116.herokuapp.com/' + url;
};

export { cors, cors_noDate, p };