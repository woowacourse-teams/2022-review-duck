import React, { useState, useEffect } from "react"
import './reviewFormList.css'

import axios from "axios"

import { DataGrid } from '@mui/x-data-grid'

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'code', headerName: 'ReviewForm Code', width: 160 },
  { field: 'reviewTitle', headerName: 'Review Title', width: 160 },
  { field: 'memberId', headerName: 'Member Id', width: 90 },
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
  
  { field: 'createdAt', headerName: '생성일', width: 250 },
  { field: 'updatedAt', headerName: '최종 수정일', width: 250 },
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
