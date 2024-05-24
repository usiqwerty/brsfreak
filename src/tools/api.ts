/*
*    BRSfreak - калькулятор баллов для ВУЗа
*    Copyright (C) 2024  usiqwerty
*
*    BRSfreak is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    BRSfreak is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with this program.  If not, see <https://www.gnu.org/licenses/>.
* */

import {Rating} from "./Rating";

const api_server = "https://usiqwerty.pythonanywhere.com"

function parse_attended(attended: string[]): Date[] {
    if (attended === undefined)
        return [];
    let res = [] as Date[];
    for (const date of attended) {
        res.push(new Date(date));
    }
    return res;
}

export function parse(json: Rating): Rating {
    // @ts-ignore
    let x = new Rating(json.name, json.weight, json.self_maxval, json.self_value, json.self_banned, parse_attended(json.attended as string[]), json.attendable);

    x.subratings = json.subratings.map((each: Rating) => parse(each));
    return x;
}

export async function fetchRating(discipline_id: number, password: string): Promise<Rating[]> {
    // const data = localStorage.getItem('brs-tree');
    //localStorage.getItem('brs-tree')
    const data = await sync_import("0", password);

    if (data !== null) {
        let json = JSON.parse(data!) as [];
        return json.map((item) => {
            return parse(item)
        });
    } else {
        let x = new Rating("root", 1);
        return [x];
    }
}


export async function sync_import(user_id: string, password: string) {
    const api_import_url = api_server + "/get-user-data";
    const resp = await fetch(api_import_url + "?" + new URLSearchParams({user_id: user_id, pass: password}));
    if (!resp.ok)
        return null
    return resp.text();
}


export function sync_export(user_id: string, data: Rating[], password: string) {
    const api_create_export_url = api_server + "/set-user-data";

    fetch(api_create_export_url, {
            method: 'POST',
            body: JSON.stringify({user_id: user_id, data: JSON.stringify(data), pass: password}),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: "no-cors",
            referrerPolicy: "origin-when-cross-origin"
        }
    ).catch((reason) => {
        alert(reason)
    })
}

export function try_login(user: string, password: string){
    const body = JSON.stringify({user_id: user, pass: password});
    const api_create_export_url = api_server + "/login";
    // const xhr = new XMLHttpRequest();
    //
    // xhr.open("POST", api_create_export_url);
    // xhr.send(body);
    // return xhr.status;
    return fetch(api_create_export_url, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            referrerPolicy: "origin-when-cross-origin"
        }
    );
}
export function try_register(user: string, password: string){
    const body = JSON.stringify({user_id: user, pass: password});
    const api_create_export_url = api_server + "/register";
    // const xhr = new XMLHttpRequest();
    //
    // xhr.open("POST", api_create_export_url);
    // xhr.send(body);
    // return xhr.status;
    return fetch(api_create_export_url, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            referrerPolicy: "origin-when-cross-origin"
        }
    );
}