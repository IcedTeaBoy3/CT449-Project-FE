import {defineStore} from "pinia";
export const useUserStore = defineStore("userStore", {
    state: () => ({
        _id: "",
        FullName: "",
        Date: "",
        Email: "",
        isAdmin: "",
        Address: "",
        Phone: "",
        Avatar: "",
        access_token: ""
    }),
    getters: {
        getUser(state) {
            return {
                _id: state._id,
                FullName: state.FullName,
                Date: state.Date,
                Email: state.Email,
                isAdmin: state.isAdmin,
                Address: state.Address,
                Phone: state.Phone,
                access_token: state.access_token,
                Avatar: state.Avatar
            };
        },
    },
    actions: {
        setUser(user) {
            this._id = user._id;
            this.FullName = user.FullName;
            this.Date = user.Date;
            this.Email = user.Email;
            this.isAdmin = user.isAdmin;
            this.Address = user.Address;
            this.Phone = user.Phone;
            this.access_token = user.access_token;
            this.Avatar = user.Avatar;
        },
        logOut() {
            this._id = "";
            this.FullName = "";
            this.Date = "";
            this.Email = "";
            this.isAdmin = "";
            this.Address = "";
            this.Phone = "";
            this.access_token = "";
            this.Avatar = "";
        },
    }
});