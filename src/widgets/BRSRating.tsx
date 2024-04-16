import React from 'react';
import "../css/syle.css";
import {Rating} from "../Rating";

export function BRSRating({node, onAddChild, onDelete, onEdit, job}: { node: Rating, onAddChild: any, onDelete: any, onEdit:any, job: number}) {

    const handleAddChild = () => {
        onAddChild(node);
    };

    const handleDelete = () => {
        onDelete(node);
    };

    return (
        <div className={"brs-rating"}>
            <div className={job? "rating-header active": "rating-header inactive"}>
                <input value={node.name} className={"header-input long-input"} onChange={(e)=>onEdit('name', e.target.value, node)}/>
                <span className={"right-head"}>{node.value()}x
                <input value={node.weight} className={'header-input'} onChange={(e)=>onEdit('weight', e.target.value, node)}/>
                <button onClick={handleDelete}>X</button>
                </span>
            </div>
            <div className={'rating-content'}>
                {node.subratings.length ? (
                        <div style={{marginLeft: '20px'}}>
                            {node.subratings.map((child: Rating, index: number) => (
                                <BRSRating key={index} node={child} onAddChild={onAddChild} onDelete={onDelete} onEdit={onEdit} job={job*child.free()/node.free()}/>
                            ))}
                        </div>
                    ) :
                    <div>
                        Значение: <input value={node.self_value} onChange={(e)=>onEdit('self-val', e.target.value, node)}/>
                        / <input value={node.maxval()} onChange={(e)=>onEdit('max-val', e.target.value, node)}/>
                        (нужно еще {job})
                        <div>
                            -<input value={node.banned()} onChange={(e)=>onEdit('self-banned', e.target.value, node)}/>
                        </div>
                    </div>
                }
                <button onClick={handleAddChild}>Добавить дочерний элемент</button>
            </div>
        </div>
    );
}
