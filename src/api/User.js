const User = {
    key: "user",
    getData(){
        const data = JSON.parse(localStorage.getItem(this.key));
        return data;
    },
    add(data) {
        const historyData = localStorage.getItem(this.key) !== null ? JSON.parse(localStorage.getItem(this.key)) : [];
        historyData.push(data);

        console.log(historyData);
        
        localStorage.setItem(this.key, JSON.stringify(historyData));
    }
}

export default User;