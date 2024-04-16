import {Rating} from "./Rating";

export function parse(json:Rating): Rating{
    let x = new Rating(json.name, json.weight, json.self_maxval, json.self_value, json.self_banned);

    let subs = json.subratings.map((each:Rating)=>parse(each));
    x.subratings = subs;
    return x;
}

export function fetchRating(discipline_id: number): Rating[] {
    if (localStorage.getItem('brs-tree')!==null)
    {
        let json = JSON.parse(localStorage.getItem('brs-tree')!) as [];
        let res = json.map((item)=> {return parse(item)});
        return res;
    }
    else {
        let x = new Rating( "root", 1);
        return [x];
    }
}
