import React from 'react';
import "../css/syle.css";
import {Rating} from "../Rating";
import "../css/BRSRating.css"
import {RatingHeader} from "./RatingHeader";

export function BRSRating({node, onAddChild, onDelete, onEdit, job}: {
    node: Rating,
    onAddChild: any,
    onDelete: any,
    onEdit: any,
    job: number
}) {

    const handleAddChild = () => {
        onAddChild(node);
    };

    const handleDelete = () => {
        onDelete(node);
    };

    return (
        <div className={"brs-rating"}>
            <RatingHeader job={job} value={node.name}
                          onChange={(e) => onEdit('name', e.target.value, node)}
                          number={node.value()} value1={node.weight}
                          onChange1={(e) => onEdit('weight', e.target.value, node)}
                          onClick={handleDelete}/>

            <div className={'rating-content'}>
                {node.subratings.length ? (
                        <div style={{marginLeft: '20px'}}>
                            {node.subratings.map((child: Rating, index: number) => (
                                <BRSRating key={index} node={child} onAddChild={onAddChild} onDelete={onDelete}
                                           onEdit={onEdit} job={job * child.free() / node.free()}/>
                            ))}
                        </div>
                    ) :
                    <div>
                        Значение: <input value={node.self_value}
                                         onChange={(e) => onEdit('self-val', e.target.value, node)}/>
                        / <input value={node.maxval()} onChange={(e) => onEdit('max-val', e.target.value, node)}/>
                        (нужно еще {job})
                        <div>
                            -<input value={node.banned()}
                                    onChange={(e) => onEdit('self-banned', e.target.value, node)}/>
                        </div>
                    </div>
                }
                <button className={"add-new"} onClick={handleAddChild}>+</button>
            </div>
        </div>
    );
}
