import { createStore } from "vuex";

const nav = {
    namespaced: true,
    state: () => ({
        category: [],
        brands: []
    }),
    mutations: {
        updateCategory(state, {category, brands}){
            state.category = category
            state.brands = brands
        }
    },
    actions: {

    }
}

const user = {
    namespaced: true,
    state: {},
    mutations: {
        updateUser(state, user){
            state.first_name = user.first_name
            state.last_name = user.last_name
            state.accountID = user.accountID
            state.created_date = user.created_date
            state.email = user.email
            state.role = user.role
        }
    },
    actions: {

    }
}

const store = createStore({
    modules: {
        nav,
        user
    }
})

export default store