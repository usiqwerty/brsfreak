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

import React from 'react';
import "../css/style.css";
import {Rating} from "../tools/Rating";
import "../css/BRSRating.css"
import "../css/mobile.css";
import {RatingHeader} from "./RatingHeader";

const truncateToTwo = (num: number) => Math.floor(num * 100) / 100;

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
                        <div>
                            {node.subratings.map((child: Rating, index: number) => (
                                <BRSRating key={index}
                                           node={child}
                                           onAddChild={onAddChild}
                                           onDelete={onDelete}
                                           onEdit={onEdit}
                                           job={node.free() ? job * child.free() / node.free() : 0}/>
                            ))}
                        </div>
                    ) :
                    <div>
                        Значение: <input value={node.self_value}
                                         onChange={(e) => onEdit('self-val', e.target.value, node)}
                                         size={3}
                                         disabled={node.attendable}/>
                        / <input value={node.maxval()}
                                 onChange={(e) => onEdit('max-val', e.target.value, node)}
                                 size={3}/>
                        (нужно еще {truncateToTwo(job)})
                        <div>
                            Потеряно <input value={node.banned()}
                                    onChange={(e) => onEdit('self-banned', e.target.value, node)} size={3}/>
                        </div>
                        <span>
                            <input type={"checkbox"}
                                   checked={node.attendable}
                                   onChange={e => onEdit('attendable', e.target.checked, node)}/>
                            Посещаемость
                        </span>
                    </div>
                }
            </div>
            <div className={"rating-footer"}>
                <button className={"add-new"} onClick={handleAddChild}>+</button>
            </div>
        </div>
    );
}
