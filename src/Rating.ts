class Rating {
    id: number;
    subratings: Rating[];
    name: string;
    weight: number;
    self_maxval: number;
    self_value: number;
    self_banned: number
    static count = 0;

    constructor(name: string, weight: number, maxval = 100, value = 0, banned = 0) {
        this.id = Rating.count++;
        this.subratings = [];
        this.name = name;
        this.weight = weight;
        this.self_maxval = maxval;
        this.self_value = value;
        this.self_banned = banned;
    }

    value() {
        if (this.subratings.length) {
            let value = 0;
            this.subratings.forEach(sub => {
                value += sub.value() * sub.weight
            });
            return value
        } else {
            return this.self_value;
        }
    }
    maxval(){
        if (this.subratings.length) {
            let maxvalue = 0;
            this.subratings.forEach(sub => {
                maxvalue += sub.maxval() * sub.weight
            });
            return maxvalue
        } else {
            return this.self_maxval;
        }
    }
    free(){
        return this.maxval() - this.value() - this.banned();
    }
    banned(){
        if (this.subratings.length) {
            let banval = 0;
            this.subratings.forEach(sub => {
                banval += sub.banned() * sub.weight
            });
            return banval
        } else {
            return this.self_banned;
        }
    }
}

export {Rating};