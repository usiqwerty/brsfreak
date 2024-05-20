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

function parse_attended(attended: string[]):Date[]{
    if (attended===undefined)
        return [];
    let res = [] as Date[];
    for (const date of attended){
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

export function fetchRating(discipline_id: number): Rating[] {
    if (localStorage.getItem('brs-tree') !== null) {
        let json = JSON.parse(localStorage.getItem('brs-tree')!) as [];
        return json.map((item) => {
            return parse(item)
        });
    } else {
        let x = new Rating("root", 1);
        return [x];
    }
}
