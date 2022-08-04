import React from "react";
import { useParams } from "react-router-dom";
import './member.css'

export default function Member() {
    const param = useParams();

    console.log(param);
    
    return <div className="member">member pages</div>
}