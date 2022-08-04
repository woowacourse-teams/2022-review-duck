import React, { useState, useEffect } from "react"
import './reviewFormList.css'

import axios from "axios"

import {Link} from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { DeleteOutline } from '@mui/icons-material'

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'code', headerName: 'ReviewForm Code', width: 160,  
  renderCell:(params)=>{
    return <Link to={`/review-forms/${params.row.code}`}>
      {params.row.code}
    </Link>
  } },
  { field: 'reviewTitle', headerName: 'Review Title', width: 160 },
  { field: 'memberId', headerName: 'Member Id', width: 90,
  renderCell:(params)=>{
    return <Link to={`/members/${params.row.memberId}`}>
      {params.row.memberId}
    </Link>
  }  },
  {
    field: 'memberProfileUrl',
    headerName: 'Member Profile',
    width: 160,
    renderCell: (params) => {
        return (
            <div className="reviewformListMember">
                <img className="reviewFormListMemberImg" src={params.row.memberProfileUrl} alt="" />
                {params.row.memberNickname}
            </div>
        )
    },
  },
  
  { field: 'active', headerName: 'isActive', width: 130,}, 
  { field: 'createdAt', headerName: '생성일', width: 250 },
  { field: 'updatedAt', headerName: '최종 수정일', width: 250 },
  { field: 'action', headerName: 'Action', width: 150, 
  renderCell: (params)=>{
    return (
      <>
        <DeleteOutline 
        className='reviewFormListDelete' 
        onClick={()=>axios.delete(`http://localhost:8080/api/admin/review-forms/${params.row.id}`)}
        />
      </>
    )
  },
},
]


export default function ReviewFormList(){
    const [reviewFormRows, setReviewFormRows] = useState([])
    
    useEffect(() => {
        axios.get("http://localhost:8080/api/admin/review-forms").then((res)=>{
          if(res.data){
            console.log(res.data);
            setReviewFormRows(res.data.reviewForms);
          }else{
            alert("failed to ");
          }
        });
        },[]);

    return (
        <div className="reviewFormList">
            <DataGrid
                rows={reviewFormRows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
    )
}
