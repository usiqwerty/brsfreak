import React from "react";

export function RatingHeader(props: {
    job: number,
    value: string,
    onChange: (e:any) => any,
    number: number,
    value1: number,
    onChange1: (e:any) => any,
    onClick: () => void
}) {
    return <div className={"rating-header " + (props.job ? "active" : "inactive")}>
        <input value={props.value} className={"header-input long-input"}
               onChange={props.onChange}/>
        <span className={"header-eval"}>
                    <span>{props.number}x</span>
                    <input value={props.value1} className={"header-input"}
                           onChange={props.onChange1}/>

                </span>
        <button className={"remove-btn"} onClick={props.onClick}>X</button>
    </div>;
}