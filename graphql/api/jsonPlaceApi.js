const { RESTDataSource } = require("apollo-datasource-rest");

class JsonPlaceAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://jsonplaceholder.typicode.com/';
    }

    async getUsers() {
        const data = await this.get('/users');
        return data;
    }
    async getUser(id) {
        const data = await this.get(`/users/${id}`);
        return data;
    }
    async getPosts() {
        const data = await this.get('/posts');
        return data;
    }
}

module.exports = JsonPlaceAPI;