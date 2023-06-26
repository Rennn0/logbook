import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class AppStateManageService {
    //
    userAuthData: any;

    constructor() { }

    // need optimization
    load(): void {

        //data in localstorage by userAuthData key
        if (this.getDataFromLocalStorage("logbookUserAuthData")) {
            //
            this.userAuthData = this.getDataFromLocalStorage('logbookUserAuthData').picture;
        }
    }

    //
    setDataInLocalStorage(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    //
    getDataFromLocalStorage(key: string): any {
        return JSON.parse(String(localStorage.getItem(key)));
    }

    //
    removeDataFromLocalStorage(key: string): void {
        localStorage.removeItem(key);
    }
}
