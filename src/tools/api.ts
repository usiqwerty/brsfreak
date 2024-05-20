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
